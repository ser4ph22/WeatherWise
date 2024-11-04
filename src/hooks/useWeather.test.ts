// src/hooks/useWeather.test.ts

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWeather } from './useWeather';
import type { WeatherResponse, ForecastResponse } from '@/types/Weather.types';

// Mock setup must be before any other code
vi.mock('@/services/weatherService', () => {
  return {
    weatherService: {
      getCurrentWeather: vi.fn(),
      getForecast: vi.fn(),
    },
    WeatherService: {
      isValidLocation: vi.fn().mockReturnValue(true),
      getCurrentLocation: vi.fn(),
      getInstance: vi.fn(),
    }
  };
});

// Import the mocked module after the mock definition
import { weatherService, WeatherService } from '@/services/weatherService';

const mockWeatherData: WeatherResponse = {
  location: {
    name: 'London',
    region: 'City of London',
    country: 'UK',
    lat: 51.52,
    lon: -0.11,
    tz_id: 'Europe/London',
    localtime_epoch: 1699084800,
    localtime: '2024-11-04 12:00'
  },
  current: {
    last_updated_epoch: 1699084800,
    last_updated: '2024-11-04 12:00',
    temp_c: 18,
    temp_f: 64.4,
    is_day: 1,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      code: 1003
    },
    wind_mph: 5,
    wind_kph: 8,
    wind_degree: 350,
    wind_dir: 'N',
    pressure_mb: 1015,
    pressure_in: 29.77,
    precip_mm: 0,
    precip_in: 0,
    humidity: 65,
    cloud: 20,
    feelslike_c: 18,
    feelslike_f: 64.4,
    vis_km: 10,
    vis_miles: 6,
    uv: 5,
    gust_mph: 7,
    gust_kph: 11.2
  }
};

const mockForecastData: ForecastResponse = {
  ...mockWeatherData,
  forecast: {
    forecastday: [{
      date: '2024-11-04',
      date_epoch: 1699084800,
      day: {
        maxtemp_c: 20,
        maxtemp_f: 68,
        mintemp_c: 15,
        mintemp_f: 59,
        avgtemp_c: 17.5,
        avgtemp_f: 63.5,
        maxwind_mph: 8,
        maxwind_kph: 12.9,
        totalprecip_mm: 0,
        totalprecip_in: 0,
        totalsnow_cm: 0,
        avgvis_km: 10,
        avgvis_miles: 6,
        avghumidity: 65,
        daily_will_it_rain: 0,
        daily_chance_of_rain: 0,
        daily_will_it_snow: 0,
        daily_chance_of_snow: 0,
        condition: {
          text: 'Sunny',
          icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
          code: 1000
        },
        uv: 5
      },
      hour: [],
      astro: {
        sunrise: '07:00 AM',
        sunset: '04:30 PM',
        moonrise: '09:00 PM',
        moonset: '02:00 PM',
        moon_phase: 'Waning Gibbous',
        moon_illumination: '75',
        is_moon_up: 0,
        is_sun_up: 1
      }
    }]
  }
};

describe('useWeather', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(weatherService.getCurrentWeather).mockResolvedValue(mockWeatherData);
    vi.mocked(weatherService.getForecast).mockResolvedValue(mockForecastData);
    vi.mocked(WeatherService.isValidLocation).mockReturnValue(true);
    vi.mocked(WeatherService.getCurrentLocation).mockResolvedValue({
      latitude: 51.52,
      longitude: -0.11
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWeather());
    
    expect(result.current.current).toBeNull();
    expect(result.current.forecast).toBeNull();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();
    expect(result.current.units).toBe('metric');
  });

  it('should fetch weather data when location is provided', async () => {
    const { result } = renderHook(() => useWeather({ location: 'London' }));

    expect(result.current.isLoading).toBeTruthy();

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.current).toEqual(mockWeatherData);
    expect(result.current.forecast).toEqual(mockForecastData);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  it('should handle invalid locations', async () => {
    vi.mocked(WeatherService.isValidLocation).mockReturnValue(false);
    
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      result.current.fetchWeather('invalid');
    });

    expect(result.current.error).toBe('Please enter a valid location');
    expect(weatherService.getCurrentWeather).not.toHaveBeenCalled();
  });

  it('should handle empty location', async () => {
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      result.current.fetchWeather('');
    });

    expect(result.current.error).toBe('Please enter a valid location');
    expect(weatherService.getCurrentWeather).not.toHaveBeenCalled();
  });

  it('should fetch current location weather', async () => {
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.getCurrentLocation();
    });

    expect(result.current.current).toEqual(mockWeatherData);
    expect(result.current.error).toBeNull();
  });

  it('should handle geolocation errors', async () => {
    vi.mocked(WeatherService.getCurrentLocation).mockRejectedValueOnce(
      new Error('Geolocation permission denied')
    );

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.getCurrentLocation();
    });

    expect(result.current.error).toBe(
      'Failed to get current location. Please enter location manually.'
    );
  });

  it('should toggle temperature units', async () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.units).toBe('metric');

    act(() => {
      result.current.toggleUnits();
    });

    expect(result.current.units).toBe('imperial');
  });

  it('should use cached data when available', async () => {
    localStorage.setItem(
      'weather_cache_london',
      JSON.stringify({
        timestamp: Date.now(),
        data: { current: mockWeatherData, forecast: mockForecastData }
      })
    );

    const { result } = renderHook(() => useWeather({ location: 'London' }));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.current).toEqual(mockWeatherData);
    expect(weatherService.getCurrentWeather).not.toHaveBeenCalled();
  });
});