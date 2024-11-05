import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFavorites } from './useFavorites';
import type { WeatherLocation } from '@/types/Weather.types';

const mockLocation: WeatherLocation = {
  name: 'London',
  region: 'City of London',
  country: 'UK',
  lat: 51.52,
  lon: -0.11,
  tz_id: 'Europe/London',
  localtime_epoch: 1699084800,
  localtime: '2024-11-04 12:00'
};

const mockLocation2: WeatherLocation = {
  ...mockLocation,
  name: 'Paris',
  country: 'France',
  lat: 48.8566,
  lon: 2.3522
};

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());
    
    expect(result.current.favorites).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should add a favorite location', () => {
    const { result } = renderHook(() => useFavorites());
    let addResult = false;

    act(() => {
      addResult = result.current.addFavorite(mockLocation);
    });

    expect(addResult).toBe(true);
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]).toEqual(mockLocation);
    expect(result.current.error).toBeNull();
  });

  it('should prevent duplicate favorites', () => {
    const { result } = renderHook(() => useFavorites());
    let firstAdd = false;
    let secondAdd = false;

    // First addition should succeed
    act(() => {
      firstAdd = result.current.addFavorite(mockLocation);
    });
    
    expect(firstAdd).toBe(true);
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.error).toBeNull();

    // Second addition of same location should fail
    act(() => {
      secondAdd = result.current.addFavorite(mockLocation);
    });

    expect(secondAdd).toBe(false);
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.error).toBe('Location already in favorites');
  });

  it('should enforce maximum favorites limit', () => {
    const maxFavorites = 2;
    const { result } = renderHook(() => useFavorites({ maxFavorites }));
    let firstAdd = false;
    let secondAdd = false;
    let thirdAdd = false;

    // First two additions should succeed
    act(() => {
      firstAdd = result.current.addFavorite(mockLocation);
      secondAdd = result.current.addFavorite(mockLocation2);
    });

    expect(firstAdd).toBe(true);
    expect(secondAdd).toBe(true);
    expect(result.current.favorites).toHaveLength(2);
    expect(result.current.error).toBeNull();

    // Third addition should fail
    act(() => {
      thirdAdd = result.current.addFavorite({ ...mockLocation, name: 'Berlin' });
    });

    expect(thirdAdd).toBe(false);
    expect(result.current.favorites).toHaveLength(maxFavorites);
    expect(result.current.error).toBe(`Cannot add more than ${maxFavorites} favorites`);
  });

  it('should remove a favorite location', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(mockLocation);
      result.current.addFavorite(mockLocation2);
    });

    expect(result.current.favorites).toHaveLength(2);

    act(() => {
      result.current.removeFavorite(`${mockLocation.name}-${mockLocation.country}`);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]).toEqual(mockLocation2);
    expect(result.current.error).toBeNull();
  });

  it('should check if location is favorite', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(mockLocation);
    });

    expect(result.current.isFavorite(`${mockLocation.name}-${mockLocation.country}`)).toBe(true);
    expect(result.current.isFavorite(`${mockLocation2.name}-${mockLocation2.country}`)).toBe(false);
  });

  it('should clear all favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(mockLocation);
      result.current.addFavorite(mockLocation2);
    });

    expect(result.current.favorites).toHaveLength(2);

    act(() => {
      result.current.clearFavorites();
    });

    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  it('should persist favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(mockLocation);
    });

    const stored = localStorage.getItem('weather_favorites');
    expect(stored).toBeDefined();
    expect(JSON.parse(stored!)).toEqual([mockLocation]);
  });

  it('should handle localStorage errors gracefully', () => {
    const mockError = new Error('Storage error');
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => { throw mockError; });

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite(mockLocation);
    });

    expect(result.current.error).toBe('Failed to save favorites');

    // Restore original implementation
    Storage.prototype.setItem = originalSetItem;
  });
});