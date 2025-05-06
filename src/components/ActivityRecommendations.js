import React from 'react';

function ActivityRecommendations({ current, forecast }) {
  // Get relevant weather data
  const currentTemp = current.temp_c;
  const windSpeed = current.wind_kph;
  const isRaining = current.precip_mm > 0 || current.condition.text.toLowerCase().includes('rain');
  const uvIndex = current.uv;
  const humidity = current.humidity;
  const condition = current.condition.text.toLowerCase();

  // Determine suitable activities based on weather conditions
  const getSuitableActivities = () => {
    const activities = [];
    
    // Good weather for running
    if (currentTemp >= 5 && currentTemp <= 25 && windSpeed < 20 && !isRaining) {
      activities.push({
        name: 'Laufen',
        icon: '🏃',
        suitability: 'Ausgezeichnet',
        note: currentTemp > 20 ? 'Viel Wasser trinken' : ''
      });
    } else if (!isRaining && currentTemp > 0) {
      activities.push({
        name: 'Laufen',
        icon: '🏃',
        suitability: 'Gut',
        note: currentTemp > 25 ? 'Mittagshitze vermeiden' : (currentTemp < 5 ? 'Warme Kleidung tragen' : '')
      });
    }
    
    // Good weather for cycling
    if (currentTemp >= 10 && currentTemp <= 28 && windSpeed < 25 && !isRaining) {
      activities.push({
        name: 'Radfahren',
        icon: '🚴',
        suitability: 'Ausgezeichnet',
        note: ''
      });
    } else if (!isRaining && currentTemp > 5 && windSpeed < 30) {
      activities.push({
        name: 'Radfahren',
        icon: '🚴',
        suitability: 'Gut',
        note: windSpeed > 20 ? 'Windige Verhältnisse' : ''
      });
    }
    
    // Good weather for hiking
    if (currentTemp >= 8 && currentTemp <= 25 && windSpeed < 20 && !isRaining) {
      activities.push({
        name: 'Wandern',
        icon: '🥾',
        suitability: 'Ausgezeichnet',
        note: ''
      });
    } else if (!isRaining && currentTemp > 0) {
      activities.push({
        name: 'Wandern',
        icon: '🥾',
        suitability: 'Gut',
        note: currentTemp > 25 ? 'Extra Wasser mitnehmen' : (currentTemp < 5 ? 'Warm anziehen' : '')
      });
    }
    
    // Good weather for swimming (outdoor)
    if (currentTemp >= 25 && !isRaining && condition.includes('sunny')) {
      activities.push({
        name: 'Schwimmen',
        icon: '🏊',
        suitability: 'Ausgezeichnet',
        note: 'Sonnenschutz auftragen'
      });
    } else if (currentTemp >= 20 && !isRaining) {
      activities.push({
        name: 'Schwimmen',
        icon: '🏊',
        suitability: 'Gut',
        note: ''
      });
    }
    
    // Good weather for tennis/outdoor sports
    if (currentTemp >= 15 && currentTemp <= 28 && windSpeed < 15 && !isRaining) {
      activities.push({
        name: 'Tennis',
        icon: '🎾',
        suitability: 'Ausgezeichnet',
        note: ''
      });
    } else if (!isRaining && windSpeed < 20) {
      activities.push({
        name: 'Tennis',
        icon: '🎾',
        suitability: 'Gut',
        note: windSpeed > 10 ? 'Leicht windig' : ''
      });
    }
    
    // Good weather for yoga (outdoors)
    if (currentTemp >= 15 && currentTemp <= 30 && !isRaining && windSpeed < 10) {
      activities.push({
        name: 'Outdoor Yoga',
        icon: '🧘',
        suitability: 'Ausgezeichnet',
        note: ''
      });
    }
    
    // Indoor activities when weather is bad
    if (isRaining || currentTemp < 5 || windSpeed > 30) {
      activities.push({
        name: 'Fitnessstudio',
        icon: '🏋️',
        suitability: 'Empfohlen',
        note: 'Indoor-Aktivität heute empfohlen'
      });
      
      activities.push({
        name: 'Hallenbad',
        icon: '🏊',
        suitability: 'Empfohlen',
        note: 'Indoor-Aktivität heute empfohlen'
      });
    }
    
    // Return at least 3 activities, but no more than 4
    return activities.slice(0, 4);
  };

  const activities = getSuitableActivities();

  return (
    <div className="activity-recommendations">
      <h3>Sportempfehlungen</h3>
      <div className="activity-container">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className={`activity-item ${activity.suitability.toLowerCase()}`}>
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-details">
                <div className="activity-name">{activity.name}</div>
                <div className="activity-suitability">{activity.suitability}</div>
                {activity.note && <div className="activity-note">{activity.note}</div>}
              </div>
            </div>
          ))
        ) : (
          <div className="no-activities">
            Keine geeigneten Outdoor-Aktivitäten für das aktuelle Wetter. Erwäge Indoor-Sport.
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityRecommendations;