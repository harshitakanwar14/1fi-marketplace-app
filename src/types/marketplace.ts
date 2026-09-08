export interface EMIPlan {
  id: string;
  tenureMonths: number;
  monthlyAmount: number;
  isNoCost: boolean;
  interestRatePct: number; // 0 for No-Cost EMI
  processingFee: number;
  totalPayable: number;
  savingsAmount?: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  color?: string;
  storage?: string;
}

export type ProductCategory =
  | 'electronics'
  | 'jewellery'
  | 'fashion'
  | 'home_appliances'
  | 'furniture'
  | 'travel'
  | 'books_stationery'
  | 'health_fitness'
  | 'sports';

export interface Product {
  id: string;
  name: string;
  brand: string;
  brandLogo: string;
  category: ProductCategory;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  thumbnail: string;
  badge?: string;
  emiPlans: EMIPlan[];
  specs: Record<string, string>;
  description: string;
  variants?: ProductVariant[];
  inStock: boolean;
  reviews: Review[];
  similarProductIds: string[];
}

export interface FilterSortState {
  searchQuery: string;
  selectedCategory: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  onlyNoCostEMI: boolean;
  sortBy: 'popular' | 'price_low_high' | 'price_high_low' | 'rating';
  wishlistIds?: string[];
}

export type MainTabType = 'top_brands' | 'nearby_stores' | 'marketplace';

export type BottomNavTabType = 'home' | 'shop' | 'emi_dues' | 'limit' | 'profile';
