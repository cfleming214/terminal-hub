import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { MachineCard } from '@/components/MachineCard';
import { useAppStore } from '@/store/useAppStore';
import { theme, mono } from '@/theme';

export default function DeviceListScreen() {
  const router = useRouter();
  const machines = useAppStore((s) => s.machines);
  const setActive = useAppStore((s) => s.setActive);
  const setPrimary = useAppStore((s) => s.setPrimary);
  const onlineCount = machines.filter((m) => m.status === 'online').length;

  function openMachine(id: string) {
    setActive(id);
    router.push(`/terminal/${id}`);
  }

  return (
    <Screen bottomInset>
      <View style={styles.header}>
        <Text style={[mono(11, theme.mid), styles.eyebrow]}>YOUR MACHINES</Text>
        <Text style={mono(24, theme.text, 'bd')}>
          {onlineCount} <Text style={mono(14, theme.mid)}>connected</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {machines.map((m) => (
          <MachineCard
            key={m.id}
            machine={m}
            onPress={() => openMachine(m.id)}
            onLongPress={() => setPrimary(m.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.addBtn} onPress={() => router.push('/login')}>
          <Text style={mono(12, theme.amber)}>+ </Text>
          <Text style={mono(12, theme.mid)}>add machine</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  eyebrow: { letterSpacing: 2, marginBottom: 4 },
  list: { padding: 14, gap: 10 },
  footer: { paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: theme.border },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.amberBd,
    borderRadius: theme.radiusInput,
    paddingVertical: 11,
  },
});
