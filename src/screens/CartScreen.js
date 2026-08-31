import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radii } from '../theme/colors';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const navigation = useNavigation();
  const {
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
    updateQuantity,
    removeFromCart,
    applyPromo,
    removePromo,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  const handleApplyPromo = () => {
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode);
    setPromoMessage({ text: res.message, success: res.success });
    if (res.success) setInputCode('');
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Your Shopping Bag" showBack={false} showCart={false} />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bag-handle-outline" size={48} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Explore our artisanal African botanical skincare rituals and fill your bag with pure luxury.
          </Text>
          <CustomButton
            title="Start Exploring"
            variant="primary"
            size="lg"
            onPress={() => navigation.navigate('Shop')}
            icon={<Ionicons name="sparkles" size={18} color={colors.surface} />}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={`Bag (${totalItemCount})`} showBack={false} showCart={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Free Shipping Progress Bar */}
        <View style={styles.freeShippingCard}>
          <View style={styles.freeShippingHeader}>
            <Ionicons
              name={isFreeShipping ? 'checkmark-circle' : 'gift-outline'}
              size={18}
              color={isFreeShipping ? colors.forestGreen : colors.primary}
            />
            <Text style={styles.freeShippingText}>
              {isFreeShipping
                ? 'You unlocked FREE standard continental delivery!'
                : `Add $${amountToFreeShipping.toFixed(2)} more for FREE delivery`}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${freeShippingProgress * 100}%`,
                  backgroundColor: isFreeShipping ? colors.forestGreen : colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* Cart Item Cards */}
        <View style={styles.itemsList}>
          {items.map(({ product, quantity, variant }) => (
            <View key={`${product._id}-${variant?.id || 'def'}`} style={styles.cartItemCard}>
              <Image source={{ uri: product.image }} style={styles.itemImage} />

              <View style={styles.itemDetails}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemBrand}>{product.brand}</Text>
                  <TouchableOpacity
                    onPress={() => removeFromCart(product._id, variant?.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.itemName} numberOfLines={2}>
                  {product.name}
                </Text>

                <Text style={styles.itemPrice}>${product.price.toFixed(2)}</Text>

                {/* Quantity Controls */}
                <View style={styles.itemBottomRow}>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(product._id, quantity - 1, variant?.id)}
                      style={styles.qtyBtn}
                    >
                      <Ionicons name="remove" size={14} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(product._id, quantity + 1, variant?.id)}
                      style={styles.qtyBtn}
                    >
                      <Ionicons name="add" size={14} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemTotal}>
                    ${(product.price * quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Code Box */}
        <View style={styles.promoSection}>
          <Text style={styles.sectionHeading}>Promotional Code</Text>
          {promoCode ? (
            <View style={styles.activePromoCard}>
              <View style={styles.promoCodeRow}>
                <Ionicons name="pricetag" size={16} color={colors.forestGreen} />
                <Text style={styles.activePromoCode}>{promoCode}</Text>
                <Text style={styles.activeDiscountTag}>({discountPercent}% OFF)</Text>
              </View>
              <TouchableOpacity onPress={removePromo}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoInputRow}>
              <TextInput
                placeholder="Try AFRICA15 or GLOW20"
                placeholderTextColor={colors.textTertiary}
                value={inputCode}
                onChangeText={(t) => {
                  setInputCode(t);
                  setPromoMessage(null);
                }}
                autoCapitalize="characters"
                style={styles.promoInput}
              />
              <CustomButton
                title="Apply"
                variant="secondary"
                size="sm"
                onPress={handleApplyPromo}
              />
            </View>
          )}
          {promoMessage && (
            <Text
              style={[
                styles.promoMessageText,
                { color: promoMessage.success ? colors.forestGreen : colors.error },
              ]}
            >
              {promoMessage.text}
            </Text>
          )}
        </View>

        {/* Order Summary Calculation */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionHeading}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>

          {discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.forestGreen }]}>
                Discount ({discountPercent}%)
              </Text>
              <Text style={[styles.summaryValue, { color: colors.forestGreen }]}>
                -${discountAmount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Shipping</Text>
            <Text style={styles.summaryValue}>
              {shippingFee === 0 ? (
                <Text style={{ color: colors.forestGreen, fontWeight: typography.weights.bold }}>
                  FREE
                </Text>
              ) : (
                `$${shippingFee.toFixed(2)}`
              )}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Sticky Bottom Checkout Action */}
      <View style={styles.checkoutBar}>
        <View style={styles.checkoutBarTotal}>
          <Text style={styles.checkoutBarLabel}>Total to pay</Text>
          <Text style={styles.checkoutBarAmount}>${total.toFixed(2)}</Text>
        </View>
        <CustomButton
          title="Proceed to Checkout"
          variant="primary"
          size="lg"
          onPress={() => navigation.navigate('Checkout')}
          style={{ flex: 1, marginLeft: spacing.lg }}
          icon={<Ionicons name="lock-closed" size={16} color={colors.surface} />}
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  freeShippingCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  freeShippingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  freeShippingText: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radii.full,
  },
  itemsList: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  itemImage: {
    width: 85,
    height: 85,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceVariant,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemBrand: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginVertical: 2,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
  },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    paddingHorizontal: 6,
  },
  itemTotal: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  promoSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  promoInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  activePromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    padding: spacing.sm + 2,
    borderRadius: radii.sm,
  },
  promoCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  activePromoCode: {
    fontWeight: typography.weights.bold,
    color: colors.forestGreen,
    fontSize: typography.sizes.sm,
  },
  activeDiscountTag: {
    fontSize: typography.sizes.xs,
    color: colors.forestGreen,
  },
  promoMessageText: {
    fontSize: typography.sizes.xs,
    marginTop: 6,
    fontWeight: typography.weights.medium,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  checkoutBar: {
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
  checkoutBarTotal: {
    justifyContent: 'center',
  },
  checkoutBarLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  checkoutBarAmount: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
});
