import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radii } from '../theme/colors';
import CustomButton from '../components/CustomButton';

export default function OrderSuccessScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { order } = route.params || {};

  const orderId = order?._id || order?.orderNumber || 'BA-774921';
  const totalAmount = order?.totalPrice ? `$${order.totalPrice.toFixed(2)}` : '$76.00';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Animated Check Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={80} color={colors.forestGreen} />
        </View>

        <Text style={styles.heading}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Thank you for embracing authentic African botanical beauty rituals.
        </Text>

        {/* Order Receipt Box */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Order Identifier</Text>
            <Text style={styles.receiptValueBold}>{orderId}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Total Paid</Text>
            <Text style={styles.receiptValue}>{totalAmount}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Estimated Delivery</Text>
            <Text style={styles.receiptValue}>3 - 5 Business Days</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Confirmation Sent</Text>
            <Text style={styles.receiptValue}>Check your email inbox</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <CustomButton
            title="Track Live Order Status"
            variant="primary"
            size="lg"
            onPress={() => navigation.navigate('TrackOrders', { initialOrderId: orderId })}
            icon={<Ionicons name="location-outline" size={18} color={colors.surface} />}
          />
          <CustomButton
            title="Continue Shopping"
            variant="outline"
            size="lg"
            onPress={() => navigation.navigate('Home')}
            style={{ marginTop: spacing.md }}
          />
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  iconCircle: {
    marginBottom: spacing.lg,
  },
  heading: {
    fontSize: typography.sizes.display - 4,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
    marginBottom: spacing.xl,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  receiptValue: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  receiptValueBold: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  actionsContainer: {
    width: '100%',
  },
});
