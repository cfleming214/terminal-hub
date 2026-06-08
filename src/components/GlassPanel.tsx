import { View, ViewProps, ViewStyle } from 'react-native';
import { glassCard, amberGlow, theme } from '@/theme';

// Reusable glass surface. `glow` adds the amber ambient shadow; `amber` tints it for primary surfaces.
export function GlassPanel({
  glow = false,
  amber = false,
  style,
  children,
  ...rest
}: ViewProps & { glow?: boolean; amber?: boolean }) {
  const tint: ViewStyle = amber
    ? { backgroundColor: theme.amberFaint, borderColor: theme.amberBd }
    : {};
  return (
    <View style={[glassCard, tint, glow ? amberGlow(amber ? 0.25 : 0.18, 16) : null, style]} {...rest}>
      {children}
    </View>
  );
}
