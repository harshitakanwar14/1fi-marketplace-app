import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBanner } from '../components/common/HeaderBanner';
import { TabPills } from '../components/common/TabPills';
import { SearchBar } from '../components/common/SearchBar';
import { BottomNavBar } from '../components/common/BottomNavBar';
import { MarketplaceTab } from './MarketplaceTab';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { Product } from '../types/marketplace';
import { Colors } from '../theme/colors';
import { ShoppingBag, MapPin, Store } from 'lucide-react-native';

interface ShopScreenProps {
  onSelectProduct: (product: Product) => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({ onSelectProduct }) => {
  const {
    activeMainTab,
    setActiveMainTab,
    activeBottomTab,
    setActiveBottomTab,
    filters,
    setSearchQuery,
  } = useMarketplaceStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Scrollable Header & Body Content */}
      <View style={styles.container}>
        {/* Purple Hero Banner (Matching 1Fi Screenshot) */}
        <HeaderBanner />

        {/* 3 Tab Pills: Top Brands | Nearby Stores | 1Fi Marketplace */}
        <TabPills
          activeTab={activeMainTab}
          onTabChange={(tab) => setActiveMainTab(tab)}
        />

        {/* Search Bar */}
        <SearchBar
          value={filters.searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          placeholder="Search online stores, products..."
        />

        {/* Dynamic Tab Body */}
        <View style={styles.tabContent}>
          {activeMainTab === 'marketplace' ? (
            /* 1Fi Marketplace Section (Fully Implemented) */
            <MarketplaceTab onProductSelect={onSelectProduct} />
          ) : activeMainTab === 'top_brands' ? (
            /* Top Brands Section (Unimplemented / Standard 1Fi list as per assignment PDF) */
            <ScrollView style={styles.unimplementedContainer}>
              <Text style={styles.sectionHeaderTitle}>Top Brands</Text>

              <View style={styles.brandCard}>
                <View style={[styles.brandLogoBox, { backgroundColor: '#E11D48' }]}>
                  <Text style={styles.brandLogoText}>AIR INDIA</Text>
                </View>
                <View style={styles.brandInfo}>
                  <Text style={styles.brandTitle}>Air India</Text>
                  <Text style={styles.brandSubtext}>No-cost EMIs upto 18 months</Text>
                </View>
              </View>

              <View style={styles.brandCard}>
                <View style={[styles.brandLogoBox, { backgroundColor: '#000000' }]}>
                  <Text style={styles.brandLogoText}> Apple</Text>
                </View>
                <View style={styles.brandInfo}>
                  <Text style={styles.brandTitle}>Apple Premium Reseller</Text>
                  <Text style={styles.brandSubtext}>No-cost EMIs upto 24 months</Text>
                </View>
              </View>

              <View style={styles.brandCard}>
                <View style={[styles.brandLogoBox, { backgroundColor: '#9333EA' }]}>
                  <Text style={styles.brandLogoText}>CARATLANE</Text>
                </View>
                <View style={styles.brandInfo}>
                  <Text style={styles.brandTitle}>CaratLane</Text>
                  <Text style={styles.brandSubtext}>No-cost EMIs upto 12 months</Text>
                </View>
              </View>

              <View style={styles.assignmentNoteBox}>
                <Text style={styles.assignmentNoteTitle}>Assignment Spec Note</Text>
                <Text style={styles.assignmentNoteBody}>
                  "Top Brands section requires no implementation and can remain blank. Switch to the '1Fi Marketplace' tab to view the live marketplace feature."
                </Text>
              </View>
            </ScrollView>
          ) : (
            /* Nearby Stores Section (Unimplemented as per assignment PDF) */
            <View style={styles.emptyTabState}>
              <View style={styles.emptyIconCircle}>
                <MapPin size={32} color={Colors.primary} />
              </View>
              <Text style={styles.emptyStateTitle}>Nearby Stores</Text>
              <Text style={styles.emptyStateSubtext}>
                No implementation required for Nearby Stores tab in this assignment.
              </Text>
              <Pressable
                style={styles.switchTabBtn}
                onPress={() => setActiveMainTab('marketplace')}
              >
                <Text style={styles.switchTabBtnText}>Go to 1Fi Marketplace Tab</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* 1Fi Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeBottomTab}
        onTabSelect={(tab) => setActiveBottomTab(tab)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  unimplementedContainer: {
    paddingHorizontal: 16,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  brandLogoBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  brandLogoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
    textAlign: 'center',
  },
  brandInfo: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  brandSubtext: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  assignmentNoteBox: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  assignmentNoteTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  assignmentNoteBody: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  emptyTabState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyIconCircle: {
    backgroundColor: Colors.primarySurface,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  switchTabBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  switchTabBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
