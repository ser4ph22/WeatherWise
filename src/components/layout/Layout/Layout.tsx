// src/components/layout/Layout/Layout.tsx

import React, { useState } from 'react';
import { Header } from '../Header';
import { WeatherSearch } from '../../weather/WeatherSearch';
import { WeatherService } from '../../../services/weatherService';
import type { WeatherResponse } from '../../../types/Weather.types';

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWeatherSearch = async (location: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await WeatherService.getCurrentWeather(location);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full max-w-md">
            <WeatherSearch 
              onSearch={handleWeatherSearch}
              isLoading={isLoading}
              error={error}
            />
          </div>
          
          {weatherData && !error && (
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {weatherData.location.name}, {weatherData.location.country}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Temperature</p>
                  <p className="text-3xl font-bold">
                    {weatherData.current.temp_c}°C
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Condition</p>
                  <p className="text-xl">
                    {weatherData.current.condition.text}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Humidity</p>
                  <p className="text-xl">
                    {weatherData.current.humidity}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Wind</p>
                  <p className="text-xl">
                    {weatherData.current.wind_kph} km/h
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {children}
        </div>
      </main>
    </div>
  );
};