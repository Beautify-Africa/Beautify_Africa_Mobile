import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In local mobile development with Expo:
// On Android Emulator: http://10.0.2.2:5000/api
// On iOS Simulator: http://localhost:5000/api
// On Web/Default: http://localhost:5000/api
export const BASE_API_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api',
  ios: 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@beautify_africa_auth_token',
  AUTH_USER: '@beautify_africa_auth_user',
  LOCAL_CART: '@beautify_africa_local_cart',
  WISHLIST: '@beautify_africa_wishlist',
  SAVED_ADDRESS: '@beautify_africa_saved_address',
};

export async function getAuthHeaders() {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  } catch {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }
}
