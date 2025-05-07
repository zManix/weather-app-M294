import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchLocation from "./components/SearchLocation";
import WeatherDisplay from "./components/WeatherDisplay";
import HourlyForecast from "./components/HourlyForecast";
import DayDetails from "./components/DayDetails";
import ActivityRecommendations from "./components/ActivityRecommendations";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("Bern");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const API_KEY = "d06b69e7931340c485b111410250605";
  const WEATHER_API_URL = "https://api.weatherapi.com/v1";
  const BACKEND_API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchWeatherData(location);
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    console.log("Fetching favorites from backend...");
    try {
      const response = await axios.get(`${BACKEND_API_URL}/favorites`);
      console.log("Favorites fetched:", response.data);
      setFavorites(response.data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      // Fallback to local storage if backend is not available
      const savedFavorites = localStorage.getItem("weatherFavorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  };

  const fetchWeatherData = async (searchLocation) => {
    setLoading(true);
    setError(null);
    setSelectedDay(null);

    try {
      const response = await axios.get(`${WEATHER_API_URL}/forecast.json`, {
        params: {
          key: API_KEY,
          q: searchLocation,
          days: 7,
          aqi: "no",
          alerts: "no",
        },
      });

      setWeatherData(response.data);
      setLocation(searchLocation);
      setLoading(false);
    } catch (err) {
      setError(
        "Wetterdaten konnten nicht abgerufen werden. Bitte versuche es erneut."
      );
      setLoading(false);
      console.error("Error fetching weather data:", err);
    }
  };

  const handleSearch = (searchLocation) => {
    fetchWeatherData(searchLocation);
  };

  const toggleFavorite = async (locationName) => {
    console.log("Toggling favorite for:", locationName);
    try {
      if (favorites.includes(locationName)) {
        // Remove from favorites
        await axios.delete(
          `${BACKEND_API_URL}/favorites/${encodeURIComponent(locationName)}`
        );
        console.log("Removed from favorites:", locationName);
      } else {
        // Add to favorites
        await axios.post(`${BACKEND_API_URL}/favorites`, {
          location: locationName,
        });
        console.log("Added to favorites:", locationName);
      }
      // Refresh favorites list from backend
      await fetchFavorites();
    } catch (err) {
      console.error("Error updating favorites:", err);

      // Fallback to local storage if backend is not available
      if (favorites.includes(locationName)) {
        const newFavorites = favorites.filter((fav) => fav !== locationName);
        setFavorites(newFavorites);
        localStorage.setItem("weatherFavorites", JSON.stringify(newFavorites));
      } else {
        const newFavorites = [...favorites, locationName];
        setFavorites(newFavorites);
        localStorage.setItem("weatherFavorites", JSON.stringify(newFavorites));
      }
    }
  };

  const handleDayClick = (index) => {
    setSelectedDay(index);
  };

  const handleBackClick = () => {
    setSelectedDay(null);
  };

  return (
    <div className="container">
      <div className="weather-app">
        <SearchLocation
          onSearch={handleSearch}
          favorites={favorites}
          onFavoriteSelect={fetchWeatherData}
          currentLocation={weatherData?.location.name || ""}
          isFavorite={
            weatherData && favorites.includes(weatherData.location.name)
          }
          onToggleFavorite={() =>
            weatherData && toggleFavorite(weatherData.location.name)
          }
        />

        {loading && (
          <div className="loading">Wetterdaten werden geladen...</div>
        )}

        {error && <div className="error-message">{error}</div>}

        {weatherData && !loading && !error && selectedDay === null && (
          <>
            <WeatherDisplay
              current={weatherData.current}
              location={weatherData.location}
              forecast={weatherData.forecast}
              onDayClick={handleDayClick}
            />
            <ActivityRecommendations
              current={weatherData.current}
              forecast={weatherData.forecast}
            />
            <HourlyForecast forecast={weatherData.forecast} />
          </>
        )}

        {weatherData && !loading && !error && selectedDay !== null && (
          <DayDetails
            day={weatherData.forecast.forecastday[selectedDay]}
            location={weatherData.location}
            onBackClick={handleBackClick}
          />
        )}
      </div>
    </div>
  );
}

export default App;
