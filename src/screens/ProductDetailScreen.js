import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radii } from '../theme/colors';
import Header from '../components/Header';
import RatingStars from '../components/RatingStars';
import Badge from '../components/Badge';
import CustomButton from '../components/CustomButton';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productsApi } from '../services/productsApi';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { productId, product: passedProduct } = route.params || {};

  const [product, setProduct] = useState(passedProduct || null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'ingredients' | 'howToUse' | 'reviews'
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!product && productId) {
      loadProduct();
    }
  }, [productId]);

  async function loadProduct() {
    const data = await productsApi.getProductById(productId);
    if (data) setProduct(data);
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Header showBack={true} />
        <Text style={styles.loadingText}>Loading formula details...</Text>
      </View>
    );
  }

  const isFavorite = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on Beautify Africa - Organic African Botanical Luxury!`,
      });
    } catch {}
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <View style={styles.container}>
      <Header
        showBack={true}
        title={product.brand}
        rightComponent={
          <TouchableOpacity onPress={handleShare} style={styles.headerIconBtn}>
            <Ionicons name="share-social-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Image Slider */}
        <View style={styles.imageSliderContainer}>
          <Image
            source={{ uri: images[activeImageIndex] || product.image }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Floating Badges */}
          <View style={styles.imageOverlayTop}>
            {product.isBestSeller && <Badge label="BESTSELLER" variant="bestseller" />}
            {product.isNewProduct && <Badge label="NEW FORMULA" variant="new" />}
          </View>

          {/* Floating Wishlist Button */}
          <TouchableOpacity
            onPress={() => toggleWishlist(product)}
            style={styles.floatingWishlistBtn}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? colors.primary : colors.textPrimary}
            />
          </TouchableOpacity>

          {/* Thumbnail Dots */}
          {images.length > 1 && (
            <View style={styles.dotsContainer}>
              {images.map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActiveImageIndex(idx)}
                  style={[styles.dot, activeImageIndex === idx && styles.activeDot]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Details Main Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.brandSubtitle}>{product.brand}</Text>
          <Text style={styles.productTitle}>{product.name}</Text>

          {/* Rating & Stock row */}
          <View style={styles.metaRow}>
            <RatingStars rating={product.rating} count={product.numReviews} size={15} />
            <View style={styles.stockBadge}>
              <View style={styles.stockDot} />
              <Text style={styles.stockText}>
                {product.inStock ? 'In Stock • Ready to ship' : 'Low Stock'}
              </Text>
            </View>
          </View>

          {/* Price Row */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>${product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
            )}
            {product.originalPrice && (
              <View style={styles.savePill}>
                <Text style={styles.saveText}>
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          {/* Origin & Skin Type Pills */}
          {product.origin && (
            <View style={styles.originCard}>
              <Ionicons name="location-outline" size={16} color={colors.desertOchre} />
              <Text style={styles.originText}>Ethically Harvested in {product.origin}</Text>
            </View>
          )}

          {product.skinType && (
            <View style={styles.skinTypeWrapper}>
              <Text style={styles.sectionSmallTitle}>Target Skin Types:</Text>
              <View style={styles.skinTypeChips}>
                {Array.isArray(product.skinType) ? (
                  product.skinType.map((st, i) => (
                    <View key={i} style={styles.skinTypeChip}>
                      <Text style={styles.skinTypeChipText}>{st}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.skinTypeChip}>
                    <Text style={styles.skinTypeChipText}>{product.skinType}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Information Tabs */}
          <View style={styles.tabHeaderRow}>
            <TouchableOpacity
              onPress={() => setActiveTab('description')}
              style={[styles.tabButton, activeTab === 'description' && styles.tabButtonActive]}
            >
              <Text
                style={[styles.tabButtonText, activeTab === 'description' && styles.tabButtonTextActive]}
              >
                Ritual & Benefits
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('ingredients')}
              style={[styles.tabButton, activeTab === 'ingredients' && styles.tabButtonActive]}
            >
              <Text
                style={[styles.tabButtonText, activeTab === 'ingredients' && styles.tabButtonTextActive]}
              >
                Botanicals
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('howToUse')}
              style={[styles.tabButton, activeTab === 'howToUse' && styles.tabButtonActive]}
            >
              <Text
                style={[styles.tabButtonText, activeTab === 'howToUse' && styles.tabButtonTextActive]}
              >
                Application
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('reviews')}
              style={[styles.tabButton, activeTab === 'reviews' && styles.tabButtonActive]}
            >
              <Text
                style={[styles.tabButtonText, activeTab === 'reviews' && styles.tabButtonTextActive]}
              >
                Reviews ({product.numReviews || 0})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContentContainer}>
            {activeTab === 'description' && (
              <Text style={styles.tabParagraph}>
                {product.description ||
                  'Nourishing formulation rooted in indigenous African botanicals. Delivers active hydration and promotes skin barrier restoration.'}
              </Text>
            )}

            {activeTab === 'ingredients' && (
              <View>
                <Text style={styles.tabParagraph}>
                  {product.ingredients ||
                    '100% Unrefined African Shea Butter, Cold-Pressed Marula Oil, Kalahari Melon Extract, Baobab Fruit Oil, Natural Tocopherol.'}
                </Text>
                <View style={styles.cleanStandardCard}>
                  <Ionicons name="checkmark-done-circle" size={20} color={colors.forestGreen} />
                  <Text style={styles.cleanStandardText}>
                    Free from Parabens, Sulfates, Mineral Oils, and Synthetic Fragrances.
                  </Text>
                </View>
              </View>
            )}

            {activeTab === 'howToUse' && (
              <Text style={styles.tabParagraph}>
                {product.howToUse ||
                  'Warm a dime-sized amount between fingertips. Gently press and smooth upward over cleansed face, neck, or body morning and evening.'}
              </Text>
            )}

            {activeTab === 'reviews' && (
              <View>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <View key={rev.id} style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewUser}>{rev.user}</Text>
                        <Text style={styles.reviewDate}>{rev.date}</Text>
                      </View>
                      <RatingStars rating={rev.rating} size={12} showText={false} />
                      <Text style={styles.reviewComment}>{rev.comment}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.noReviewsBox}>
                    <Text style={styles.noReviewsText}>No reviews yet. Be the first to try!</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Guarantee Badges */}
          <View style={styles.guaranteeRow}>
            <View style={styles.guaranteeItem}>
              <Ionicons name="leaf-outline" size={22} color={colors.forestGreen} />
              <Text style={styles.guaranteeText}>100% Organic</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
              <Text style={styles.guaranteeText}>Clean Standard</Text>
            </View>
            <View style={styles.guaranteeItem}>
              <Ionicons name="heart-circle-outline" size={22} color={colors.desertOchre} />
              <Text style={styles.guaranteeText}>Ethical Fair Trade</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 110 + bottomInset }} />
      </ScrollView>

      {/* Added to Cart Feedback Banner */}
      {addedToast && (
        <View style={[styles.toastBanner, { bottom: 80 + bottomInset }]}>
          <Ionicons name="checkmark-circle" size={20} color={colors.surface} />
          <Text style={styles.toastText}>Added {quantity} to your bag!</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.toastActionText}>View Bag</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sticky Bottom Add-To-Cart Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: bottomInset + spacing.sm }]}>
        <View style={styles.quantityPicker}>
          <TouchableOpacity
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            style={styles.qtyBtn}
          >
            <Ionicons name="remove" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity((q) => q + 1)}
            style={styles.qtyBtn}
          >
            <Ionicons name="add" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <CustomButton
          title={`Add to Bag • $${(product.price * quantity).toFixed(2)}`}
          variant="primary"
          size="lg"
          onPress={handleAddToCart}
          style={{ flex: 1, marginLeft: spacing.md }}
          icon={<Ionicons name="bag-handle" size={18} color={colors.surface} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  headerIconBtn: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  imageSliderContainer: {
    width: width,
    height: 380,
    backgroundColor: colors.surfaceVariant,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayTop: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    gap: spacing.xs,
  },
  floatingWishlistBtn: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: 44,
    height: 44,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 22,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    marginTop: -20,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  brandSubtitle: {
    fontSize: typography.sizes.xs + 1,
    color: colors.primary,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  productTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginVertical: spacing.xs,
    lineHeight: 30,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.success,
  },
  stockText: {
    fontSize: typography.sizes.xs,
    color: colors.success,
    fontWeight: typography.weights.medium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  originalPrice: {
    fontSize: typography.sizes.md,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  savePill: {
    backgroundColor: '#FDECE7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
    marginLeft: spacing.md,
  },
  saveText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  originCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  originText: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  skinTypeWrapper: {
    marginVertical: spacing.sm,
  },
  sectionSmallTitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  skinTypeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  skinTypeChip: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  skinTypeChipText: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
  },
  tabHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: spacing.lg,
  },
  tabButton: {
    paddingVertical: spacing.md,
    marginRight: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: colors.primary,
  },
  tabButtonText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  tabButtonTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  tabContentContainer: {
    paddingVertical: spacing.lg,
    minHeight: 100,
  },
  tabParagraph: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  cleanStandardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: spacing.md,
    borderRadius: radii.md,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cleanStandardText: {
    flex: 1,
    fontSize: typography.sizes.xs + 1,
    color: colors.forestGreen,
    fontWeight: typography.weights.medium,
    lineHeight: 18,
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  reviewDate: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
  },
  reviewComment: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  noReviewsBox: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  noReviewsText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  guaranteeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
  },
  guaranteeItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  guaranteeText: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  toastBanner: {
    position: 'absolute',
    bottom: 85,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.surfaceDark,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    flex: 1,
    color: colors.surface,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  toastActionText: {
    color: colors.goldLight,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xs,
    height: 48,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
});
