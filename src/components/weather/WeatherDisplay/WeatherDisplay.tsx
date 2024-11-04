import React from 'react';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { WeatherDisplayProps } from '@/types/Weather.types';
import { Card } from '@/components/ui/Card';

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  weather,
  units = 'metric',
  onUnitToggle,
  isLoading = false,
}) => {
  const { current, location } = weather;
  const temperature = units === 'metric' ? current.temp_c : current.temp_f;
  const feelsLike = units === 'metric' ? current.feelslike_c : current.feelslike_f;
  const windSpeed = units === 'metric' ? current.wind_kph : current.wind_mph;

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="p-6 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Location and Time */}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">
            {location.name}, {location.country}
          </h2>
          <p className="text-sm text-gray-500">
            Last updated: {current.last_updated}
          </p>
        </div>

        {/* Temperature and Condition */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={current.condition.icon} 
              alt={current.condition.text}
              className="w-16 h-16"
            />
            <div>
              <div className="text-4xl font-bold">
                {temperature}°{units === 'metric' ? 'C' : 'F'}
              </div>
              <div className="text-gray-500">{current.condition.text}</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onUnitToggle}
            className="ml-4"
          >
            Switch to {units === 'metric' ? '°F' : '°C'}
          </Button>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Feels Like</div>
              <div className="font-medium">
                {feelsLike}°{units === 'metric' ? 'C' : 'F'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Wind className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Wind</div>
              <div className="font-medium">
                {windSpeed} {units === 'metric' ? 'km/h' : 'mph'} {current.wind_dir}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Humidity</div>
              <div className="font-medium">{current.humidity}%</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Cloud Cover</div>
              <div className="font-medium">{current.cloud}%</div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <div className="text-sm text-gray-500">Visibility</div>
            <div className="font-medium">
              {units === 'metric' ? current.vis_km + ' km' : current.vis_miles + ' mi'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Pressure</div>
            <div className="font-medium">
              {current.pressure_mb} mb
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};