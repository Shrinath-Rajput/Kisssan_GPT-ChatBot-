import React from 'react';
import { AppContextData } from '../types';
import { CloudRain, Sprout, MapPin, Activity } from 'lucide-react';

interface WidgetsProps {
  data: AppContextData;
  onAnalyzeClick: () => void;
}

export const Widgets: React.FC<WidgetsProps> = ({ data, onAnalyzeClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-1 gap-3 mb-4">
      {/* Weather Widget */}
      <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 text-blue-700 mb-1">
          <CloudRain size={18} />
          <h3 className="font-semibold text-sm">Weather</h3>
        </div>
        <div className="text-xs text-blue-900">
          <div className="flex items-center gap-1 mb-1">
             <MapPin size={10} /> {data.weather.location}
          </div>
          <p className="font-bold text-lg">{data.weather.temp}°C</p>
          <p>{data.weather.condition}</p>
          <p className="mt-1 text-blue-600 font-medium">Forecast: {data.weather.rainForecast}</p>
        </div>
      </div>

      {/* Crop Health Analyzer Trigger Widget */}
      <button 
        onClick={onAnalyzeClick}
        className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl shadow-sm text-left hover:bg-emerald-100 transition-colors group"
      >
        <div className="flex items-center gap-2 text-emerald-700 mb-1">
          <Activity size={18} className="group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-sm">Crop Health Analyzer</h3>
        </div>
        <div className="text-xs text-emerald-900">
          <p className="font-medium">Analyze Brinjal & Grapes</p>
          <p className="text-emerald-600 mt-1">Upload leaf photo to detect diseases instantly.</p>
          <div className="mt-2 bg-emerald-600 text-white text-[10px] py-1 px-2 rounded-full inline-block font-bold">
            START ANALYSIS
          </div>
        </div>
      </button>

      {/* Soil Widget */}
      <div className="bg-stone-100 border border-stone-200 p-3 rounded-xl shadow-sm col-span-2 md:col-span-1">
        <div className="flex items-center gap-2 text-stone-700 mb-1">
          <Sprout size={18} />
          <h3 className="font-semibold text-sm">Soil Health</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-stone-800">
          <div>
            <span className="text-stone-500 block">Type</span>
            <span className="font-medium">{data.soil.type}</span>
          </div>
          <div>
            <span className="text-stone-500 block">Nitrogen</span>
            <span className={`font-medium ${data.soil.nitrogen === 'Low' ? 'text-red-600' : 'text-green-600'}`}>
              {data.soil.nitrogen}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
