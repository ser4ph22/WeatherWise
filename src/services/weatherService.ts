// src/services/weatherService.ts

import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  WeatherResponse,
  ForecastResponse,
  WeatherErrorResponse,
  GeoLocation,
} from '@/types/Weather.types';

class WeatherServiceError extends Error {
  constructor(
    message: string,
    public code?: number,
    public status?: number
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

export class WeatherService {
  private static instance: WeatherService;
  private readonly api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      params: {
        key: import.meta.env.VITE_WEATHER_API_KEY,
      },
      timeout: 10000, // 10 second timeout
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      response => response,
      this.handleError
    );
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * Handles API errors and transforms them into WeatherServiceError
   */
  private handleError(error: AxiosError<WeatherErrorResponse>): never {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const weatherError = error.response.data?.error;
      throw new WeatherServiceError(
        weatherError?.message || 'An error occurred with the weather service',
        weatherError?.code,
        error.response.status
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new WeatherServiceError('No response received from weather service');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new WeatherServiceError('Failed to make weather service request');
    }
  }

  /**
   * Fetches current weather data for a given location
   */
  public async getCurrentWeather(location: string): Promise<WeatherResponse> {
    try {
      const response = await this.api.get<WeatherResponse>('/current.json', {
        params: { q: location },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<WeatherErrorResponse>);
    }
  }

  /**
   * Fetches forecast data for a given location
   */
  public async getForecast(location: string, days: number = 5): Promise<ForecastResponse> {
    try {
      const response = await this.api.get<ForecastResponse>('/forecast.json', {
        params: { q: location, days },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<WeatherErrorResponse>);
    }
  }

  /**
   * Fetches weather data by coordinates
   */
  public async getWeatherByCoordinates(coords: GeoLocation): Promise<WeatherResponse> {
    const location = WeatherService.formatCoordinates(coords);
    return this.getCurrentWeather(location);
  }

  /**
   * Fetches forecast data by coordinates
   */
  public async getForecastByCoordinates(
    coords: GeoLocation,
    days: number = 5
  ): Promise<ForecastResponse> {
    const location = WeatherService.formatCoordinates(coords);
    return this.getForecast(location, days);
  }

  /**
   * Validates a location string
   */
  public static isValidLocation(location: string): boolean {
    const trimmedLocation = location.trim();
    // Basic validation - can be enhanced based on requirements
    return trimmedLocation.length >= 2 && trimmedLocation.length <= 100;
  }

  /**
   * Gets the user's current location
   */
  public static async getCurrentLocation(): Promise<GeoLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Failed to get location: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Determines if the location is coordinates
   */
  public static isCoordinates(location: string): boolean {
    const coords = location.split(',').map(coord => parseFloat(coord.trim()));
    if (coords.length !== 2) return false;
    
    const [lat, lon] = coords;
    return !isNaN(lat) && !isNaN(lon) &&
           lat >= -90 && lat <= 90 &&
           lon >= -180 && lon <= 180;
  }

  /**
   * Formats coordinates to a string
   */
  public static formatCoordinates(coords: GeoLocation): string {
    return `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`;
  }

  /**
   * Clears all weather-related cache
   */
  public static clearCache(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('weather_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Export a singleton instance
export const weatherService = WeatherService.getInstance();

// Export error class for type checking
export { WeatherServiceError };