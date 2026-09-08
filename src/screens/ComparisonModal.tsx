import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { ComparisonTable } from '../components/marketplace/ComparisonTable';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { Product } from '../types/marketplace';
import { Colors } from '../theme/colors';
import { X, Trash2 } from 'lucide-react-native';

interface ComparisonModalProps {
  onSelectProductForDetail: (product: Product) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  onSelectProductForDetail,
}) => {
  const {
    comparisonProductIds,
    isComparisonOpen,
    setComparisonOpen,
    toggleComparisonProduct,
    clearComparison,
  } = useMarketplaceStore();

  const comparedProducts = MOCK_PRODUCTS.filter((p) =>
    comparisonProductIds.includes(p.id)
  );

  return (
    <Modal
      visible={isComparisonOpen}
      animationType="slide"
      onRequestClose={() => setComparisonOpen(false)}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.title}>Product Comparison</Text>
            <Text style={styles.countBadge}>
              {comparedProducts.length} Selected
            </Text>
          </View>

          <View style={styles.actions}>
            {comparedProducts.length > 0 && (
              <Pressable style={styles.clearBtn} onPress={clearComparison}>
                <Trash2 size={14} color="#EF4444" style={{ marginRight: 4 }} />
                <Text style={styles.clearBtnText}>Clear All</Text>
              </Pressable>
            )}

            <Pressable style={styles.closeBtn} onPress={() => setComparisonOpen(false)}>
              <X size={18} color={Colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        {/* Comparison Table Content */}
        <View style={styles.body}>
          <ComparisonTable
            products={comparedProducts}
            onRemoveProduct={(id) => toggleComparisonProduct(id)}
            onSelectProductForDetail={(product) => {
              setComparisonOpen(false);
              onSelectProductForDetail(product);
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  countBadge: {
    backgroundColor: Colors.primarySurface,
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
  },
  body: {
    flex: 1,
  },
});
