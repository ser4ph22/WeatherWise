// src/services/weatherService.ts

import axios, { AxiosError } from 'axios';
import type { WeatherResponse, WeatherError } from '../types/Weather.types';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export class WeatherService {
  static async getCurrentWeather(location: string): Promise<WeatherResponse> {
    try {
      const response = await weatherApi.get<WeatherResponse>('/current.json', {
        params: { q: location },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<WeatherError>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message);
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  static isValidLocation(location: string): boolean {
    return location.trim().length >= 2;
  }
}