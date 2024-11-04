import React from 'react';
import { useWeather } from '@/hooks/useWeather';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
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
  const {
    current,
    isLoading,
    error,
    units,
    toggleUnits,
    getCurrentLocation
  } = useWeather({
    location,
    enableForecast: true
  });

  if (error) {
    return (
      <Card className="p-6 text-center bg-red-50">
        <p className="text-red-600">{error}</p>
        <Button 
          onClick={getCurrentLocation}
          className="mt-4"
        >
          Try Using Current Location
        </Button>
      </Card>
    );
  }

  if (!current) {
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
    <div className={className}>
      <WeatherDisplay
        weather={current}
        units={units}
        onUnitToggle={toggleUnits}
        isLoading={isLoading}
      />
    </div>
  );
};