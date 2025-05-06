import React from 'react';

function HourlyForecast({ forecast }) {
  // Get today's forecast hours from the current time onwards
  const getTodayHours = () => {
    const today = forecast.forecastday[0];
    const currentHour = new Date().getHours();
    
    // If we're near the end of the day, show some hours from tomorrow as well
    if (currentHour >= 20) {
      const remainingHoursToday = today.hour.slice(currentHour);
      const earlyHoursTomorrow = forecast.forecastday[1]?.hour.slice(0, 4) || [];
      return [...remainingHoursToday, ...earlyHoursTomorrow];
    }
    
    return today.hour.slice(currentHour, currentHour + 12);
  };

  const formatHour = (timeString) => {
    const hour = new Date(timeString).getHours();
    return hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const todayHours = getTodayHours();

  return (
    <div className="hourly-forecast">
      <div className="forecast-container">
        {todayHours.map((hour, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-time">{formatHour(hour.time)}</div>
            <img 
              src={hour.condition.icon} 
              alt={hour.condition.text} 
              className="forecast-icon" 
            />
            <div className="forecast-temp">{Math.round(hour.temp_c)}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;