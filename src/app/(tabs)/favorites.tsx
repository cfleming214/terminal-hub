import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { NavBar } from '@/components/NavBar';
import { PlayIcon } from '@/components/icons';
import { useAppStore } from '@/store/useAppStore';
import { theme, mono, glassCard, categoryColors } from '@/theme';
import { Favorite } from '@/types';

export default function FavoritesScreen() {
  const router = useRouter();
  const favorites = useAppStore((s) => s.favorites);
  const machines = useAppStore((s) => s.machines);
  const activeMachineId = useAppStore((s) => s.activeMachineId);
  const incrementFavoriteUsage = useAppStore((s) => s.incrementFavoriteUsage);
  const setInput = useAppStore((s) => s.setInput);

  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const categories = useMemo(() => {
    const set = new Set<string>(['all']);
    favorites.forEach((f) => set.add(f.category));
    return Array.from(set);
  }, [favorites]);

  const filtered = favorites.filter((f) => {
    const matchCat = category === 'all' || f.category === category;
    const matchQuery = f.command.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  function execute(fav: Favorite) {
    const target =
      machines.find((m) => m.id === activeMachineId && m.status === 'online') ??
      machines.find((m) => m.isPrimary && m.status === 'online') ??
      machines.find((m) => m.status === 'online');
    if (!target) return;
    incrementFavoriteUsage(fav.id);
    setInput(target.id, fav.command);
    router.push(`/terminal/${target.id}`);
  }

  return (
    <Screen bottomInset>
      <NavBar title="Favorites" subtitle={`${favorites.length} saved commands`} showBack={false} pulse={false} />

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={14} color={theme.mid} />
        <TextInput
          style={[mono(12, theme.text), styles.search]}
          value={query}
          onChangeText={setQuery}
          placeholder="search commands"
          placeholderTextColor={theme.mid}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="dark"
          cursorColor={theme.amber}
        />
      </View>

      <View style={styles.tabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {categories.map((cat) => {
            const active = cat === category;
            return (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}>
                <Text style={mono(11, active ? theme.black : theme.mid, active ? 'bd' : 'r')}>{cat}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map((fav) => {
          const color = categoryColors[fav.category] ?? theme.amber;
          return (
            <View key={fav.id} style={[glassCard, styles.card, { borderRadius: theme.radiusInput }]}>
              <View style={styles.cardBody}>
                <Text style={mono(12, theme.text)}>{fav.command}</Text>
                <View style={[styles.badge, { backgroundColor: color + '22' }]}>
                  <Text style={mono(9.5, color)}>{fav.category}</Text>
                </View>
              </View>
              <Pressable style={styles.exec} onPress={() => execute(fav)} hitSlop={6}>
                <PlayIcon size={12} />
              </Pressable>
            </View>
          );
        })}
        {filtered.length === 0 && <Text style={[mono(12, theme.mid), styles.empty]}>no matching commands</Text>}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 14,
    marginTop: 11,
    paddingHorizontal: 12,
    paddingVertical: 9,
    ...glassCard,
    borderRadius: theme.radiusInput,
  },
  search: { flex: 1, padding: 0 },
  tabsRow: { borderBottomWidth: 1, borderBottomColor: theme.border },
  tabs: { gap: 7, paddingHorizontal: 14, paddingVertical: 11 },
  tab: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: theme.radiusChip, borderWidth: 1 },
  tabActive: { backgroundColor: theme.amber, borderColor: theme.amber },
  tabInactive: { backgroundColor: theme.card, borderColor: theme.border },
  list: { padding: 14, gap: 8 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 14 },
  cardBody: { flex: 1 },
  badge: { alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  exec: {
    width: 32,
    height: 32,
    borderRadius: theme.radiusSm,
    backgroundColor: theme.amberFaint,
    borderWidth: 1,
    borderColor: theme.amberBd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { textAlign: 'center', marginTop: 30 },
});
