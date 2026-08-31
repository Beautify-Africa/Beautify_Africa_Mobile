import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../services/apiConfig';

const CartContext = createContext(null);

const FREE_SHIPPING_THRESHOLD = 75.00;
const STANDARD_SHIPPING_FEE = 7.50;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [items]);

  async function loadCart() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.LOCAL_CART);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Local cart load error
    }
  }

  async function saveCart() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LOCAL_CART, JSON.stringify(items));
    } catch {
      // Local cart save error
    }
  }

  function addToCart(product, quantity = 1, variant = null) {
    const prodId = product._id || product.id;
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.product._id || item.product.id) === prodId && item.variant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prevItems, { product, quantity, variant }];
    });
  }

  function updateQuantity(productId, quantity, variantId = null) {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if ((item.product._id || item.product.id) === productId && item.variant?.id === variantId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  }

  function removeFromCart(productId, variantId = null) {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !((item.product._id || item.product.id) === productId && item.variant?.id === variantId)
      )
    );
  }

  function clearCart() {
    setItems([]);
    setPromoCode('');
    setDiscountPercent(0);
  }

  function applyPromo(code) {
    const clean = code.trim().toUpperCase();
    if (clean === 'AFRICA15' || clean === 'WELCOME15') {
      setPromoCode(clean);
      setDiscountPercent(15);
      return { success: true, message: '15% discount applied!' };
    }
    if (clean === 'GLOW20') {
      setPromoCode(clean);
      setDiscountPercent(20);
      return { success: true, message: '20% VIP discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try AFRICA15' };
  }

  function removePromo() {
    setPromoCode('');
    setDiscountPercent(0);
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const isFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = items.length === 0 || isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const total = discountedSubtotal + shippingFee;
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingProgress = Math.min(1, discountedSubtotal / FREE_SHIPPING_THRESHOLD);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemCount,
        subtotal,
        discountAmount,
        discountPercent,
        promoCode,
        shippingFee,
        total,
        isFreeShipping,
        freeShippingProgress,
        amountToFreeShipping,
        FREE_SHIPPING_THRESHOLD,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromo,
        removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
