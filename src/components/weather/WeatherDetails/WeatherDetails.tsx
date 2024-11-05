import React from 'react';
import { Card } from '@/components/ui/Card';
import { Wind, Droplets, Gauge, Sun, Thermometer, Eye } from 'lucide-react';
import type { CurrentWeather } from '@/types/Weather.types';

export interface WeatherDetailsProps {
  weather: CurrentWeather;
  units?: 'metric' | 'imperial';
  className?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  weather,
  units = 'metric',
  className = '',
  expanded = false,
  onToggleExpand
}) => {
  const {
    wind_kph,
    wind_mph,
    wind_dir,
    humidity,
    pressure_mb,
    pressure_in,
    feelslike_c,
    feelslike_f,
    uv,
    vis_km,
    vis_miles
  } = weather;

  const detailItems = [
    {
      icon: <Wind className="w-5 h-5" />,
      label: 'Wind',
      value: units === 'metric' 
        ? `${wind_kph} km/h ${wind_dir}`
        : `${wind_mph} mph ${wind_dir}`,
      id: 'wind'
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: 'Humidity',
      value: `${humidity}%`,
      id: 'humidity'
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      label: 'Pressure',
      value: units === 'metric'
        ? `${pressure_mb} mb`
        : `${pressure_in} in`,
      id: 'pressure'
    },
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: 'Feels Like',
      value: units === 'metric'
        ? `${feelslike_c}°C`
        : `${feelslike_f}°F`,
      id: 'feels-like'
    },
    {
      icon: <Sun className="w-5 h-5" />,
      label: 'UV Index',
      value: uv.toString(),
      id: 'uv'
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: 'Visibility',
      value: units === 'metric'
        ? `${vis_km} km`
        : `${vis_miles} mi`,
      id: 'visibility'
    }
  ];

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 ${className}`}
      role="region"
      aria-label="Weather details"
      aria-expanded={expanded}
    >
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onToggleExpand?.();
          }
        }}
        aria-controls="weather-details-content"
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Gauge className="w-5 h-5" />
          Detailed Weather Information
        </h3>
      </div>

      <div 
        id="weather-details-content"
        className={`grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 ${
          expanded ? 'block' : 'hidden'
        }`}
      >
        {detailItems.map(({ icon, label, value, id }) => (
          <div 
            key={id}
            className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm"
            role="group"
            aria-labelledby={`weather-detail-${id}`}
          >
            {icon}
            <div className="flex flex-col">
              <span 
                id={`weather-detail-${id}`}
                className="text-sm text-gray-600"
              >
                {label}
              </span>
              <span className="font-medium">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};