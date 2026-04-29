import { useEffect, useState } from 'react';
import { getLiveContextData } from '../../services/geminiService';
import { AppContextData } from '../../types';

const DEFAULT_DATA: AppContextData = {
  weather: {
    temp: 0,
    condition: 'Detecting...',
    rainForecast: 'Fetching forecast...',
    location: 'Locating...'
  },
  soil: {
    type: 'Detecting...',
    nitrogen: 'Medium',
    moisture: 'Moderate'
  }
};

export const useLocationData = () => {
  const [contextData, setContextData] = useState<AppContextData>(DEFAULT_DATA);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const liveData = await getLiveContextData({ lat: latitude, long: longitude });
            if (liveData) {
              setContextData(liveData);
            }
          } catch (e) {
            console.error('Error fetching live data', e);
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          setIsLocating(false);
          setContextData((prev) => ({
            ...prev,
            weather: { ...prev.weather, location: 'Select Location', condition: 'Unknown' }
          }));
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const setLocationByName = async (location: string) => {
    setIsLocating(true);
    try {
      const liveData = await getLiveContextData(location);
      if (liveData) {
        setContextData(liveData);
      }
    } catch (e) {
      console.error('Error setting location', e);
    } finally {
      setIsLocating(false);
    }
  };

  return { contextData, isLocating, fetchLocationData, setLocationByName };
};
