import { View, Text, StyleSheet } from 'react-native';
import { theme, mono, amberGlow } from '@/theme';
import { PulseDot } from './PulseDot';
import { ClaudeChip } from './ClaudeChip';

// Inline Claude suggestion below the terminal (screens-b). Body may highlight a command in amber.
export function ClaudeSuggestionCard({
  text,
  highlight,
  chips,
  onChipPress,
}: {
  text: string;
  highlight?: string;
  chips: string[];
  onChipPress: (command: string) => void;
}) {
  return (
    <View style={[styles.card, amberGlow(0.12, 18)]}>
      <View style={styles.labelRow}>
        <PulseDot size={6} />
        <Text style={[mono(10, theme.amber, 'sb'), styles.label]}>CLAUDE</Text>
      </View>
      <Text style={[mono(12, theme.text), styles.body]}>{renderHighlighted(text, highlight)}</Text>
      {chips.length > 0 && (
        <View style={styles.chips}>
          {chips.map((c) => (
            <ClaudeChip key={c} command={c} onPress={onChipPress} />
          ))}
        </View>
      )}
    </View>
  );
}

function renderHighlighted(text: string, highlight?: string) {
  if (!highlight || !text.includes(highlight)) return text;
  const [before, after] = text.split(highlight);
  return (
    <Text>
      {before}
      <Text style={{ color: theme.amber }}>{highlight}</Text>
      {after}
    </Text>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.amberFaint,
    borderWidth: 1,
    borderColor: theme.amberBd,
    borderRadius: theme.radiusMd,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 7 },
  label: { letterSpacing: 1.5 },
  body: { lineHeight: 20 },
  chips: { flexDirection: 'row', gap: 7, marginTop: 10, flexWrap: 'wrap' },
});
