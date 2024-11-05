import { useState, useCallback, useEffect } from 'react';
import type { WeatherLocation } from '@/types/Weather.types';

interface UseFavoritesOptions {
  maxFavorites?: number;
  storageKey?: string;
}

interface UseFavoritesReturn {
  favorites: WeatherLocation[];
  addFavorite: (location: WeatherLocation) => boolean;
  removeFavorite: (locationId: string) => void;
  isFavorite: (locationId: string) => boolean;
  clearFavorites: () => void;
  error: string | null;
}

const DEFAULT_MAX_FAVORITES = 10;
const DEFAULT_STORAGE_KEY = 'weather_favorites';

export function useFavorites({
  maxFavorites = DEFAULT_MAX_FAVORITES,
  storageKey = DEFAULT_STORAGE_KEY
}: UseFavoritesOptions = {}): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<WeatherLocation[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
      setError(null);
    } catch (error) {
      console.error('Error saving favorites:', error);
      setError('Failed to save favorites');
    }
  }, [favorites, storageKey]);

  const addFavorite = useCallback((location: WeatherLocation): boolean => {
    let success = true;

    setFavorites(current => {
      // Check if location already exists
      if (current.some(fav => fav.name === location.name && fav.country === location.country)) {
        setError('Location already in favorites');
        success = false;
        return current;
      }

      // Check max favorites limit
      if (current.length >= maxFavorites) {
        setError(`Cannot add more than ${maxFavorites} favorites`);
        success = false;
        return current;
      }

      // If we get here, we can add the favorite
      setError(null);
      return [...current, location];
    });

    return success;
  }, [maxFavorites]);

  const removeFavorite = useCallback((locationId: string) => {
    setError(null);
    setFavorites(current => 
      current.filter(location => `${location.name}-${location.country}` !== locationId)
    );
  }, []);

  const isFavorite = useCallback((locationId: string) => {
    return favorites.some(
      location => `${location.name}-${location.country}` === locationId
    );
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setError(null);
    setFavorites([]);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    error
  };
}