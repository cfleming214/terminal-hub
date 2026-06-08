import { Text, View, StyleSheet } from 'react-native';
import { theme, getLineColor } from '@/theme';
import { TerminalLine } from '@/types';
import { Cursor } from './Cursor';

// Single terminal scrollback row. Prompt rows render the amber prompt prefix + light command text.
export function TerminalLineRow({ line, showCursor = false }: { line: TerminalLine; showCursor?: boolean }) {
  if (line.type === 'info') {
    return <Text style={[styles.info, { color: theme.mid }]}>{line.text}</Text>;
  }

  if (line.type === 'prompt') {
    return (
      <View style={styles.promptRow}>
        <Text style={styles.line}>
          <Text style={{ color: theme.amber, fontFamily: theme.fontMonoSb }}>{line.promptText}</Text>
          <Text style={{ color: theme.text, fontFamily: theme.fontMono }}>{line.text}</Text>
        </Text>
        {showCursor && <Cursor />}
      </View>
    );
  }

  return <Text style={[styles.line, { color: getLineColor(line.type) }]}>{line.text}</Text>;
}

const styles = StyleSheet.create({
  line: { fontFamily: theme.fontMono, fontSize: 11.5, lineHeight: 18 },
  promptRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  info: { fontFamily: theme.fontMono, fontSize: 10, lineHeight: 15, marginBottom: 4 },
});
