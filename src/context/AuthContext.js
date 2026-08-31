import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/authApi';
import { STORAGE_KEYS } from '../services/apiConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredSession();
  }, []);

  async function loadStoredSession() {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.log('Error restoring auth session', e);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await authApi.login(email, password);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  }

  async function register(name, email, password) {
    const res = await authApi.register(name, email, password);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
    setToken(null);
  }

  async function updateProfile(updates) {
    const res = await authApi.updateProfile(updates);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
