// Typed wrapper around expo-secure-store for SSH keys / host credentials.
// On web, secure-store is unavailable — fall back to an in-memory map so the app still runs.
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const memoryStore = new Map<string, string>();
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export const SecureStorage = {
  async get(key: string): Promise<string | null> {
    if (!isNative) return memoryStore.get(key) ?? null;
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    if (!isNative) {
      memoryStore.set(key, value);
      return;
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // ignore write failures (e.g. keychain locked) — caller treats absence as not-stored
    }
  },

  async delete(key: string): Promise<void> {
    if (!isNative) {
      memoryStore.delete(key);
      return;
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore
    }
  },
};
