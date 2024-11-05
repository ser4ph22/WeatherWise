// src/components/weather/WeatherContainer/WeatherContainer.tsx
import React, { useState, useCallback } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
import { ForecastDisplay } from '@/components/weather/ForecastDisplay';
import { WeatherDetails } from '@/components/weather/WeatherDetails';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface WeatherContainerProps {
  location?: string;
  className?: string;
}

export const WeatherContainer: React.FC<WeatherContainerProps> = ({
  location,
  className
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
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

  const handleDaySelect = useCallback((date: string) => {
    setSelectedDate(prevDate => prevDate === date ? null : date);
  }, []);

  const handleToggleDetails = useCallback(() => {
    setDetailsExpanded(prev => !prev);
  }, []);

  if (error) {
    return (
      <Card className="p-6 text-center bg-red-50">
        <p className="text-red-600" role="alert">{error}</p>
        <Button 
          onClick={getCurrentLocation}
          className="mt-4"
        >
          Try Using Current Location
        </Button>
      </Card>
    );
  }

  if (!current && !isLoading) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">
          Enter a location to see weather details
        </p>
        <Button 
          onClick={getCurrentLocation}
          className="mt-4"
        >
          Use Current Location
        </Button>
      </Card>
    );
  }

  return (
    <div 
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
            isLoading={isLoading}
          />
          {!isLoading && (
            <WeatherDetails
              weather={current.current}
              units={units}
              expanded={detailsExpanded}
              onToggleExpand={handleToggleDetails}
              className="mt-4"
            />
          )}
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
    </div>
  );
};