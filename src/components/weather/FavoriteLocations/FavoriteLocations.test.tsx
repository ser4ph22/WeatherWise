import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FavoriteLocations } from './FavoriteLocations';
import type { FavoriteLocation } from '@/types/Weather.types';

const mockFavorites: FavoriteLocation[] = [
  { name: 'London', lat: 51.52, lon: -0.11, region: 'City of London', country: 'UK' },
  { name: 'Paris', lat: 48.85, lon: 2.35, region: 'Ile-de-France', country: 'France' }
];

describe('FavoriteLocations', () => {
  it('renders loading spinner when loading', () => {
    render(
      <FavoriteLocations
        favorites={[]}
        onSelect={vi.fn()}
        isLoading={true}
      />
    );
    
    // Check for loading state
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading favorites')).toBeInTheDocument();
    expect(screen.getByText('Loading favorite locations...')).toBeInTheDocument();
  });

  it('displays empty state message when no locations', () => {
    render(
      <FavoriteLocations
        favorites={[]}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('No favorite locations saved')).toBeInTheDocument();
  });

  it('renders list of locations', () => {
    render(
      <FavoriteLocations
        favorites={mockFavorites}
        onSelect={vi.fn()}
      />
    );
    
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('calls onSelect when location is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <FavoriteLocations
        favorites={mockFavorites}
        onSelect={handleSelect}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /Select London/i }));
    expect(handleSelect).toHaveBeenCalledWith(mockFavorites[0]);
  });

  it('shows error message when provided', () => {
    const errorMessage = 'Failed to load favorites';
    render(
      <FavoriteLocations
        favorites={[]}
        onSelect={vi.fn()}
        error={errorMessage}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });
});