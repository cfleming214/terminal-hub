import { useRef, useState } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { NavBar } from '@/components/NavBar';
import { GlassPanel } from '@/components/GlassPanel';
import { PulseDot } from '@/components/PulseDot';
import { ClaudeChip } from '@/components/ClaudeChip';
import { TypingDots } from '@/components/TypingDots';
import { PillInput } from '@/components/PillInput';
import { useClaude } from '@/hooks/useClaude';
import { useAppStore } from '@/store/useAppStore';
import { theme, mono } from '@/theme';
import { ChatMessage } from '@/types';

const COMMAND_RE = /^(git|npm|npx|docker|kubectl|node|cd|ls|tail|ssh|yarn|pnpm)\b/;

export default function ClaudeChatScreen() {
  const { machineId } = useLocalSearchParams<{ machineId: string }>();
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  const { machine, messages, send } = useClaude(machineId);
  const setInput = useAppStore((s) => s.setInput);
  const session = useAppStore((s) => s.sessions[machineId]);
  const contextLines = (session?.lines ?? []).slice(-4);

  const [draft, setDraft] = useState('');

  function onChip(cmd: string) {
    setInput(machineId, cmd);
    router.back();
  }

  function onSend() {
    send(draft);
    setDraft('');
  }

  return (
    <Screen bottomInset>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}>
        <NavBar title="Claude" sparkle subtitle={`${machine?.name ?? ''} session`} />

        <GlassPanel style={styles.context}>
          <Text style={[mono(9.5, theme.mid), styles.contextLabel]}>TERMINAL CONTEXT</Text>
          {contextLines.map((l) => (
            <Text key={l.id} style={mono(10.5, l.promptText ? theme.text : lineColor(l.type))} numberOfLines={1}>
              {l.promptText ? <Text style={{ color: theme.amber }}>{l.promptText}</Text> : null}
              {l.text}
            </Text>
          ))}
        </GlassPanel>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <ChatBubble message={item} onChip={onChip} />}
          contentContainerStyle={styles.chat}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputWrap}>
          <PillInput
            value={draft}
            onChangeText={setDraft}
            onSubmit={onSend}
            placeholder="Ask Claude..."
            promptGlyph=""
            actionLabel="→"
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function ChatBubble({ message, onChip }: { message: ChatMessage; onChip: (cmd: string) => void }) {
  const isUser = message.role === 'user';
  const streamingEmpty = message.streaming && message.content.length === 0;

  if (isUser) {
    return (
      <View style={styles.userWrap}>
        <Text style={[mono(9.5, theme.mid), styles.userLabel]}>you</Text>
        <View style={styles.userBubble}>
          <Text style={[mono(12, theme.text), styles.bubbleText]}>{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.claudeWrap}>
      <View style={styles.claudeLabelRow}>
        <PulseDot size={5} />
        <Text style={mono(9.5, theme.amber)}>claude</Text>
      </View>
      <View style={styles.claudeBubble}>
        {streamingEmpty ? <TypingDots /> : <FormattedContent content={message.content} />}
      </View>
      {message.chips && message.chips.length > 0 && (
        <View style={styles.chips}>
          {message.chips.map((c) => (
            <ClaudeChip key={c} command={c} onPress={onChip} variant="muted" />
          ))}
        </View>
      )}
    </View>
  );
}

// Render multi-line content with command lines tinted teal and conventional-commit keys amber.
function FormattedContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <Text style={[mono(12, theme.text), styles.bubbleText]}>
      {lines.map((line, i) => {
        const newline = i < lines.length - 1 ? '\n' : '';
        if (COMMAND_RE.test(line.trim())) {
          return (
            <Text key={i} style={{ color: theme.teal }}>
              {line}
              {newline}
            </Text>
          );
        }
        const m = line.match(/^(feat:|fix:|chore:)(.*)$/);
        if (m) {
          return (
            <Text key={i}>
              <Text style={{ color: theme.amber }}>{m[1]}</Text>
              <Text style={{ color: theme.mid }}>{m[2]}</Text>
              {newline}
            </Text>
          );
        }
        return (
          <Text key={i}>
            {line}
            {newline}
          </Text>
        );
      })}
    </Text>
  );
}

function lineColor(type: string) {
  if (type === 'success') return theme.teal;
  if (type === 'error') return theme.red;
  if (type === 'url') return theme.blue;
  if (type === 'dim' || type === 'info') return theme.mid;
  return theme.text;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  context: { marginHorizontal: 14, marginTop: 10, paddingVertical: 12, paddingHorizontal: 14, gap: 2 },
  contextLabel: { letterSpacing: 2, marginBottom: 6 },
  chat: { padding: 14, gap: 12 },
  userWrap: { alignSelf: 'flex-end', maxWidth: '84%' },
  userLabel: { textAlign: 'right', marginBottom: 4 },
  userBubble: {
    backgroundColor: theme.amberTint,
    borderWidth: 1,
    borderColor: theme.amberBorderSoft,
    borderRadius: 14,
    borderBottomRightRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  claudeWrap: { alignSelf: 'flex-start', maxWidth: '88%' },
  claudeLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  claudeBubble: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 14,
    borderTopLeftRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  bubbleText: { lineHeight: 19 },
  chips: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
  inputWrap: { marginHorizontal: 14, marginBottom: 14 },
});
