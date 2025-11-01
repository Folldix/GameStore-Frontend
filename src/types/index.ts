// Enums
export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  INACTIVE = 'INACTIVE',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum NotificationType {
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  NEW_GAME_RELEASE = 'NEW_GAME_RELEASE',
  PROMOTION = 'PROMOTION',
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN'; // Для сумісності зі старою версією
  registrationDate?: string;
  lastLoginAt?: string;
  accountStatus?: AccountStatus;
  balance?: number;
  userType?: 'CUSTOMER' | 'ADMIN';
  
  // Customer fields
  customerLevel?: string;
  loyaltyPoints?: number;
  
  // Admin fields
  adminLevel?: string;
  permissions?: string[];
}

// System Requirements
export interface SystemRequirements {
  id: string;
  minOS: string;
  minProcessor: string;
  minRAM: string;
  minStorage: string;
  minGraphics: string;
  recOS: string;
  recProcessor: string;
  recRAM: string;
  recStorage: string;
  recGraphics: string;
}

// Game
export interface Game {
  id: string;
  title: string;
  description: string;
  genre: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  price: number;
  discountPrice?: number;
  rating: number;
  downloadSize: number;
  coverImage: string;
  coverImageUrl?: string;
  screenshots: string[];
  videoTrailer?: string;
  ageRating: string;
  systemRequirements?: SystemRequirements;
  createdAt?: string;
  updatedAt?: string;
}

// Shopping Cart
export interface ShoppingCart {
  id: string;
  userId: string;
  totalAmount: number;
  createdDate: string;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  gameId: string;
  game: Game;
  price: number;
  addedDate: string;
}

// Order
export interface Order {
  id: string;
  userId: string;
  orderDate: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentMethod: string;
  items: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  orderId: string;
  gameId: string;
  game: Game;
  price: number;
  purchaseDate: string;
}

// Payment
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionDate: string;
  transactionId?: string;
}

// Library
export interface Library {
  id: string;
  userId: string;
  games: LibraryGame[];
}

export interface LibraryGame {
  id: string;
  libraryId: string;
  gameId: string;
  game: Game;
  purchaseDate: string;
  lastPlayedDate?: string;
  playTime: number;
  isInstalled: boolean;
}

// Review
export interface Review {
  id: string;
  userId: string;
  user?: User;
  gameId: string;
  rating: number;
  comment: string;
  reviewDate: string;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
}

// Promotion
export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  games: Game[];
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  message: string;
  notificationType: NotificationType;
  createdDate: string;
  isRead: boolean;
}

// Wishlist
export interface WishlistItem {
  id: string;
  userId: string;
  gameId: string;
  game: Game;
  addedDate: string;
}

// Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API Request/Response types
export interface CheckoutRequest {
  items: { gameId: string }[];
  paymentMethod: PaymentMethod;
}

export interface AddFundsRequest {
  amount: number;
}

export interface CreateReviewRequest {
  gameId: string;
  rating: number;
  comment: string;
}
