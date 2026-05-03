// Weather and location service
// Simple service that returns realistic demo data without consuming API quota

export const getWeatherData = async (location = 'Your Location') => {
  // Simulate a realistic weather response
  const weatherConditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Overcast'];
  const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  
  const temp = Math.floor(Math.random() * (35 - 20) + 20); // 20-35°C
  const humidity = Math.floor(Math.random() * (85 - 40) + 40); // 40-85%
  const windSpeed = Math.floor(Math.random() * (20 - 5) + 5); // 5-20 km/h
  const rainfall = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)];
  
  return {
    temp: temp,
    condition: condition,
    rainForecast: rainfall,
    location: location || 'Your Location'
  };
};

export const getSoilData = async (location) => {
  const nitrogenLevels = ['Low', 'Medium', 'High'];
  const moistureLevels = ['Low', 'Moderate', 'High'];
  
  return {
    type: 'Loamy Soil',
    nitrogen: nitrogenLevels[Math.floor(Math.random() * 3)],
    moisture: moistureLevels[Math.floor(Math.random() * 3)]
  };
};
