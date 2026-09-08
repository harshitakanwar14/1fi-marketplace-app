import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ShopScreen } from './src/screens/ShopScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { ComparisonModal } from './src/screens/ComparisonModal';
import { Product } from './src/types/marketplace';
import { useMarketplaceStore } from './src/store/marketplaceStore';

// Global Web CSS fix to ensure React Native Web never collapses to 0 height or blank white screen
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    html, body, #root {
      height: 100% !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      display: flex !important;
      flex-direction: column !important;
      background-color: #F8F9FE !important;
      overflow-x: hidden !important;
    }
  `;
  document.head.appendChild(styleEl);
}

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

        <View style={styles.contentWrapper}>
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
    width: '100%',
    backgroundColor: '#F8F9FE',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 500 : undefined,
    backgroundColor: '#F8F9FE',
  },
});
