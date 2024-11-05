import type { FavoriteLocation } from '@/types/Weather.types';

export interface UseFavoritesReturn {
  favorites: FavoriteLocation[];
  addFavorite: (location: FavoriteLocation) => void;
  removeFavorite: (locationName: string) => void;
  isFavorite: (locationName: string) => boolean;
  error: string | null;
}

export function useFavorites(): UseFavoritesReturn {
  // This is just a stub - implement the actual hook functionality
  return {
    favorites: [],
    addFavorite: () => {},
    removeFavorite: () => {},
    isFavorite: () => false,
    error: null
  };
}