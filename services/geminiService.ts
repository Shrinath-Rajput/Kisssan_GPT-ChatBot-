/**
 * Frontend Gemini Service (Updated to use Backend Proxy)
 * All API calls now go through the backend instead of directly to Gemini
 * This prevents 429 quota errors and improves security
 */

import { AppContextData, Language, DiseaseResult } from "../types";
import { 
  sendChatToBackend, 
  analyzeCropViaBackend, 
  getLocationDataViaBackend,
  checkBackendHealth 
} from "./apiClient";

// Check backend health on startup
checkBackendHealth().then(isHealthy => {
  if (isHealthy) {
    console.log("✅ Backend server is healthy");
  } else {
    console.warn("⚠️ Backend server might not be available. Make sure it's running.");
  }
});

export const getLiveContextData = async (
  locationInput: { lat: number; long: number } | string
): Promise<AppContextData | null> => {
  try {
    console.log("📍 Fetching location data from backend...");
    const data = await getLocationDataViaBackend(locationInput);
    console.log("✅ Successfully fetched location data from backend:", data);
    return data as AppContextData;
  } catch (error) {
    console.error("❌ Error fetching location data from backend:", error);
    // Return default mock data on error
    return {
      weather: {
        temp: 27,
        condition: "Partly Cloudy",
        rainForecast: "Light rain expected",
        location: typeof locationInput === 'string' ? locationInput : "Your Location"
      },
      soil: {
        type: "Black Soil",
        nitrogen: "Medium",
        moisture: "Moderate"
      }
    };
  }
};

export const analyzeCropHealth = async (
  imageBase64: string,
  language: Language,
  contextData: AppContextData
): Promise<DiseaseResult | string> => {
  try {
    console.log("🔍 Sending image to backend for analysis...");
    const result = await analyzeCropViaBackend(imageBase64, language, contextData);
    console.log("✅ Analysis completed successfully via backend");
    return result as DiseaseResult;
  } catch (error) {
    console.error("❌ Backend analysis error:", error);
    const errorMsg = (error as any)?.message || String(error);
    
    // Backend connectivity error - provide clear fix instructions
    if (errorMsg.includes('Failed to fetch') || errorMsg.includes('Network')) {
      return `❌ Cannot connect to backend server\n\n🔧 FIX THIS:\n1. Go to Railway Dashboard (railway.app)\n2. Click your FRONTEND service\n3. Go to Variables tab\n4. Add: VITE_API_URL = https://your-backend-url.up.railway.app\n5. Copy backend URL from your BACKEND service in Railway\n6. Save and wait 2-3 minutes for redeploy\n\nFor development: Make sure backend is running with 'npm start' in backend/ folder`;
    }
    
    if (errorMsg.includes('429')) {
      return "⚠️ Server busy - API quota exceeded. Please try again later.\n\nKissan GPT is currently experiencing high traffic. Your request could not be processed. Please wait a few moments and try again.";
    }
    
    if (errorMsg.includes('API Key') || errorMsg.includes('UNAUTHENTICATED')) {
      return "❌ Backend Error: API key not configured on server.\n\nPlease contact administrator to:\n1. Configure GEMINI_API_KEY in backend environment variables\n2. Restart the backend server\n3. Try again";
    }
    
    return `❌ Analysis failed: ${errorMsg}\n\nPlease check the browser console for details and try again.`;
  }
};

export const sendMessageToGemini = async (
  prompt: string,
  imageBase64: string | undefined,
  language: Language,
  contextData: AppContextData
): Promise<string> => {
  try {
    console.log("💬 Sending message to backend...");
    const response = await sendChatToBackend(
      prompt,
      imageBase64,
      language,
      contextData
    );
    console.log("✅ Chat response received from backend");
    return response;
  } catch (error) {
    console.error("❌ Backend chat error:", error);
    const errorMsg = (error as any)?.message || String(error);
    
    // Backend connectivity error - provide clear fix instructions
    if (errorMsg.includes('Failed to fetch') || errorMsg.includes('Network')) {
      return `❌ Cannot connect to backend server\n\n🔧 FIX THIS:\n1. Go to Railway Dashboard (railway.app)\n2. Click your FRONTEND service\n3. Go to Variables tab\n4. Add: VITE_API_URL = https://your-backend-url.up.railway.app\n5. Copy backend URL from your BACKEND service in Railway\n6. Save and wait 2-3 minutes for redeploy\n\nFor development: Make sure backend is running with 'npm start' in backend/ folder`;
    }
    
    if (errorMsg.includes('429')) {
      return "⚠️ Server busy - API quota exceeded. Please try again later.\n\nKissan GPT is currently experiencing high traffic. Please wait a few moments and try again.";
    }
    
    if (errorMsg.includes('API Key') || errorMsg.includes('UNAUTHENTICATED')) {
      return "❌ Backend Error: API key not configured on server.\n\nPlease contact administrator to configure GEMINI_API_KEY in backend environment variables.";
    }
    
    if (errorMsg.includes('timeout')) {
      return "⏱️ Request took too long. Please try again.";
    }
    
    return `❌ Error: ${errorMsg}\n\nPlease try again or check the browser console for details.`;
  }
};
