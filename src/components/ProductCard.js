import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radii } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import RatingStars from './RatingStars';
import Badge from './Badge';

export default function ProductCard({ product, horizontal = false, style }) {
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const prodId = product._id || product.id;
  const isFavorite = isInWishlist(prodId);

  const handleCardPress = () => {
    navigation.navigate('ProductDetail', { productId: prodId, product });
  };

  const handleQuickAdd = (e) => {
    e?.stopPropagation?.();
    addToCart(product, 1);
  };

  const handleToggleFavorite = (e) => {
    e?.stopPropagation?.();
    toggleWishlist(product);
  };

  if (horizontal) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleCardPress}
        style={[styles.horizontalContainer, style]}
      >
        <Image source={{ uri: product.image }} style={styles.horizontalImage} />
        <View style={styles.horizontalContent}>
          <Text style={styles.brandText}>{product.brand}</Text>
          <Text style={styles.horizontalName} numberOfLines={2}>
            {product.name}
          </Text>
          <RatingStars rating={product.rating} count={product.numReviews} size={12} />
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPriceText}>${product.originalPrice.toFixed(2)}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleCardPress}
      style={[styles.card, style]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        
        {/* Top Badges */}
        <View style={styles.badgePosition}>
          {product.isBestSeller && <Badge label="BESTSELLER" variant="bestseller" />}
          {product.isNewProduct && <Badge label="NEW" variant="new" style={{ marginTop: 4 }} />}
        </View>

        {/* Wishlist Button */}
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.wishlistBtn}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? colors.primary : colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.brandText} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={styles.nameText} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingWrapper}>
          <RatingStars rating={product.rating} count={product.numReviews} size={12} />
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPriceText}>${product.originalPrice.toFixed(2)}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleQuickAdd}
            style={styles.quickAddBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
    flex: 1,
  },
  imageContainer: {
    height: 170,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.surfaceVariant,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgePosition: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  wishlistBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoContainer: {
    padding: spacing.md,
  },
  brandText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  nameText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    minHeight: 36,
    lineHeight: 18,
  },
  ratingWrapper: {
    marginVertical: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  originalPriceText: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  quickAddBtn: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Horizontal Card Variant
  horizontalContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    width: 260,
    marginRight: spacing.md,
  },
  horizontalImage: {
    width: 80,
    height: 80,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceVariant,
  },
  horizontalContent: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  horizontalName: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginVertical: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});
