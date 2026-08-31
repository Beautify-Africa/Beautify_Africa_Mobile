import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii } from '../theme/colors';
import Header from '../components/Header';

export default function AboutBrandScreen() {
  const pillars = [
    {
      icon: 'shield-checkmark-outline',
      title: '100% Authentic Products',
      desc: 'We partner directly with verified global and local beauty brands to guarantee 100% genuine makeup, skincare, haircare, and fragrances.',
    },
    {
      icon: 'options-outline',
      title: 'Diverse Range for All Beauty Needs',
      desc: 'From daily essential cleansers to high-pigment lipsticks, haircare oils, and signature perfumes, we bring you choices for every skin tone and hair type.',
    },
    {
      icon: 'rocket-outline',
      title: 'Fast & Reliable Shipping',
      desc: 'Enjoy rapid door-to-door delivery with secure tracking across major cities and regions.',
    },
  ];

  return (
    <View style={styles.container}>
      <Header showBack={true} title="About Beautify Africa" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Hero */}
        <View style={styles.heroCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroContent}>
            <Text style={styles.eyebrow}>WELCOME TO BEAUTIFY AFRICA</Text>
            <Text style={styles.heroHeading}>Your One-Stop Destination For All Things Beauty.</Text>
          </View>
        </View>

        {/* Narrative Paragraph */}
        <View style={styles.narrativeSection}>
          <Text style={styles.narrativeTitle}>Empowering Everyday Beauty</Text>
          <Text style={styles.narrativeBody}>
            Beautify Africa was created to make high-quality, authentic beauty products accessible to everyone across the continent. Whether you are looking for daily skincare essentials, vibrant makeup, rich haircare, or luxurious fragrances, we have curated a comprehensive store for you.
          </Text>
          <Text style={styles.narrativeBody}>
            We combine an intuitive shopping experience with fast delivery, secure payment options like Mobile Money and credit cards, and dedicated customer support.
          </Text>
        </View>

        {/* Core Pillars */}
        <View style={styles.pillarsSection}>
          <Text style={styles.pillarsHeader}>Our Core Commitments</Text>
          {pillars.map((pillar, i) => (
            <View key={i} style={styles.pillarCard}>
              <View style={styles.pillarIconContainer}>
                <Ionicons name={pillar.icon} size={28} color={colors.primary} />
              </View>
              <View style={styles.pillarTextWrapper}>
                <Text style={styles.pillarTitle}>{pillar.title}</Text>
                <Text style={styles.pillarDesc}>{pillar.desc}</Text>
              </View>
            </View>
          ))}
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
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  heroContent: {
    padding: spacing.xl,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  heroHeading: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 28,
  },
  narrativeSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  narrativeTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  narrativeBody: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  pillarsSection: {
    gap: spacing.md,
  },
  pillarsHeader: {
    fontSize: typography.sizes.md + 1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  pillarCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  pillarIconContainer: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarTextWrapper: {
    flex: 1,
  },
  pillarTitle: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  pillarDesc: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
