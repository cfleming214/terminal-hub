import { View, Text, StyleSheet } from 'react-native';
import { theme, mono } from '@/theme';
import { PulseDot } from './PulseDot';

// "LIVE" badge shown top-right of the terminal panel. Dims when not actively connected.
export function LiveBadge({ active = true }: { active?: boolean }) {
  return (
    <View style={styles.wrap}>
      <PulseDot size={6} active={active} />
      <Text style={[mono(9, active ? theme.mid : theme.dim), styles.label]}>LIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  label: { letterSpacing: 1 },
});
