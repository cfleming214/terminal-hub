// Binds a machine's live bridge connection to the terminal session in the store.
import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { bridgeManager } from '@/services/WebSocketManager';
import { ConnectionStatus } from '@/services/bridgeProtocol';

export function useTerminalSession(machineId: string) {
  const machine = useAppStore((s) => s.machines.find((m) => m.id === machineId));
  const session = useAppStore((s) => s.sessions[machineId]);
  const claudeEnabled = useAppStore((s) => s.settings.claudeSuggestions);
  const useMock = useAppStore((s) => s.settings.useMockBridge);

  const ensureSession = useAppStore((s) => s.ensureSession);
  const appendLine = useAppStore((s) => s.appendLine);
  const setConnected = useAppStore((s) => s.setConnected);
  const setInput = useAppStore((s) => s.setInput);
  const setClaudeSuggestion = useAppStore((s) => s.setClaudeSuggestion);
  const updateMachineStats = useAppStore((s) => s.updateMachineStats);

  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const suggestionBuffer = useRef('');
  const awaitingClaude = useRef(false);

  useEffect(() => {
    if (!machine) return;
    ensureSession(machineId);
    bridgeManager.connect(machine, useMock);

    const unsubscribe = bridgeManager.subscribe(
      machineId,
      (msg) => {
        switch (msg.type) {
          case 'output':
            appendLine(machineId, { type: msg.line.type, text: msg.line.text, promptText: msg.line.promptText });
            break;
          case 'heartbeat':
            updateMachineStats(machineId, msg.cpu, msg.mem);
            break;
          case 'claude_chunk':
            if (!awaitingClaude.current) break;
            suggestionBuffer.current += msg.text;
            setClaudeSuggestion(machineId, suggestionBuffer.current, []);
            break;
          case 'claude_done':
            if (!awaitingClaude.current) break;
            setClaudeSuggestion(machineId, suggestionBuffer.current, msg.chips ?? []);
            awaitingClaude.current = false;
            break;
        }
      },
      (s) => {
        setStatus(s);
        setConnected(machineId, s === 'connected');
      }
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineId, useMock, machine?.hostname]);

  function sendCommand(command: string) {
    const cmd = command.trim();
    if (!cmd || !machine) return;
    setClaudeSuggestion(machineId, null, []);
    bridgeManager.send(machineId, { type: 'input', text: cmd });
    setInput(machineId, '');

    if (claudeEnabled) {
      // Ask the bridge for an inline suggestion once the command has produced output.
      suggestionBuffer.current = '';
      awaitingClaude.current = true;
      const context = buildContext();
      setTimeout(() => {
        bridgeManager.send(machineId, {
          type: 'claude',
          context,
          prompt: `I just ran: ${cmd}. Suggest the most useful next command.`,
          machineName: machine.name,
        });
      }, 1400);
    }
  }

  function buildContext(): string[] {
    const lines = useAppStore.getState().sessions[machineId]?.lines ?? [];
    const ctxLines = parseInt(useAppStore.getState().settings.contextLines, 10) || 50;
    return lines.slice(-ctxLines).map((l) => (l.promptText ?? '') + l.text);
  }

  return { machine, session, status, connected: status === 'connected', sendCommand, setInput };
}
