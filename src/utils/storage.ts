import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cross-platform safe storage utility
 * Uses window.localStorage on web, AsyncStorage on native platforms, and in-memory fallback.
 */
class SafeStorage {
  private memoryStore: Record<string, string> = {};

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      if (AsyncStorage) {
        return await AsyncStorage.getItem(key);
      }
    } catch (e) {
      // Fallback to memory
    }
    return this.memoryStore[key] || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      if (AsyncStorage) {
        await AsyncStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // Fallback to memory
    }
    this.memoryStore[key] = value;
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      if (AsyncStorage) {
        await AsyncStorage.removeItem(key);
        return;
      }
    } catch (e) {
      // Fallback to memory
    }
    delete this.memoryStore[key];
  }
}

export const safeStorage = new SafeStorage();
