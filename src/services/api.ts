// frontend/src/services/api.ts

import { Game, Order, AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
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
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch orders');
    }
    
    return response.json();
  },

  checkout: async (items: { gameId: string }[]): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Checkout failed');
    }
    
    return response.json();
  },
};