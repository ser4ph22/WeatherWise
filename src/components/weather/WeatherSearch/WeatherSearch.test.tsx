// src/components/weather/WeatherSearch/WeatherSearch.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeatherSearch } from './WeatherSearch';
import { beforeEach } from 'node:test';

describe('WeatherSearch', () => {
  const mockOnSearch = vi.fn();
  const mockOnCurrentLocation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and buttons', () => {
    render(
      <WeatherSearch 
        onSearch={mockOnSearch} 
        onCurrentLocation={mockOnCurrentLocation} 
      />
    );

    expect(screen.getByPlaceholderText(/enter city name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /use current location/i })).toBeInTheDocument();
  });

  it('handles search submission', async () => {
    render(
      <WeatherSearch 
        onSearch={mockOnSearch} 
        onCurrentLocation={mockOnCurrentLocation} 
      />
    );

    const input = screen.getByPlaceholderText(/enter city name/i);
    await userEvent.type(input, 'London');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mockOnSearch).toHaveBeenCalledWith('London');
  });

  it('handles current location button click', async () => {
    render(
      <WeatherSearch 
        onSearch={mockOnSearch} 
        onCurrentLocation={mockOnCurrentLocation} 
      />
    );

    const locationButton = screen.getByRole('button', { name: /use current location/i });
    await userEvent.click(locationButton);

    expect(mockOnCurrentLocation).toHaveBeenCalled();
  });

  it('displays error state', () => {
    const errorMessage = 'Location not found';
    render(
      <WeatherSearch 
        onSearch={mockOnSearch} 
        onCurrentLocation={mockOnCurrentLocation}
        error={errorMessage}
      />
    );

    const input = screen.getByPlaceholderText(/enter city name/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables inputs while loading', () => {
    render(
      <WeatherSearch 
        onSearch={mockOnSearch} 
        onCurrentLocation={mockOnCurrentLocation}
        isLoading={true}
      />
    );

    expect(screen.getByPlaceholderText(/enter city name/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /use current location/i })).toBeDisabled();
  });
});