import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product, EMIPlan } from '../types/marketplace';
import { Colors } from '../theme/colors';
import { RatingStars } from '../components/common/RatingStars';
import { EMIPlanSelector } from '../components/marketplace/EMIPlanSelector';
import { ProductSpecTable } from '../components/marketplace/ProductSpecTable';
import { RecommendationCarousel } from '../components/marketplace/RecommendationCarousel';
import { AIComparisonTable } from '../components/marketplace/AIComparisonTable';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { ApiService } from '../data/apiService';
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
} from 'lucide-react-native';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onBack,
  onSelectProduct,
}) => {
  const {
    wishlist,
    toggleWishlist,
    selectedEMIPlan,
    setSelectedEMIPlan,
  } = useMarketplaceStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants?.[0]?.id
  );
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  useEffect(() => {
    // Set default selected EMI plan
    if (product.emiPlans.length > 0) {
      const default12Mo = product.emiPlans.find((p) => p.tenureMonths === 12) || product.emiPlans[0];
      setSelectedEMIPlan(default12Mo);
    }
    // Fetch similar products
    ApiService.getSimilarProducts(product.id).then(setSimilarProducts);
  }, [product]);

  const currentPrice = selectedVariantId
    ? product.variants?.find((v) => v.id === selectedVariantId)?.price || product.price
    : product.price;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Pressable style={styles.iconCircle} onPress={onBack} accessibilityLabel="Back">
          <ArrowLeft size={18} color={Colors.textPrimary} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.headerRightActions}>
          <Pressable
            style={[styles.iconCircle, isWishlisted && styles.wishlistCircle]}
            onPress={() => toggleWishlist(product.id)}
            accessibilityLabel="Wishlist product"
          >
            <Heart
              size={18}
              color={isWishlisted ? Colors.heartActive : Colors.textPrimary}
              fill={isWishlisted ? Colors.heartActive : 'none'}
            />
          </Pressable>
        </View>
      </View>

      {/* Main Scroll Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Main Product Image Carousel */}
        <View style={styles.imageGalleryContainer}>
          <Image
            source={{ uri: product.images[activeImageIndex] || product.thumbnail }}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Badge */}
          {product.badge && (
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>{product.badge}</Text>
            </View>
          )}

          {/* Thumbnail Dots */}
          {product.images.length > 1 && (
            <View style={styles.thumbnailRow}>
              {product.images.map((img, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setActiveImageIndex(idx)}
                  style={[
                    styles.thumbBox,
                    activeImageIndex === idx && styles.activeThumbBox,
                  ]}
                >
                  <Image source={{ uri: img }} style={styles.thumbImage} resizeMode="cover" />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Product Details Section */}
        <View style={styles.bodyContent}>
          {/* Brand Logo & Name */}
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>{product.brand}</Text>
          </View>

          {/* Product Title */}
          <Text style={styles.productTitle}>{product.name}</Text>

          {/* Rating Stars & Count */}
          <View style={styles.ratingSection}>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} starSize={16} />
            <Text style={styles.stockStatus}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          {/* Price Box */}
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>₹{currentPrice.toLocaleString('en-IN')}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPriceText}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </Text>
              )}
              {product.discountPercentage && (
                <View style={styles.discountPill}>
                  <Text style={styles.discountPillText}>{product.discountPercentage}% OFF</Text>
                </View>
              )}
            </View>

            {/* 1Fi MF Collateral Security Note */}
            <View style={styles.mfSecurityNote}>
              <ShieldCheck size={16} color={Colors.primary} style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.securityTitle}>1Fi Mutual Fund Backed Credit</Text>
                <Text style={styles.securitySubtext}>
                  No credit score required. Instant approval backed by your active mutual fund portfolio.
                </Text>
              </View>
            </View>
          </View>

          {/* Product Variants (if applicable) */}
          {product.variants && product.variants.length > 0 && (
            <View style={styles.variantSection}>
              <Text style={styles.sectionTitle}>Select Variant</Text>
              <View style={styles.variantRow}>
                {product.variants.map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  return (
                    <Pressable
                      key={v.id}
                      style={[styles.variantChip, isSelected && styles.selectedVariantChip]}
                      onPress={() => setSelectedVariantId(v.id)}
                    >
                      <Text
                        style={[
                          styles.variantChipText,
                          isSelected && styles.selectedVariantText,
                        ]}
                      >
                        {v.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* AI Auto Comparison Table */}
          <AIComparisonTable currentProduct={product} onSelectProduct={onSelectProduct} />

          {/* Interactive EMI Plan Selector */}
          <EMIPlanSelector
            plans={product.emiPlans}
            selectedPlanId={selectedEMIPlan?.id}
            onSelectPlan={(plan) => setSelectedEMIPlan(plan)}
          />

          {/* Specifications Table */}
          <ProductSpecTable specs={product.specs} />

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Customer Reviews Section */}
          {product.reviews.length > 0 && (
            <View style={styles.reviewsContainer}>
              <Text style={styles.sectionTitle}>Verified Reviews</Text>
              {product.reviews.map((r) => (
                <View key={r.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{r.userName}</Text>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <RatingStars rating={r.rating} showText={false} starSize={12} />
                  <Text style={styles.reviewComment}>{r.comment}</Text>
                </View>
              ))}
            </View>
          )}

          {/* You May Also Like Recommendations */}
          <RecommendationCarousel
            products={similarProducts}
            onSelectProduct={onSelectProduct}
          />
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA Bar */}
      <View style={styles.stickyCtaBar}>
        <View style={styles.ctaEmiSummary}>
          <Text style={styles.ctaEmiLabel}>Selected EMI Plan</Text>
          <Text style={styles.ctaEmiAmount}>
            ₹{selectedEMIPlan?.monthlyAmount.toLocaleString('en-IN') || 0}/mo
          </Text>
          <Text style={styles.ctaEmiTenure}>
            for {selectedEMIPlan?.tenureMonths || 12} Months ({selectedEMIPlan?.isNoCost ? '0% Interest' : 'Std EMI'})
          </Text>
        </View>

        <Pressable
          style={styles.proceedBtn}
          onPress={() => setConfirmationModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Proceed with selected EMI plan"
        >
          <Lock size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.proceedBtnText}>Proceed with Plan</Text>
        </Pressable>
      </View>

      {/* EMI Plan Confirmation & Loan Summary Modal */}
      <Modal
        visible={isConfirmationModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirmationModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModalCard}>
            <View style={styles.modalSuccessIcon}>
              <CheckCircle2 size={36} color={Colors.success} />
            </View>

            <Text style={styles.modalTitle}>Confirm EMI Purchase</Text>
            <Text style={styles.modalSubtext}>
              You are applying for a Mutual Fund backed EMI loan on 1Fi.
            </Text>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Product</Text>
                <Text style={styles.summaryVal} numberOfLines={1}>{product.name}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Total Amount</Text>
                <Text style={styles.summaryVal}>₹{currentPrice.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Tenure</Text>
                <Text style={styles.summaryVal}>{selectedEMIPlan?.tenureMonths} Months</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Monthly Instalment</Text>
                <Text style={[styles.summaryVal, { color: Colors.primary, fontWeight: '800' }]}>
                  ₹{selectedEMIPlan?.monthlyAmount.toLocaleString('en-IN')}/mo
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Interest Scheme</Text>
                <Text style={[styles.summaryVal, { color: Colors.success, fontWeight: '700' }]}>
                  {selectedEMIPlan?.isNoCost ? '0% No-Cost EMI' : `${selectedEMIPlan?.interestRatePct}% Standard`}
                </Text>
              </View>

              <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.summaryKey}>Collateral</Text>
                <Text style={styles.summaryVal}>MF Portfolio Pledge</Text>
              </View>
            </View>

            <Pressable
              style={styles.modalConfirmBtn}
              onPress={() => {
                setConfirmationModalOpen(false);
                alert(`Success! Loan application for ${product.name} submitted successfully.`);
                onBack();
              }}
            >
              <Text style={styles.modalConfirmBtnText}>Submit Loan Application</Text>
            </Pressable>

            <Pressable
              style={styles.modalCancelBtn}
              onPress={() => setConfirmationModalOpen(false)}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginHorizontal: 12,
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeCircle: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  wishlistCircle: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  scrollContainer: {
    flex: 1,
  },
  imageGalleryContainer: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 20,
    alignItems: 'center',
    position: 'relative',
  },
  mainImage: {
    width: '90%',
    height: 240,
  },
  imageBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  thumbnailRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  thumbBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  activeThumbBox: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  bodyContent: {
    padding: 16,
  },
  brandRow: {
    marginBottom: 4,
  },
  brandName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stockStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  priceContainer: {
    backgroundColor: Colors.primarySurface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 10,
  },
  priceText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  originalPriceText: {
    fontSize: 14,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountPill: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  discountPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  mfSecurityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  securityTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  securitySubtext: {
    fontSize: 10,
    color: Colors.textSecondary,
    lineHeight: 14,
  },
  variantSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  variantRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  selectedVariantChip: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  variantChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  selectedVariantText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  compareBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  compareLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compareBarText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  descriptionContainer: {
    marginVertical: 16,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  reviewsContainer: {
    marginVertical: 12,
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewDate: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  reviewComment: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  stickyCtaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  ctaEmiSummary: {
    flex: 1,
  },
  ctaEmiLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  ctaEmiAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  ctaEmiTenure: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  proceedBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalSuccessIcon: {
    backgroundColor: '#D1FAE5',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  modalSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  summaryKey: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    maxWidth: '60%',
  },
  modalConfirmBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalConfirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  modalCancelBtn: {
    paddingVertical: 8,
  },
  modalCancelBtnText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
