import { useEffect, useRef } from 'react';
import { View, FlatList, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { NavBar } from '@/components/NavBar';
import { GlassPanel } from '@/components/GlassPanel';
import { LiveBadge } from '@/components/LiveBadge';
import { PulseDot } from '@/components/PulseDot';
import { Sparkle } from '@/components/icons';
import { TerminalLineRow } from '@/components/TerminalLineRow';
import { ClaudeSuggestionCard } from '@/components/ClaudeSuggestionCard';
import { PillInput } from '@/components/PillInput';
import { useTerminalSession } from '@/hooks/useTerminalSession';
import { useAppStore } from '@/store/useAppStore';
import { theme } from '@/theme';

export default function TerminalScreen() {
  const { machineId, prefill } = useLocalSearchParams<{ machineId: string; prefill?: string }>();
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  const { machine, session, connected, sendCommand } = useTerminalSession(machineId);
  const inputValue = useAppStore((s) => s.sessions[machineId]?.inputValue ?? '');
  const setInput = useAppStore((s) => s.setInput);

  // Pre-fill the input when arriving from Favorites / a Claude chip with a ?prefill= param.
  const appliedPrefill = useRef(false);
  useEffect(() => {
    if (prefill && !appliedPrefill.current) {
      appliedPrefill.current = true;
      setInput(machineId, String(prefill));
    }
  }, [prefill, machineId, setInput]);

  if (!machine) return <Screen bottomInset />;

  const lines = session?.lines ?? [];
  const lastIndex = lines.length - 1;

  return (
    <Screen bottomInset>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}>
        <NavBar
          title={machine.name}
          subtitle={`${machine.username}@${machine.hostname} · ssh`}
          right={
            <View style={styles.navRight}>
              <Pressable hitSlop={10} onPress={() => router.push(`/claude/${machineId}`)}>
                <Sparkle size={14} />
              </Pressable>
              <PulseDot size={8} active={connected} />
            </View>
          }
        />

        <GlassPanel style={styles.terminal}>
          <View style={styles.liveBadge}>
            <LiveBadge active={connected} />
          </View>
          <FlatList
            ref={listRef}
            data={lines}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TerminalLineRow line={item} showCursor={index === lastIndex && item.type === 'prompt'} />
            )}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.lines}
          />
        </GlassPanel>

        {session?.claudeSuggestion ? (
          <View style={styles.suggestion}>
            <ClaudeSuggestionCard
              text={session.claudeSuggestion}
              chips={session.claudeChips}
              onChipPress={(cmd) => setInput(machineId, cmd)}
            />
          </View>
        ) : null}

        <View style={styles.inputWrap}>
          <PillInput
            value={inputValue}
            onChangeText={(v) => setInput(machineId, v)}
            onSubmit={() => sendCommand(inputValue)}
            promptGlyph="›"
            actionLabel="RUN"
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  terminal: {
    flex: 1,
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: theme.radiusLg,
    padding: 14,
    overflow: 'hidden',
  },
  liveBadge: { position: 'absolute', top: 11, right: 13, zIndex: 2 },
  lines: { paddingTop: 2 },
  suggestion: { marginHorizontal: 14, marginBottom: 9 },
  inputWrap: { marginHorizontal: 14, marginBottom: 14 },
});
