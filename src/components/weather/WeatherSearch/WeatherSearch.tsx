// src/components/weather/WeatherSearch/WeatherSearch.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';
import type { WeatherSearchProps, WeatherSearchForm } from '../../../types/Weather.types';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { WeatherService } from '../../../services/weatherService';

export const WeatherSearch: React.FC<WeatherSearchProps> = ({
  onSearch,
  isLoading = false,
  error = null,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<WeatherSearchForm>({
    defaultValues: {
      location: '',
    },
  });

  const onSubmit = async (data: WeatherSearchForm) => {
    if (WeatherService.isValidLocation(data.location)) {
      await onSearch(data.location);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="w-full max-w-md space-y-2"
    >
      <div className="relative flex items-center">
        <Input
          {...register('location', {
            required: 'Please enter a location',
            minLength: {
              value: 2,
              message: 'Location must be at least 2 characters',
            },
          })}
          placeholder="Enter city or location..."
          className="pr-12"
          aria-label="Search location"
          disabled={isLoading}
        />
        <Button 
          type="submit"
          variant="ghost"
          size="sm"
          className="absolute right-2"
          disabled={isLoading}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      
      {errors.location && (
        <p className="text-sm text-red-500">{errors.location.message}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {isLoading && (
        <p className="text-sm text-gray-500">Searching weather data...</p>
      )}
    </form>
  );
};