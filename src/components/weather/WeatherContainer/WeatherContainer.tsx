import React, { useState, useCallback } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { useFavorites } from '@/hooks/useFavorites';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
import { ForecastDisplay } from '@/components/weather/ForecastDisplay';
import { FavoriteLocations } from '@/components/weather/FavoriteLocations';
import { WeatherSearch } from '@/components/weather/WeatherSearch';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { FavoriteLocation } from '@/types/Weather.types';

interface WeatherContainerProps {
  location?: string;
  className?: string;
}

export const WeatherContainer: React.FC<WeatherContainerProps> = ({
  location: initialLocation,
  className
}) => {
  const [location, setLocation] = useState<string>(initialLocation || '');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const {
    current,
    forecast,
    isLoading,
    error,
    units,
    toggleUnits,
    getCurrentLocation
  } = useWeather({
    location,
    enableForecast: true
  });

  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    error: favoritesError
  } = useFavorites();

  const handleSearch = useCallback(async (searchLocation: string) => {
    setLocation(searchLocation);
    setSelectedDate(null);
  }, []);

  const handleDaySelect = useCallback((date: string) => {
    setSelectedDate(prevDate => prevDate === date ? null : date);
  }, []);

  const handleFavoriteSelect = useCallback((selectedLocation: FavoriteLocation) => {
    setLocation(selectedLocation.name);
    setSelectedDate(null);
  }, []);

  const handleToggleFavorite = useCallback(() => {
    if (!current?.location) return;
    
    const locationInfo: FavoriteLocation = {
      name: current.location.name,
      lat: current.location.lat,
      lon: current.location.lon,
      region: current.location.region,
      country: current.location.country
    };

    if (isFavorite(locationInfo.name)) {
      removeFavorite(locationInfo.name);
    } else {
      addFavorite(locationInfo);
    }
  }, [current?.location, isFavorite, removeFavorite, addFavorite]);

  const handleCurrentLocation = useCallback(async () => {
    await getCurrentLocation();
    setSelectedDate(null);
  }, [getCurrentLocation]);

  if (error || favoritesError) {
    return (
      <Card className="p-6 text-center bg-red-50">
        <p className="text-red-600" role="alert">{error || favoritesError}</p>
        <Button 
          onClick={handleCurrentLocation}
          className="mt-4"
        >
          Try Using Current Location
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[300px,1fr]">
      <aside className="space-y-6">
        <WeatherSearch 
          onSearch={handleSearch}
          onCurrentLocation={handleCurrentLocation}
          isLoading={isLoading}
          error={error}
        />

        {(!current && !isLoading) && (
          <Card className="p-6 text-center">
            <p className="text-gray-500">
              Enter a location to see weather details
            </p>
            <Button 
              onClick={handleCurrentLocation}
              className="mt-4"
            >
              Use Current Location
            </Button>
          </Card>
        )}

        <FavoriteLocations
          favorites={favorites}
          onSelect={handleFavoriteSelect}
          error={favoritesError}
          className="hidden md:block"
        />
      </aside>

      <main 
        className={`space-y-4 ${className}`} 
        role="region" 
        aria-label="Weather information"
      >
        {current && (
          <Card className="p-6">
            <WeatherDisplay
              weather={current}
              units={units}
              onUnitToggle={toggleUnits}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={current ? isFavorite(current.location.name) : false}
              isLoading={isLoading}
            />
          </Card>
        )}

        {(forecast || isLoading) && (
          <Card className="p-6">
            <ForecastDisplay
              forecast={forecast!}
              units={units}
              isLoading={isLoading}
              onDaySelect={handleDaySelect}
              selectedDate={selectedDate}
            />
          </Card>
        )}
      </main>

      <FavoriteLocations
        favorites={favorites}
        onSelect={handleFavoriteSelect}
        error={favoritesError}
        className="md:hidden"
      />
    </div>
  );
};