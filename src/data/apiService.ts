import { Product, FilterSortState } from '../types/marketplace';
import { MOCK_PRODUCTS } from './mockProducts';

// Simulated latency in milliseconds
const SIMULATED_LATENCY = 600;

export class ApiService {
  private static shouldSimulateError = false;

  /**
   * Toggle simulated API error for testing error UI and retry workflows
   */
  public static setSimulateError(value: boolean) {
    this.shouldSimulateError = value;
  }

  /**
   * Fetch all products matching current filter & sort state
   */
  public static async getProducts(filters?: FilterSortState): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.shouldSimulateError) {
          reject(new Error('Network error: Unable to connect to 1Fi Marketplace server. Please check your connection and retry.'));
          return;
        }

        let results = [...MOCK_PRODUCTS];

        if (!filters) {
          resolve(results);
          return;
        }

        // Search Query Filter
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          results = results.filter(
            p =>
              p.name.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q)
          );
        }

        // Category Filter
        if (filters.selectedCategory && filters.selectedCategory !== 'all') {
          if (filters.selectedCategory === 'wishlist') {
            const ids = filters.wishlistIds || [];
            results = results.filter(p => ids.includes(p.id));
          } else {
            results = results.filter(p => p.category === filters.selectedCategory);
          }
        }

        // No Cost EMI Filter
        if (filters.onlyNoCostEMI) {
          results = results.filter(p => p.emiPlans.some(plan => plan.isNoCost));
        }

        // Rating Filter
        if (filters.minRating && filters.minRating > 0) {
          results = results.filter(p => p.rating >= filters.minRating!);
        }

        // Price Filter
        if (filters.minPrice !== undefined) {
          results = results.filter(p => p.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          results = results.filter(p => p.price <= filters.maxPrice!);
        }

        // Sorting
        switch (filters.sortBy) {
          case 'price_low_high':
            results.sort((a, b) => a.price - b.price);
            break;
          case 'price_high_low':
            results.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            results.sort((a, b) => b.rating - a.rating);
            break;
          case 'popular':
          default:
            results.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
        }

        resolve(results);
      }, SIMULATED_LATENCY);
    });
  }

  /**
   * Fetch single product by ID
   */
  public static async getProductById(id: string): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.shouldSimulateError) {
          reject(new Error('Failed to load product details.'));
          return;
        }

        const product = MOCK_PRODUCTS.find(p => p.id === id) || null;
        resolve(product);
      }, SIMULATED_LATENCY);
    });
  }

  /**
   * Fetch similar product recommendations
   */
  public static async getSimilarProducts(productId: string): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentProduct = MOCK_PRODUCTS.find(p => p.id === productId);
        if (!currentProduct) {
          resolve([]);
          return;
        }

        // Strictly filter to the SAME category only
        let sameCategoryProducts = MOCK_PRODUCTS.filter(
          p => p.id !== productId && p.category === currentProduct.category
        );

        // Sort: prioritize explicitly linked similarProductIds first, then same subcategory
        sameCategoryProducts.sort((a, b) => {
          const aExplicit = currentProduct.similarProductIds.includes(a.id) ? 1 : 0;
          const bExplicit = currentProduct.similarProductIds.includes(b.id) ? 1 : 0;
          if (aExplicit !== bExplicit) return bExplicit - aExplicit;

          const aSub = a.subcategory === currentProduct.subcategory ? 1 : 0;
          const bSub = b.subcategory === currentProduct.subcategory ? 1 : 0;
          return bSub - aSub;
        });

        resolve(sameCategoryProducts.slice(0, 6));
      }, SIMULATED_LATENCY / 2);
    });
  }
}
