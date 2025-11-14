// frontend/src/context/LibraryContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Library } from '../types';
import { libraryService } from '../services/api';
import { useAuth } from './AuthContext';

interface LibraryContextType {
  library: Library | null;
  isLoading: boolean;
  isGameOwned: (gameId: string) => boolean;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

interface LibraryProviderProps {
  children: ReactNode;
}

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [library, setLibrary] = useState<Library | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadLibrary = async () => {
    if (!isAuthenticated) {
      setLibrary(null);
      return;
    }

    try {
      setIsLoading(true);
      const data = await libraryService.getLibrary();
      setLibrary(data);
    } catch (err) {
      setLibrary(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, [isAuthenticated]);

  const isGameOwned = (gameId: string): boolean => {
    if (!library) return false;
    return library.games.some(lg => lg.gameId === gameId);
  };

  const refreshLibrary = async () => {
    await loadLibrary();
  };

  const value: LibraryContextType = {
    library,
    isLoading,
    isGameOwned,
    refreshLibrary,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  
  return context;
};

