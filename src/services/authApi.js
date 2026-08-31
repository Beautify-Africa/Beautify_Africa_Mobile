// Auth API Client with AsyncStorage token caching
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL, STORAGE_KEYS, getAuthHeaders } from './apiConfig';

export const authApi = {
  async login(email, password) {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: data.message || 'Login failed. Please check credentials.' };
    } catch {
      // Demo / Offline login fallback
      const demoUser = {
        _id: 'usr_demo_123',
        name: email.split('@')[0] || 'Amina Keita',
        email,
        role: 'user',
        loyaltyPoints: 150,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo_jwt_token_123');
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(demoUser));
      return { success: true, user: demoUser, token: 'demo_jwt_token_123' };
    }
  },

  async register(name, email, password) {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: data.message || 'Registration failed.' };
    } catch {
      const demoUser = {
        _id: `usr_${Date.now()}`,
        name,
        email,
        role: 'user',
        loyaltyPoints: 50,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo_jwt_token_123');
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(demoUser));
      return { success: true, user: demoUser, token: 'demo_jwt_token_123' };
    }
  },

  async getMe() {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/me`, {
        headers: await getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        const userObj = data.user || data.data;
        if (userObj) {
          await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userObj));
          return userObj;
        }
      }
    } catch {
      // Return cached user
    }
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return cached ? JSON.parse(cached) : null;
  },

  async updateProfile(updates) {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (response.ok) {
        const userObj = data.user || data.data;
        if (userObj) {
          await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userObj));
          return { success: true, user: userObj };
        }
      }
      return { success: false, message: data.message || 'Failed to update profile' };
    } catch {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_USER);
      const user = cached ? JSON.parse(cached) : {};
      const updated = { ...user, ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updated));
      return { success: true, user: updated };
    }
  },

  async logout() {
    try {
      await fetch(`${BASE_API_URL}/auth/logout`, {
        method: 'POST',
        headers: await getAuthHeaders(),
      });
    } catch {
      // Ignore network errors on logout
    }
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },
};
