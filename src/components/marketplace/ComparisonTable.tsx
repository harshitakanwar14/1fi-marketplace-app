import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { Product } from '../../types/marketplace';
import { Colors } from '../../theme/colors';
import { RatingStars } from '../common/RatingStars';
import { X, Check } from 'lucide-react-native';

interface ComparisonTableProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onSelectProductForDetail: (product: Product) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  products,
  onRemoveProduct,
  onSelectProductForDetail,
}) => {
  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products selected for comparison.</Text>
        <Text style={styles.emptySubtext}>Tap the comparison scale icon on product cards to compare specs side-by-side.</Text>
      </View>
    );
  }

  // Extract all unique spec keys across compared products
  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs)))
  );

  return (
    <ScrollView style={styles.container} horizontal showsHorizontalScrollIndicator={true}>
      <View style={styles.tableContent}>
        {/* Header Row: Product Images & Titles */}
        <View style={styles.headerRow}>
          <View style={[styles.cell, styles.labelColumn, styles.headerCell]}>
            <Text style={styles.comparisonHeaderTitle}>Comparison</Text>
            <Text style={styles.comparisonSubtitle}>{products.length} Items</Text>
          </View>
          {products.map((p) => (
            <View key={p.id} style={[styles.cell, styles.productColumn, styles.headerCell]}>
              <Pressable style={styles.removeBtn} onPress={() => onRemoveProduct(p.id)}>
                <X size={12} color="#FFFFFF" />
              </Pressable>

              <Image source={{ uri: p.thumbnail }} style={styles.productImg} resizeMode="contain" />
              <Text style={styles.brandText}>{p.brand}</Text>
              <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
              <Pressable
                style={styles.viewBtn}
                onPress={() => onSelectProductForDetail(p)}
              >
                <Text style={styles.viewBtnText}>View</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Price Row */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.labelColumn]}><Text style={styles.rowLabel}>Price</Text></View>
          {products.map((p) => (
            <View key={p.id} style={[styles.cell, styles.productColumn]}>
              <Text style={styles.priceVal}>₹{p.price.toLocaleString('en-IN')}</Text>
              {p.originalPrice && <Text style={styles.origPrice}>₹{p.originalPrice.toLocaleString('en-IN')}</Text>}
            </View>
          ))}
        </View>

        {/* 12-Month EMI Row */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.labelColumn]}><Text style={styles.rowLabel}>12-Mo EMI</Text></View>
          {products.map((p) => {
            const plan = p.emiPlans.find((e) => e.tenureMonths === 12) || p.emiPlans[0];
            return (
              <View key={p.id} style={[styles.cell, styles.productColumn]}>
                <Text style={styles.emiVal}>₹{plan?.monthlyAmount.toLocaleString('en-IN')}/mo</Text>
                <Text style={styles.emiBadge}>{plan?.isNoCost ? '0% Interest' : 'Standard'}</Text>
              </View>
            );
          })}
        </View>

        {/* Rating Row */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.labelColumn]}><Text style={styles.rowLabel}>User Rating</Text></View>
          {products.map((p) => (
            <View key={p.id} style={[styles.cell, styles.productColumn]}>
              <RatingStars rating={p.rating} reviewCount={p.reviewCount} starSize={12} />
            </View>
          ))}
        </View>

        {/* Spec Rows */}
        {allSpecKeys.map((key) => (
          <View key={key} style={styles.row}>
            <View style={[styles.cell, styles.labelColumn]}><Text style={styles.rowLabel}>{key}</Text></View>
            {products.map((p) => (
              <View key={p.id} style={[styles.cell, styles.productColumn]}>
                <Text style={styles.specVal}>{p.specs[key] || '—'}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  tableContent: {
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primarySurface,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cell: {
    padding: 10,
    justifyContent: 'center',
  },
  headerCell: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  labelColumn: {
    width: 110,
    backgroundColor: '#F8FAFC',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  productColumn: {
    width: 140,
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
    position: 'relative',
  },
  comparisonHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  comparisonSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  productImg: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginBottom: 6,
  },
  brandText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginVertical: 4,
    height: 30,
  },
  viewBtn: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 8,
    paddingVertical: 4,
    alignItems: 'center',
    marginTop: 4,
  },
  viewBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  rowLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  priceVal: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  origPrice: {
    fontSize: 9,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  emiVal: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  emiBadge: {
    fontSize: 9,
    color: Colors.success,
    fontWeight: '700',
  },
  specVal: {
    fontSize: 11,
    color: Colors.textPrimary,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
