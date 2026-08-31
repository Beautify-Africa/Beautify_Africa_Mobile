import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

export default function RatingStars({ rating = 5, count = null, size = 14, showText = true }) {
  const rounded = Math.round(rating * 2) / 2;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) {
      stars.push(<Ionicons key={i} name="star" size={size} color={colors.gold} />);
    } else if (i - 0.5 === rounded) {
      stars.push(<Ionicons key={i} name="star-half" size={size} color={colors.gold} />);
    } else {
      stars.push(<Ionicons key={i} name="star-outline" size={size} color={colors.border} />);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>{stars}</View>
      {showText && (
        <Text style={styles.ratingText}>
          {rating.toFixed(1)} {count !== null && <Text style={styles.countText}>({count})</Text>}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  ratingText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  countText: {
    color: colors.textSecondary,
    fontWeight: typography.weights.regular,
  },
});
