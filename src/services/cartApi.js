// Cart API & Local Storage Management
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL, STORAGE_KEYS, getAuthHeaders } from './apiConfig';

export const cartApi = {
  async getCart() {
    try {
      const response = await fetch(`${BASE_API_URL}/cart`, {
        headers: await getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.data && Array.isArray(data.data.items)) {
          return data.data;
        }
      }
    } catch {
      // Local cart fallback
    }

    const localCart = await AsyncStorage.getItem(STORAGE_KEYS.LOCAL_CART);
    return localCart ? JSON.parse(localCart) : { items: [], total: 0, subtotal: 0 };
  },

  async syncLocalCart(cartState) {
    await AsyncStorage.setItem(STORAGE_KEYS.LOCAL_CART, JSON.stringify(cartState));
  },
};
