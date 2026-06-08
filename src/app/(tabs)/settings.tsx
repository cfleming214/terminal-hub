import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { NavBar } from '@/components/NavBar';
import { AmberToggle } from '@/components/AmberToggle';
import { RightChevron } from '@/components/icons';
import { useAppStore } from '@/store/useAppStore';
import { theme, mono, glassCard } from '@/theme';
import { Settings } from '@/types';

type Row =
  | { kind: 'toggle'; label: string; key: keyof Settings }
  | { kind: 'value'; label: string; key: keyof Settings };

const GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: 'Appearance',
    rows: [
      { kind: 'value', label: 'Theme', key: 'theme' },
      { kind: 'value', label: 'Font Size', key: 'fontSize' },
      { kind: 'value', label: 'Line Height', key: 'lineHeight' },
    ],
  },
  {
    title: 'Connection',
    rows: [
      { kind: 'toggle', label: 'Use mock bridge', key: 'useMockBridge' },
      { kind: 'toggle', label: 'Auto-reconnect', key: 'autoReconnect' },
      { kind: 'toggle', label: 'Compression', key: 'compression' },
      { kind: 'value', label: 'Keepalive', key: 'keepalive' },
    ],
  },
  {
    title: 'Claude',
    rows: [
      { kind: 'toggle', label: 'Suggestions', key: 'claudeSuggestions' },
      { kind: 'value', label: 'Auto-suggest', key: 'autoSuggest' },
      { kind: 'value', label: 'Context lines', key: 'contextLines' },
    ],
  },
];

export default function SettingsScreen() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  return (
    <Screen bottomInset>
      <NavBar title="Settings" showBack={false} pulse={false} />

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {GROUPS.map((group) => (
          <View key={group.title} style={[glassCard, styles.group]}>
            <Text style={[mono(10, theme.mid), styles.groupLabel]}>{group.title.toUpperCase()}</Text>
            {group.rows.map((row, i) => (
              <View key={row.label} style={[styles.row, i === 0 && styles.rowFirst]}>
                <Text style={mono(13, theme.text)}>{row.label}</Text>
                {row.kind === 'toggle' ? (
                  <AmberToggle
                    value={settings[row.key] as boolean}
                    onChange={(next) => updateSettings({ [row.key]: next } as Partial<Settings>)}
                  />
                ) : (
                  <View style={styles.valueRow}>
                    <Text style={mono(12, theme.amber)}>{String(settings[row.key])}</Text>
                    <RightChevron />
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
        <Text style={[mono(9.5, theme.mid), styles.version]}>TerminalHub v1.0.0</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 14, gap: 10 },
  group: { overflow: 'hidden' },
  groupLabel: { letterSpacing: 2, paddingTop: 9, paddingBottom: 5, paddingHorizontal: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  rowFirst: { borderTopWidth: 1, borderTopColor: theme.border },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  version: { textAlign: 'center', marginTop: 8 },
});
