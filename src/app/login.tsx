import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { TerminalMark } from '@/components/icons';
import { useAppStore } from '@/store/useAppStore';
import { theme, mono, glassCard, amberGlow } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const addMachine = useAppStore((s) => s.addMachine);
  const setActive = useAppStore((s) => s.setActive);

  const [hostname, setHostname] = useState('');
  const [username, setUsername] = useState('');
  const [port, setPort] = useState('22');

  const valid = hostname.trim().length > 0 && username.trim().length > 0;

  function connect() {
    if (!valid) return;
    const id = addMachine({
      name: hostname.trim(),
      hostname: hostname.trim(),
      username: username.trim(),
      port: parseInt(port, 10) || 22,
      isPrimary: false,
      status: 'connecting',
      lastConnected: new Date().toISOString(),
    });
    setActive(id);
    router.back();
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logoBlock}>
          <Text style={[mono(10, theme.mid), styles.eyebrow]}>TERMINALHUB</Text>
          <View style={styles.glowBehind} />
          <View style={[styles.iconCircle, amberGlow(0.3, 18)]}>
            <TerminalMark size={16} />
          </View>
          <Text style={mono(22, theme.text, 'bd')}>
            Terminal<Text style={{ color: theme.amber }}>Hub</Text>
          </Text>
          <Text style={[mono(10.5, theme.mid), styles.tagline]}>remote terminal controller</Text>
        </View>

        <View style={styles.form}>
          <Field label="HOSTNAME" value={hostname} onChangeText={setHostname} placeholder="192.168.1.100" />
          <Field label="USERNAME" value={username} onChangeText={setUsername} placeholder="alex" />
          <Field label="PORT" value={port} onChangeText={setPort} placeholder="22" keyboardType="number-pad" />
        </View>

        <Pressable style={[styles.cta, amberGlow(0.35, 14), { opacity: valid ? 1 : 0.5 }]} onPress={connect} disabled={!valid}>
          <Text style={[mono(13, theme.black, 'bd'), styles.ctaText]}>CONNECT</Text>
        </Pressable>

        <Pressable style={styles.footer} onPress={() => router.back()}>
          <Text style={mono(11, theme.mid)}>+ register new machine</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  action,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  action?: string;
  keyboardType?: 'number-pad';
}) {
  return (
    <View>
      <Text style={[mono(10, theme.mid), styles.fieldLabel]}>{label}</Text>
      <View style={[glassCard, styles.field, { borderRadius: theme.radiusSm }]}>
        <TextInput
          style={[mono(13, theme.text), styles.fieldInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.mid}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={keyboardType}
          keyboardAppearance="dark"
          cursorColor={theme.amber}
          selectionColor={theme.amber}
        />
        {action ? <Text style={mono(10, theme.amber)}>{action}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, paddingTop: 28, paddingBottom: 40 },
  logoBlock: { alignItems: 'center', marginBottom: 24 },
  eyebrow: { letterSpacing: 4, marginBottom: 14 },
  glowBehind: {
    position: 'absolute',
    top: 24,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.amberFaint,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: 'rgba(245,158,11,0.55)',
    backgroundColor: theme.amberFaint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  tagline: { marginTop: 5 },
  form: { gap: 11 },
  fieldLabel: { letterSpacing: 1.5, marginBottom: 5 },
  field: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11 },
  fieldInput: { flex: 1, padding: 0 },
  cta: { backgroundColor: theme.amber, borderRadius: theme.radiusInput, paddingVertical: 14, marginTop: 18 },
  ctaText: { textAlign: 'center', letterSpacing: 2 },
  footer: { alignItems: 'center', paddingVertical: 14 },
});
