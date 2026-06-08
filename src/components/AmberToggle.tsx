import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, ViewStyle } from 'react-native';
import { theme } from '@/theme';

// Animated toggle (AGENTS.md AmberToggle): 44x26 track, white knob, amber + glow when on.
export function AmberToggle({ value, onChange }: { value: boolean; onChange: (next: boolean) => void }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: value ? 1 : 0, duration: 180, useNativeDriver: false }).start();
  }, [value, anim]);

  const left = anim.interpolate({ inputRange: [0, 1], outputRange: [3, 21] });
  const bg = anim.interpolate({ inputRange: [0, 1], outputRange: [theme.dimBg, theme.amber] });

  const glow: ViewStyle = value
    ? Platform.select<ViewStyle>({
        ios: { shadowColor: theme.amber, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 5 },
        default: { elevation: 3 },
      })!
    : {};

  return (
    <Pressable onPress={() => onChange(!value)} hitSlop={8}>
      <Animated.View style={[{ width: 44, height: 26, borderRadius: 13, backgroundColor: bg }, glow]}>
        <Animated.View
          style={{ position: 'absolute', top: 3, left, width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' }}
        />
      </Animated.View>
    </Pressable>
  );
}
