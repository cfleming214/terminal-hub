import { useEffect, useRef } from 'react';
import { Animated, Platform, ViewStyle } from 'react-native';
import { theme } from '@/theme';

// Amber status dot with a soft glow + gentle pulse. Grey + static when offline.
export function PulseDot({
  size = 8,
  color = theme.amber,
  active = true,
}: {
  size?: number;
  color?: string;
  active?: boolean;
}) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, pulse]);

  const dotColor = active ? color : theme.dimBg;

  const glow: ViewStyle = active
    ? Platform.select<ViewStyle>({
        ios: { shadowColor: color, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: size },
        default: { elevation: 4 },
      })!
    : {};

  if (!active) {
    return <Animated.View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: dotColor }]} />;
  }

  return (
    <Animated.View
      style={[
        { width: size, height: size, borderRadius: size / 2, backgroundColor: dotColor },
        glow,
        { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.55] }) },
      ]}
    />
  );
}
