// src/components/weather/FavoriteLocations/FavoriteLocations.tsx

import React from 'react';
import { Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { WeatherLocation } from '@/types/Weather.types';

export interface FavoriteLocationsProps {
  locations: WeatherLocation[];
  onSelect: (location: WeatherLocation) => void;
  onRemove: (location: WeatherLocation) => void;
  isLoading?: boolean;
  selectedLocation?: WeatherLocation | null;
  className?: string;
}

export const FavoriteLocations: React.FC<FavoriteLocationsProps> = ({
  locations,
  onSelect,
  onRemove,
  isLoading = false,
  selectedLocation,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (!locations.length) {
    return (
      <Card className={`p-4 text-center ${className}`}>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Star className="w-4 h-4" />
          <span>No favorite locations yet</span>
        </div>
      </Card>
    );
  }

  return (
    <ul
      className={`grid gap-2 ${className}`}
      role="listbox"
      aria-label="Favorite locations"
    >
      {locations.map((location) => {
        const isSelected = selectedLocation?.name === location.name;
        const locationKey = `${location.name}-${location.lat}-${location.lon}`;
        
        return (
          <li
            key={locationKey}
            role="option"
            aria-selected={isSelected}
          >
            <Card
              className={`
                p-3 transition-all
                ${isSelected ? 'ring-2 ring-primary' : ''}
                hover:shadow-md
              `}
            >
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  className="flex-1 text-left justify-start h-auto p-2"
                  onClick={() => onSelect(location)}
                >
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-500">
                      {location.region}, {location.country}
                    </div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => onRemove(location)}
                  aria-label={`Remove ${location.name} from favorites`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
};