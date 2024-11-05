import React from 'react';
import { Card } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';
import type { FavoriteLocation, FavoriteLocationsProps } from '@/types/Weather.types';

export const FavoriteLocations: React.FC<FavoriteLocationsProps> = ({
  favorites = [],
  onSelect,
  error,
  className,
  isLoading = false
}) => {
  const content = () => {
    if (isLoading) {
      return (
        <div 
          className="flex justify-center p-4" 
          role="status"
          aria-label="Loading favorites"
        >
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="sr-only">Loading favorite locations...</span>
        </div>
      );
    }

    if (error) {
      return (
        <p className="text-red-500 mb-4" role="alert">{error}</p>
      );
    }

    if (favorites.length === 0) {
      return (
        <p className="text-gray-500">No favorite locations saved</p>
      );
    }

    return (
      <ul className="space-y-2">
        {favorites.map((location) => (
          <li key={`${location.name}-${location.region}`}>
            <button
              onClick={() => onSelect(location)}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Select ${location.name}, ${location.region}`}
            >
              <span className="font-medium">{location.name}</span>
              <span className="text-sm text-gray-500 block">
                {location.region}, {location.country}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className={`p-4 ${className || ''}`}>
      <h2 className="text-lg font-semibold mb-4">Favorite Locations</h2>
      {content()}
    </Card>
  );
};