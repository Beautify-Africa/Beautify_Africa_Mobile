import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../services/apiConfig';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch {
      // Wishlist load error
    }
  }

  async function saveWishlist(newList) {
    setWishlist(newList);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(newList));
    } catch {
      // Wishlist save error
    }
  }

  async function toggleWishlist(product) {
    const exists = wishlist.some((item) => (item._id || item.id) === (product._id || product.id));
    const updated = exists
      ? wishlist.filter((item) => (item._id || item.id) !== (product._id || product.id))
      : [...wishlist, product];

    saveWishlist(updated);

    // Sync with backend if online/authenticated
    try {
      const { BASE_API_URL, getAuthHeaders } = require('../services/apiConfig');
      const headers = await getAuthHeaders();
      if (headers.Authorization) {
        await fetch(`${BASE_API_URL}/wishlist/toggle`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ productId: product._id || product.id }),
        });
      }
    } catch {
      // Ignored for offline resilience
    }
  }

  function isInWishlist(productId) {
    return wishlist.some((item) => (item._id || item.id) === productId);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
