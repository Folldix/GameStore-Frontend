// frontend/src/context/CartContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Game } from '../types';

// Простий тип для локального кошика (frontend state)
interface LocalCartItem {
  game: Game;
}

interface CartContextType {
  items: LocalCartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string) => void;
  clearCart: () => void;
  isInCart: (gameId: string) => boolean;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<LocalCartItem[]>([]);

  const addToCart = (game: Game): void => {
    setItems((prevItems) => {
      // Check if game is already in cart
      if (prevItems.some((item) => item.game.id === game.id)) {
        return prevItems;
      }
      return [...prevItems, { game }];
    });
  };

  const removeFromCart = (gameId: string): void => {
    setItems((prevItems) => prevItems.filter((item) => item.game.id !== gameId));
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const isInCart = (gameId: string): boolean => {
    return items.some((item) => item.game.id === gameId);
  };

  const itemCount = items.length;

  const total = items.reduce((sum, item) => sum + item.game.price, 0);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    itemCount,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};