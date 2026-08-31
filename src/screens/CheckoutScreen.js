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
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../services/ordersApi';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { items, total, subtotal, shippingFee, discountAmount, clearCart } = useCart();
  const { user } = useAuth();

  // Form State
  const [fullName, setFullName] = useState(user?.name || 'Amina Keita');
  const [email, setEmail] = useState(user?.email || 'amina@example.com');
  const [phone, setPhone] = useState('+254 712 345 678');
  const [street, setStreet] = useState('124 Serengeti Avenue, Suite 4B');
  const [city, setCity] = useState('Nairobi');
  const [country, setCountry] = useState('Kenya');
  const [postalCode, setPostalCode] = useState('00100');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'mpesa' | 'apple_pay' | 'cod'
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('•••');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentOptions = [
    { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline', subtitle: 'Visa, Mastercard, Amex' },
    { id: 'mpesa', label: 'Mobile Money / M-Pesa', icon: 'phone-portrait-outline', subtitle: 'Direct mobile wallet prompt' },
    { id: 'apple_pay', label: 'Apple Pay / Google Pay', icon: 'logo-apple', subtitle: 'Fast one-touch checkout' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'cash-outline', subtitle: 'Pay when package arrives' },
  ];

  async function handlePlaceOrder() {
    if (!fullName || !email || !street || !city) {
      Alert.alert('Missing Details', 'Please complete all required shipping fields.');
      return;
    }

    setIsProcessing(true);
    try {
      const orderPayload = {
        orderItems: items.map((i) => ({
          product: i.product._id,
          name: i.product.name,
          qty: i.quantity,
          price: i.product.price,
          image: i.product.image,
        })),
        shippingAddress: {
          fullName,
          street,
          city,
          country,
          postalCode,
          phone,
        },
        paymentMethod: paymentOptions.find((p) => p.id === paymentMethod)?.label,
        subtotal,
        shippingFee,
        discountAmount,
        totalPrice: total,
      };

      const res = await ordersApi.createOrder(orderPayload);
      if (res.success) {
        clearCart();
        navigation.replace('OrderSuccess', { order: res.order });
      } else {
        Alert.alert('Order Error', res.message || 'Unable to finalize order.');
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Secure Checkout" showBack={true} showCart={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Shipping Address */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholder="e.g. Amina Keita"
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Street Address *</Text>
            <TextInput
              value={street}
              onChangeText={setStreet}
              style={styles.input}
              placeholder="Street and house / apt number"
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput value={city} onChangeText={setCity} style={styles.input} />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Country *</Text>
              <TextInput value={country} onChangeText={setCountry} style={styles.input} />
            </View>
          </View>
        </View>

        {/* Step 2: Payment Method */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <View style={styles.paymentOptionsList}>
            {paymentOptions.map((opt) => {
              const isSelected = paymentMethod === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setPaymentMethod(opt.id)}
                  style={[
                    styles.paymentOptionItem,
                    isSelected && styles.paymentOptionSelected,
                  ]}
                >
                  <View style={styles.paymentRadioRow}>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    <Ionicons
                      name={opt.icon}
                      size={20}
                      color={isSelected ? colors.primary : colors.textSecondary}
                      style={{ marginLeft: spacing.sm, marginRight: spacing.sm }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.paymentLabel, isSelected && styles.paymentLabelActive]}>
                        {opt.label}
                      </Text>
                      <Text style={styles.paymentSubtitle}>{opt.subtitle}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Card Mock Input Fields */}
          {paymentMethod === 'card' && (
            <View style={styles.cardInputWrapper}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Expiry</Text>
                  <TextInput value={cardExpiry} onChangeText={setCardExpiry} style={styles.input} />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    value={cardCvc}
                    onChangeText={setCardCvc}
                    secureTextEntry
                    style={styles.input}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Step 3: Order Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Breakdown</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({items.length})</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          {discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.forestGreen }]}>Discount</Text>
              <Text style={[styles.summaryValue, { color: colors.forestGreen }]}>
                -${discountAmount.toFixed(2)}
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>
              {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Button */}
        <CustomButton
          title={`Pay $${total.toFixed(2)} & Complete Order`}
          variant="primary"
          size="lg"
          loading={isProcessing}
          onPress={handlePlaceOrder}
          icon={<Ionicons name="shield-checkmark" size={18} color={colors.surface} />}
          style={{ marginTop: spacing.md }}
        />

        <View style={styles.securityNote}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.textTertiary} />
          <Text style={styles.securityNoteText}>
            256-Bit SSL Encrypted & PCI Compliant Checkout
          </Text>
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
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stepNumber: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: typography.weights.bold,
  },
  sectionTitle: {
    fontSize: typography.sizes.md + 1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
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
    height: 42,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  paymentOptionsList: {
    gap: spacing.sm,
  },
  paymentOptionItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FDF7F5',
  },
  paymentRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
  },
  paymentLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  paymentLabelActive: {
    color: colors.primary,
  },
  paymentSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardInputWrapper: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
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
  },
  totalLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
  securityNoteText: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
  },
});
