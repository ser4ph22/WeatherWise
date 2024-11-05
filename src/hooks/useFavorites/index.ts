import { useState, useCallback } from 'react';
import type { FavoriteLocation } from '@/types/Weather.types';

const FAVORITES_KEY = 'weather_favorites';
const MAX_FAVORITES = 10;

export interface UseFavoritesReturn {
  favorites: FavoriteLocation[];
  addFavorite: (location: FavoriteLocation) => void;
  removeFavorite: (locationName: string) => void;
  isFavorite: (locationName: string) => boolean;
  error: string | null;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  });

  const [error, setError] = useState<string | null>(null);

  const addFavorite = useCallback((location: FavoriteLocation) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.name === location.name)) {
        return prev;
      }
      if (prev.length >= MAX_FAVORITES) {
        setError('Maximum number of favorites reached');
        return prev;
      }
      const newFavorites = [...prev, location];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        setError(null);
      } catch (error) {
        console.error('Error saving favorite:', error);
        setError('Failed to save favorite');
        return prev;
      }
      return newFavorites;
    });
  }, []);

  const removeFavorite = useCallback((locationName: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(fav => fav.name !== locationName);
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        setError(null);
      } catch (error) {
        console.error('Error removing favorite:', error);
        setError('Failed to remove favorite');
        return prev;
      }
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((locationName: string) => {
    return favorites.some(fav => fav.name === locationName);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite, error };
}
