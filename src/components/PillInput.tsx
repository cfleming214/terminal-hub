import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { theme, mono } from '@/theme';

// Floating pill input (screens-b): prompt glyph + text field + amber action button.
export function PillInput({
  value,
  onChangeText,
  onSubmit,
  placeholder = '',
  promptGlyph = '›',
  actionLabel = 'RUN',
}: {
  value: string;
  onChangeText: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  promptGlyph?: string;
  actionLabel?: string;
}) {
  const canSubmit = value.trim().length > 0;
  return (
    <View style={styles.bar}>
      <Text style={[mono(15, theme.amber, 'sb')]}>{promptGlyph}</Text>
      <TextInput
        style={[mono(13, theme.text), styles.input]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.mid}
        onSubmitEditing={onSubmit}
        returnKeyType="send"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardAppearance="dark"
        blurOnSubmit={false}
        cursorColor={theme.amber}
        selectionColor={theme.amber}
      />
      <Pressable
        onPress={onSubmit}
        disabled={!canSubmit}
        style={[styles.action, { opacity: canSubmit ? 1 : 0.4 }]}>
        <Text style={mono(11, theme.black, 'bd')}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radiusPill,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  input: { flex: 1, padding: 0, margin: 0 },
  action: {
    backgroundColor: theme.amber,
    borderRadius: theme.radiusChip,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
});
