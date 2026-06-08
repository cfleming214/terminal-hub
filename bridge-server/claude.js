// Claude integration for the bridge. Shells out to the local Claude Code CLI (`claude`) in print
// mode, so it reuses your existing Claude Code login — NO API key required. Streams the reply back
// chunk-by-chunk and extracts runnable command chips.
const { spawn } = require('child_process');

function buildSystemPrompt(machineName, context) {
  const recent = context.slice(-50).join('\n');
  return [
    `You are assisting a developer using TerminalHub on the machine "${machineName}" over SSH.`,
    `Recent terminal output (most recent last):`,
    '```',
    recent,
    '```',
    `Answer briefly and practically. When you suggest shell commands, put each command on its own`,
    `line exactly as it should be run, with no surrounding backticks. Respond with the answer only.`,
  ].join('\n');
}

// Pull command-like lines out of the response to surface as tap-to-run chips (max 3).
function extractChips(text) {
  const chips = [];
  const cmdRe = /^\s*(git|npm|npx|yarn|pnpm|docker|kubectl|node|cd|ls|tail|ssh|make|cargo|go|python3?|pip3?)\b.*$/;
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (cmdRe.test(line) && !chips.includes(line)) chips.push(line);
    if (chips.length >= 3) break;
  }
  return chips;
}

// Stream a suggestion via the local `claude` CLI. onChunk receives text deltas as they arrive;
// resolves with the full text + extracted chips. Rejects with a helpful message if `claude` is missing.
function streamClaude({ context = [], prompt, machineName = 'this machine' }, onChunk) {
  return new Promise((resolve, reject) => {
    const system = buildSystemPrompt(machineName, context);
    const child = spawn('claude', ['--print', '--append-system-prompt', system], {
      env: process.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let full = '';
    let errOut = '';

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (d) => {
      full += d;
      onChunk(d);
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (d) => {
      errOut += d;
    });

    child.on('error', (e) => {
      if (e.code === 'ENOENT') {
        reject(new Error('`claude` CLI not found on PATH. Install Claude Code, or start the bridge from a shell where `claude` works.'));
      } else {
        reject(e);
      }
    });

    child.on('close', (code) => {
      if (!full && code !== 0) {
        reject(new Error(errOut.trim() || `claude exited with code ${code}`));
      } else {
        resolve({ text: full.trim(), chips: extractChips(full) });
      }
    });

    // Send the user's prompt on stdin (avoids arg-length/escaping issues).
    child.stdin.write(prompt);
    child.stdin.end();
  });
}

module.exports = { streamClaude };
