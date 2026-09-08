import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Home, Store, Receipt, TrendingUp, User } from 'lucide-react-native';
import { BottomNavTabType } from '../../types/marketplace';
import { Colors } from '../../theme/colors';

interface BottomNavBarProps {
  activeTab: BottomNavTabType;
  onTabSelect: (tab: BottomNavTabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabSelect }) => {
  const tabs = [
    { id: 'home' as BottomNavTabType, label: 'Home', icon: Home },
    { id: 'shop' as BottomNavTabType, label: 'Shop', icon: Store },
    { id: 'emi_dues' as BottomNavTabType, label: 'EMI Dues', icon: Receipt },
    { id: 'limit' as BottomNavTabType, label: 'Limit', icon: TrendingUp },
    { id: 'profile' as BottomNavTabType, label: 'Profile', icon: User },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <Pressable
            key={tab.id}
            style={styles.navItem}
            onPress={() => onTabSelect(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label} Navigation Tab`}
          >
            <View style={[styles.iconBox, isActive && styles.activeIconBox]}>
              <IconComponent
                size={20}
                color={isActive ? Colors.primary : Colors.navInactive}
              />
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: Colors.navBg,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconBox: {
    padding: 6,
    borderRadius: 12,
  },
  activeIconBox: {
    backgroundColor: Colors.primarySurface,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.navInactive,
    marginTop: 2,
  },
  activeLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
