import {
  Game,
  Order,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Library,
  LibraryGame,
  Review,
  CreateReviewRequest,
  WishlistItem,
  ShoppingCart,
  CartItem,
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (e) {
    return false;
  }
};

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// Auth Service
export const authService = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  },
};

// Game Service
export const gameService = {
  getAll: async (genre?: string): Promise<Game[]> => {
    const url = genre 
      ? `${API_URL}/games?genre=${encodeURIComponent(genre)}` 
      : `${API_URL}/games`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }
    
    return response.json();
  },

  getById: async (id: string): Promise<Game> => {
    const response = await fetch(`${API_URL}/games/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch game');
    }
    
    return response.json();
  },

  create: async (game: Partial<Game>): Promise<Game> => {
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(game),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create game');
    }
    
    return response.json();
  },

  update: async (id: string, game: Partial<Game>): Promise<Game> => {
    const response = await fetch(`${API_URL}/games/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(game),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update game');
    }
    
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/games/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete game');
    }
  },
};

// Order Service
export const orderService = {
  getMyOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_URL}/orders/my-orders`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    return response.json();
  },

  checkout: async (items: { gameId: string }[]): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ items }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Checkout failed');
    }
    
    return response.json();
  },
};

// Cart Service
export const cartService = {
  getCart: async (): Promise<ShoppingCart> => {
    const response = await fetch(`${API_URL}/cart`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    
    return response.json();
  },

  addToCart: async (gameId: string): Promise<CartItem> => {
    const response = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ gameId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add to cart');
    }
    
    return response.json();
  },

  removeFromCart: async (itemId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove from cart');
    }
  },

  clearCart: async (): Promise<void> => {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
  },
};

// Library Service
export const libraryService = {
  getLibrary: async (): Promise<Library> => {
    const response = await fetch(`${API_URL}/library`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch library');
    }
    
    return response.json();
  },

  toggleInstall: async (gameId: string): Promise<LibraryGame> => {
    const response = await fetch(`${API_URL}/library/games/${gameId}/install`, {
      method: 'PATCH',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle install');
    }
    
    return response.json();
  },

  updatePlayTime: async (gameId: string, playTime: number): Promise<LibraryGame> => {
    const response = await fetch(`${API_URL}/library/games/${gameId}/play`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ playTime }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update play time');
    }
    
    return response.json();
  },
};

// Review Service
export const reviewService = {
  getGameReviews: async (gameId: string): Promise<Review[]> => {
    const response = await fetch(`${API_URL}/reviews/game/${gameId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    
    return response.json();
  },

  createReview: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create review');
    }
    
    return response.json();
  },

  updateReview: async (
    reviewId: string,
    data: { rating?: number; comment?: string }
  ): Promise<Review> => {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update review');
    }
    
    return response.json();
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete review');
    }
  },

  markHelpful: async (reviewId: string): Promise<Review> => {
    const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark review as helpful');
    }
    
    return response.json();
  },
};

// Wishlist Service
export const wishlistService = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await fetch(`${API_URL}/wishlist`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }
    
    return response.json();
  },

  addToWishlist: async (gameId: string): Promise<WishlistItem> => {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ gameId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add to wishlist');
    }
    
    return response.json();
  },

  removeFromWishlist: async (gameId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/wishlist/${gameId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove from wishlist');
    }
  },
};