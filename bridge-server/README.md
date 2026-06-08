# TerminalHub Bridge Server

The companion server that runs on your Mac. The TerminalHub mobile app connects to it over your
LAN; it spawns a local shell, streams the output to the app, runs the commands you send, and proxies
Claude suggestions. **Your `ANTHROPIC_API_KEY` lives here and never leaves the Mac.**

## Setup

```bash
cd bridge-server
npm install
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY=sk-ant-...
npm start
```

You should see:

```
TerminalHub bridge listening on ws://0.0.0.0:8765 (shell: /bin/zsh)
```

> `node-pty` builds a native module on install — Xcode command-line tools are required on macOS
> (`xcode-select --install`).

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
- `{ "type": "claude", "context": ["…"], "prompt": "…", "machineName": "…" }` — request a suggestion

Bridge → app:
- `{ "type": "connected" }`
- `{ "type": "output", "line": { "type": "output", "text": "…" } }`
- `{ "type": "heartbeat", "cpu": 12, "mem": 68 }`
- `{ "type": "claude_chunk", "text": "…" }` (streamed) then `{ "type": "claude_done", "chips": ["…"] }`
- `{ "type": "error", "message": "…" }`

## Security notes

- The shell runs with your user's full permissions. Only run the bridge on a trusted network.
- The Claude API key is read from `.env` (gitignored) and is never sent to the app.
