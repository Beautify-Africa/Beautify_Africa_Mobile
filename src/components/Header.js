import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radii } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Header({
  title,
  showBack = false,
  showSearch = true,
  showWishlist = true,
  showCart = true,
  onSearchPress,
  rightComponent,
  transparent = false,
}) {
  const navigation = useNavigation();
  const { totalItemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const iconColor = transparent ? colors.surface : colors.textPrimary;
  const brandTextColor = transparent ? colors.surface : colors.textPrimary;

  return (
    <SafeAreaView style={[styles.safeArea, transparent && styles.safeAreaTransparent]}>
      <View style={styles.container}>
        <View style={styles.leftRow}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <View style={styles.brandTitleContainer}>
              <Text style={[styles.brandTitle, { color: brandTextColor }]}>BEAUTIFY AFRICA</Text>
            </View>
          )}
          {showBack && title && (
            <Text style={[styles.screenTitle, { color: brandTextColor }]} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        <View style={styles.rightRow}>
          {rightComponent}
          {showSearch && (
            <TouchableOpacity
              onPress={onSearchPress || (() => navigation.navigate('Shop', { screen: 'ShopMain', params: { autoFocusSearch: true } }))}
              style={styles.iconBtn}
            >
              <Ionicons name="search-outline" size={22} color={iconColor} />
            </TouchableOpacity>
          )}
          {showWishlist && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Wishlist')}
              style={styles.iconBtn}
            >
              <Ionicons name="heart-outline" size={22} color={iconColor} />
              {wishlistCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{wishlistCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {showCart && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
              style={styles.iconBtn}
            >
              <Ionicons name="bag-handle-outline" size={22} color={iconColor} />
              {totalItemCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeText}>{totalItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  safeAreaTransparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandTitleContainer: {
    flexDirection: 'column',
  },
  brandTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    letterSpacing: 2,
    color: colors.textPrimary,
  },
  brandSubtitle: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  screenTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: spacing.xs,
    marginLeft: spacing.md,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: colors.desertOchre,
    minWidth: 16,
    height: 16,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
});
