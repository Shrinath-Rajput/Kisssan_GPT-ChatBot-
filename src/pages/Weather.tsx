import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Eye, MapPin, RefreshCw } from 'lucide-react';
import { useLocationData } from '../hooks/useLocationData';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';
import { useAppContext } from '../context/AppContext';

export const Weather: React.FC = () => {
  const { contextData, isLocating, fetchLocationData, setLocationByName } = useLocationData();
  const { setContextData } = useAppContext();
  const [manualLocation, setManualLocation] = useState('');

  useEffect(() => {
    setContextData(contextData);
  }, [contextData, setContextData]);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualLocation.trim()) {
      setLocationByName(manualLocation);
      setManualLocation('');
    }
  };

  const weatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain')) return '🌧️';
    if (lowerCondition.includes('cloud')) return '☁️';
    if (lowerCondition.includes('sun')) return '☀️';
    if (lowerCondition.includes('snow')) return '❄️';
    if (lowerCondition.includes('wind')) return '💨';
    return '🌤️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-stone-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Weather Monitor</h1>
          <p className="text-stone-600">Real-time weather data for your crops</p>
        </div>

        {/* Location Selector */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-600" size={24} />
              <div>
                <h3 className="font-bold text-stone-900">Current Location</h3>
                <p className="text-sm text-stone-600">{contextData.weather.location}</p>
              </div>
            </div>

            <form onSubmit={handleLocationSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="Enter city or district..."
                className="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <Button type="submit" size="sm">
                Search
              </Button>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={fetchLocationData}
                disabled={isLocating}
              >
                <RefreshCw size={18} />
              </Button>
            </form>
          </div>
        </Card>

        {isLocating ? (
          <div className="flex justify-center py-20">
            <Loader text="Fetching weather data..." />
          </div>
        ) : (
          <>
            {/* Main Weather Card */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Large Current Weather */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">
                          Current Weather
                        </p>
                        <h2 className="text-5xl font-bold mt-2">{contextData.weather.temp}°C</h2>
                        <p className="text-xl text-blue-100 mt-2">{contextData.weather.condition}</p>
                      </div>
                      <div className="text-6xl">{weatherIcon(contextData.weather.condition)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-blue-400">
                      <div>
                        <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold">
                          Rain Forecast
                        </p>
                        <p className="text-2xl font-bold mt-1">{contextData.weather.rainForecast}</p>
                      </div>
                      <div>
                        <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold">
                          Location
                        </p>
                        <p className="text-2xl font-bold mt-1 break-words">{contextData.weather.location}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Soil Info */}
              <div>
                <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
                    <Droplets className="text-orange-600" />
                    Soil Info
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-lg border border-amber-100">
                      <p className="text-xs text-stone-600 uppercase font-semibold">Type</p>
                      <p className="text-lg font-bold text-stone-900 mt-1">{contextData.soil.type}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-amber-100">
                      <p className="text-xs text-stone-600 uppercase font-semibold">Nitrogen</p>
                      <p className="text-lg font-bold text-stone-900 mt-1">{contextData.soil.nitrogen}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-amber-100">
                      <p className="text-xs text-stone-600 uppercase font-semibold">Moisture</p>
                      <p className="text-lg font-bold text-stone-900 mt-1">{contextData.soil.moisture}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Recommendations */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
                <Wind className="text-green-600" size={24} />
                Smart Recommendations
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-stone-700">
                {contextData.weather.temp > 30 && (
                  <div className="flex gap-2">
                    <span>💧</span>
                    <p>Increase irrigation frequency in high temperature</p>
                  </div>
                )}
                {contextData.weather.rainForecast &&
                  contextData.weather.rainForecast.toLowerCase().includes('high') && (
                  <div className="flex gap-2">
                    <span>🌧️</span>
                    <p>Heavy rain forecasted - ensure proper drainage</p>
                  </div>
                )}
                {contextData.soil.nitrogen === 'Low' && (
                  <div className="flex gap-2">
                    <span>🌾</span>
                    <p>Apply nitrogen-rich fertilizer</p>
                  </div>
                )}
                {contextData.soil.moisture === 'High' && (
                  <div className="flex gap-2">
                    <span>⚠️</span>
                    <p>Reduce watering - monitor for fungal diseases</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <span>📱</span>
                  <p>Check disease alerts regularly in chat</p>
                </div>
                <div className="flex gap-2">
                  <span>🌿</span>
                  <p>Maintain optimal crop health monitoring</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
