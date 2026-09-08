import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonBox: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <SkeletonBox width="100%" height={140} borderRadius={14} />
      <View style={styles.cardContent}>
        <SkeletonBox width="40%" height={10} style={{ marginBottom: 6 }} />
        <SkeletonBox width="90%" height={14} style={{ marginBottom: 6 }} />
        <SkeletonBox width="60%" height={14} style={{ marginBottom: 10 }} />
        <SkeletonBox width="50%" height={18} style={{ marginBottom: 8 }} />
        <SkeletonBox width="80%" height={24} borderRadius={12} />
      </View>
    </View>
  );
};

export const ProductGridSkeleton: React.FC = () => {
  return (
    <View style={styles.gridContainer}>
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}><ProductCardSkeleton /></View>
        <View style={{ flex: 1, marginLeft: 8 }}><ProductCardSkeleton /></View>
      </View>
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}><ProductCardSkeleton /></View>
        <View style={{ flex: 1, marginLeft: 8 }}><ProductCardSkeleton /></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E2E8F0',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardContent: {
    marginTop: 10,
  },
  gridContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
});
