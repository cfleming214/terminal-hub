// Drives the Claude chat screen: sends a prompt with terminal context, streams the reply into the store.
import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { bridgeManager } from '@/services/WebSocketManager';
import { ChatMessage } from '@/types';

// Stable empty reference — returning a fresh `[]` from a Zustand selector triggers an infinite
// re-render loop (Object.is sees a new array every time).
const EMPTY_MESSAGES: ChatMessage[] = [];

export function useClaude(machineId: string) {
  const machine = useAppStore((s) => s.machines.find((m) => m.id === machineId));
  const messages = useAppStore((s) => s.claudeChats[machineId] ?? EMPTY_MESSAGES);
  const useMock = useAppStore((s) => s.settings.useMockBridge);

  const addChatMessage = useAppStore((s) => s.addChatMessage);
  const appendChatChunk = useAppStore((s) => s.appendChatChunk);
  const finishChatMessage = useAppStore((s) => s.finishChatMessage);

  const awaiting = useRef<string | null>(null);

  useEffect(() => {
    if (!machine) return;
    bridgeManager.connect(machine, useMock);
    const unsubscribe = bridgeManager.subscribe(
      machineId,
      (msg) => {
        const targetId = awaiting.current;
        if (!targetId) return;
        if (msg.type === 'claude_chunk') {
          appendChatChunk(machineId, targetId, msg.text);
        } else if (msg.type === 'claude_done') {
          finishChatMessage(machineId, targetId, msg.chips);
          awaiting.current = null;
        }
      },
      () => {}
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineId, useMock, machine?.hostname]);

  function send(prompt: string) {
    const text = prompt.trim();
    if (!text || !machine) return;
    addChatMessage(machineId, { role: 'user', content: text, timestamp: new Date().toISOString() });
    const assistantId = addChatMessage(machineId, {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      streaming: true,
    });
    awaiting.current = assistantId;

    const context = buildContext(machineId);
    bridgeManager.send(machineId, { type: 'claude', context, prompt: text, machineName: machine.name });
  }

  return { machine, messages, send };
}

function buildContext(machineId: string): string[] {
  const lines = useAppStore.getState().sessions[machineId]?.lines ?? [];
  const ctxLines = parseInt(useAppStore.getState().settings.contextLines, 10) || 50;
  return lines.slice(-ctxLines).map((l) => (l.promptText ?? '') + l.text);
}
