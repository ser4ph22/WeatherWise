import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import ForecastDisplay from './ForecastDisplay';
import type { ForecastResponse } from '@/types/Weather.types';

describe('ForecastDisplay', () => {
  // Mock the date for consistent testing
  const mockDate = new Date('2024-11-04');
  const expectedDayName = mockDate.toLocaleDateString('en-US', { weekday: 'long' });
  
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  const mockForecast: ForecastResponse = {
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
    },
    forecast: {
      forecastday: [
        {
          date: '2024-11-04',
          date_epoch: 1699084800,
          day: {
            maxtemp_c: 20,
            maxtemp_f: 68,
            mintemp_c: 10,
            mintemp_f: 50,
            avgtemp_c: 15,
            avgtemp_f: 59,
            maxwind_mph: 8,
            maxwind_kph: 12.9,
            totalprecip_mm: 0,
            totalprecip_in: 0,
            totalsnow_cm: 0,
            avgvis_km: 10,
            avgvis_miles: 6,
            avghumidity: 65,
            daily_will_it_rain: 0,
            daily_chance_of_rain: 20,
            daily_will_it_snow: 0,
            daily_chance_of_snow: 0,
            condition: {
              text: 'Partly cloudy',
              icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
              code: 1003
            },
            uv: 5
          },
          astro: {
            sunrise: '07:00 AM',
            sunset: '04:30 PM',
            moonrise: '09:00 PM',
            moonset: '02:00 PM',
            moon_phase: 'Waning Gibbous',
            moon_illumination: '75',
            is_moon_up: 0,
            is_sun_up: 1
          },
          hour: []
        }
      ]
    }
  };

  it('renders loading state correctly', () => {
    render(<ForecastDisplay forecast={mockForecast} isLoading={true} />);
    const loadingElements = screen.getAllByRole('article');
    expect(loadingElements).toHaveLength(5);
    loadingElements.forEach(element => {
      expect(element).toHaveClass('animate-pulse');
    });
  });

  it('renders forecast data correctly', () => {
    render(<ForecastDisplay forecast={mockForecast} />);
    const list = screen.getByRole('list', { name: /weather forecast days/i });
    expect(list).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockForecast.forecast.forecastday.length);
    
    expect(screen.getByText(expectedDayName)).toBeInTheDocument();
    expect(screen.getByText('Partly cloudy')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('displays temperatures in correct unit', () => {
    const { rerender } = render(<ForecastDisplay forecast={mockForecast} units="metric" />);
    expect(screen.getByText('20°C')).toBeInTheDocument();
    
    rerender(<ForecastDisplay forecast={mockForecast} units="imperial" />);
    expect(screen.getByText('68°F')).toBeInTheDocument();
  });

  it('calls onDaySelect when a day is clicked', () => {
    const onDaySelect = vi.fn();
    render(<ForecastDisplay forecast={mockForecast} onDaySelect={onDaySelect} />);
    
    const dayElement = screen.getByRole('listitem');
    fireEvent.click(dayElement.firstChild as Element);
    expect(onDaySelect).toHaveBeenCalledWith('2024-11-04');
  });

  it('supports keyboard navigation', () => {
    const onDaySelect = vi.fn();
    render(<ForecastDisplay forecast={mockForecast} onDaySelect={onDaySelect} />);
    
    const dayElement = screen.getByRole('listitem').firstChild as Element;
    
    fireEvent.keyDown(dayElement, { key: 'Enter' });
    expect(onDaySelect).toHaveBeenCalledWith('2024-11-04');

    fireEvent.keyDown(dayElement, { key: ' ' });
    expect(onDaySelect).toHaveBeenCalledTimes(2);
  });

  it('shows selected state correctly', () => {
    const { rerender } = render(
      <ForecastDisplay 
        forecast={mockForecast} 
        selectedDate="2024-11-04"
      />
    );

    const dayElement = screen.getByRole('listitem').firstChild as Element;
    expect(dayElement).toHaveAttribute('aria-selected', 'true');
    expect(dayElement).toHaveClass('ring-2', 'ring-primary');

    rerender(
      <ForecastDisplay 
        forecast={mockForecast} 
        selectedDate="2024-11-05"
      />
    );

    expect(dayElement).toHaveAttribute('aria-selected', 'false');
    expect(dayElement).not.toHaveClass('ring-2', 'ring-primary');
  });

  it('handles keyboard events correctly', () => {
    const onDaySelect = vi.fn();
    render(<ForecastDisplay 
      forecast={mockForecast} 
      onDaySelect={onDaySelect}
    />);
    
    const dayElement = screen.getByRole('listitem').firstChild as Element;

    // Enter key
    fireEvent.keyDown(dayElement, { key: 'Enter' });
    expect(onDaySelect).toHaveBeenCalledWith('2024-11-04');

    // Space key
    fireEvent.keyDown(dayElement, { key: ' ' });
    expect(onDaySelect).toHaveBeenCalledWith('2024-11-04');

    // Other keys should not trigger selection
    fireEvent.keyDown(dayElement, { key: 'a' });
    expect(onDaySelect).toHaveBeenCalledTimes(2);
  });

  it('maintains accessibility attributes', () => {
    render(<ForecastDisplay forecast={mockForecast} />);
    
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-label', 'Weather forecast days');

    const dayElement = screen.getByRole('listitem').firstChild as Element;
    expect(dayElement).toHaveAttribute('id', 'forecast-day-2024-11-04');
    expect(dayElement).toHaveAttribute('aria-selected');
    expect(dayElement).toHaveAttribute('tabIndex', '0');
  });

  it('handles empty forecast data gracefully', () => {
    const emptyForecast = {
      ...mockForecast,
      forecast: { forecastday: [] }
    };
    
    render(<ForecastDisplay forecast={emptyForecast} />);
    expect(screen.queryByRole('list')).toBeNull();
  });
});