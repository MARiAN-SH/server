import axios from 'axios';
// axios.defaults.baseURL = 'https://api.weatherbit.io/v2.0/current';

export const fetchWeather = (latitude, longitude) =>
  axios.get('current', {
    baseURL: 'https://api.weatherbit.io/v2.0',
    params: {
      key: process.env.API_KEY_WEATHER,
      lat: latitude || 50.166422,
      lon: longitude || 12.361121,
    },
  });
