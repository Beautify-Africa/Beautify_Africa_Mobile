import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { colors, typography, spacing, radii } from '../theme/colors';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import { ordersApi } from '../services/ordersApi';

export default function TrackOrdersScreen() {
  const route = useRoute();
  const initialOrderId = route.params?.initialOrderId || '';

  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleTrack() {
    if (!orderQuery.trim()) return;
    setLoading(true);
    try {
      const data = await ordersApi.trackOrder(orderQuery.trim());
      setTrackingData(data);
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Track Your Package" showBack={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Tracking Input Card */}
        <View style={styles.searchCard}>
          <Text style={styles.cardHeading}>Enter Order or Tracking ID</Text>
          <Text style={styles.cardSubtitle}>
            Find real-time delivery status, courier logs, and estimated doorstep arrival.
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="e.g. BA-984210 or AFR-7729103"
              placeholderTextColor={colors.textTertiary}
              value={orderQuery}
              onChangeText={setOrderQuery}
              style={styles.input}
              autoCapitalize="characters"
            />
            <CustomButton
              title="Track"
              variant="primary"
              size="md"
              loading={loading}
              onPress={handleTrack}
              icon={<Ionicons name="search" size={16} color={colors.surface} />}
            />
          </View>
        </View>

        {/* Tracking Results View */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Fetching shipment telemetry...</Text>
          </View>
        ) : trackingData ? (
          <View style={styles.trackingResultCard}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.orderNumberTitle}>{trackingData.orderNumber}</Text>
                <Text style={styles.carrierSub}>{trackingData.carrier} • {trackingData.trackingNumber}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{trackingData.orderStatus}</Text>
              </View>
            </View>

            <View style={styles.estimateBanner}>
              <Ionicons name="time-outline" size={18} color={colors.desertOchre} />
              <Text style={styles.estimateText}>
                Estimated Arrival: <Text style={{ fontWeight: typography.weights.bold }}>{trackingData.estimatedDelivery}</Text>
              </Text>
            </View>

            {/* Stepper Timeline */}
            <View style={styles.timelineWrapper}>
              {trackingData.timeline.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <View style={styles.stepIndicatorColumn}>
                    <View
                      style={[
                        styles.stepDot,
                        step.completed && styles.stepDotCompleted,
                      ]}
                    >
                      {step.completed && (
                        <Ionicons name="checkmark" size={12} color={colors.surface} />
                      )}
                    </View>
                    {index < trackingData.timeline.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          step.completed && styles.stepLineCompleted,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stepContent}>
                    <View style={styles.stepTitleRow}>
                      <Text
                        style={[
                          styles.stepTitle,
                          step.completed && styles.stepTitleCompleted,
                        ]}
                      >
                        {step.title}
                      </Text>
                      <Text style={styles.stepTime}>{step.time}</Text>
                    </View>
                    <Text style={styles.stepDesc}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.helperCard}>
            <Ionicons name="airplane-outline" size={36} color={colors.primary} />
            <Text style={styles.helperTitle}>Continental Express Fulfillment</Text>
            <Text style={styles.helperText}>
              All packages are handcrafted, quality-sealed, and dispatched with temperature-controlled shipping to preserve botanical freshness.
            </Text>
          </View>
        )}

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
  searchCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeading: {
    fontSize: typography.sizes.md + 1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  loadingBox: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  trackingResultCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderNumberTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  carrierSub: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  statusBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.forestGreen,
  },
  estimateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    padding: spacing.md,
    borderRadius: radii.sm,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  estimateText: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textPrimary,
  },
  timelineWrapper: {
    paddingLeft: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 65,
  },
  stepIndicatorColumn: {
    alignItems: 'center',
    width: 24,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotCompleted: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  stepLineCompleted: {
    backgroundColor: colors.forestGreen,
  },
  stepContent: {
    flex: 1,
    marginLeft: spacing.md,
    paddingBottom: spacing.md,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepTitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold,
  },
  stepTitleCompleted: {
    color: colors.textPrimary,
  },
  stepTime: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
  },
  stepDesc: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  helperCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    textAlign: 'center',
  },
  helperTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  helperText: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
