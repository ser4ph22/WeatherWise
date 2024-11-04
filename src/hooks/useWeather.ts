// src/hooks/useWeather.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import { weatherService, WeatherService, WeatherServiceError } from '@/services/weatherService';
import type { 
  WeatherResponse, 
  ForecastResponse,
  UseWeatherState,
  UseWeatherOptions,
  TemperatureUnit
} from '@/types/Weather.types';

interface CacheData {
  timestamp: number;
  data: {
    current: WeatherResponse | null;
    forecast: ForecastResponse | null;
  };
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const CACHE_PREFIX = 'weather_cache_';

const ERROR_MESSAGES = {
  EMPTY_LOCATION: 'Please enter a valid location',
  INVALID_LOCATION: 'Please enter a valid location',
  FETCH_ERROR: 'Failed to fetch weather data',
  GEOLOCATION_ERROR: 'Failed to get current location. Please enter location manually.'
} as const;

export function useWeather({
  location,
  units = 'metric',
  days = 5,
  enableForecast = true
}: UseWeatherOptions = {}) {
  const [state, setState] = useState<UseWeatherState>({
    current: null,
    forecast: null,
    isLoading: false,
    error: null
  });

  const [preferences, setPreferences] = useState<{
    units: TemperatureUnit;
  }>(() => {
    const saved = localStorage.getItem('weather_preferences');
    return saved ? JSON.parse(saved) : { units };
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const getCacheKey = useCallback((loc: string) => {
    return `${CACHE_PREFIX}${loc.toLowerCase().replace(/\s+/g, '_')}`;
  }, []);

  const getCachedData = useCallback((loc: string): CacheData | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(loc));
      if (cached) {
        const parsedCache: CacheData = JSON.parse(cached);
        if (Date.now() - parsedCache.timestamp < CACHE_DURATION) {
          return parsedCache;
        }
        localStorage.removeItem(getCacheKey(loc));
      }
    } catch (error) {
      console.error('Cache retrieval error:', error);
    }
    return null;
  }, [getCacheKey]);

  const setCachedData = useCallback((
    loc: string, 
    current: WeatherResponse | null, 
    forecast: ForecastResponse | null
  ) => {
    try {
      const cacheData: CacheData = {
        timestamp: Date.now(),
        data: { current, forecast }
      };
      localStorage.setItem(getCacheKey(loc), JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache setting error:', error);
    }
  }, [getCacheKey]);

  const fetchWeather = useCallback(async (searchLocation: string) => {
    // Handle empty location
    if (!searchLocation?.trim()) {
      setState(prev => ({
        ...prev,
        error: ERROR_MESSAGES.EMPTY_LOCATION,
        isLoading: false
      }));
      return;
    }

    // Validate location
    if (!WeatherService.isValidLocation(searchLocation)) {
      setState(prev => ({
        ...prev,
        error: ERROR_MESSAGES.INVALID_LOCATION,
        isLoading: false
      }));
      return;
    }

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check cache first
      const cached = getCachedData(searchLocation);
      if (cached) {
        setState({
          ...cached.data,
          isLoading: false,
          error: null
        });
        return;
      }

      // Fetch fresh data
      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(searchLocation),
        enableForecast ? weatherService.getForecast(searchLocation, days) : Promise.resolve(null)
      ]);

      const newState: UseWeatherState = {
        current: currentData,
        forecast: forecastData,
        isLoading: false,
        error: null
      };

      setCachedData(searchLocation, currentData, forecastData);
      setState(newState);

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof WeatherServiceError 
          ? error.message 
          : ERROR_MESSAGES.FETCH_ERROR
      }));
    }
  }, [days, enableForecast, getCachedData, setCachedData]);

  // Initial fetch effect
  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [location, fetchWeather]);

  const toggleUnits = useCallback(() => {
    const newUnits = preferences.units === 'metric' ? 'imperial' : 'metric';
    setPreferences(prev => ({
      ...prev,
      units: newUnits
    }));
    localStorage.setItem('weather_preferences', JSON.stringify({ units: newUnits }));
  }, [preferences.units]);

  const clearWeather = useCallback(() => {
    setState({
      current: null,
      forecast: null,
      isLoading: false,
      error: null
    });
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const coords = await WeatherService.getCurrentLocation();
      await fetchWeather(`${coords.latitude},${coords.longitude}`);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: ERROR_MESSAGES.GEOLOCATION_ERROR
      }));
    }
  }, [fetchWeather]);

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [location, fetchWeather]);

  return {
    ...state,
    units: preferences.units,
    fetchWeather,
    clearWeather,
    toggleUnits,
    getCurrentLocation,
  };
}