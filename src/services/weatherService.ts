import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export const getCurrentWeather = async (location: string) => {
  try {
    const response = await weatherApi.get('/current.json', {
      params: { q: location },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getForecast = async (location: string, days: number = 5) => {
  try {
    const response = await weatherApi.get('/forecast.json', {
      params: { q: location, days },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
