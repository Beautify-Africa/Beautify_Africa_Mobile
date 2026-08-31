import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii } from '../theme/colors';
import CustomButton from './CustomButton';

export default function FilterBottomSheet({
  visible,
  onClose,
  categories = [],
  skinTypes = [],
  selectedCategory,
  selectedSkinType,
  selectedSort,
  onSelectCategory,
  onSelectSkinType,
  onSelectSort,
  onResetFilters,
  onApply,
}) {
  const sortOptions = [
    { id: 'featured', label: 'Featured & Best Match' },
    { id: 'best-selling', label: 'Bestselling First' },
    { id: 'rating', label: 'Highest Customer Rating' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Sheet Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Refine & Filter</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            {/* Sort Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.sortList}>
                {sortOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => onSelectSort(opt.id)}
                    style={[
                      styles.sortItem,
                      selectedSort === opt.id && styles.sortItemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sortItemText,
                        selectedSort === opt.id && styles.sortItemTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {selectedSort === opt.id && (
                      <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.chipsContainer}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => onSelectCategory(cat.id)}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Skin Type Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skin Type / Concern</Text>
              <View style={styles.chipsContainer}>
                {skinTypes.map((st) => {
                  const isSelected = selectedSkinType === st;
                  return (
                    <TouchableOpacity
                      key={st}
                      onPress={() => onSelectSkinType(st)}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <CustomButton
              title="Reset"
              variant="outline"
              size="md"
              onPress={onResetFilters}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <CustomButton
              title="Apply Filters"
              variant="primary"
              size="md"
              onPress={() => {
                onApply();
                onClose();
              }}
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '85%',
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  contentScroll: {
    paddingHorizontal: spacing.xl,
  },
  section: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sortList: {
    gap: spacing.xs,
  },
  sortItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },
  sortItemSelected: {
    backgroundColor: colors.surfaceVariant,
  },
  sortItemText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  sortItemTextSelected: {
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  chipTextSelected: {
    color: colors.surface,
    fontWeight: typography.weights.semibold,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
});
