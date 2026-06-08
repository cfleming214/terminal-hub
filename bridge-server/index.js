// TerminalHub Mac bridge server.
// - Spawns a persistent login shell (Node's built-in child_process — no native deps) per
//   connection and pipes its stdout/stderr over WebSocket.
// - Accepts {type:"input"} to run commands and {type:"claude"} to stream a Claude suggestion.
// - Emits periodic {type:"heartbeat"} with CPU/memory so the app's stat bars stay live.
// Keep the wire protocol in sync with src/services/bridgeProtocol.ts.
require('dotenv').config();
const os = require('os');
const { spawn } = require('child_process');
const { WebSocketServer } = require('ws');
const { streamClaude } = require('./claude');

const PORT = process.env.PORT ? Number(process.env.PORT) : 8765;
const SHELL = process.env.SHELL || (os.platform() === 'win32' ? 'powershell.exe' : '/bin/zsh');
const USER = process.env.USER || process.env.LOGNAME || 'user';
const HOST = os.hostname().split('.')[0];
const PROMPT = `${USER}@${HOST} $ `;

// Strip ANSI escape sequences so the app receives clean text lines.
const ANSI_RE = /[][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
const stripAnsi = (s) => s.replace(ANSI_RE, '');

function cpuPercent() {
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

  // Persistent non-interactive shell reading commands from stdin. cwd/state persist across commands.
  let shell;
  try {
    shell = spawn(SHELL, [], {
      cwd: process.env.HOME || process.cwd(),
      env: process.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (err) {
    send({ type: 'error', message: `Failed to start shell: ${err.message}` });
    ws.close();
    return;
  }

  send({ type: 'connected' });
  send({ type: 'output', line: { type: 'info', text: `Connected to ${USER}@${HOST}` } });

  // Buffer each stream and emit one wire line per complete text line.
  function pipe(stream, lineType) {
    let buffer = '';
    stream.setEncoding('utf8');
    stream.on('data', (data) => {
      buffer += stripAnsi(data);
      const parts = buffer.split('\n');
      buffer = parts.pop() ?? '';
      for (const part of parts) {
        send({ type: 'output', line: { type: lineType, text: part.replace(/\r$/, '') } });
      }
    });
  }
  pipe(shell.stdout, 'output');
  pipe(shell.stderr, 'output'); // many tools log to stderr normally; keep it readable, not red

  shell.on('exit', (code) => {
    send({ type: 'output', line: { type: 'info', text: `[shell exited${code != null ? ` (${code})` : ''}]` } });
  });
  shell.on('error', (err) => {
    send({ type: 'error', message: `Shell error: ${err.message}` });
  });

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
      // Echo the command as a prompt line (a piped shell has no TTY echo), then run it.
      send({ type: 'output', line: { type: 'prompt', promptText: PROMPT, text: msg.text } });
      if (shell.stdin.writable) shell.stdin.write(msg.text + '\n');
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
