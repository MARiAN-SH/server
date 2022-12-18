import { fetchWeather } from '../api/weatherApi.js';

export const getWeather = async (req, res) => {
  try {
    //req.headers
    //req.body
    //req.params
    //req.query

    // {latitude = 50.222523, longitude = 12.869794} KV
    // {latitude = 50.166422, longitude = 12.361121} SKN
    // {latitude = 27.25008, longitude = 33.842101} E
    const { latitude = 50.166422, longitude = 12.361121 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Invalid latitude or longitude' });
    }

    const response = await fetchWeather(latitude, longitude);
    const [weatherData] = response.data.data;
    // console.log(weatherData);

    const {
      city_name,
      weather: { icon, description },
      temp,
    } = weatherData;

    res.json({ city_name, icon, description, temp });
    // return res.send(`<h1>${city_name}</h1>
    // <img src="https://www.weatherbit.io/static/img/icons/${icon}.png" alt="${description}">
  
    // <span>${temp}</span>
    // <p>${description}</p>
    // `);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
