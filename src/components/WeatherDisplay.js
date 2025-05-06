import React from 'react';

function WeatherDisplay({ current, location, forecast, onDayClick }) {
  // Format the date
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getDayName = (dateString) => {
    const options = { weekday: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="weather-display">
      <div className="location">{location.name}, {location.country}</div>
      <div className="date">{formatDate(location.localtime)}</div>
      
      <div className="current-weather">
        <div className="temperature">{Math.round(current.temp_c)}°</div>
        <div>
          <img 
            src={current.condition.icon} 
            alt={current.condition.text} 
            className="weather-icon" 
          />
          <div className="weather-condition">{current.condition.text}</div>
        </div>
      </div>
      
      <div className="weather-details">
        <div className="detail">
          <div className="detail-label">Feels Like</div>
          <div className="detail-value">{Math.round(current.feelslike_c)}°C</div>
        </div>
        <div className="detail">
          <div className="detail-label">Humidity</div>
          <div className="detail-value">{current.humidity}%</div>
        </div>
        <div className="detail">
          <div className="detail-label">Wind</div>
          <div className="detail-value">{Math.round(current.wind_kph)} km/h</div>
        </div>
        <div className="detail">
          <div className="detail-label">UV Index</div>
          <div className="detail-value">{current.uv}</div>
        </div>
      </div>

      <div className="weekly-days">
        {forecast.forecastday.map((day, index) => (
          <div 
            className="day-item clickable" 
            key={day.date}
            onClick={() => onDayClick(index)}
          >
            <div className="day-name">{getDayName(day.date)}</div>
            <img 
              src={day.day.condition.icon} 
              alt={day.day.condition.text} 
              className="day-icon" 
            />
            <div className="day-temp">
              <div className="day-max">{Math.round(day.day.maxtemp_c)}°</div>
              <div className="day-min">{Math.round(day.day.mintemp_c)}°</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherDisplay;