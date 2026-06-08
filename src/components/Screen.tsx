import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme';

// Screen shell: deep-navy background + top safe-area inset (never hardcode the status-bar height).
export function Screen({ children, bottomInset = false }: { children?: ReactNode; bottomInset?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: bottomInset ? insets.bottom : 0 }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
});
