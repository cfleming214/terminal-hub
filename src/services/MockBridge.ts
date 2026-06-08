// Mock bridge: replays canned terminal output + a streamed Claude reply so the app is fully
// demoable in the simulator without a Mac bridge running. Mirrors the real wire protocol.
import { ClientMessage, ServerMessage } from './bridgeProtocol';
import { mockStreamLines, mockClaudeSuggestion } from '@/data/mockData';

export class MockBridge {
  private emit: (msg: ServerMessage) => void;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private heartbeat?: ReturnType<typeof setInterval>;
  private closed = false;

  constructor(emit: (msg: ServerMessage) => void) {
    this.emit = emit;
    // Connect + start heartbeat shortly after creation.
    this.schedule(120, () => this.emit({ type: 'connected' }));
    this.heartbeat = setInterval(() => {
      if (this.closed) return;
      const cpu = 8 + Math.floor(Math.random() * 30);
      const mem = 40 + Math.floor(Math.random() * 35);
      this.emit({ type: 'heartbeat', cpu, mem });
    }, 3000);
  }

  send(msg: ClientMessage) {
    if (this.closed) return;
    if (msg.type === 'input') {
      this.replayCommand(msg.text);
    } else if (msg.type === 'claude') {
      this.replayClaude();
    }
  }

  // Echo the command as a prompt line, then stream some plausible output + a Claude suggestion.
  private replayCommand(command: string) {
    this.emit({ type: 'output', line: { type: 'prompt', promptText: 'alex@home:~/webapp$ ', text: command } });
    let delay = 200;
    mockStreamLines.forEach((line) => {
      this.schedule(delay, () =>
        this.emit({ type: 'output', line: { type: line.type, text: line.text, promptText: line.promptText } })
      );
      delay += 220;
    });
    // Trailing prompt + Claude suggestion after the command "completes".
    this.schedule(delay + 150, () =>
      this.emit({ type: 'output', line: { type: 'prompt', promptText: 'alex@home:~/webapp$ ', text: '' } })
    );
  }

  private replayClaude() {
    const full = mockClaudeSuggestion.text;
    const words = full.split(' ');
    let delay = 150;
    words.forEach((w, i) => {
      this.schedule(delay, () => this.emit({ type: 'claude_chunk', text: (i === 0 ? '' : ' ') + w }));
      delay += 55;
    });
    this.schedule(delay + 100, () => this.emit({ type: 'claude_done', chips: mockClaudeSuggestion.chips }));
  }

  private schedule(ms: number, fn: () => void) {
    const t = setTimeout(() => {
      if (!this.closed) fn();
    }, ms);
    this.timers.push(t);
  }

  close() {
    this.closed = true;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    if (this.heartbeat) clearInterval(this.heartbeat);
  }
}
