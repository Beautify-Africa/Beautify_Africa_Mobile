import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, typography, radii, spacing } from '../theme/colors';

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
}) {
  const getStyles = () => {
    let bg = colors.primary;
    let text = colors.surface;
    let border = 'transparent';

    if (variant === 'secondary') {
      bg = colors.surfaceDark;
      text = colors.surface;
    } else if (variant === 'outline') {
      bg = 'transparent';
      text = colors.primary;
      border = colors.primary;
    } else if (variant === 'gold') {
      bg = colors.gold;
      text = colors.surfaceDark;
    } else if (variant === 'light') {
      bg = colors.surfaceVariant;
      text = colors.textPrimary;
    }

    if (disabled) {
      bg = colors.border;
      text = colors.textTertiary;
      border = 'transparent';
    }

    return { bg, text, border };
  };

  const scheme = getStyles();

  const getPadding = () => {
    if (size === 'sm') return { py: spacing.sm, px: spacing.md, fontSize: typography.sizes.xs };
    if (size === 'lg') return { py: spacing.lg, px: spacing.xxl, fontSize: typography.sizes.md };
    return { py: spacing.md + 2, px: spacing.xl, fontSize: typography.sizes.sm };
  };

  const sizing = getPadding();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: scheme.bg,
          borderColor: scheme.border,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          paddingVertical: sizing.py,
          paddingHorizontal: sizing.px,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={scheme.text} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.buttonText,
              { color: scheme.text, fontSize: sizing.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  buttonText: {
    fontWeight: typography.weights.semibold,
    letterSpacing: 0.3,
  },
});
