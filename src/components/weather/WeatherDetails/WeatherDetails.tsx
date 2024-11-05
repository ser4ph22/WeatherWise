import React, { useEffect, useRef, useState } from 'react';
import { Cloud, Droplets, Sun, Thermometer, Wind } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { WeatherResponse } from '@/types/Weather.types';

interface WeatherDetailsProps {
  weather: WeatherResponse;
  units?: 'metric' | 'imperial';
  className?: string;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  weather,
  units = 'metric',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(true); // Default to expanded for better accessibility

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        setExpanded(containerRef.current.scrollHeight > 0);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const metrics = [
    {
      icon: Wind,
      label: 'Wind',
      value: units === 'metric' 
        ? `${weather.current.wind_kph} km/h`
        : `${weather.current.wind_mph} mph`,
      details: `${weather.current.wind_dir} ${weather.current.wind_degree}°`
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.current.humidity}%`,
      details: `Feels like ${units === 'metric' 
        ? `${weather.current.feelslike_c}°C`
        : `${weather.current.feelslike_f}°F`}`
    },
    {
      icon: Cloud,
      label: 'Cloud Cover',
      value: `${weather.current.cloud}%`,
      details: `Visibility ${units === 'metric'
        ? `${weather.current.vis_km} km`
        : `${weather.current.vis_miles} mi`}`
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: weather.current.uv.toString(),
      details: `Pressure ${weather.current.pressure_mb} mb`
    },
    {
      icon: Thermometer,
      label: 'Precipitation',
      value: units === 'metric'
        ? `${weather.current.precip_mm} mm`
        : `${weather.current.precip_in} in`,
      details: `Gust ${units === 'metric'
        ? `${weather.current.gust_kph} km/h`
        : `${weather.current.gust_mph} mph`}`
    }
  ];

  const getMetricColor = (index: number) => {
    const colors = [
      'text-blue-500 dark:text-blue-400',   // Wind
      'text-sky-500 dark:text-sky-400',     // Humidity
      'text-gray-500 dark:text-gray-400',   // Cloud Cover
      'text-yellow-500 dark:text-yellow-400', // UV Index
      'text-red-500 dark:text-red-400'      // Precipitation
    ];
    return colors[index] || colors[0];
  };

  return (
    <Card 
      ref={containerRef}
      role="region"
      aria-label="Weather details"
      className={`overflow-hidden transition-all duration-300 ${className} ${
        expanded ? 'max-h-[800px]' : 'max-h-0'
      }`}
    >
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-5">
        {metrics.map((metric, index) => (
          <button
            key={metric.label}
            type="button"
            className="flex flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-left"
          >
            <metric.icon 
              className={`h-6 w-6 ${getMetricColor(index)}`}
              aria-hidden="true"
            />
            <div className="text-center w-full">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {metric.label}
              </h3>
              <p className="mt-1 text-lg font-semibold">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {metric.details}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};