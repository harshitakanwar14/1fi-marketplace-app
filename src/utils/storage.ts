import { Platform } from 'react-native';

const MEMORY_STORE: Record<string, string> = {};

/**
 * Cross-platform storage utility.
 * - Web: uses window.localStorage
 * - Native: uses @react-native-async-storage (only imported at runtime, never on web)
 * - Fallback: in-memory map
 */
export const safeStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return MEMORY_STORE[key] ?? null;
      }
    }
    try {
      // Dynamically import AsyncStorage only on native to avoid web crash
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      return AsyncStorage.getItem(key);
    } catch {
      return MEMORY_STORE[key] ?? null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        MEMORY_STORE[key] = value;
      }
      return;
    }
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem(key, value);
    } catch {
      MEMORY_STORE[key] = value;
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        window.localStorage.removeItem(key);
      } catch {
        delete MEMORY_STORE[key];
      }
      return;
    }
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.removeItem(key);
    } catch {
      delete MEMORY_STORE[key];
    }
  },
};
