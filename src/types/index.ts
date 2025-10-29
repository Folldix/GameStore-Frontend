// frontend/src/types/index.ts

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Genre {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  genreId: string;
  genre: Genre;
  releaseDate: string;
  coverImageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  game: Game;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  purchaseDate: string;
  totalAmount: number;
  orderItems: OrderItem[];
}

export interface CartItem {
  game: Game;
}

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