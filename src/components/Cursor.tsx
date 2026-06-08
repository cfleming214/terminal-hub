import { useEffect, useRef } from 'react';
import { Animated, Platform, ViewStyle } from 'react-native';
import { theme } from '@/theme';

// Blinking amber block cursor (AGENTS.md cursor-blink spec, 550ms intervals).
export function Cursor({ width = 8, height = 15 }: { width?: number; height?: number }) {
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0, duration: 550, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 550, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [blink]);

  const glow: ViewStyle = Platform.select<ViewStyle>({
    ios: { shadowColor: theme.amber, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 5 },
    default: {},
  })!;

  return (
    <Animated.View
      style={[{ width, height, backgroundColor: theme.amber, opacity: blink, marginLeft: 2, borderRadius: 1 }, glow]}
    />
  );
}
