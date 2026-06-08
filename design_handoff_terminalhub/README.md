# Handoff: TerminalHub Mobile App

## Overview

TerminalHub is a cross-platform (iOS/Android) mobile app built with **Expo + React Native** that lets developers control and manage Mac terminals remotely from their phone. It integrates Claude AI for intelligent command suggestions inline within the terminal session.

This handoff package contains **high-fidelity HTML design references** — prototypes showing the intended look, layout, and content of all screens. **Do not ship the HTML directly.** The task is to recreate these designs in the existing React Native + Expo codebase using its established patterns, navigation library, and component system.

---

## Fidelity

**High-fidelity.** These are pixel-level references with final colors, typography, spacing, and visual hierarchy. The developer should match the designs as closely as possible using React Native primitives (View, Text, ScrollView, TextInput, etc.) and the project's existing component system.

---

## Design Files

| File | Contents |
|------|----------|
| `TerminalHub Design.html` | Full design canvas — open in a browser to pan/zoom all 12 screens side by side |
| `screens-a.jsx` | Direction A ("Raw Signal") — 6 screen components |
| `screens-b.jsx` | Direction B ("Pulse") — 6 screen components |
| `ios-frame.jsx` | iOS device frame scaffold (browser-only, reference only) |
| `design-canvas.jsx` | Pan/zoom canvas scaffold (browser-only, reference only) |

Open `TerminalHub Design.html` in Chrome or Safari. Pan with click-drag, zoom with scroll. Click any screen to view it fullscreen.

---

## Two Design Directions

Two visual directions were explored. Choose one — or mix components from each — before implementation begins.

### Direction A — "Raw Signal"
> Dense, sysadmin-first. Pure terminal aesthetic. Amber on black.

Intended for developers who want zero visual noise. Feels like a real terminal. The design language borrows from BBS systems and traditional Unix interfaces.

### Direction B — "Pulse"
> Spatial, dimensional. Deep navy with amber glow and glass panels.

Intended as a polished consumer-dev product. Feels like a premium mobile app that happens to run terminals. Glass cards, rounded corners, ambient glows.

**Recommendation:** Use Direction B as the primary direction — it reads better at mobile font sizes and communicates the Claude AI integration more naturally. Pull the terminal output density from Direction A into B's Terminal screen for the best of both.

---

## Design Tokens

### Direction A — Raw Signal

```
// Colors
--bg:          #0a0a0a   // screen background
--bg-2:        #101010   // input bars, secondary surfaces
--bg-3:        #161616   // inset panels, code blocks
--border:      #1c1c1c   // dividers, input outlines
--amber:       #f59e0b   // prompts, CTAs, key labels
--amber-faint: rgba(245,158,11,0.10)  // amber tinted backgrounds
--amber-bd:    rgba(245,158,11,0.25)  // amber borders
--green:       #6ee7b7   // successful output, online status
--blue:        #93c5fd   // URLs, links in output
--text:        #c4c4c4   // primary text
--dim:         #484848   // muted/secondary text
--red:         #f87171   // errors

// Typography
font-family:   "JetBrains Mono", "Fira Code", monospace  // ALL text
font-size:     9.5px (micro labels) | 10–11px (meta) | 12–13px (body) | 22–26px (display)
font-weight:   400 (body) | 600–700 (prompts, headings, CTAs)
line-height:   1.5–1.65 (terminal output)
letter-spacing: 2–4px (section headers, uppercase labels)

// Spacing (base unit: 4px)
screen-padding:  18–24px horizontal
section-gap:     14–20px
row-height:      ~42–52px (list rows)
nav-height:      ~42px + 60px status bar offset

// Shape
border-radius:   0 (inputs, buttons) | 3–4px (tags/chips only)
box-shadow:      none (Direction A has no shadows)
```

---

### Direction B — Pulse

```
// Colors
--bg:             #060d1f   // screen background (deep navy)
--bg-2:           #0b1526   // slightly lighter navy
--card:           rgba(255,255,255,0.04)  // glass card background
--border:         rgba(255,255,255,0.07)  // subtle glass borders
--dim-bg:         #253349   // offline/inactive states
--amber:          #f59e0b   // primary accent
--amber-faint:    rgba(245,158,11,0.09)   // amber tint
--amber-bd:       rgba(245,158,11,0.22)   // amber glass border
--amber-glow:     0 0 22px rgba(245,158,11,0.22)  // box-shadow glow
--teal:           #34d399   // success, CPU bars
--blue:           #60a5fa   // URLs, memory bars
--purple:         #a78bfa   // Kubernetes/k8s tags
--text:           #e2e8f0   // primary text
--mid:            #4a6180   // secondary text
--dim:            #253349   // muted/inactive

// Typography
font-family:   "JetBrains Mono", "Fira Code", monospace  // ALL text
font-size:     9.5px (micro) | 10–11px (meta) | 12–13px (body) | 22–24px (display)
font-weight:   400 (body) | 600–700 (headings, CTAs)
line-height:   1.55–1.65

// Spacing
screen-padding:  14–22px horizontal
card-padding:    12–15px
card-gap:        8–12px
nav-height:      ~42px + 60px status bar offset

// Shape
border-radius:   10–12px (inputs) | 14–16px (cards) | 20–30px (pills/floating input)
backdrop-filter: blur(8px) saturate(180%)  // glass cards
box-shadow (glow): 0 0 22px rgba(245,158,11,0.22)   // amber primary
                   0 0 20px rgba(245,158,11,0.10)   // subtle card glow

// Toggles
on:  background #f59e0b, box-shadow 0 0 8px rgba(245,158,11,0.3)
off: background #253349
knob: white circle 20×20px, positioned top:3px left:3px (off) left:21px (on)
```

---

## Screens

### 1. Login / Setup

**Purpose:** First-run screen. User enters SSH connection details and authenticates.

**Layout:** Single column, top-down. Logo block → form fields → CTA button → secondary action.

**Direction A specifics:**
- Background `#0a0a0a`, no card chrome
- Logo: `TERMINALHUB` — "TERMINAL" in `#f59e0b`, "HUB" in `#c4c4c4`, 26px bold, letter-spacing -1px
- Version line above logo: 10px, `#484848`, letter-spacing 4px, uppercase
- Fields: `#161616` background, 1px `#1c1c1c` border, no border-radius, 13px text, 10px 14px padding
- Field labels: 10px uppercase, letter-spacing 2px, `#484848`
- "ssh_key" field has inline `CHANGE` link in amber
- CTA button: full-width, `#f59e0b` background, black text, 13px 700 weight, letter-spacing 3px, 14px vertical padding, no border-radius
- Footer fingerprint block: `#161616` bg, 1px `#1c1c1c` border, shows last SSH fingerprint

**Direction B specifics:**
- Background `#060d1f`
- Centered logo with radial amber glow behind it (100×100 `radial-gradient`)
- Icon circle: 58px diameter, `1.5px solid rgba(245,158,11,0.55)` border, `bAmberFaint` bg, amber glow shadow
- Icon: terminal chevron SVG (`>_` style) in amber
- `Terminal` + `Hub` (Hub in amber) 22px bold
- Fields: glass card style, `bCard` bg, `bBd` border, 10px border-radius, 11px padding
- CTA: amber bg, 12px border-radius, amber glow shadow, letter-spacing 2px

---

### 2. Device List

**Purpose:** Overview of all connected Mac machines. User selects a machine to open a terminal session.

**Layout:** Sticky header with count → column headers (A) or none (B) → machine list/cards → "add machine" footer.

**Direction A specifics:**
- Header: machine count in 22px amber bold, "online · N offline" in 12px `#484848`
- Column headers: 9.5px uppercase, letter-spacing 2px — HOST / LOAD / STATUS
- Row height ~52px, 1px `#1c1c1c` bottom border
- Primary machine row: `rgba(245,158,11,0.10)` tint background
- Status dot: 7px circle, `#6ee7b7` with `0 0 5px #6ee7b7` glow when online; `#2a2a2a` when offline
- Name: 13px, amber (primary) or `#c4c4c4`; sub: 10.5px `#484848`
- Load: 11px `#484848`
- "Add machine": dashed `#484848` border text, amber `+` icon

**Direction B specifics:**
- Header: 24px bold white count + muted "connected"
- Each machine is a **card**: `bCard` bg, `bBd` border, 14px border-radius
- Primary card: `rgba(245,158,11,0.08)` bg, `bAmberBd` border, amber glow shadow
- Pulse dot: 8px, amber with double glow when online
- **CPU + Memory bars** (online machines only):
  - Label + percent in 9.5px
  - Bar: 3px tall, `bBd` track, colored fill (`#34d399` CPU, `#60a5fa` memory)
  - Width = percentage value
- "Add machine": dashed `rgba(245,158,11,0.2)` border, 12px border-radius

---

### 3. Terminal Screen ★ (Key Screen)

**Purpose:** The core experience. Shows live terminal output from the connected Mac. User types commands, sees output in real time, and receives inline Claude suggestions.

**Layout (Direction A):**
```
┌─ Nav bar (machine name + status dot + search icon) ────┐
│                                                          │
│  Terminal scrollback output (flex:1, overflow:hidden)   │
│  · Lines: info (dim) → prompt+command → output          │
│  · Blank lines between command groups                    │
│                                                          │
│  ┌─ Claude suggestion block ──────────────────────────┐ │
│  │ ✦ CLAUDE (amber, 9.5px, letter-spacing 2px)        │ │
│  │ Suggestion text (11.5px, #c4c4c4)                  │ │
│  │ [tap-to-run chips: amber border, amber text]        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─ Input bar (› prompt + text + RUN button) ──────────────┘
```

**Layout (Direction B):**
```
┌─ Nav bar (machine name + amber pulse dot) ──────────────┐
│                                                          │
│  ┌─ Glass terminal panel (margin:10px 14px) ──────────┐ │
│  │  LIVE badge (amber dot + "LIVE" text, top-right)   │ │
│  │  Terminal output (same content as A)               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─ Claude card (amber glow, rounded 14px) ───────────┐ │
│  │  ● CLAUDE label                                    │ │
│  │  Suggestion text                                   │ │
│  │  [pill-shaped chips: border-radius 20px]           │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─ Floating pill input (border-radius:30px) ──────────────┘
```

**Terminal output color coding:**
| Content | Color |
|---------|-------|
| Prompt (`user@host:path$ `) | `#f59e0b` amber, font-weight 600 |
| Command text | `#c4c4c4` / `#e2e8f0` |
| Tool output, package names | `#c4c4c4` / `#e2e8f0` |
| Dim output (npm internals, etc.) | `#484848` / `#4a6180` |
| URLs, localhost links | `#93c5fd` / `#60a5fa` |
| Success (`✓ Ready`, etc.) | `#6ee7b7` / `#34d399` |
| Error output | `#f87171` |
| Login/info lines | `#484848` / `#4a6180` |

**Font:** 11.5px JetBrains Mono, line-height 1.55

**Blank line spacing between command groups:** 4–5px `<View style={{ height: 5 }} />`

**Claude suggestion block (Direction A):**
- 1px `rgba(245,158,11,0.25)` border
- `rgba(245,158,11,0.10)` background
- 10px 14px padding
- Header: `✦ CLAUDE`, 9.5px amber bold, letter-spacing 2px
- Body: 11.5px `#c4c4c4`, line-height 1.65
- Inline code references: amber text
- Chips: `font-size: 10px`, `padding: 3px 8px`, `border: 1px solid rgba(245,158,11,0.25)`, amber text

**Claude suggestion card (Direction B):**
- `rgba(245,158,11,0.09)` bg, `rgba(245,158,11,0.22)` border, 14px border-radius
- `box-shadow: 0 0 24px rgba(245,158,11,0.10)`
- Pulse dot: 6px amber with glow
- Body: 12px `#e2e8f0`, line-height 1.65
- Chips: 10.5px, `padding: 5px 11px`, border-radius 20px (pill), amber border + amber text

**Nav bar (Direction A):**
- Machine name: 13px amber bold
- Sub: SSH address, 10.5px `#484848`
- Right side: 7px green dot with glow + search icon (16px, stroke `#484848`)

**Nav bar (Direction B):**
- Machine name: 13px `#e2e8f0` bold
- Sub: SSH address, 10.5px `#4a6180`
- Right side: single 8px amber dot with double glow

**Input bar (Direction A):**
- Background: `#101010`, 1px `#1c1c1c` top border, 10px 18px padding
- `›` prompt: 15px amber, font-weight 600
- Text field: 13px `#c4c4c4`, flex:1
- RUN button: `#f59e0b` bg, 5px 12px padding, 11px black bold text, letter-spacing 1px, no border-radius

**Input bar (Direction B):**
- Border-radius: 30px (pill shape)
- Background: `rgba(255,255,255,0.04)`, 1px `rgba(255,255,255,0.07)` border
- Padding: 10px 16px
- Margins: 0 14px 14px (floats above screen bottom)
- RUN button: amber bg, 20px border-radius, 6px 14px padding

---

### 4. Claude Chat

**Purpose:** Full conversation interface. Shows the live terminal session as context at the top, then a scrollable Claude conversation below. User can ask questions about their terminal output and receive actionable command suggestions.

**Layout:**
```
┌─ Nav ("✦ Claude" + machine/session sub) ───────────────┐
├─ Context panel (last 4–6 terminal lines) ───────────────┤
│  · Compact, read-only, shows prompts + recent output    │
├─ Chat scroll region (flex:1) ───────────────────────────┤
│  · User messages: right-aligned                         │
│  · Claude messages: left-aligned                        │
│  · Below Claude messages: tap-to-run command chips      │
├─ Input bar ─────────────────────────────────────────────┘
```

**Context panel (Direction A):** `#161616` bg, 1px `#1c1c1c` border-bottom, 10px 18px padding. "CONTEXT" label 9.5px uppercase, letter-spacing 2px. Lines 10.5px.

**Context panel (Direction B):** Glass card (`bCard` bg, `bBd` border, 14px border-radius), 12px 14px margin, 12px 14px padding. Same label style.

**Message bubbles:**

| | Direction A | Direction B |
|--|-------------|-------------|
| User bg | `rgba(245,158,11,0.10)` | `rgba(245,158,11,0.10)` |
| User border | `rgba(245,158,11,0.25)` | `rgba(245,158,11,0.15)` |
| User border-radius (A) | 0px | `14px 14px 4px 14px` |
| Claude bg | `#161616` | `rgba(255,255,255,0.04)` |
| Claude border | `#1c1c1c` | `rgba(255,255,255,0.07)` |
| Claude border-radius (A) | 0px | `4px 14px 14px 14px` |
| Font size | 12px | 12px |
| Line height | 1.6 | 1.6 |

**Direction A sender labels:** 9.5px `#484848` ("you") and 9.5px amber ("✦ claude"). No avatars.
**Direction B sender labels:** Same but Claude label accompanied by a 5px amber dot with glow.

**Inline code in Claude responses:**
- Commands: `#6ee7b7` / `#34d399` text (teal)
- Key terms / branch names: `#f59e0b` amber

**Tap-to-run chips below Claude messages:** Same spec as Terminal screen chips.

---

### 5. Command Favorites

**Purpose:** Saved command library. User can search, browse by category, and execute a command with one tap.

**Layout (Direction A):** Nav → search bar → flat list with index numbers
**Layout (Direction B):** Nav → horizontal category tab strip → card list

**Direction A list rows:**
- Row padding: 10px 18px, 1px `#1c1c1c` border-bottom
- Index number: 11px `#484848`, right-aligned in 14px column
- Command text: 12px `#c4c4c4`
- Category tag: `${color}18` bg, `${color}` text, 9px, 1px 5px padding
- Execute button: `#161616` bg, "▶" in `#484848`, 5px 10px padding

**Direction B cards:**
- Card: `bCard` bg, `bBd` border, 12px border-radius, 11px 14px padding
- Same content, execute button is 32×32 rounded square (`bAmberFaint` bg, `bAmberBd` border, amber ▶)

**Category colors:**
```
npm:    #f59e0b  (amber)
git:    #93c5fd  (blue)     / #60a5fa (Direction B)
docker: #34d399  (teal)
k8s:    #a78bfa  (purple)
logs:   #fb923c  (orange)
ssh:    #f472b6  (pink)
node:   #4ade80  (green)
```

**Direction B category tabs:**
- Active: `#f59e0b` bg, black text, font-weight 700, no border
- Inactive: `bCard` bg, `bMid` text, `bBd` border
- Height: ~32px, border-radius: 20px, padding: 5px 12px
- Scroll horizontally (tabs overflow)

---

### 6. Settings / Profiles

**Purpose:** App configuration — appearance, connection settings, SSH key management, Claude integration options.

**Direction A layout:** Flat key → value list, grouped by section headers.
- Section headers: 9.5px `#484848`, letter-spacing 3px, styled `── SECTION ──────────────`
- Rows: `display: flex`, key in 130px wide `#484848` span, value in amber
- Row padding: 7px 20px
- Font size: 12px

**Direction B layout:** Grouped glass cards, one card per section.
- Card: `bCard` bg, `bBd` border, 14px border-radius, overflow hidden
- Section label: 10px `bMid`, letter-spacing 2px, 9px 14px 5px padding
- Rows: 11px 14px padding, 1px `bBd` top border on first row only
- Row font: 13px `#e2e8f0` label

**Toggle spec (Direction B):**
- Container: 44×26px, border-radius 13px
- On: `#f59e0b` bg, `box-shadow: 0 0 8px rgba(245,158,11,0.3)`
- Off: `#253349` bg
- Knob: 20×20px white circle, `top: 3, left: 3` (off) / `top: 3, left: 21` (on)

**Select row (Direction B):** Value in amber + small chevron in `#4a6180`

---

## Interactions & Behavior

### Navigation
- All secondary screens (Terminal, Claude, etc.) slide in from the right (standard iOS push)
- Back button (chevron `‹`) returns to previous screen
- Bottom tab bar (not shown in mockups) for: Machines | Favorites | Settings

### Terminal Screen
- **Output stream:** WebSocket messages append new lines to the output list. New lines scroll the view to the bottom.
- **Command input:** Focused state shows iOS keyboard. `RUN` taps or pressing Return sends command via WebSocket.
- **Claude suggestion:** Appears after a command completes. Trigger: after `stdout` closes for a command. Tap a chip to populate the input field (do not auto-run).
- **Live badge (Direction B):** Pulses when WebSocket is actively receiving data. Dims when idle.

### Device List
- Tap any machine row/card → navigate to Terminal screen for that machine
- Long press → context menu: Set as Primary / Edit / Disconnect / Remove
- Primary machine highlighted — badge shown

### Claude Chat
- Sending a message calls the Claude API with system prompt containing the last N lines of terminal output as context
- Claude responses stream in. Show typing indicator (three dots) while streaming.
- Tapping a command chip in Claude's response navigates back to the Terminal screen and pre-fills the input

### Command Favorites
- Tap execute (▶) → navigate to the machine's Terminal screen and pre-fill the command in the input bar
- Long press → Edit / Delete / Move to category
- Search filters in real time as the user types

### Authentication / SSH
- SSH keys stored in iOS Keychain / Android Keystore via `react-native-keychain`
- On first connect: fingerprint confirmation dialog
- Connection state machine: Disconnected → Connecting → Authenticating → Connected → Error

---

## State Management

```typescript
// Machines
interface Machine {
  id: string;
  name: string;
  hostname: string;       // IP or hostname
  username: string;
  sshKeyRef: string;      // Keychain reference
  port: number;           // default 22
  isPrimary: boolean;
  status: 'online' | 'offline' | 'connecting';
  lastConnected: Date;
  cpuPercent?: number;    // from heartbeat
  memPercent?: number;    // from heartbeat
}

// Terminal session
interface Session {
  machineId: string;
  lines: TerminalLine[];
  claudeSuggestion: string | null;
  claudeChips: string[];
  inputValue: string;
  isConnected: boolean;
}

interface TerminalLine {
  type: 'prompt' | 'output' | 'error' | 'info';
  text: string;
  promptText?: string;    // the prompt prefix
}

// Favorites
interface Favorite {
  id: string;
  command: string;
  category: string;
  usageCount: number;
}

// Claude chat
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  chips?: string[];       // tap-to-run commands from Claude
  timestamp: Date;
}
```

---

## Assets & Icons

The mockups use inline SVG for all icons — no external icon library referenced. For implementation, use an icon library already present in the codebase. Suggested mappings:

| Icon | Suggested SF Symbol (iOS) | Usage |
|------|--------------------------|-------|
| Back chevron | `chevron.left` | Nav bar back button |
| Search | `magnifyingglass` | Terminal screen search |
| Terminal prompt `›` | Text character U+203A | Input bar |
| Status dot | `circle.fill` | Machine online/offline |
| Live indicator | `circle.fill` | Terminal live badge |
| Execute | `play.fill` or `▶` | Favorites run button |
| Claude `✦` | Text character U+2726 | Claude labels |
| Settings chevron `›` | `chevron.right` | Settings rows |

---

## Typography: Google Fonts

The design uses **JetBrains Mono** throughout — load it as a custom font in the Expo project:

```bash
npx expo install expo-font @expo-google-fonts/jetbrains-mono
```

```typescript
import { useFonts, JetBrainsMono_400Regular, JetBrainsMono_600SemiBold, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
```

Fallback chain if not loaded: `Courier New`, `Courier`, `monospace`.

---

## Key Technical Notes

1. **Terminal output rendering:** Use a `FlatList` with `inverted={false}` and auto-scroll to bottom on new items. Each line is a fixed-height row for performance.

2. **WebSocket connection:** Maintain a single WebSocket per machine session. Reconnect automatically on disconnect with exponential backoff.

3. **Claude integration:** The system prompt for each Claude call should include: machine name, current working directory, and the last 50 lines of terminal output. The Claude session is hosted on the backend Mac (per product spec) — the mobile app sends the terminal context to the backend, which makes the Claude API call and streams the response back via WebSocket.

4. **SSH from mobile:** SSH connection is managed by the **Node.js backend** running on the Mac, not the mobile app directly. The mobile app communicates with the backend via WebSocket over the local network (or via tunnel for remote access).

5. **Status bar offset:** iOS Dynamic Island devices require 60px top padding on all screens. Android varies — use `react-native-safe-area-context` `SafeAreaView` or `useSafeAreaInsets()`.

6. **Cursor blink:** CSS `animation: blink 1.1s step-end infinite` in web; in React Native use `Animated.loop` with `Animated.sequence` toggling opacity between 1 and 0 at 550ms intervals.

---

## File Structure Suggestion

```
src/
  screens/
    LoginScreen.tsx
    DeviceListScreen.tsx
    TerminalScreen.tsx       ← Priority #1
    ClaudeChatScreen.tsx
    FavoritesScreen.tsx
    SettingsScreen.tsx
  components/
    TerminalLine.tsx          ← Single output line renderer
    ClaudeSuggestion.tsx      ← Inline suggestion block
    MachineCard.tsx           ← Device list card (Direction B)
    CommandChip.tsx           ← Tap-to-run chip
    PulseIndicator.tsx        ← Animated status dot
  hooks/
    useWebSocket.ts           ← WebSocket connection manager
    useSSHSession.ts          ← Session state
    useClaude.ts              ← Claude API integration
  services/
    SSHManager.ts
    WebSocketServer.ts
    ClaudeIntegration.ts
    SecureStorage.ts
```

---

## Questions for the Developer

Before starting implementation, clarify:

1. **Which direction?** A (Raw Signal) or B (Pulse) — or a merge?
2. **Navigation library?** React Navigation v6 (stack + tabs) is assumed.
3. **Existing design system?** Are there existing components for buttons, inputs, cards?
4. **Backend ready?** Is the Node.js + WebSocket backend running? The terminal screen depends on it.
5. **Claude integration location?** Product spec says Claude runs on the hosting Mac — confirm the API key is stored server-side only.
