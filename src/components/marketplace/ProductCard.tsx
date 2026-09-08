import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Heart, Scale } from 'lucide-react-native';
import { Product } from '../../types/marketplace';
import { Colors } from '../../theme/colors';
import { RatingStars } from '../common/RatingStars';
import { useMarketplaceStore } from '../../store/marketplaceStore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { wishlist, toggleWishlist, comparisonProductIds, toggleComparisonProduct } = useMarketplaceStore();
  const isWishlisted = wishlist.includes(product.id);
  const isComparing = comparisonProductIds.includes(product.id);

  // Find lowest monthly EMI or 12-month EMI
  const lowestEmi = product.emiPlans.length > 0
    ? product.emiPlans.reduce((prev, curr) => (curr.monthlyAmount < prev.monthlyAmount ? curr : prev))
    : null;

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, price ₹${product.price.toLocaleString('en-IN')}`}
    >
      {/* Thumbnail & Wishlist / Compare overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Top Badges */}
        {product.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}

        {/* Action Buttons: Heart & Compare */}
        <View style={styles.actionButtons}>
          <Pressable
            style={[styles.iconBtn, isWishlisted && styles.iconBtnActive]}
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={14}
              color={isWishlisted ? Colors.heartActive : '#64748B'}
              fill={isWishlisted ? Colors.heartActive : 'none'}
            />
          </Pressable>

          <Pressable
            style={[styles.iconBtn, isComparing && styles.compareActiveBtn]}
            onPress={(e) => {
              e.stopPropagation();
              toggleComparisonProduct(product.id);
            }}
            accessibilityLabel="Compare product"
          >
            <Scale
              size={14}
              color={isComparing ? Colors.primary : '#64748B'}
            />
          </Pressable>
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.content}>
        {/* Brand Label */}
        <Text style={styles.brandText} numberOfLines={1}>
          {product.brand}
        </Text>

        {/* Product Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} starSize={12} />
        </View>

        {/* Price & Discount */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
          )}
          {product.discountPercentage && (
            <Text style={styles.discountText}>{product.discountPercentage}% OFF</Text>
          )}
        </View>

        {/* EMI Pill */}
        {lowestEmi && (
          <View style={styles.emiPill}>
            <Text style={styles.emiText}>
              EMI from <Text style={styles.emiAmount}>₹{lowestEmi.monthlyAmount.toLocaleString('en-IN')}/mo</Text>
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  actionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    gap: 6,
  },
  iconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  iconBtnActive: {
    backgroundColor: '#FEE2E2',
  },
  compareActiveBtn: {
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  content: {
    padding: 10,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 16,
    height: 32,
    marginBottom: 4,
  },
  ratingRow: {
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  originalPrice: {
    fontSize: 10,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  emiPill: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  emiText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  emiAmount: {
    fontWeight: '800',
    color: Colors.primary,
  },
});
