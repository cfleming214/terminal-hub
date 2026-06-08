// Inline SVG icons matching the design references (no external icon font for these glyphs).
import Svg, { Path } from 'react-native-svg';
import { theme } from '@/theme';

export function BackChevron({ color = theme.mid, size = 12 }: { color?: string; size?: number }) {
  const w = (size * 7) / 12;
  return (
    <Svg width={w} height={size} viewBox="0 0 7 12" fill="none">
      <Path d="M6 1L1 6l5 5" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function RightChevron({ color = theme.mid, size = 9 }: { color?: string; size?: number }) {
  const w = (size * 5) / 9;
  return (
    <Svg width={w} height={size} viewBox="0 0 5 9" fill="none">
      <Path d="M1 1l3 3.5-3 3.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Terminal prompt chevron ">_" used in the logo mark.
export function TerminalMark({ color = theme.amber, size = 16 }: { color?: string; size?: number }) {
  const w = (size * 22) / 16;
  return (
    <Svg width={w} height={size} viewBox="0 0 22 16" fill="none">
      <Path d="M2 1l6 7-6 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 15h9" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Four-pointed sparkle for the Claude label (U+2726 rendered as a vector).
export function Sparkle({ color = theme.amber, size = 12 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path
        d="M6 0c.4 2.6 1.4 4.6 6 6-4.6 1.4-5.6 3.4-6 6-.4-2.6-1.4-4.6-6-6 4.6-1.4 5.6-3.4 6-6z"
        fill={color}
      />
    </Svg>
  );
}

export function PlayIcon({ color = theme.amber, size = 12 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path d="M3 1.5v9l7-4.5-7-4.5z" fill={color} />
    </Svg>
  );
}
