import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherContainer } from './WeatherContainer';
import { useWeather } from '@/hooks/useWeather';
import type { WeatherResponse } from '@/types/Weather.types';

// Mock the useWeather hook
vi.mock('@/hooks/useWeather', () => ({
  useWeather: vi.fn()
}));

// Mock the WeatherDisplay component
vi.mock('../WeatherDisplay', () => ({
  WeatherDisplay: vi.fn().mockImplementation((props) => (
    <div data-testid="weather-display">
      <div>Mock WeatherDisplay</div>
      <button onClick={props.onUnitToggle}>Toggle Units</button>
    </div>
  ))
}));

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

describe('WeatherContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to fetch weather data';
    vi.mocked(useWeather).mockReturnValue({
      current: null,
      forecast: null,
      isLoading: false,
      error: errorMessage,
      units: 'metric',
      toggleUnits: vi.fn(),
      getCurrentLocation: vi.fn(),
      fetchWeather: vi.fn(),
      clearWeather: vi.fn()
    });

    render(<WeatherContainer />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders empty state with location button', () => {
    vi.mocked(useWeather).mockReturnValue({
      current: null,
      forecast: null,
      isLoading: false,
      error: null,
      units: 'metric',
      toggleUnits: vi.fn(),
      getCurrentLocation: vi.fn(),
      fetchWeather: vi.fn(),
      clearWeather: vi.fn()
    });

    render(<WeatherContainer />);
    expect(screen.getByText('Enter a location to see weather details')).toBeInTheDocument();
  });

  it('calls getCurrentLocation when button is clicked', () => {
    const getCurrentLocation = vi.fn();
    vi.mocked(useWeather).mockReturnValue({
      current: null,
      forecast: null,
      isLoading: false,
      error: null,
      units: 'metric',
      toggleUnits: vi.fn(),
      getCurrentLocation,
      fetchWeather: vi.fn(),
      clearWeather: vi.fn()
    });

    render(<WeatherContainer />);
    const button = screen.getByText('Use Current Location');
    fireEvent.click(button);
    expect(getCurrentLocation).toHaveBeenCalled();
  });

  it('passes correct props to WeatherDisplay', () => {
    const toggleUnits = vi.fn();

    vi.mocked(useWeather).mockReturnValue({
      current: mockWeatherData,
      forecast: null,
      isLoading: false,
      error: null,
      units: 'metric',
      toggleUnits,
      getCurrentLocation: vi.fn(),
      fetchWeather: vi.fn(),
      clearWeather: vi.fn()
    });

    render(<WeatherContainer />);
    
    const weatherDisplay = screen.getByTestId('weather-display');
    expect(weatherDisplay).toBeInTheDocument();

    // Test unit toggle
    const toggleButton = screen.getByText('Toggle Units');
    fireEvent.click(toggleButton);
    expect(toggleUnits).toHaveBeenCalled();
  });
});