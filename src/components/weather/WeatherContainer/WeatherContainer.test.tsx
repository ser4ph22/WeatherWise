import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherContainer } from './WeatherContainer';
import { useWeather } from '@/hooks/useWeather';
import { useFavorites } from '@/hooks/useFavorites';
import type { WeatherResponse, ForecastResponse } from '@/types/Weather.types';

// Mock the hooks
vi.mock('@/hooks/useWeather', () => ({
  useWeather: vi.fn()
}));

vi.mock('@/hooks/useFavorites', () => ({
  useFavorites: vi.fn()
}));

// Mock the WeatherDisplay component
vi.mock('../WeatherDisplay', () => ({
  WeatherDisplay: vi.fn().mockImplementation((props) => (
    <div data-testid="weather-display">
      <div>Mock WeatherDisplay</div>
      <button onClick={props.onUnitToggle}>Toggle Units</button>
      <button 
        onClick={props.onToggleFavorite}
        aria-label={props.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {props.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </button>
      {props.isLoading && <div data-testid="weather-loading">Loading...</div>}
    </div>
  ))
}));

// Mock the ForecastDisplay component
vi.mock('../ForecastDisplay', () => ({
  ForecastDisplay: vi.fn().mockImplementation((props) => (
    <div 
      data-testid="forecast-display"
      aria-busy={props.isLoading}
      role="list"
      aria-label="Weather forecast days"
    >
      <div role="listitem">
        <div 
          id={`forecast-day-2024-11-05`}
          data-selected={props.selectedDate === '2024-11-05'}
          tabIndex={0}
        >
          <div>Mock ForecastDisplay</div>
          <button onClick={() => props.onDaySelect?.('2024-11-05')}>
            Select Day
          </button>
        </div>
      </div>
      {props.isLoading && <div data-testid="forecast-loading">Loading...</div>}
    </div>
  ))
}));

// Mock the WeatherDetails
vi.mock('../WeatherDetails', () => ({
  WeatherDetails: vi.fn().mockImplementation((props) => (
    <div data-testid="weather-details">
      <div>Mock WeatherDetails</div>
      <button onClick={props.onToggleExpand}>Toggle Details</button>
      {props.expanded && <div data-testid="expanded-details">Expanded Details</div>}
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

const mockForecastData: ForecastResponse = {
  location: mockWeatherData.location,
  current: mockWeatherData.current,
  forecast: {
    forecastday: [
      {
        date: '2024-11-04',
        date_epoch: 1699084800,
        day: {
          maxtemp_c: 20,
          maxtemp_f: 68,
          mintemp_c: 15,
          mintemp_f: 59,
          avgtemp_c: 17.5,
          avgtemp_f: 63.5,
          maxwind_mph: 8,
          maxwind_kph: 12.9,
          totalprecip_mm: 0,
          totalprecip_in: 0,
          totalsnow_cm: 0,
          avgvis_km: 10,
          avgvis_miles: 6,
          avghumidity: 65,
          daily_will_it_rain: 0,
          daily_chance_of_rain: 0,
          daily_will_it_snow: 0,
          daily_chance_of_snow: 0,
          condition: {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
            code: 1000
          },
          uv: 5
        },
        hour: [],
        astro: {
          sunrise: '07:00 AM',
          sunset: '04:30 PM',
          moonrise: '09:00 PM',
          moonset: '02:00 PM',
          moon_phase: 'Waning Gibbous',
          moon_illumination: '75',
          is_moon_up: 0,
          is_sun_up: 1
        }
      }
    ]
  }
};

describe('WeatherContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default useWeather mock return value
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

    // Default useFavorites mock return value - removed clearFavorites
    vi.mocked(useFavorites).mockReturnValue({
      favorites: [],
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      isFavorite: vi.fn().mockReturnValue(false),
      error: null
    });
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
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(errorMessage);
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
    expect(screen.getByRole('button', { name: 'Use Current Location' })).toBeInTheDocument();
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
    const button = screen.getByRole('button', { name: 'Use Current Location' });
    fireEvent.click(button);
    expect(getCurrentLocation).toHaveBeenCalledTimes(1);
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

    const toggleButton = screen.getByRole('button', { name: 'Toggle Units' });
    fireEvent.click(toggleButton);
    expect(toggleUnits).toHaveBeenCalledTimes(1);
  });

  it('renders both current weather and forecast when available', () => {
    vi.mocked(useWeather).mockReturnValue({
      current: mockWeatherData,
      forecast: mockForecastData,
      isLoading: false,
      error: null,
      units: 'metric',
      toggleUnits: vi.fn(),
      getCurrentLocation: vi.fn(),
      fetchWeather: vi.fn(),
      clearWeather: vi.fn()
    });

    render(<WeatherContainer />);
    
    expect(screen.getByTestId('weather-display')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-display')).toBeInTheDocument();
  });

  it('handles loading state correctly', () => {
    vi.mocked(useWeather).mockReturnValue({
      current: mockWeatherData, // Need to provide data for loading state
      forecast: mockForecastData,
      isLoading: true,
      error: null,
      units: 'metric',
      toggleUnits: vi.fn(),
      getCurrentLocation: vi.fn(),
      fetchWeather: vi.fn(),
      clearWeather: vi.fn()
    });
  
    render(<WeatherContainer />);
    
    expect(screen.getByTestId('weather-loading')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-loading')).toBeInTheDocument();
  });

  it('handles forecast day selection', () => {
    vi.mocked(useWeather).mockReturnValue({
      current: mockWeatherData,
      forecast: mockForecastData,
      isLoading: false,
      error: null,
      units: 'metric',
      toggleUnits: vi.fn(),
      getCurrentLocation: vi.fn(),
      fetchWeather: vi.fn(),
      clearWeather: vi.fn()
    });

    render(<WeatherContainer />);
    
    const selectDayButton = screen.getByRole('button', { name: 'Select Day' });
    fireEvent.click(selectDayButton);
    
    const forecastDay = screen.getByRole('listitem').firstChild as HTMLElement;
    expect(forecastDay).toHaveAttribute('data-selected', 'true');
  });

  it('updates both displays when toggling units', () => {
    const toggleUnits = vi.fn();
    vi.mocked(useWeather).mockReturnValue({
      current: mockWeatherData,
      forecast: mockForecastData,
      isLoading: false,
      error: null,
      units: 'metric',
      toggleUnits,
      getCurrentLocation: vi.fn(),
      fetchWeather: vi.fn(),
      clearWeather: vi.fn()
    });

    render(<WeatherContainer />);
    
    const toggleButton = screen.getByRole('button', { name: 'Toggle Units' });
    fireEvent.click(toggleButton);
    
    expect(toggleUnits).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('weather-display')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-display')).toBeInTheDocument();
  });

  it('maintains accessibility attributes', () => {
    vi.mocked(useWeather).mockReturnValue({
      current: mockWeatherData,
      forecast: mockForecastData,
      isLoading: false,
      error: null,
      units: 'metric',
      toggleUnits: vi.fn(),
      getCurrentLocation: vi.fn(),
      fetchWeather: vi.fn(),
      clearWeather: vi.fn()
    });

    render(<WeatherContainer />);
    
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Weather information');
    expect(screen.getByTestId('weather-display')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-display')).toBeInTheDocument();
  });

  it('handles error in forecast display', () => {
    const errorMessage = 'Failed to fetch forecast data';
    vi.mocked(useWeather).mockReturnValue({
      current: mockWeatherData,
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
    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });

  it('renders favorites list', () => {
    const mockFavorites = [
      { name: 'London', lat: 51.52, lon: -0.11, region: 'City of London', country: 'UK' },
      { name: 'Paris', lat: 48.85, lon: 2.35, region: 'Ile-de-France', country: 'France' }
    ];

    vi.mocked(useFavorites).mockReturnValue({
      favorites: mockFavorites,
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      isFavorite: vi.fn(),
      error: null
    });

    render(<WeatherContainer />);
    
    // Use getAllByText since we have both mobile and desktop versions
    expect(screen.getAllByText('London')).toHaveLength(2);
    expect(screen.getAllByText('Paris')).toHaveLength(2);
  });

  it('handles favorite selection', () => {
    const mockFavorites = [
      { name: 'London', lat: 51.52, lon: -0.11, region: 'City of London', country: 'UK' }
    ];
  
    // Mock useWeather with weather data
    vi.mocked(useWeather).mockReturnValue({
      current: mockWeatherData,
      forecast: null,
      isLoading: false,
      error: null,
      units: 'metric',
      toggleUnits: vi.fn(),
      getCurrentLocation: vi.fn(),
      fetchWeather: vi.fn(),
      clearWeather: vi.fn()
    });
  
    // Mock useFavorites
    vi.mocked(useFavorites).mockReturnValue({
      favorites: mockFavorites,
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      isFavorite: vi.fn(),
      error: null
    });
  
    render(<WeatherContainer />);
    
    // Get the first location button
    const favoriteButton = screen.getAllByRole('button', { 
      name: /Select London, City of London/i 
    })[0];
    
    fireEvent.click(favoriteButton);
    
    // Just check for weather-display since we're not returning forecast data
    expect(screen.getByTestId('weather-display')).toBeInTheDocument();
  });

  it('handles adding location to favorites', () => {
    const addFavorite = vi.fn();
    const isFavorite = vi.fn().mockReturnValue(false);

    vi.mocked(useFavorites).mockReturnValue({
      favorites: [],
      addFavorite,
      removeFavorite: vi.fn(),
      isFavorite,
      error: null
    });

    vi.mocked(useWeather).mockReturnValue({
      current: mockWeatherData,
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
    
    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);
    
    expect(addFavorite).toHaveBeenCalledWith({
      name: 'London',
      lat: 51.52,
      lon: -0.11,
      region: 'City of London',
      country: 'UK'
    });
  });

  it('handles favorites error state', () => {
    const errorMessage = 'Failed to load favorites';
    vi.mocked(useFavorites).mockReturnValue({
      favorites: [],
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      isFavorite: vi.fn(),
      error: errorMessage
    });

    render(<WeatherContainer />);
    
    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });
});