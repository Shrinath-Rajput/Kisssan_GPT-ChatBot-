import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Language, AppContextData } from '../../types';

interface AppContextType {
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  contextData: AppContextData;
  setContextData: (data: AppContextData) => void;
  analysisResult: any;
  setAnalysisResult: (result: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.ENGLISH);
  const [contextData, setContextData] = useState<AppContextData>(DEFAULT_DATA);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  return (
    <AppContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        contextData,
        setContextData,
        analysisResult,
        setAnalysisResult
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
