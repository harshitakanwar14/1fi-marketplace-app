import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ShopScreen } from './src/screens/ShopScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { ComparisonModal } from './src/screens/ComparisonModal';
import { Product } from './src/types/marketplace';
import { useMarketplaceStore } from './src/store/marketplaceStore';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { loadWishlistFromStorage } = useMarketplaceStore();

  useEffect(() => {
    // Load persisted wishlist on mount
    loadWishlistFromStorage();
  }, []);

  return (
    <SafeAreaProvider style={styles.safeAreaProvider}>
      <View style={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.mobileFrame}>
          {selectedProduct ? (
            /* Product Detail Screen View */
            <ProductDetailScreen
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          ) : (
            /* Main Shop Screen View with 1Fi Marketplace Tab */
            <ShopScreen
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          )}

          {/* Global Comparison Modal */}
          <ComparisonModal
            onSelectProductForDetail={(p) => setSelectedProduct(p)}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  container: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#F8F9FE',
    overflow: 'hidden',
  },
});
