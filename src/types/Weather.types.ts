// src/types/Weather.types.ts

// API Response Types
export interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeather {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

export interface DayForecast {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: WeatherCondition;
  uv: number;
}

export interface HourForecast {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: DayForecast;
  hour: HourForecast[];
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: string;
    is_moon_up: number;
    is_sun_up: number;
  };
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
}

export interface ForecastResponse extends WeatherResponse {
  forecast: {
    forecastday: ForecastDay[];
  };
}

// Error Types
export interface WeatherError {
  code: number;
  message: string;
}

export type WeatherErrorResponse = {
  error: WeatherError;
};

// Component Props Types
export interface WeatherDisplayProps {
  weather: WeatherResponse;
  forecast?: ForecastResponse;
  units?: 'metric' | 'imperial';
  onUnitToggle?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export interface WeatherSearchProps {
  onSearch: (location: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  placeholder?: string;
}

// Form Types
export interface WeatherSearchForm {
  location: string;
}

// Hook Types
export interface UseWeatherState {
  current: WeatherResponse | null;
  forecast: ForecastResponse | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseWeatherOptions {
  location?: string;
  units?: 'metric' | 'imperial';
  days?: number;
  enableForecast?: boolean;
}

// Utility Types
export type TemperatureUnit = 'metric' | 'imperial';

export interface WeatherCache<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

// Constants
export const WEATHER_UNITS = {
  METRIC: 'metric' as const,
  IMPERIAL: 'imperial' as const,
};

export const CACHE_KEYS = {
  CURRENT_WEATHER: 'current_weather',
  FORECAST: 'forecast',
  PREFERENCES: 'weather_preferences',
} as const;