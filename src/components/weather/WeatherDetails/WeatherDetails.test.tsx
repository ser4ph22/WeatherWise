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
    
    // Test keyboard - Enter
    fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' });
    expect(onToggleExpand).toHaveBeenCalledTimes(2);
    
    // Test keyboard - Space
    fireEvent.keyDown(header, { key: ' ', code: 'Space' });
    expect(onToggleExpand).toHaveBeenCalledTimes(3);
  });

  it('displays all weather metrics with correct icons', () => {
    render(<WeatherDetails weather={mockWeatherData} expanded={true} />);
    
    const metrics = [
      { label: 'Wind', value: '8 km/h N' },
      { label: 'Humidity', value: '65%' },
      { label: 'Pressure', value: '1015 mb' },
      { label: 'Feels Like', value: '18°C' },
      { label: 'UV Index', value: '5' },
      { label: 'Visibility', value: '10 km' }
    ];

    metrics.forEach(({ label, value }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('applies correct ARIA attributes when expanded/collapsed', () => {
    const { rerender } = render(
      <WeatherDetails 
        weather={mockWeatherData} 
        expanded={false}
      />
    );

    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <WeatherDetails 
        weather={mockWeatherData} 
        expanded={true}
      />
    );

    expect(region).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies transition classes correctly', () => {
    const { container } = render(
      <WeatherDetails 
        weather={mockWeatherData} 
        expanded={true}
      />
    );

    const content = container.querySelector('#weather-details-content');
    expect(content).toHaveClass('opacity-100');
    expect(content).not.toHaveClass('h-0');
  });

  it('has interactive hover states on metric cards', () => {
    render(
      <WeatherDetails 
        weather={mockWeatherData} 
        expanded={true}
      />
    );

    const cards = screen.getAllByRole('group');
    cards.forEach(card => {
      expect(card).toHaveClass('hover:shadow-md');
      expect(card).toHaveClass('hover:-translate-y-0.5');
    });
  });
});