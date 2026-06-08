# TerminalHub — Claude Code Agent Instructions

You are implementing a React Native (Expo) iOS app called **TerminalHub**. This is a mobile SSH terminal controller with inline Claude AI suggestions. The full visual spec lives in `README.md` in this folder. **Read README.md first**, then come back here.

This file gives you the implementation plan, priorities, constraints, and decision answers so you can work autonomously.

---

## Project Identity

| Key | Value |
|-----|-------|
| App name | TerminalHub |
| Platform | iOS (iPhone), React Native + Expo |
| Font | JetBrains Mono, all text, all weights |
| Primary accent | `#f59e0b` (amber) |
| App icon | `AppIcon-1024.png` in this folder |
| Design direction | **Direction B (Pulse)** — deep navy, glass cards, amber glow |
| Fallback reference | Direction A details in `screens-a.jsx` for terminal output density |

---

## Architecture Decisions (pre-resolved, do not ask)

| Decision | Answer |
|----------|--------|
| Navigation | React Navigation v7 — Stack + Bottom Tabs |
| State management | Zustand |
| WebSocket | Native WebSocket API, managed in a custom `useWebSocket` hook |
| SSH | **Not on device.** The Mac runs a local Node.js bridge server. The app connects to it via WebSocket over LAN |
| Claude API | Runs on the Mac bridge server. App sends context → server calls Claude → streams back over WebSocket |
| Secure storage | `expo-secure-store` for SSH keys and host credentials |
| Safe area | `react-native-safe-area-context` — use `useSafeAreaInsets()` everywhere, never hardcode status bar height |
| Font loading | `expo-font` + `@expo-google-fonts/jetbrains-mono` |
| Icon library | `@expo/vector-icons` / Ionicons |

---

## Task Order — implement in this sequence

### Phase 1 — Foundation
1. `AppNavigator.tsx` — Stack wrapping Tab navigator. Tabs: Machines | Favorites | Settings.
2. `theme.ts` — All color tokens, typography scale, spacing, border-radius from Direction B tokens in README.md.
3. `JetBrainsMono` font loading in `App.tsx` with `<AppLoading>` splash.

### Phase 2 — Core Screens
4. `DeviceListScreen.tsx` — Glass cards, CPU/memory bars, online pulse dot.
5. `TerminalScreen.tsx` ← **This is the priority screen.** Full spec in README.md §Terminal Screen.
6. `ClaudeChatScreen.tsx` — Context panel at top + bubble conversation + chips.

### Phase 3 — Supporting Screens
7. `LoginScreen.tsx` — SSH connection form (adds a new machine).
8. `FavoritesScreen.tsx` — Horizontal category tabs + card list.
9. `SettingsScreen.tsx` — Glass card groups with amber toggles.

### Phase 4 — Services
10. `WebSocketManager.ts` — Connects to Mac bridge, handles reconnect with exponential backoff.
11. `ClaudeService.ts` — Sends terminal context to bridge, streams response.
12. `SecureStorage.ts` — Wrap `expo-secure-store` with typed get/set/delete.

---

## Key Implementation Details

### TerminalScreen — the most important screen

```tsx
// Component structure
<SafeAreaView>
  <NavBar title={machine.name} subtitle={`${machine.username}@${machine.ip}`} />
  <GlassPanel style={styles.terminalPanel}>
    <LiveBadge active={isConnected} />          // amber dot + "LIVE"
    <FlatList
      data={lines}
      renderItem={({ item }) => <TerminalLine line={item} />}
      ref={listRef}
      onContentSizeChange={() => listRef.current?.scrollToEnd()}
    />
  </GlassPanel>
  {claudeSuggestion && (
    <ClaudeSuggestionCard
      text={claudeSuggestion}
      chips={claudeChips}
      onChipPress={(cmd) => setInput(cmd)}   // fill input, do NOT auto-run
    />
  )}
  <PillInput
    value={input}
    onChangeText={setInput}
    onSubmit={sendCommand}
  />
</SafeAreaView>
```

### Terminal line color mapping (exact)
```ts
export function getLineColor(line: TerminalLine, theme: Theme) {
  switch (line.type) {
    case 'prompt':  return theme.amber;          // #f59e0b
    case 'output':  return theme.text;           // #e2e8f0
    case 'dim':     return theme.mid;            // #4a6180
    case 'url':     return theme.blue;           // #60a5fa
    case 'success': return theme.teal;           // #34d399
    case 'error':   return theme.red;            // #f87171
    case 'info':    return theme.mid;            // #4a6180
  }
}
```

### Glass card style (reuse everywhere)
```ts
export const glassCard = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.07)',
  borderRadius: 14,
};
```

### Amber glow shadow (React Native)
React Native doesn't support `box-shadow` with blur on Android. Use this cross-platform approach:
```ts
// iOS only (use Platform.select)
shadowColor: '#f59e0b',
shadowOffset: { width: 0, height: 0 },
shadowOpacity: 0.35,
shadowRadius: 12,
// Android fallback: elevation: 8 (no color control)
```

### Cursor blink animation
```ts
const blink = useRef(new Animated.Value(1)).current;
useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(blink, { toValue: 0, duration: 550, useNativeDriver: true }),
      Animated.timing(blink, { toValue: 1, duration: 0,   useNativeDriver: true }),
      Animated.timing(blink, { toValue: 1, duration: 550, useNativeDriver: true }),
    ])
  ).start();
}, []);
// <Animated.View style={{ opacity: blink, width: 8, height: 15, backgroundColor: '#f59e0b' }} />
```

### Toggle component (Settings)
```tsx
function AmberToggle({ value, onChange }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const toggle = () => {
    const next = !value;
    Animated.timing(anim, { toValue: next ? 1 : 0, duration: 180, useNativeDriver: false }).start();
    onChange(next);
  };
  const left = anim.interpolate({ inputRange: [0,1], outputRange: [3, 21] });
  const bg   = anim.interpolate({ inputRange: [0,1], outputRange: ['#253349', '#f59e0b'] });
  return (
    <Pressable onPress={toggle}>
      <Animated.View style={{ width:44, height:26, borderRadius:13, backgroundColor: bg }}>
        <Animated.View style={{ position:'absolute', top:3, left, width:20, height:20, borderRadius:10, backgroundColor:'#fff' }} />
      </Animated.View>
    </Pressable>
  );
}
```

---

## Mac Bridge Server (companion piece — implement after app)

The Mac bridge is a **Node.js server** (not part of the app bundle) that the user runs on their Mac. It:
1. Spawns a local shell session and pipes stdin/stdout over WebSocket
2. Accepts WebSocket connections from the mobile app on port `8765`
3. Forwards Claude API calls: receives `{ type: 'claude', context: string[], prompt: string }`, responds with streamed `{ type: 'claude_chunk', text: string }`

Suggested stack: `ws` (WebSocket) + `node-pty` (PTY) + `@anthropic-ai/sdk`

```
bridge-server/
  index.js         // WS server, spawns node-pty shell
  claude.js        // Claude API integration
  package.json
  README.md        // Setup: npm install && node index.js
```

Claude API key lives in the bridge server's `.env`, never in the app.

---

## Zustand Store Shape

```ts
interface AppStore {
  machines: Machine[];
  activeMachineId: string | null;
  sessions: Record<string, Session>;         // keyed by machineId
  claudeChats: Record<string, ChatMessage[]>;// keyed by machineId
  favorites: Favorite[];

  // Actions
  addMachine: (m: Omit<Machine, 'id'>) => void;
  setActive: (id: string) => void;
  appendLine: (machineId: string, line: TerminalLine) => void;
  setClaudeSuggestion: (machineId: string, text: string, chips: string[]) => void;
  addChatMessage: (machineId: string, msg: ChatMessage) => void;
}
```

---

## Suggested File Structure

```
app/
  _layout.tsx                    // Expo Router root (or App.tsx if bare)
  (tabs)/
    index.tsx                    // → DeviceListScreen
    favorites.tsx                // → FavoritesScreen
    settings.tsx                 // → SettingsScreen
  terminal/[machineId].tsx       // → TerminalScreen
  claude/[machineId].tsx         // → ClaudeChatScreen
  login.tsx                      // → LoginScreen (add machine modal)

src/
  components/
    TerminalLine.tsx
    ClaudeSuggestionCard.tsx
    ClaudeChip.tsx
    MachineCard.tsx
    GlassPanel.tsx               // reusable glass card wrapper
    AmberToggle.tsx
    PillInput.tsx
    PulseDot.tsx
    NavBar.tsx
  hooks/
    useWebSocket.ts
    useTerminalSession.ts
    useClaude.ts
  services/
    SecureStorage.ts
    ClaudeService.ts
  store/
    useAppStore.ts               // Zustand
  theme/
    index.ts                     // Direction B tokens
    typography.ts
```

---

## Exact Color Token File

Paste this into `src/theme/index.ts`:

```ts
export const theme = {
  // Backgrounds
  bg:          '#060d1f',
  bg2:         '#0b1526',
  card:        'rgba(255,255,255,0.04)',
  dimBg:       '#253349',

  // Borders
  border:      'rgba(255,255,255,0.07)',

  // Amber
  amber:       '#f59e0b',
  amberFaint:  'rgba(245,158,11,0.09)',
  amberBd:     'rgba(245,158,11,0.22)',

  // Semantic
  teal:        '#34d399',   // success
  blue:        '#60a5fa',   // links, memory
  purple:      '#a78bfa',   // k8s tags
  red:         '#f87171',   // errors

  // Text
  text:        '#e2e8f0',
  mid:         '#4a6180',
  dim:         '#253349',

  // Radii
  radiusSm:    10,
  radiusMd:    14,
  radiusLg:    16,
  radiusPill:  30,

  // Font
  fontMono:    'JetBrainsMono_400Regular',
  fontMonoSb:  'JetBrainsMono_600SemiBold',
  fontMonoBd:  'JetBrainsMono_700Bold',
} as const;
```

---

## Do Not

- Do not use any font other than JetBrains Mono
- Do not add emoji anywhere in the UI
- Do not add placeholder/lorem ipsum content
- Do not store the Claude API key anywhere in the app bundle or Expo config
- Do not use `StyleSheet.create` with magic numbers — reference `theme.*` tokens
- Do not add a splash/onboarding screen that isn't in the designs

---

## Visual Reference Files

| File | Use for |
|------|---------|
| `TerminalHub Design.html` | Open in browser — full 12-screen visual reference |
| `screens-a.jsx` | Direction A component source (terminal output density) |
| `screens-b.jsx` | Direction B component source (all screens — implement this) |
| `AppIcon-1024.png` | App icon — drop into `assets/images/icon.png` |
| `README.md` | Full pixel-level spec per screen |

---

## First Message to Send

When starting the implementation, your first message should be:
> "I'll implement the TerminalHub React Native app using the Expo Router + Zustand + Direction B visual design. Starting with Phase 1: AppNavigator, theme tokens, and font loading. Which screens do you want me to tackle first after the foundation?"
