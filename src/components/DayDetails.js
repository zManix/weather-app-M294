import React from 'react';

function DayDetails({ day, location, onBackClick }) {
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatHour = (timeString) => {
    const hour = new Date(timeString).getHours();
    return hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  return (
    <div className="day-details">
      <button className="back-button" onClick={onBackClick}>
        ← Back
      </button>
      
      <div className="day-header">
        <h2>{formatDate(day.date)}</h2>
        <h3>{location.name}, {location.country}</h3>
      </div>
      
      <div className="day-summary">
        <div className="day-temp">
          <div className="day-max-temp">{Math.round(day.day.maxtemp_c)}°C</div>
          <div className="day-min-temp">{Math.round(day.day.mintemp_c)}°C</div>
        </div>
        
        <div className="day-condition">
          <img src={day.day.condition.icon} alt={day.day.condition.text} />
          <span>{day.day.condition.text}</span>
        </div>
      </div>
      
      <div className="day-detail-grid">
        <div className="detail-item">
          <span className="detail-label">Avg Temp</span>
          <span className="detail-value">{Math.round(day.day.avgtemp_c)}°C</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Max Wind</span>
          <span className="detail-value">{Math.round(day.day.maxwind_kph)} km/h</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Precipitation</span>
          <span className="detail-value">{day.day.totalprecip_mm} mm</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Avg Humidity</span>
          <span className="detail-value">{day.day.avghumidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">UV Index</span>
          <span className="detail-value">{day.day.uv}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Chance of Rain</span>
          <span className="detail-value">{day.day.daily_chance_of_rain}%</span>
        </div>
      </div>
      
      <div className="hourly-breakdown">
        <h3>Hourly Breakdown</h3>
        <div className="hourly-grid">
          {day.hour.filter((_, index) => index % 2 === 0).map((hour, index) => (
            <div key={index} className="hourly-item">
              <div className="hourly-time">{formatHour(hour.time)}</div>
              <div className="hourly-condition">
                <img src={hour.condition.icon} alt={hour.condition.text} />
                <span>{Math.round(hour.temp_c)}°C</span>
              </div>
              <div className="hourly-details">
                <span>{hour.chance_of_rain}% rain</span>
                <span>{Math.round(hour.wind_kph)} km/h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="astronomy-info">
        <h3>Astronomy</h3>
        <div className="astronomy-grid">
          <div className="astronomy-item">
            <span className="astronomy-label">Sunrise</span>
            <span className="astronomy-value">{day.astro.sunrise}</span>
          </div>
          <div className="astronomy-item">
            <span className="astronomy-label">Sunset</span>
            <span className="astronomy-value">{day.astro.sunset}</span>
          </div>
          <div className="astronomy-item">
            <span className="astronomy-label">Moonrise</span>
            <span className="astronomy-value">{day.astro.moonrise}</span>
          </div>
          <div className="astronomy-item">
            <span className="astronomy-label">Moonset</span>
            <span className="astronomy-value">{day.astro.moonset}</span>
          </div>
          <div className="astronomy-item">
            <span className="astronomy-label">Moon Phase</span>
            <span className="astronomy-value">{day.astro.moon_phase}</span>
          </div>
          <div className="astronomy-item">
            <span className="astronomy-label">Moon Illumination</span>
            <span className="astronomy-value">{day.astro.moon_illumination}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DayDetails;