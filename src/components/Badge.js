import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radii, spacing } from '../theme/colors';

export default function Badge({ label, variant = 'primary', style }) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'bestseller':
        return { bg: colors.goldLight, text: colors.desertOchre };
      case 'new':
        return { bg: colors.forestGreenLight, text: colors.surface };
      case 'discount':
        return { bg: colors.primary, text: colors.surface };
      case 'outline':
        return { bg: 'transparent', text: colors.textSecondary, border: colors.border };
      case 'success':
        return { bg: '#E8F5E9', text: colors.success };
      default:
        return { bg: colors.surfaceVariant, text: colors.textPrimary };
    }
  };

  const scheme = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: scheme.bg,
          borderColor: scheme.border || 'transparent',
          borderWidth: scheme.border ? 1 : 0,
        },
        style,
      ]}
    >
      <Text style={[styles.badgeText, { color: scheme.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    letterSpacing: 0.2,
  },
});
