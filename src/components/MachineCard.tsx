import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme, mono, glassCard, amberGlow } from '@/theme';
import { Machine } from '@/types';
import { PulseDot } from './PulseDot';
import { StatBar } from './StatBar';

// Device-list card (screens-b BDevices). Primary machine gets amber tint + glow + amber name.
export function MachineCard({
  machine,
  onPress,
  onLongPress,
}: {
  machine: Machine;
  onPress: () => void;
  onLongPress?: () => void;
}) {
  const online = machine.status === 'online';
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        glassCard,
        styles.card,
        machine.isPrimary && { backgroundColor: theme.amberFaint, borderColor: theme.amberBd },
        machine.isPrimary && amberGlow(0.2, 16),
      ]}>
      <View style={[styles.header, online && { marginBottom: 10 }]}>
        <View style={styles.nameWrap}>
          <Text style={mono(13, machine.isPrimary ? theme.amber : theme.text, 'sb')}>{machine.name}</Text>
          <Text style={[mono(10.5, theme.mid), styles.addr]}>
            {machine.username}@{machine.hostname}
          </Text>
        </View>
        <View style={styles.status}>
          <PulseDot size={8} active={online} />
          <Text style={mono(10.5, online ? theme.amber : theme.mid)}>{machine.status}</Text>
        </View>
      </View>
      {online && (
        <View style={styles.bars}>
          <StatBar label="CPU" percent={machine.cpuPercent ?? 0} color={theme.teal} />
          <StatBar label="MEM" percent={machine.memPercent ?? 0} color={theme.blue} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 13, paddingHorizontal: 15 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nameWrap: { flex: 1 },
  addr: { marginTop: 2 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bars: { flexDirection: 'row', gap: 14 },
});
