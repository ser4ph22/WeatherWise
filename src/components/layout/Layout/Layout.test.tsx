// src/components/layout/Layout/Layout.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Layout } from './Layout';

// Move imports after mock definition
vi.mock('@/services/weatherService', () => ({
  weatherService: {
    getCurrentWeather: vi.fn(),
    getForecast: vi.fn(),
  },
  WeatherService: {
    isValidLocation: vi.fn().mockReturnValue(true),
    getCurrentLocation: vi.fn(),
  }
}));

// Import after mock
import { weatherService, WeatherService } from '@/services/weatherService';

const mockWeatherData = {
  location: {
    name: 'London',
    country: 'UK',
    region: 'City of London',
    lat: 51.52,
    lon: -0.11,
    tz_id: 'Europe/London',
    localtime_epoch: 1635777600,
    localtime: '2021-11-01 12:00'
  },
  current: {
    temp_c: 15,
    temp_f: 59,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      code: 1003
    },
    humidity: 72,
    wind_kph: 15,
    wind_mph: 9.3,
    last_updated: '2021-11-01 12:00',
    last_updated_epoch: 1635777600,
    is_day: 1,
    wind_degree: 280,
    wind_dir: 'W',
    pressure_mb: 1015,
    pressure_in: 29.98,
    precip_mm: 0,
    precip_in: 0,
    cloud: 75,
    feelslike_c: 14,
    feelslike_f: 57.2,
    vis_km: 10,
    vis_miles: 6,
    uv: 4,
    gust_mph: 12.5,
    gust_kph: 20.2
  }
};

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the search form', () => {
    render(<Layout />);
    expect(screen.getByRole('search', { name: /weather-search/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter city name/i)).toBeInTheDocument();
  });

  it('handles successful weather search', async () => {
    vi.mocked(weatherService.getCurrentWeather).mockResolvedValueOnce(mockWeatherData);
    
    render(<Layout />);
    
    const input = screen.getByPlaceholderText(/enter city name/i);
    const form = screen.getByRole('search');
    
    await userEvent.type(input, 'London');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(weatherService.getCurrentWeather).toHaveBeenCalledWith('London');
      expect(screen.getByText(/15°/i)).toBeInTheDocument();
      expect(screen.getByText(/partly cloudy/i)).toBeInTheDocument();
    });
  });

  it('handles weather search error', async () => {
    const errorMessage = 'City not found';
    vi.mocked(weatherService.getCurrentWeather).mockRejectedValueOnce(
      new Error(errorMessage)
    );
    
    render(<Layout />);
    
    const input = screen.getByPlaceholderText(/enter city name/i);
    const form = screen.getByRole('search');
    
    await userEvent.type(input, 'NonExistentCity');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(weatherService.getCurrentWeather).toHaveBeenCalledWith('NonExistentCity');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('enables current location search', async () => {
    vi.mocked(WeatherService.getCurrentLocation).mockResolvedValueOnce({
      latitude: 51.52,
      longitude: -0.11
    });
    vi.mocked(weatherService.getCurrentWeather).mockResolvedValueOnce(mockWeatherData);

    render(<Layout />);
    
    const locationButton = screen.getByRole('button', { name: /use current location/i });
    await userEvent.click(locationButton);

    await waitFor(() => {
      expect(WeatherService.getCurrentLocation).toHaveBeenCalled();
      expect(weatherService.getCurrentWeather).toHaveBeenCalledWith('51.52,-0.11');
    });
  });
});