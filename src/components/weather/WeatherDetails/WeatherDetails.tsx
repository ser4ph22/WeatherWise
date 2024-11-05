import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Wind, Droplets, Gauge, Sun, Thermometer, Eye, ChevronDown } from 'lucide-react';
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
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [isInitialRender, setIsInitialRender] = useState(true);

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
      id: 'wind',
      color: 'text-blue-500'
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: 'Humidity',
      value: `${humidity}%`,
      id: 'humidity',
      color: 'text-cyan-500'
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      label: 'Pressure',
      value: units === 'metric'
        ? `${pressure_mb} mb`
        : `${pressure_in} in`,
      id: 'pressure',
      color: 'text-purple-500'
    },
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: 'Feels Like',
      value: units === 'metric'
        ? `${feelslike_c}°C`
        : `${feelslike_f}°F`,
      id: 'feels-like',
      color: 'text-red-500'
    },
    {
      icon: <Sun className="w-5 h-5" />,
      label: 'UV Index',
      value: uv.toString(),
      id: 'uv',
      color: 'text-yellow-500'
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: 'Visibility',
      value: units === 'metric'
        ? `${vis_km} km`
        : `${vis_miles} mi`,
      id: 'visibility',
      color: 'text-green-500'
    }
  ];

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  return (
    <Card 
      className={`overflow-hidden transition-shadow duration-300 ${
        expanded ? 'shadow-md' : ''
      } ${className}`}
      role="region"
      aria-label="Weather details"
      aria-expanded={expanded}
    >
      <div 
        className={`
          p-4 cursor-pointer hover:bg-gray-50 
          transition-colors duration-200
          flex items-center justify-between
        `}
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleExpand?.();
          }
        }}
        aria-controls="weather-details-content"
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Gauge className="w-5 h-5" />
          Detailed Weather Information
        </h3>
        <ChevronDown 
          className={`
            w-5 h-5 transition-transform duration-300
            ${expanded ? 'rotate-180' : ''}
          `}
          aria-hidden="true"
        />
      </div>

      <div 
        id="weather-details-content"
        className={`
          grid grid-cols-2 md:grid-cols-3 gap-4 p-4
          transition-all duration-300 ease-in-out
          ${expanded ? 'opacity-100' : 'opacity-0 h-0 p-0'}
          ${isInitialRender ? 'transform-none' : ''}
        `}
        style={{
          height: expanded ? height : 0,
          visibility: expanded ? 'visible' : 'hidden'
        }}
      >
        {detailItems.map(({ icon, label, value, id, color }) => (
          <div 
            key={id}
            className={`
              flex items-center gap-3 p-3
              bg-white rounded-lg shadow-sm
              transform transition-all duration-200
              hover:shadow-md hover:-translate-y-0.5
            `}
            role="group"
            aria-labelledby={`weather-detail-${id}`}
          >
            <div className={`${color}`}>
              {icon}
            </div>
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