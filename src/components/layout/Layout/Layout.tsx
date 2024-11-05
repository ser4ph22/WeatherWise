// src/components/layout/Layout/Layout.tsx
import { useState } from 'react';
import { Header } from '../Header';
import { WeatherSearch } from '@/components/weather/WeatherSearch';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
import { weatherService, WeatherService } from '@/services/weatherService';
import type { WeatherResponse } from '@/types/Weather.types';

export const Layout = () => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  const handleSearch = async (location: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await weatherService.getCurrentWeather(location);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const coords = await WeatherService.getCurrentLocation();
      const location = `${coords.latitude},${coords.longitude}`;
      const data = await weatherService.getCurrentWeather(location);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnitToggle = () => {
    setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full max-w-md">
            <WeatherSearch 
              onSearch={handleSearch}
              onCurrentLocation={handleCurrentLocation}
              isLoading={isLoading}
              error={error}
            />
          </div>
          {weatherData && (
            <WeatherDisplay 
              weather={weatherData}
              units={units}
              onUnitToggle={handleUnitToggle}
              isLoading={isLoading}
              className="w-full max-w-md"
            />
          )}
        </div>
      </main>
    </div>
  );
};