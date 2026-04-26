// Album types
export interface Album {
  id: string;
  slug: string;
  title: string;
  releaseYear: number;
  coverUrl: string;
  description?: string;
  bandcampUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeMusicUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

// Event types
export type EventStatus = 'upcoming' | 'sold_out' | 'cancelled' | 'past';

export interface Event {
  id: string;
  title: string;
  venue: string;
  city: string;
  country: string;
  eventDate: string;
  doorsOpen?: string;
  posterUrl?: string;
  ticketUrl?: string;
  ticketPriceMin?: number;
  ticketPriceMax?: number;
  status: EventStatus;
  notes?: string;
  createdAt: string;
}

// Product/Merch types
export type ProductCategory = 'apparel' | 'poster' | 'accessory' | 'vinyl' | 'bundle';

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  label: string;
  stock: number;
  priceDelta: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  isFeatured: boolean;
  isPublished: boolean;
  stockTotal: number;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
}

// Cart types
export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  imageUrl: string;
  slug: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Order types
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItem {
  productId: string;
  variantId?: string;
  productName: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostal: string;
  shippingProvince: string;
  items: OrderItem[];
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  snapToken?: string;
  createdAt: string;
}

// Media types
export type MediaType = 'photo' | 'video';

export interface Media {
  id: string;
  type: MediaType;
  title?: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  takenAt?: string;
  albumId?: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

// Contact/Booking form
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  eventType?: string;
  eventDate?: string;
  city?: string;
  venue?: string;
  budgetRange?: string;
  message: string;
  honeypot?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Member type
export interface BandMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
}
