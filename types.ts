export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  MARATHI = 'Marathi'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string
  timestamp: number;
}

export interface WeatherData {
  temp: number;
  condition: string;
  rainForecast: string;
  location: string;
}

export interface DiseaseResult {
  crop: 'Brinjal' | 'Grapes';
  diseaseName: string;
  confidence: number;
  cause: string;
  symptoms: string[];
  treatmentPlan: {
    immediate: string[];
    organic: string[];
    chemical: string[];
  };
  recommendations: {
    fertilizers: string[];
    fungicides: string[];
    insecticides: string[];
    dosage: string;
    applicationMethod: string;
    frequency: string;
  };
  preventionTips: string[];
}

export interface AppContextData {
  weather: WeatherData;
  soil: {
    type: string;
    nitrogen: 'Low' | 'Medium' | 'High';
    moisture: string;
  };
}
