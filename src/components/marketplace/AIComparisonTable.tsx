import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Product } from '../../types/marketplace';
import { Colors } from '../../theme/colors';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { Sparkles, Check, X, Minus } from 'lucide-react-native';

interface AIComparisonTableProps {
  currentProduct: Product;
  onSelectProduct: (product: Product) => void;
}

// Key specs to show in the comparison table
const COMPARISON_SPEC_KEYS: Record<string, string[]> = {
  electronics: ['Display', 'Chip', 'Processor', 'RAM', 'Storage', 'Camera', 'Battery', 'DPI', 'Video'],
  jewellery: ['Metal', 'Stone', 'Purity', 'Weight', 'Closure', 'Style', 'Occasion'],
  fashion: ['Fit', 'Fabric', 'Upper', 'Sole', 'Frame', 'Lens', 'Movement', 'Strap'],
  home_appliances: ['Capacity', 'Star Rating', 'Type', 'Power', 'Technology', 'Runtime'],
  beauty: ['Volume', 'Key Ingredient', 'Finish', 'Coverage', 'Skin Type'],
  furniture: ['Material', 'Size', 'Seating', 'Dimensions', 'Storage', 'Shelves'],
  sports: ['Use', 'Cushioning', 'Frame', 'Weight', 'Thickness', 'Material'],
  travel: ['Class', 'Validity', 'Duration', 'Baggage', 'Includes'],
  books_stationery: ['Display', 'Storage', 'Pages', 'Ruling', 'Type', 'Body'],
  grocery_gourmet: ['Weight', 'Contents', 'Pieces', 'Type', 'Roast', 'Shelf Life'],
};

const DEFAULT_KEYS = ['Display', 'Processor', 'Camera', 'Battery'];

function getComparisonMessage(current: Product, others: Product[]): string {
  if (others.length === 0) return '';
  const sub = current.subcategory || current.category;
  
  if (sub.includes('Samsung F Series')) {
    return '💡 AI Insight: Galaxy F55 is better value than F15 for power users. Upgrade to A or S series for flagship features.';
  }
  if (sub.includes('Samsung A Series')) {
    return '💡 AI Insight: The A series offers IP67 and metal build vs F series. Step up to S series for 200MP camera and AI features.';
  }
  if (sub.includes('Samsung S Series')) {
    return '💡 AI Insight: S24 is compact & fast. S24+ gives 45W charging & bigger screen. S24 Ultra adds 200MP + S Pen for power users.';
  }
  if (sub.includes('Apple iPhone')) {
    return '💡 AI Insight: iPhone 15 is best value. 15 Pro adds titanium + 3x zoom. 15 Pro Max gives 5x zoom and the biggest battery.';
  }
  if (sub.includes('Apple MacBook')) {
    return '💡 AI Insight: MacBook Air 13" for lightweight use. Air 15" for larger screen. MacBook Pro 14" for professional workloads.';
  }
  if (sub.includes('Over-Ear')) {
    return '💡 AI Insight: Sony XM4 is the best budget pick. XM5 adds lighter build & better mics. Bose QC45 wins on all-day comfort.';
  }

  // Generic insight
  const sortedByPrice = [...others].sort((a, b) => a.price - b.price);
  const cheapest = sortedByPrice[0];
  const saving = current.price - cheapest.price;
  if (saving > 0) {
    return `💡 AI Insight: Save ₹${saving.toLocaleString('en-IN')} by choosing ${cheapest.name.split(' ').slice(0, 4).join(' ')}. Compare features to decide.`;
  }
  return '💡 AI Insight: These are the closest alternatives to consider before buying.';
}

function getSpecValue(product: Product, key: string): string {
  if (product.specs[key]) return product.specs[key];
  // Fuzzy match: find key that contains the search key substring
  const found = Object.keys(product.specs).find(
    k => k.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(k.toLowerCase())
  );
  return found ? product.specs[found] : '—';
}

function truncateSpec(val: string, maxLen = 28): string {
  if (val === '—') return val;
  return val.length > maxLen ? val.slice(0, maxLen - 1) + '…' : val;
}

export const AIComparisonTable: React.FC<AIComparisonTableProps> = ({
  currentProduct,
  onSelectProduct,
}) => {
  // Find comparison products: same subcategory first, fallback to same category
  const compareProducts = useMemo(() => {
    const similar = currentProduct.similarProductIds
      .map(id => MOCK_PRODUCTS.find(p => p.id === id))
      .filter(Boolean) as Product[];

    // Prefer same subcategory
    const sameSubcat = similar.filter(
      p => p.subcategory && p.subcategory === currentProduct.subcategory
    );

    const candidates = sameSubcat.length >= 1 ? sameSubcat : similar;
    // Limit to 3 comparison products max for readability
    return candidates.slice(0, 3);
  }, [currentProduct]);

  if (compareProducts.length === 0) return null;

  const allProducts = [currentProduct, ...compareProducts];

  // Determine which spec keys to show
  const categoryKeys = COMPARISON_SPEC_KEYS[currentProduct.category] || DEFAULT_KEYS;
  const specKeysToShow = categoryKeys.filter(key =>
    allProducts.some(p => getSpecValue(p, key) !== '—')
  ).slice(0, 6);

  const aiMessage = getComparisonMessage(currentProduct, compareProducts);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Sparkles size={16} color={Colors.primary} />
          <Text style={styles.title}>  AI Comparison</Text>
        </View>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>Auto-Generated</Text>
        </View>
      </View>

      {/* AI Insight Message */}
      {aiMessage ? (
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>{aiMessage}</Text>
        </View>
      ) : null}

      {/* Comparison Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Product Name Headers */}
          <View style={[styles.row, styles.headerRow]}>
            <View style={styles.specLabelCell} />
            {allProducts.map((p, i) => (
              <View
                key={p.id}
                style={[styles.productHeaderCell, i === 0 && styles.currentProductCell]}
              >
                {i === 0 && (
                  <View style={styles.youBadge}>
                    <Text style={styles.youBadgeText}>Viewing</Text>
                  </View>
                )}
                <Text style={[styles.productHeaderName, i === 0 && styles.currentProductName]} numberOfLines={2}>
                  {p.name.split(' ').slice(0, 4).join(' ')}
                </Text>
                <Text style={[styles.productHeaderPrice, i === 0 && styles.currentProductPrice]}>
                  ₹{p.price.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
          </View>

          {/* Spec Rows */}
          {specKeysToShow.map((key, rowIdx) => (
            <View key={key} style={[styles.row, rowIdx % 2 === 1 && styles.altRow]}>
              <View style={styles.specLabelCell}>
                <Text style={styles.specLabel}>{key}</Text>
              </View>
              {allProducts.map((p, i) => {
                const val = getSpecValue(p, key);
                return (
                  <View
                    key={p.id}
                    style={[styles.specValueCell, i === 0 && styles.currentSpecCell]}
                  >
                    <Text style={[styles.specValue, i === 0 && styles.currentSpecValue]}>
                      {truncateSpec(val)}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}

          {/* Rating Row */}
          <View style={[styles.row, specKeysToShow.length % 2 === 0 && styles.altRow]}>
            <View style={styles.specLabelCell}>
              <Text style={styles.specLabel}>Rating</Text>
            </View>
            {allProducts.map((p, i) => (
              <View key={p.id} style={[styles.specValueCell, i === 0 && styles.currentSpecCell]}>
                <Text style={[styles.specValue, i === 0 && styles.currentSpecValue]}>
                  ⭐ {p.rating} ({p.reviewCount.toLocaleString()})
                </Text>
              </View>
            ))}
          </View>

          {/* EMI Row */}
          <View style={[styles.row, (specKeysToShow.length + 1) % 2 === 0 && styles.altRow]}>
            <View style={styles.specLabelCell}>
              <Text style={styles.specLabel}>EMI from</Text>
            </View>
            {allProducts.map((p, i) => {
              const plan = p.emiPlans[0];
              return (
                <View key={p.id} style={[styles.specValueCell, i === 0 && styles.currentSpecCell]}>
                  <Text style={[styles.emiValue, i === 0 && styles.currentSpecValue]}>
                    {plan ? `₹${plan.monthlyAmount.toLocaleString('en-IN')}/mo` : '—'}
                  </Text>
                  {plan?.isNoCost && (
                    <Text style={styles.noCostTag}>0% Interest</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: '#F0EEFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  aiBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  aiBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  insightBox: {
    backgroundColor: '#EDE9FE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  insightText: {
    fontSize: 11,
    color: Colors.primaryDark,
    lineHeight: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 44,
  },
  altRow: {
    backgroundColor: '#F8F7FF',
    borderRadius: 6,
  },
  headerRow: {
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBorder,
    paddingBottom: 8,
  },
  specLabelCell: {
    width: 80,
    justifyContent: 'center',
    paddingRight: 8,
    paddingVertical: 6,
  },
  specLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  productHeaderCell: {
    width: 110,
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  currentProductCell: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  youBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  youBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
  productHeaderName: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 13,
  },
  currentProductName: {
    color: Colors.primary,
  },
  productHeaderPrice: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 3,
  },
  currentProductPrice: {
    color: Colors.primary,
  },
  specValueCell: {
    width: 110,
    paddingHorizontal: 6,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentSpecCell: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 6,
  },
  specValue: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  currentSpecValue: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  emiValue: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  noCostTag: {
    fontSize: 8,
    color: Colors.success,
    fontWeight: '700',
    textAlign: 'center',
  },
});
