// Direction B ("Pulse") design tokens — deep navy, amber glow, glass panels.
// Source: design_handoff_terminalhub/AGENTS.md + README.md. Use these everywhere; no magic colors.
import { Platform, ViewStyle, TextStyle } from 'react-native';

export const theme = {
  // Backgrounds
  bg: '#060d1f',
  bg2: '#0b1526',
  card: 'rgba(255,255,255,0.04)',
  dimBg: '#253349',

  // Borders
  border: 'rgba(255,255,255,0.07)',

  // Amber (primary accent)
  amber: '#f59e0b',
  amberFaint: 'rgba(245,158,11,0.09)',
  amberTint: 'rgba(245,158,11,0.1)',
  amberBd: 'rgba(245,158,11,0.22)',
  amberBorderSoft: 'rgba(245,158,11,0.15)',

  // Semantic
  teal: '#34d399', // success, CPU bars
  blue: '#60a5fa', // links, memory bars
  purple: '#a78bfa', // k8s tags
  green: '#4ade80',
  orange: '#fb923c',
  pink: '#f472b6',
  red: '#f87171', // errors

  // Text
  text: '#e2e8f0',
  mid: '#4a6180',
  dim: '#253349',
  black: '#000000',

  // Radii
  radiusSm: 10,
  radiusMd: 14,
  radiusLg: 16,
  radiusInput: 12,
  radiusPill: 30,
  radiusChip: 20,

  // Fonts (JetBrains Mono — all text, all weights)
  fontMono: 'JetBrainsMono_400Regular',
  fontMonoSb: 'JetBrainsMono_600SemiBold',
  fontMonoBd: 'JetBrainsMono_700Bold',
} as const;

export type Theme = typeof theme;

// Category accent colors for favorites (README §Category colors, Direction B values)
export const categoryColors: Record<string, string> = {
  npm: theme.amber,
  git: theme.blue,
  docker: theme.teal,
  k8s: theme.purple,
  logs: theme.orange,
  ssh: theme.pink,
  node: theme.green,
};

// Reusable glass card surface
export const glassCard: ViewStyle = {
  backgroundColor: theme.card,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: theme.radiusMd,
};

// Amber glow — cross-platform (iOS colored shadow, Android elevation fallback)
export function amberGlow(opacity = 0.35, radius = 12): ViewStyle {
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: theme.amber,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    default: { elevation: 8 },
  })!;
}

// Map a terminal line type to its color (AGENTS.md getLineColor)
export function getLineColor(type: string): string {
  switch (type) {
    case 'prompt':
      return theme.amber;
    case 'output':
      return theme.text;
    case 'dim':
      return theme.mid;
    case 'url':
      return theme.blue;
    case 'success':
      return theme.teal;
    case 'error':
      return theme.red;
    case 'info':
      return theme.mid;
    default:
      return theme.text;
  }
}

// Common monospace text style helper
export function mono(size: number, color: string = theme.text, weight: 'r' | 'sb' | 'bd' = 'r'): TextStyle {
  return {
    fontFamily: weight === 'bd' ? theme.fontMonoBd : weight === 'sb' ? theme.fontMonoSb : theme.fontMono,
    fontSize: size,
    color,
  };
}
