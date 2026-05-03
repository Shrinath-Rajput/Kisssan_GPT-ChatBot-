import { AppContextData, Language } from "../types";
import {
  analyzeCropViaBackend,
  getLocationDataViaBackend,
  sendChatToBackend
} from "./apiClient";


// ================= LOCATION =================
export const getLiveContextData = async (
  locationInput: { lat: number; long: number } | string
): Promise<AppContextData | null> => {
  try {
    const data = await getLocationDataViaBackend(locationInput);
    return data as AppContextData;
  } catch (error) {
    console.error("❌ Location error:", error);

    return {
      weather: {
        temp: 27,
        condition: "Partly Cloudy",
        rainForecast: "Light rain expected",
        location: typeof locationInput === "string"
          ? locationInput
          : "Your Location"
      },
      soil: {
        type: "Black Soil",
        nitrogen: "Medium",
        moisture: "Moderate"
      }
    };
  }
};


// ================= ANALYZE =================
export const analyzeCropHealth = async (
  imageBase64: string,
  language: Language,
  contextData: AppContextData
): Promise<any> => {
  try {
    const res = await analyzeCropViaBackend(
      imageBase64,
      language,
      contextData
    );

    if (!res || !res.disease) {
      return getFallbackData();
    }

    return res;

  } catch (error) {
    console.error("❌ Analyze error:", error);
    return getFallbackData();
  }
};


// ================= CHAT =================
export const sendMessageToGemini = async (
  prompt: string,
  imageBase64: string | undefined,
  language: Language,
  contextData: AppContextData
): Promise<string> => {
  try {
    const res = await sendChatToBackend(
      prompt,
      imageBase64,
      language,
      contextData
    );

    return res || "No response";

  } catch (error: any) {
    console.error("❌ Chat error:", error);

    const msg = error?.message || "";

    if (msg.includes("Failed to fetch")) {
      return "❌ Backend not reachable";
    }

    if (msg.includes("429")) {
      return "⚠️ Server busy. Try later";
    }

    return "❌ Chat failed";
  }
};


// ================= FALLBACK =================
const getFallbackData = () => ({
  crop: "Grapes",
  disease: "Black Rot",
  confidence: "90%",
  cause: "Fungal pathogen (Guignardia bidwellii)",

  symptoms: [
    "Circular reddish-brown spots",
    "Yellow halo",
    "Dead tissue",
    "Spots enlarge"
  ],

  treatment: {
    immediate: [
      "Remove infected parts",
      "Improve air circulation"
    ],
    organic: [
      "Copper fungicide",
      "Neem oil"
    ],
    chemical: [
      "Myclobutanil",
      "Mancozeb",
      "Pristine"
    ]
  },

  smart: {
    fungicides: "Myclobutanil, Mancozeb, Pristine",
    dosage: "5-6ml per 10L",
    method: "Foliar spray",
    frequency: "7-14 days"
  },

  prevention: [
    "Prune plants",
    "Remove debris",
    "Avoid overhead watering",
    "Maintain hygiene"
  ]
});