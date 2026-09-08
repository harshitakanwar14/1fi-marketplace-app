import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Colors } from '../../theme/colors';
import { Sparkles, ArrowRight } from 'lucide-react-native';

export const HeaderBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Top Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Sparkles size={12} color="#FFFFFF" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>NO-COST EMIs</Text>
          </View>
        </View>

        {/* Hero Title */}
        <Text style={styles.title}>Shop today,</Text>
        <Text style={styles.subTitle}>
          <Text style={styles.italicText}>Pay later</Text> using Mutual funds.
        </Text>

        {/* Subtext */}
        <Text style={styles.description}>
          No credit score required. No interest. Backed by your investments.
        </Text>
      </View>

      {/* Decorative Gold Stars / Sparkle Background */}
      <View style={styles.goldSparkleContainer}>
        <View style={[styles.goldSparkle, { top: 12, right: 20 }]} />
        <View style={[styles.goldSparkle, { top: 60, right: 60, width: 6, height: 6 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bannerMiddle,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  contentContainer: {
    zIndex: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  subTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  italicText: {
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 8,
    maxWidth: '85%',
  },
  goldSparkleContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  goldSparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: Colors.bannerGold,
    borderRadius: 4,
    shadowColor: Colors.bannerGold,
    shadowRadius: 6,
    shadowOpacity: 0.8,
  },
});
