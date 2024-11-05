import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WeatherDetails } from './WeatherDetails';
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
    temp_c: 18,
    temp_f: 64.4,
    is_day: 1,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      code: 1003
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

describe('WeatherDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with metric units by default', () => {
    render(<WeatherDetails weather={mockWeatherData} />);
    
    expect(screen.getByText(/8 km\/h/)).toBeInTheDocument();
    expect(screen.getByText(/N 350°/)).toBeInTheDocument();
    expect(screen.getByText(/0 mm/)).toBeInTheDocument();
  });

  it('renders with imperial units when specified', () => {
    render(<WeatherDetails weather={mockWeatherData} units="imperial" />);
    
    expect(screen.getByText(/5 mph/)).toBeInTheDocument();
    expect(screen.getByText(/N 350°/)).toBeInTheDocument();
    expect(screen.getByText(/0 in/)).toBeInTheDocument();
  });

  it('displays all weather metrics with correct icons', () => {
    render(<WeatherDetails weather={mockWeatherData} />);
    
    expect(screen.getByText('Wind')).toBeInTheDocument();
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('Cloud Cover')).toBeInTheDocument();
    expect(screen.getByText('UV Index')).toBeInTheDocument();
    expect(screen.getByText('Precipitation')).toBeInTheDocument();

    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('handles both click and keyboard interactions', () => {
    render(<WeatherDetails weather={mockWeatherData} />);
    const buttons = screen.getAllByRole('button');

    buttons.forEach(button => {
      fireEvent.click(button);
      expect(button).toHaveClass('bg-gray-50');

      fireEvent.keyPress(button, { key: 'Enter', code: 'Enter' });
      expect(button).toHaveClass('bg-gray-50');
    });
  });

  it('applies correct ARIA attributes when expanded/collapsed', () => {
    const { container } = render(<WeatherDetails weather={mockWeatherData} />);
    
    const region = container.querySelector('[role="region"]');
    expect(region).toHaveAttribute('aria-label', 'Weather details');
  });

  it('applies transition classes correctly', () => {
    const { container } = render(<WeatherDetails weather={mockWeatherData} />);
    
    const card = container.querySelector('[role="region"]');
    expect(card).toHaveClass('transition-all', 'duration-300');
  });

  it('has interactive hover states on metric cards', () => {
    render(<WeatherDetails weather={mockWeatherData} />);
    const buttons = screen.getAllByRole('button');

    buttons.forEach(button => {
      fireEvent.mouseEnter(button);
      expect(button).toHaveClass('bg-gray-50');
      
      fireEvent.mouseLeave(button);
      expect(button).toHaveClass('bg-gray-50');
    });
  });
});