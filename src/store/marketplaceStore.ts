import { create } from 'zustand';
import { Product, EMIPlan, FilterSortState, MainTabType, BottomNavTabType } from '../types/marketplace';
import { ApiService } from '../data/apiService';
import { safeStorage } from '../utils/storage';

const WISHLIST_STORAGE_KEY = '@1fi_marketplace_wishlist';

interface MarketplaceState {
  // Navigation State
  activeMainTab: MainTabType;
  activeBottomTab: BottomNavTabType;
  setActiveMainTab: (tab: MainTabType) => void;
  setActiveBottomTab: (tab: BottomNavTabType) => void;

  // Products Data State
  products: Product[];
  isLoading: boolean;
  error: string | null;

  // Selected Product & EMI State
  selectedProduct: Product | null;
  selectedEMIPlan: EMIPlan | null;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedEMIPlan: (plan: EMIPlan | null) => void;

  // Filter & Search State
  filters: FilterSortState;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sortBy: FilterSortState['sortBy']) => void;
  setNoCostEMIOnly: (value: boolean) => void;
  resetFilters: () => void;

  // Wishlist State (Local Persistence)
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  loadWishlistFromStorage: () => Promise<void>;

  // Comparison State
  comparisonProductIds: string[];
  isComparisonOpen: boolean;
  toggleComparisonProduct: (productId: string) => void;
  setComparisonOpen: (isOpen: boolean) => void;
  clearComparison: () => void;

  // Actions
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  toggleSimulatedError: () => void;
  isSimulatedErrorActive: boolean;
}

const DEFAULT_FILTERS: FilterSortState = {
  searchQuery: '',
  selectedCategory: 'all',
  onlyNoCostEMI: false,
  sortBy: 'popular',
};

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  // Navigation Defaults
  activeMainTab: 'marketplace',
  activeBottomTab: 'shop',
  setActiveMainTab: (tab) => set({ activeMainTab: tab }),
  setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),

  // Products Data
  products: [],
  isLoading: true,
  error: null,

  // Selected Product
  selectedProduct: null,
  selectedEMIPlan: null,
  setSelectedProduct: (product) => {
    set({
      selectedProduct: product,
      selectedEMIPlan: product?.emiPlans ? product.emiPlans.find(p => p.tenureMonths === 12) || product.emiPlans[0] : null,
    });
  },
  setSelectedEMIPlan: (plan) => set({ selectedEMIPlan: plan }),

  // Filter State
  filters: DEFAULT_FILTERS,
  setSearchQuery: (query) => {
    set((state) => ({ filters: { ...state.filters, searchQuery: query } }));
    get().fetchProducts();
  },
  setCategory: (category) => {
    set((state) => ({ filters: { ...state.filters, selectedCategory: category } }));
    get().fetchProducts();
  },
  setSortBy: (sortBy) => {
    set((state) => ({ filters: { ...state.filters, sortBy } }));
    get().fetchProducts();
  },
  setNoCostEMIOnly: (value) => {
    set((state) => ({ filters: { ...state.filters, onlyNoCostEMI: value } }));
    get().fetchProducts();
  },
  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS });
    get().fetchProducts();
  },

  // Wishlist Logic with Safe Storage Persistence
  wishlist: [],
  toggleWishlist: async (productId) => {
    const current = get().wishlist;
    const exists = current.includes(productId);
    const updated = exists ? current.filter(id => id !== productId) : [...current, productId];
    set({ wishlist: updated });

    await safeStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
  },
  loadWishlistFromStorage: async () => {
    const stored = await safeStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      try {
        set({ wishlist: JSON.parse(stored) });
      } catch (e) {
        // Safe JSON parse fallback
      }
    }
  },

  // Comparison Logic
  comparisonProductIds: [],
  isComparisonOpen: false,
  toggleComparisonProduct: (productId) => {
    const current = get().comparisonProductIds;
    if (current.includes(productId)) {
      set({ comparisonProductIds: current.filter(id => id !== productId) });
    } else {
      if (current.length >= 3) {
        set({ comparisonProductIds: [...current.slice(1), productId] });
      } else {
        set({ comparisonProductIds: [...current, productId] });
      }
    }
  },
  setComparisonOpen: (isOpen) => set({ isComparisonOpen: isOpen }),
  clearComparison: () => set({ comparisonProductIds: [], isComparisonOpen: false }),

  // Simulated Error Testing
  isSimulatedErrorActive: false,
  toggleSimulatedError: () => {
    const nextState = !get().isSimulatedErrorActive;
    ApiService.setSimulateError(nextState);
    set({ isSimulatedErrorActive: nextState });
    get().fetchProducts();
  },

  // Async Actions
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ApiService.getProducts(get().filters);
      set({ products: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch products', isLoading: false });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = await ApiService.getProductById(id);
      if (product) {
        get().setSelectedProduct(product);
      } else {
        set({ error: 'Product not found' });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch product details' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
