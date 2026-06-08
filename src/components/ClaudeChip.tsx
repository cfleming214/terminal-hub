import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme, mono } from '@/theme';

// Tap-to-run command chip. Tapping pre-fills the input — it never auto-runs the command.
export function ClaudeChip({
  command,
  onPress,
  variant = 'amber',
}: {
  command: string;
  onPress: (command: string) => void;
  variant?: 'amber' | 'muted';
}) {
  const isAmber = variant === 'amber';
  const containerStyle: ViewStyle = isAmber
    ? { backgroundColor: theme.amberTint, borderColor: theme.amberBd }
    : { backgroundColor: theme.card, borderColor: theme.border };
  return (
    <Pressable onPress={() => onPress(command)} style={[styles.chip, containerStyle]}>
      <Text style={mono(isAmber ? 10.5 : 9.5, isAmber ? theme.amber : theme.mid)}>{command}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: theme.radiusChip,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
});
