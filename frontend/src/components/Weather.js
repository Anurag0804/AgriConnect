import React from 'react';

const Weather = ({ weatherData }) => {
  if (!weatherData) {
    return <div className="text-center text-gray-500">No weather data available.</div>;
  }

  const { locationName, currentWeather, forecast } = weatherData;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">Weather in {locationName}</h3>
      <div className="flex items-center mb-4">
        <img
          src={`http://openweathermap.org/img/wn/${currentWeather.icon}.png`}
          alt={currentWeather.description}
          className="w-12 h-12 mr-2"
        />
        <div>
          <p className="text-3xl font-bold">{currentWeather.temperature}°C</p>
          <p className="text-gray-600 capitalize">{currentWeather.description}</p>
          <p className="text-gray-600">Humidity: {currentWeather.humidity}%</p>
        </div>
      </div>

      <h4 className="text-lg font-semibold mb-2">5-Day Forecast:</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div key={index} className="text-center p-2 border rounded-md">
            <p className="text-sm font-medium">{new Date(day.date).toLocaleDateString()}</p>
            <img
              src={`http://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              className="w-8 h-8 mx-auto"
            />
            <p className="text-md">{day.temperature}°C</p>
            <p className="text-xs capitalize text-gray-500">{day.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
