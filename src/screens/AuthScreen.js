import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radii } from '../theme/colors';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const navigation = useNavigation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert('Incomplete Form', 'Please enter your email and password.');
      return;
    }

    if (mode === 'register' && !name) {
      Alert.alert('Incomplete Form', 'Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          navigation.goBack();
        } else {
          Alert.alert('Sign In Failed', res.message);
        }
      } else {
        const res = await register(name, email, password);
        if (res.success) {
          navigation.goBack();
        } else {
          Alert.alert('Registration Failed', res.message);
        }
      }
    } catch {
      Alert.alert('Error', 'Unable to complete request.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Header showBack={true} title={mode === 'login' ? 'Sign In' : 'Create Account'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Greeting */}
        <View style={styles.brandGreeting}>
          <Text style={styles.greetingTitle}>
            {mode === 'login' ? 'Welcome Back' : 'Begin Your Ritual'}
          </Text>
          <Text style={styles.greetingSubtitle}>
            {mode === 'login'
              ? 'Sign in to access your curated skincare rituals and reward points.'
              : 'Join our conscious community celebrating pure African botanical wellness.'}
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            onPress={() => setMode('login')}
            style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode('register')}
            style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.formCard}>
          {mode === 'register' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                placeholder="e.g. Amina Keita"
                placeholderTextColor={colors.textTertiary}
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              placeholder="name@example.com"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {mode === 'login' && (
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Password Reset',
                  'Instructions will be dispatched to your registered email address.'
                )
              }
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <CustomButton
            title={mode === 'login' ? 'Sign In to Account' : 'Create My Account'}
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleSubmit}
            style={{ marginTop: spacing.md }}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  brandGreeting: {
    marginBottom: spacing.xl,
  },
  greetingTitle: {
    fontSize: typography.sizes.display - 4,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  greetingSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radii.md,
    padding: 4,
    marginBottom: spacing.xl,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  tabBtnActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  tabText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: typography.weights.bold,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    height: 44,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  passwordInput: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  eyeBtn: {
    padding: spacing.xs,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.sm,
  },
  forgotText: {
    fontSize: typography.sizes.xs + 1,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
});
