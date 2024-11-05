// src/components/weather/WeatherDisplay/WeatherDisplay.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeatherDisplay } from './WeatherDisplay';
import type { WeatherResponse } from '@/types/Weather.types';

const mockWeatherData: WeatherResponse = {
  location: {
    name: 'London',
    region: 'City of London',
    country: 'UK',
    lat: 51.52,
    lon: -0.11,
    tz_id: 'Europe/London',
    localtime_epoch: 1699084800,
    localtime: '2024-11-04 12:00'
  },
  current: {
    last_updated_epoch: 1699084800,
    last_updated: '2024-11-04 12:00',
    temp_c: 20,
    temp_f: 68,
    is_day: 1,
    condition: {
      text: 'Sunny',
      icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
      code: 1000
    },
    wind_mph: 5,
    wind_kph: 8,
    wind_degree: 350,
    wind_dir: 'N',
    pressure_mb: 1015,
    pressure_in: 29.77,
    precip_mm: 0,
    precip_in: 0,
    humidity: 65,
    cloud: 20,
    feelslike_c: 18,
    feelslike_f: 64.4,
    vis_km: 10,
    vis_miles: 6,
    uv: 5,
    gust_mph: 7,
    gust_kph: 11.2
  }
};

describe('WeatherDisplay', () => {
  it('renders weather information correctly', () => {
    render(
      <WeatherDisplay 
        weather={mockWeatherData}
      />
    );

    expect(screen.getByText('London, UK')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
  });

  it('handles unit toggle correctly', () => {
    const onUnitToggle = vi.fn();
    render(
      <WeatherDisplay 
        weather={mockWeatherData}
        units="metric"
        onUnitToggle={onUnitToggle}
      />
    );

    const toggleButton = screen.getByText('Switch to °F');
    fireEvent.click(toggleButton);
    expect(onUnitToggle).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(
      <WeatherDisplay 
        weather={mockWeatherData}
        isLoading={true}
      />
    );

    expect(screen.queryByText('London, UK')).not.toBeInTheDocument();
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('displays additional metrics correctly', () => {
    render(
      <WeatherDisplay 
        weather={mockWeatherData}
      />
    );

    expect(screen.getByText('10 km')).toBeInTheDocument();
    expect(screen.getByText('1015 mb')).toBeInTheDocument();
  });
});