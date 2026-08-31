import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { colors, typography, spacing, radii } from '../theme/colors';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import FilterBottomSheet from '../components/FilterBottomSheet';
import { productsApi } from '../services/productsApi';
import { MOCK_CATEGORIES } from '../services/mockData';

export default function ShopScreen() {
  const route = useRoute();
  const initialCategory = route.params?.selectedCategory || 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSkinType, setSelectedSkinType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [skinTypes, setSkinTypes] = useState(['All', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Mature']);

  useEffect(() => {
    if (route.params?.selectedCategory) {
      setSelectedCategory(route.params.selectedCategory);
    }
  }, [route.params?.selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSkinType, selectedSort, searchQuery]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await productsApi.getProducts({
        category: selectedCategory,
        skinType: selectedSkinType,
        sort: selectedSort,
        q: searchQuery,
      });
      if (res.data) {
        setProducts(res.data);
      }
    } catch {
      // offline fallback handled by service
    } finally {
      setLoading(false);
    }
  }

  function handleResetFilters() {
    setSelectedCategory('all');
    setSelectedSkinType('all');
    setSelectedSort('featured');
  }

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSkinType !== 'all' ? 1 : 0) +
    (selectedSort !== 'featured' ? 1 : 0);

  return (
    <View style={styles.container}>
      <Header title="Shop Catalog" showSearch={false} />

      {/* Search & Filter Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={18} color={colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search oils, shea, cleansers..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, activeFiltersCount > 0 && styles.filterBtnActive]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFiltersCount > 0 ? colors.surface : colors.textPrimary}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Horizontal Category Pill Bar */}
      <View style={styles.categoryPillsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MOCK_CATEGORIES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoryPillsList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item.id)}
                style={[styles.categoryPill, isSelected && styles.categoryPillSelected]}
              >
                <Text
                  style={[styles.categoryPillText, isSelected && styles.categoryPillTextSelected]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results Header Count */}
      <View style={styles.resultsInfoRow}>
        <Text style={styles.resultsCountText}>
          Showing <Text style={styles.boldText}>{products.length}</Text> botanical formulas
        </Text>
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          style={styles.sortQuickToggle}
        >
          <Text style={styles.sortQuickText}>
            {selectedSort === 'price-low'
              ? 'Price: Low'
              : selectedSort === 'price-high'
              ? 'Price: High'
              : selectedSort === 'rating'
              ? 'Top Rated'
              : 'Featured'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Unveiling botanical catalog...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="sparkles-outline" size={48} color={colors.textTertiary} />
          <Text style={styles.emptyTitle}>No Formulas Found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search keywords or active filter criteria.
          </Text>
          <TouchableOpacity onPress={handleResetFilters} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id || String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}

      {/* Filter Modal */}
      <FilterBottomSheet
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        categories={MOCK_CATEGORIES}
        skinTypes={skinTypes}
        selectedCategory={selectedCategory}
        selectedSkinType={selectedSkinType}
        selectedSort={selectedSort}
        onSelectCategory={setSelectedCategory}
        onSelectSkinType={setSelectedSkinType}
        onSelectSort={setSelectedSort}
        onResetFilters={handleResetFilters}
        onApply={fetchProducts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.desertOchre,
    width: 18,
    height: 18,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  categoryPillsContainer: {
    paddingBottom: spacing.sm,
  },
  categoryPillsList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 1,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryPillText: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  categoryPillTextSelected: {
    color: colors.surface,
    fontWeight: typography.weights.semibold,
  },
  resultsInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsCountText: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
  },
  boldText: {
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  sortQuickToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortQuickText: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  gridList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  gridRow: {
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  resetBtn: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetBtnText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
  },
});
