import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Product } from '../../types/marketplace';
import { Colors } from '../../theme/colors';
import { Sparkles } from 'lucide-react-native';

interface RecommendationCarouselProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const RecommendationCarousel: React.FC<RecommendationCarouselProps> = ({
  products,
  onSelectProduct,
}) => {
  if (products.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Sparkles size={16} color={Colors.primary} style={{ marginRight: 6 }} />
        <Text style={styles.title}>You May Also Like</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {products.map((p) => {
          const emiPlan = p.emiPlans[0];
          return (
            <Pressable
              key={p.id}
              style={styles.card}
              onPress={() => onSelectProduct(p)}
              accessibilityRole="button"
              accessibilityLabel={`Recommendation: ${p.name}`}
            >
              <Image source={{ uri: p.thumbnail }} style={styles.image} resizeMode="contain" />
              <Text style={styles.brandText}>{p.brand}</Text>
              <Text style={styles.nameText} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.priceText}>₹{p.price.toLocaleString('en-IN')}</Text>
              {emiPlan && (
                <Text style={styles.emiText}>
                  EMI from <Text style={{ fontWeight: '700', color: Colors.primary }}>₹{emiPlan.monthlyAmount.toLocaleString('en-IN')}/mo</Text>
                </Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    marginBottom: 6,
  },
  brandText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  nameText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  emiText: {
    fontSize: 9,
    color: Colors.textMuted,
  },
});
