// src/components/weather/WeatherSearch/WeatherSearch.tsx
import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherSearchProps {
  onSearch: (location: string) => void;
  onCurrentLocation: () => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export const WeatherSearch: React.FC<WeatherSearchProps> = ({
  onSearch,
  onCurrentLocation,
  isLoading = false,
  error = null,
  className
}) => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:gap-4',
        className
      )}
      aria-label="weather-search"
      role="search"
    >
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Enter city name..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          disabled={isLoading}
          aria-invalid={!!error}
          className="w-full"
          aria-label="Search location"
        />
      </div>
      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={isLoading || !searchValue.trim()}
          className="flex-1 sm:flex-none"
        >
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCurrentLocation}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
          aria-label="Use current location"
        >
          <MapPin className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};