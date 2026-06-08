import { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme, mono } from '@/theme';
import { BackChevron, Sparkle } from './icons';
import { PulseDot } from './PulseDot';

// Top nav bar (screens-b BNav): back chevron + title/subtitle + optional pulse dot or custom right slot.
export function NavBar({
  title,
  subtitle,
  pulse = true,
  pulseActive = true,
  showBack = true,
  sparkle = false,
  right,
}: {
  title: string;
  subtitle?: string;
  pulse?: boolean;
  pulseActive?: boolean;
  showBack?: boolean;
  sparkle?: boolean;
  right?: ReactNode;
}) {
  const router = useRouter();
  return (
    <View style={styles.bar}>
      {showBack ? (
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <BackChevron />
        </Pressable>
      ) : (
        <View style={styles.backSpacer} />
      )}
      <View style={styles.titleWrap}>
        <View style={styles.titleRow}>
          {sparkle && <Sparkle size={12} />}
          <Text style={mono(13, theme.text, 'sb')}>{title}</Text>
        </View>
        {subtitle ? <Text style={[mono(10.5, theme.mid), styles.sub]}>{subtitle}</Text> : null}
      </View>
      {right ?? (pulse ? <PulseDot size={8} active={pulseActive} /> : null)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  back: { paddingVertical: 4, paddingRight: 2 },
  backSpacer: { width: 2 },
  titleWrap: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sub: { marginTop: 2 },
});
