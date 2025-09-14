import React, { useState, useEffect } from 'react';
import weatherService from '../services/weatherService';
import Weather from './Weather';
import LoadingSpinner from './LoadingSpinner';

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getWeather(lat, lon);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again or enter manually.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocation = () => {
    setDropdownOpen(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Geolocation denied. Please enable location or enter manually.');
          setShowManualInput(true);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser. Please enter manually.');
      setShowManualInput(true);
    }
  };

  const handleManualLocationSubmit = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    setError('Manual location input is not yet supported for fetching weather. Please use geolocation.');
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-2xl font-bold mb-4">Weather Infographic</h2>
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
            onClick={handleDropdownToggle}
          >
            Show Weather
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {dropdownOpen && (
          <div
            className="origin-top-left absolute left-0 mt-2 w-max max-w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1" role="none">
              <button
                onClick={handleGeolocation}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                role="menuitem"
              >
                Show my Location
              </button>
              <button
                onClick={() => {
                  setError('This feature is not yet implemented.');
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                role="menuitem"
              >
                Show nearest available Farmers/Customers
              </button>
            </div>
          </div>
        )}
      </div>

      {showManualInput && (
        <form onSubmit={handleManualLocationSubmit} className="mt-4">
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Enter city name (e.g., London)"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
          >
            Get Weather Manually
          </button>
        </form>
      )}

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      {weatherData && !loading && <Weather weatherData={weatherData} />} 
    </div>
  );
};

export default WeatherCard;