const axios = require('axios');
const NodeCache = require('node-cache');

const weatherCache = new NodeCache({ stdTTL: 900 }); // Cache for 15 minutes

const getWeatherData = async (lat, lon) => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  const cacheKey = `${lat},${lon}`;
  if (weatherCache.has(cacheKey)) {
    return weatherCache.get(cacheKey);
  }

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(url),
      axios.get(forecastUrl),
    ]);

    const normalizedData = {
      locationName: weatherResponse.data.name,
      currentWeather: {
        temperature: weatherResponse.data.main.temp,
        humidity: weatherResponse.data.main.humidity,
        description: weatherResponse.data.weather[0].description,
        icon: weatherResponse.data.weather[0].icon,
      },
      forecast: forecastResponse.data.list
        .filter((item, index) => index % 8 === 0) // Get forecast for the next 5 days (every 24 hours)
        .map((item) => ({
          date: item.dt_txt,
          temperature: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        })),
    };

    weatherCache.set(cacheKey, normalizedData);
    return normalizedData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data.');
  }
};

exports.getWeather = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  try {
    const weatherData = await getWeatherData(lat, lon);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
