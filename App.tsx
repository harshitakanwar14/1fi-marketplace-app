import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
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
    loadWishlistFromStorage();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="dark" />
        {selectedProduct ? (
          <ProductDetailScreen
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        ) : (
          <ShopScreen onSelectProduct={(p) => setSelectedProduct(p)} />
        )}
        <ComparisonModal onSelectProductForDetail={(p) => setSelectedProduct(p)} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    // On web, force the view to take full viewport height
    ...(Platform.OS === 'web' ? {
      height: '100vh' as any,
      overflow: 'hidden' as any,
    } : {}),
    backgroundColor: '#F8F9FE',
  },
});
