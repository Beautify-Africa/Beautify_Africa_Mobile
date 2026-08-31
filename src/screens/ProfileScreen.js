import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radii } from '../theme/colors';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [currency, setCurrency] = useState('USD ($)');

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="My Account" showBack={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        {isAuthenticated ? (
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'Amina Keita'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'amina@example.com'}</Text>
              <View style={styles.loyaltyPill}>
                <Ionicons name="sparkles" size={12} color={colors.desertOchre} />
                <Text style={styles.loyaltyText}>
                  {user?.loyaltyPoints || 150} Botanical Glow Points
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.guestCard}>
            <Text style={styles.guestTitle}>Join Beautify Africa Club</Text>
            <Text style={styles.guestSubtitle}>
              Sign in to earn rewards, track your shipments, and access members-only botanical releases.
            </Text>
            <CustomButton
              title="Sign In or Create Account"
              variant="primary"
              size="md"
              onPress={() => navigation.navigate('Auth')}
              icon={<Ionicons name="person-outline" size={16} color={colors.surface} />}
            />
          </View>
        )}

        {/* Quick Activity Shortcuts */}
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('TrackOrders')}
          >
            <Ionicons name="cube-outline" size={24} color={colors.primary} />
            <Text style={styles.quickCardTitle}>Orders & Track</Text>
            <Text style={styles.quickCardSub}>Live updates</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('Wishlist')}
          >
            <Ionicons name="heart-outline" size={24} color={colors.primary} />
            <Text style={styles.quickCardTitle}>Wishlist</Text>
            <Text style={styles.quickCardSub}>{wishlistCount} saved</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('AboutBrand')}
          >
            <Ionicons name="leaf-outline" size={24} color={colors.primary} />
            <Text style={styles.quickCardTitle}>Our Story</Text>
            <Text style={styles.quickCardSub}>Ethical Sourcing</Text>
          </TouchableOpacity>
        </View>

        {/* Account Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Preferences & Settings</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.menuItemText}>Order & Ritual Notifications</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Currency', 'Currently set to USD ($).')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="globe-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.menuItemText}>Currency</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemSubtext}>{currency}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AboutBrand')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.menuItemText}>Fair Trade & Ethical Pledges</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Support', 'Contact our botanical concierges at support@beautifyafrica.com')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="chatbubbles-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.menuItemText}>Customer Care & FAQs</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        {isAuthenticated && (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Sign Out of Account</Text>
          </TouchableOpacity>
        )}

        <View style={styles.appVersionCard}>
          <Text style={styles.appVersionText}>Beautify Africa Mobile App v1.0.0</Text>
          <Text style={styles.appVersionSub}>Crafted with pride for the continent</Text>
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
    padding: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.surface,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: typography.sizes.md + 1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  loyaltyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    gap: 4,
  },
  loyaltyText: {
    fontSize: 10,
    color: colors.desertOchre,
    fontWeight: typography.weights.bold,
  },
  guestCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  guestTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  guestSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    textAlign: 'center',
  },
  quickCardTitle: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  quickCardSub: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  menuSectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuItemText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuItemSubtext: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  logoutText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.error,
  },
  appVersionCard: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  appVersionText: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
    fontWeight: typography.weights.medium,
  },
  appVersionSub: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 2,
  },
});
