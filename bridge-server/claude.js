// Claude integration for the bridge. Streams a suggestion back chunk-by-chunk and extracts
// runnable command chips. The API key lives only in this server's environment (.env) — never in the app.
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

const MODEL = 'claude-opus-4-8';

function buildSystemPrompt(machineName, context) {
  const recent = context.slice(-50).join('\n');
  return [
    `You are an assistant embedded in a terminal app called TerminalHub, helping a developer`,
    `who is working on the machine "${machineName}" over SSH.`,
    ``,
    `Recent terminal output (most recent last):`,
    '```',
    recent,
    '```',
    ``,
    `Answer briefly and practically. When you suggest shell commands, write each command on`,
    `its own line exactly as it should be run, with no surrounding backticks or prose on that line.`,
    `Respond only with your final answer — no exploratory reasoning or meta-commentary.`,
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

// Stream a suggestion. onChunk receives text deltas; resolves with the full text + chips.
async function streamClaude({ context = [], prompt, machineName = 'this machine' }, onChunk) {
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt(machineName, context),
    messages: [{ role: 'user', content: prompt }],
  });

  stream.on('text', (delta) => onChunk(delta));

  const finalMessage = await stream.finalMessage();
  const fullText = finalMessage.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return { text: fullText, chips: extractChips(fullText) };
}

module.exports = { streamClaude };
