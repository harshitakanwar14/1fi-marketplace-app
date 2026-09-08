import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable } from 'react-native';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { ProductCard } from '../components/marketplace/ProductCard';
import { FilterSortBar } from '../components/marketplace/FilterSortBar';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';
import { Colors } from '../theme/colors';
import { SearchX, AlertCircle, RefreshCw, Scale } from 'lucide-react-native';
import { Product } from '../types/marketplace';

interface MarketplaceTabProps {
  onProductSelect: (product: Product) => void;
}

export const MarketplaceTab: React.FC<MarketplaceTabProps> = ({ onProductSelect }) => {
  const {
    products,
    isLoading,
    error,
    filters,
    fetchProducts,
    resetFilters,
    comparisonProductIds,
    setComparisonOpen,
  } = useMarketplaceStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Error State
  if (error && !isLoading) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.errorIconBg}>
          <AlertCircle size={32} color="#EF4444" />
        </View>
        <Text style={styles.stateTitle}>Unable to load Marketplace</Text>
        <Text style={styles.stateSubtext}>{error}</Text>

        <Pressable style={styles.retryBtn} onPress={fetchProducts}>
          <RefreshCw size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.retryBtnText}>Retry Connection</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter and Sort Bar */}
      <FilterSortBar />

      {/* Comparison Drawer Floating Banner */}
      {comparisonProductIds.length > 0 && (
        <Pressable
          style={styles.comparisonFloatingBar}
          onPress={() => setComparisonOpen(true)}
        >
          <View style={styles.comparisonLeft}>
            <Scale size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.comparisonText}>
              Comparing {comparisonProductIds.length} item{comparisonProductIds.length > 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.compareCtaBtn}>
            <Text style={styles.compareCtaText}>View Comparison</Text>
          </View>
        </Pressable>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        /* Empty / Search No Results State */
        <View style={styles.stateContainer}>
          <View style={styles.emptyIconBg}>
            <SearchX size={32} color={Colors.primary} />
          </View>
          <Text style={styles.stateTitle}>No products found</Text>
          <Text style={styles.stateSubtext}>
            {filters.searchQuery
              ? `We couldn't find any products matching "${filters.searchQuery}"`
              : 'No products match the selected filters.'}
          </Text>

          <Pressable style={styles.resetBtn} onPress={resetFilters}>
            <Text style={styles.resetBtnText}>Reset All Filters</Text>
          </Pressable>
        </View>
      ) : (
        /* Product Listing Grid */
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridColumnWrapper}
          contentContainerStyle={styles.gridContentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchProducts}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <ProductCard
                product={item}
                onPress={() => onProductSelect(item)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  gridItem: {
    width: '48.5%',
  },
  gridContentContainer: {
    paddingBottom: 24,
  },
  stateContainer: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyIconBg: {
    backgroundColor: Colors.primarySurface,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorIconBg: {
    backgroundColor: '#FEE2E2',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  stateSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  resetBtn: {
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  resetBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  comparisonFloatingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bannerMiddle,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  comparisonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  compareCtaBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  compareCtaText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 11,
  },
});
