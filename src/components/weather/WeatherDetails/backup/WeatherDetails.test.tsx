import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WeatherDetails } from './WeatherDetails';
import type { CurrentWeather } from '@/types/Weather.types';

const mockWeatherData: CurrentWeather = {
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
};

describe('WeatherDetails', () => {
  it('renders with metric units by default', () => {
    render(<WeatherDetails weather={mockWeatherData} />);
    
    expect(screen.getByText('8 km/h N')).toBeInTheDocument();
    expect(screen.getByText('1015 mb')).toBeInTheDocument();
    expect(screen.getByText('10 km')).toBeInTheDocument();
  });

  it('renders with imperial units when specified', () => {
    render(<WeatherDetails weather={mockWeatherData} units="imperial" />);
    
    expect(screen.getByText('5 mph N')).toBeInTheDocument();
    expect(screen.getByText('29.77 in')).toBeInTheDocument();
    expect(screen.getByText('6 mi')).toBeInTheDocument();
  });

  it('toggles expanded state when clicked', () => {
    const onToggleExpand = vi.fn();
    render(
      <WeatherDetails 
        weather={mockWeatherData} 
        expanded={false}
        onToggleExpand={onToggleExpand}
      />
    );

    const header = screen.getByRole('button');
    fireEvent.click(header);
    
    expect(onToggleExpand).toHaveBeenCalled();
  });

  it('supports keyboard interaction for expansion toggle', () => {
    const onToggleExpand = vi.fn();
    render(
      <WeatherDetails 
        weather={mockWeatherData} 
        expanded={false}
        onToggleExpand={onToggleExpand}
      />
    );
  
    const header = screen.getByRole('button');
    
    // Test Enter key
    fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' });
    expect(onToggleExpand).toHaveBeenCalledTimes(1);
    
    // Test Space key
    fireEvent.keyDown(header, { key: ' ', code: 'Space' });
    expect(onToggleExpand).toHaveBeenCalledTimes(2);
  });

  it('handles both click and keyboard interactions', () => {
    const onToggleExpand = vi.fn();
    render(
      <WeatherDetails 
        weather={mockWeatherData} 
        expanded={false}
        onToggleExpand={onToggleExpand}
      />
    );
  
    const header = screen.getByRole('button');
    
    // Test click
    fireEvent.click(header);
    expect(onToggleExpand).toHaveBeenCalledTimes(1);
    
    // Test keyboard
    fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' });
    expect(onToggleExpand).toHaveBeenCalledTimes(2);
  });

  it('displays all weather metrics', () => {
    render(<WeatherDetails weather={mockWeatherData} expanded={true} />);
    
    expect(screen.getByText('Wind')).toBeInTheDocument();
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('Pressure')).toBeInTheDocument();
    expect(screen.getByText('Feels Like')).toBeInTheDocument();
    expect(screen.getByText('UV Index')).toBeInTheDocument();
    expect(screen.getByText('Visibility')).toBeInTheDocument();
  });

  it('sets correct ARIA attributes', () => {
    render(<WeatherDetails weather={mockWeatherData} expanded={true} />);
    
    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-label', 'Weather details');
    expect(region).toHaveAttribute('aria-expanded', 'true');
  });
});