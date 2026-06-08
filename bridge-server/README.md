# TerminalHub Bridge Server

The companion server that runs on your Mac. The TerminalHub mobile app connects to it over your
LAN; it spawns a local shell, streams the output to the app, runs the commands you send, and proxies
Claude suggestions. Claude runs through your **local `claude` (Claude Code) CLI**, so it reuses your
existing Claude Code login — **no API key required**.

## Setup

```bash
cd bridge-server
npm install
npm start
```

You should see:

```
TerminalHub bridge listening on ws://0.0.0.0:8765 (shell: /bin/zsh)
```

Requirements:
- **[Claude Code](https://claude.com/claude-code)** installed and logged in (`claude` on your `PATH`) —
  used for the Claude suggestions/chat. Start the bridge from a shell where `claude` works.
- No `.env` is needed (copy `.env.example` only if you want to override the port).

> Pure JavaScript — no native modules to compile, just `ws` + `dotenv`. Uses a persistent shell via
> Node's built-in `child_process` (commands and their state, like `cd`, persist across the session).
> Full-screen TUI programs like `vim`/`top` aren't supported since there's no real PTY — run those at
> the Mac directly.

## Connect the app

1. Find your Mac's LAN IP: `ipconfig getifaddr en0`.
2. In the app, open **Settings → Connection** and turn **Use mock bridge** off.
3. Add a machine in the app whose **hostname** is that IP (port 8765 is used automatically).
4. Open the machine — you'll see your real shell stream in. Type a command and tap **RUN**.

The app and Mac must be on the same network (or use a tunnel / VPN for remote access).

## Wire protocol

JSON messages over a single WebSocket. Kept in sync with `src/services/bridgeProtocol.ts`.

App → bridge:
- `{ "type": "input", "text": "<command>" }` — run a command in the shell
- `{ "type": "claude", "context": ["…"], "prompt": "…", "machineName": "…" }` — request a suggestion (runs `claude --print`)

Bridge → app:
- `{ "type": "connected" }`
- `{ "type": "output", "line": { "type": "output", "text": "…" } }`
- `{ "type": "heartbeat", "cpu": 12, "mem": 68 }`
- `{ "type": "claude_chunk", "text": "…" }` (streamed) then `{ "type": "claude_done", "chips": ["…"] }`
- `{ "type": "error", "message": "…" }`

## Security notes

- The shell runs with your user's full permissions. Only run the bridge on a trusted network.
- Claude suggestions run through your local `claude` CLI under your Claude Code login; no API key is
  stored anywhere, and nothing Claude-related is sent to the app except the streamed response text.
