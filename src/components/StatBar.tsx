import { View, Text, StyleSheet } from 'react-native';
import { theme, mono } from '@/theme';

// CPU / memory mini meter (3px track + colored fill) used on machine cards.
export function StatBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <View style={styles.col}>
      <View style={styles.row}>
        <Text style={mono(9.5, theme.mid)}>{label}</Text>
        <Text style={mono(9.5, color)}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  col: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  track: { height: 3, backgroundColor: theme.border, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
});
