// frontend/src/utils/helpers.ts

import { Game } from '../types';

/**
 * Get genre name from Game object (handles both string and Genre object)
 */
export const getGenreName = (game: Game): string => {
  if (typeof game.genre === 'string') {
    return game.genre;
  }
  return game.genre;
};

/**
 * Get cover image URL from Game object (handles both coverImage and coverImageUrl)
 */
export const getCoverImage = (game: Game): string => {
  return game.coverImage || game.coverImageUrl || '';
};

/**
 * Format play time from minutes to human readable format
 */
export const formatPlayTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Format file size from bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  const gb = bytes / 1_000_000_000;
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  const mb = bytes / 1_000_000;
  return `${mb.toFixed(2)} MB`;
};

/**
 * Calculate discount percentage
 */
export const getDiscountPercentage = (originalPrice: number, discountPrice: number): number => {
  return Math.round((1 - discountPrice / originalPrice) * 100);
};

/**
 * Get final price (with discount if available)
 */
export const getFinalPrice = (game: Game): number => {
  return game.discountPrice || game.price;
};