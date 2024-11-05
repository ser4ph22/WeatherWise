// src/components/weather/FavoriteLocations/FavoriteLocations.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FavoriteLocations } from './FavoriteLocations';
import type { WeatherLocation } from '@/types/Weather.types';

const mockLocations: WeatherLocation[] = [
  {
    name: 'London',
    region: 'City of London',
    country: 'UK',
    lat: 51.52,
    lon: -0.11,
    tz_id: 'Europe/London',
    localtime_epoch: 1699084800,
    localtime: '2024-11-04 12:00'
  },
  {
    name: 'Paris',
    region: 'Ile-de-France',
    country: 'France',
    lat: 48.8567,
    lon: 2.3508,
    tz_id: 'Europe/Paris',
    localtime_epoch: 1699084800,
    localtime: '2024-11-04 13:00'
  }
];

describe('FavoriteLocations', () => {
  it('renders loading spinner when loading', () => {
    render(
      <FavoriteLocations
        locations={[]}
        onSelect={() => {}}
        onRemove={() => {}}
        isLoading={true}
      />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays empty state message when no locations', () => {
    render(
      <FavoriteLocations
        locations={[]}
        onSelect={() => {}}
        onRemove={() => {}}
      />
    );

    expect(screen.getByText('No favorite locations yet')).toBeInTheDocument();
  });

  it('renders list of locations', () => {
    render(
      <FavoriteLocations
        locations={mockLocations}
        onSelect={() => {}}
        onRemove={() => {}}
      />
    );

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('calls onSelect when location is clicked', () => {
    const onSelect = vi.fn();
    render(
      <FavoriteLocations
        locations={mockLocations}
        onSelect={onSelect}
        onRemove={() => {}}
      />
    );

    fireEvent.click(screen.getByText('London'));
    expect(onSelect).toHaveBeenCalledWith(mockLocations[0]);
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(
      <FavoriteLocations
        locations={mockLocations}
        onSelect={() => {}}
        onRemove={onRemove}
      />
    );

    const removeButtons = screen.getAllByLabelText(/Remove .* from favorites/);
    fireEvent.click(removeButtons[0]);
    expect(onRemove).toHaveBeenCalledWith(mockLocations[0]);
  });

  it('highlights selected location', () => {
    render(
      <FavoriteLocations
        locations={mockLocations}
        onSelect={() => {}}
        onRemove={() => {}}
        selectedLocation={mockLocations[0]}
      />
    );

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
  });
});