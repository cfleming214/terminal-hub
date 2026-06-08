// TerminalHub Mac bridge server.
// - Spawns a local shell (node-pty) per connection and pipes its output over WebSocket.
// - Accepts {type:"input"} to run commands and {type:"claude"} to stream a Claude suggestion.
// - Emits periodic {type:"heartbeat"} with CPU/memory so the app's stat bars stay live.
// Keep the wire protocol in sync with src/services/bridgeProtocol.ts.
require('dotenv').config();
const os = require('os');
const { WebSocketServer } = require('ws');
const pty = require('node-pty');
const { streamClaude } = require('./claude');

const PORT = process.env.PORT ? Number(process.env.PORT) : 8765;
const SHELL = process.env.SHELL || (os.platform() === 'win32' ? 'powershell.exe' : 'bash');

// Strip ANSI escape sequences so the app receives clean text lines.
const ANSI_RE = /[][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
const stripAnsi = (s) => s.replace(ANSI_RE, '');

function cpuPercent() {
  // Rough instantaneous load → percentage of available cores.
  const load = os.loadavg()[0];
  const cores = os.cpus().length || 1;
  return Math.min(100, Math.round((load / cores) * 100));
}

function memPercent() {
  const total = os.totalmem();
  const free = os.freemem();
  return Math.round(((total - free) / total) * 100);
}

const wss = new WebSocketServer({ port: PORT });
console.log(`TerminalHub bridge listening on ws://0.0.0.0:${PORT} (shell: ${SHELL})`);

wss.on('connection', (ws) => {
  console.log('Client connected');

  const send = (msg) => {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(msg));
  };

  const shell = pty.spawn(SHELL, [], {
    name: 'xterm-color',
    cols: 100,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  send({ type: 'connected' });

  // Buffer PTY output and emit one wire line per complete text line.
  let buffer = '';
  shell.onData((data) => {
    buffer += stripAnsi(data);
    const parts = buffer.split('\n');
    buffer = parts.pop() ?? '';
    for (const part of parts) {
      const text = part.replace(/\r$/, '');
      send({ type: 'output', line: { type: 'output', text } });
    }
  });

  shell.onExit(() => send({ type: 'output', line: { type: 'info', text: '[shell exited]' } }));

  const heartbeat = setInterval(() => {
    send({ type: 'heartbeat', cpu: cpuPercent(), mem: memPercent() });
  }, 3000);

  ws.on('message', async (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (msg.type === 'input') {
      shell.write(msg.text + '\r');
    } else if (msg.type === 'claude') {
      try {
        const result = await streamClaude(
          { context: msg.context, prompt: msg.prompt, machineName: msg.machineName },
          (chunk) => send({ type: 'claude_chunk', text: chunk })
        );
        send({ type: 'claude_done', chips: result.chips });
      } catch (err) {
        send({ type: 'error', message: `Claude error: ${err.message}` });
      }
    }
  });

  ws.on('close', () => {
    clearInterval(heartbeat);
    shell.kill();
    console.log('Client disconnected');
  });
});
