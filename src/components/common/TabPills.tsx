import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MainTabType } from '../../types/marketplace';
import { Colors } from '../../theme/colors';

interface TabPillsProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
}

export const TabPills: React.FC<TabPillsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.pillsContainer}>
        {/* Top Brands Tab */}
        <Pressable
          style={[styles.pill, activeTab === 'top_brands' && styles.activePill]}
          onPress={() => onTabChange('top_brands')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'top_brands' }}
          accessibilityLabel="Top Brands Tab"
        >
          <Text style={[styles.pillText, activeTab === 'top_brands' && styles.activePillText]}>
            Top Brands
          </Text>
          {activeTab === 'top_brands' && <View style={styles.activeIndicator} />}
        </Pressable>

        {/* Nearby Stores Tab */}
        <Pressable
          style={[styles.pill, activeTab === 'nearby_stores' && styles.activePill]}
          onPress={() => onTabChange('nearby_stores')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'nearby_stores' }}
          accessibilityLabel="Nearby Stores Tab"
        >
          <Text style={[styles.pillText, activeTab === 'nearby_stores' && styles.activePillText]}>
            Nearby Stores
          </Text>
          {activeTab === 'nearby_stores' && <View style={styles.activeIndicator} />}
        </Pressable>

        {/* 1Fi Marketplace Tab */}
        <Pressable
          style={[styles.pill, activeTab === 'marketplace' && styles.activePill]}
          onPress={() => onTabChange('marketplace')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'marketplace' }}
          accessibilityLabel="1Fi Marketplace Tab"
        >
          <View style={styles.marketplacePillContent}>
            <Text style={[styles.pillText, activeTab === 'marketplace' && styles.activePillText]}>
              1Fi Marketplace
            </Text>
            {/* New feature pill dot */}
            <View style={styles.newBadge} />
          </View>
          {activeTab === 'marketplace' && <View style={styles.activeIndicator} />}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1EEFE',
    borderRadius: 24,
    padding: 4,
    justifyContent: 'space-between',
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  activePill: {
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activePillText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 20,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  marketplacePillContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginLeft: 3,
    marginTop: -4,
  },
});
