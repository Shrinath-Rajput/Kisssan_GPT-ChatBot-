// Weather and location service
// Simple service that returns realistic demo data without consuming API quota

export const getWeatherData = async (location = 'Your Location') => {
  // Simulate a realistic weather response
  const weatherConditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Overcast'];
  const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  
  const temp = Math.floor(Math.random() * (35 - 20) + 20); // 20-35°C
  const humidity = Math.floor(Math.random() * (85 - 40) + 40); // 40-85%
  const windSpeed = Math.floor(Math.random() * (20 - 5) + 5); // 5-20 km/h
  const rainfall = Math.floor(Math.random() * 100); // 0-100%
  
  return {
    location: location || 'Your Location',
    temp: temp.toString(),
    condition: condition,
    humidity: humidity + '%',
    windSpeed: windSpeed + ' km/h',
    rainForecast: rainfall + '%',
    soilMoisture: (Math.floor(Math.random() * (80 - 50) + 50)) + '%',
    timestamp: new Date().toISOString(),
    note: 'Demo weather data for demonstration. Connect to a real weather API for actual data.'
  };
};

export const getSoilData = async (location) => {
  return {
    location: location || 'Your Location',
    type: 'Loamy Soil',
    nitrogen: 'Good (N: 25-40 mg/kg)',
    phosphorus: 'Moderate (P: 10-15 mg/kg)',
    potassium: 'Good (K: 150-300 mg/kg)',
    pH: '6.5 (Neutral)',
    moisture: (Math.floor(Math.random() * (80 - 30) + 30)) + '%',
    organicMatter: '2.5-3%',
    timestamp: new Date().toISOString()
  };
};
