import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radii } from '../theme/colors';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import CustomButton from '../components/CustomButton';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistScreen() {
  const navigation = useNavigation();
  const { wishlist, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <View style={styles.container}>
        <Header title="Saved Favorites" showBack={false} showWishlist={false} />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={48} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Saved Formulas</Text>
          <Text style={styles.emptySubtitle}>
            Save your favorite handcrafted African serums, balms, and botanicals to curate your personal beauty ritual.
          </Text>
          <CustomButton
            title="Discover Formulations"
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
      <Header title={`Saved Rituals (${wishlistCount})`} showBack={false} showWishlist={false} />

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
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
  gridList: {
    padding: spacing.lg,
  },
  gridRow: {
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
