import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { SlidersHorizontal, Check, AlertTriangle } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useMarketplaceStore } from '../../store/marketplaceStore';
import { FilterSortState } from '../../types/marketplace';

export const FilterSortBar: React.FC = () => {
  const { filters, setCategory, setNoCostEMIOnly, setSortBy, toggleSimulatedError, isSimulatedErrorActive } = useMarketplaceStore();
  const [isSortModalVisible, setSortModalVisible] = useState(false);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'wishlist', label: '❤️ Wishlist' },
    { id: 'electronics', label: '📱 Electronics' },
    { id: 'jewellery', label: '💎 Jewellery' },
    { id: 'fashion', label: '👕 Fashion' },
    { id: 'home_appliances', label: '🏠 Home Appliances' },
    { id: 'furniture', label: '🛋️ Furniture' },
    { id: 'travel', label: '✈️ Travel' },
    { id: 'books_stationery', label: '📚 Books & Stationery' },
    { id: 'health_fitness', label: '🏃 Health & Fitness' },
    { id: 'sports', label: '⚽ Sports' },
  ];

  const sortOptions: { id: FilterSortState['sortBy']; label: string }[] = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'price_low_high', label: 'Price: Low to High' },
    { id: 'price_high_low', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sort Button */}
        <Pressable
          style={styles.filterChip}
          onPress={() => setSortModalVisible(true)}
          accessibilityLabel="Sort products modal"
        >
          <SlidersHorizontal size={13} color={Colors.textPrimary} style={{ marginRight: 4 }} />
          <Text style={styles.filterChipText}>Sort</Text>
        </Pressable>

        {/* Category Chips */}
        {categories.map((cat) => {
          const isActive = filters.selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[styles.filterChip, isActive && styles.activeChip]}
              onPress={() => setCategory(cat.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isActive }}
              accessibilityLabel={`Filter category ${cat.label}`}
            >
              <Text style={[styles.filterChipText, isActive && styles.activeChipText]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Sort Options Modal */}
      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSortModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort Products By</Text>
            {sortOptions.map((opt) => {
              const isSelected = filters.sortBy === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  style={styles.sortOptionRow}
                  onPress={() => {
                    setSortBy(opt.id);
                    setSortModalVisible(false);
                  }}
                >
                  <Text style={[styles.sortOptionText, isSelected && styles.selectedSortText]}>
                    {opt.label}
                  </Text>
                  {isSelected && <Check size={16} color={Colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  activeChip: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeChipText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  errorToggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  errorToggleActive: {
    backgroundColor: '#EF4444',
  },
  errorToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 34,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  sortOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sortOptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectedSortText: {
    fontWeight: '700',
    color: Colors.primary,
  },
});
