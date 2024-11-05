import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Cloud, Droplets, Sun, ThermometerSun, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ForecastResponse } from '@/types/Weather.types';

interface ForecastDayData {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    daily_chance_of_rain: number;
    condition: {
      text: string;
      code: number;
    };
  };
}

interface ForecastDisplayProps {
  forecast: ForecastResponse;
  units?: 'metric' | 'imperial';
  isLoading?: boolean;
  onDaySelect?: (date: string) => void;
  className?: string;
}

const ForecastDisplay: React.FC<ForecastDisplayProps> = ({
    forecast,
    units = 'metric',
    isLoading = false,
    onDaySelect,
    className
  }) => {
    if (isLoading) {
      return (
        <div className="w-full space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card 
              key={i} 
              className="w-full animate-pulse bg-gray-100"
              role="article"
              aria-label="Loading forecast"
            >
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
      );
    }

  if (!forecast?.forecast?.forecastday) {
    return null;
  }

  const getWeatherIcon = (code: number) => {
    // Basic weather icon mapping
    switch (true) {
      case code === 1000: return <Sun className="w-6 h-6 text-yellow-500" />;
      case code >= 1003 && code <= 1009: return <Cloud className="w-6 h-6 text-gray-500" />;
      case code >= 1180 && code <= 1201: return <Droplets className="w-6 h-6 text-blue-500" />;
      default: return <Cloud className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {forecast.forecast.forecastday.map((day: ForecastDayData) => (
        <Card 
          key={day.date}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onDaySelect?.(day.date)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onDaySelect?.(day.date);
            }
          }}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              {getWeatherIcon(day.day.condition.code)}
              <div>
                <p className="font-medium">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                <p className="text-sm text-gray-500">{day.day.condition.text}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{day.day.daily_chance_of_rain}%</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <ThermometerSun className="w-4 h-4 text-red-500" />
                <span>{units === 'metric' ? `${day.day.maxtemp_c}°C` : `${day.day.maxtemp_f}°F`}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-blue-500" />
                <span>{units === 'metric' ? `${day.day.mintemp_c}°C` : `${day.day.mintemp_f}°F`}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ForecastDisplay;