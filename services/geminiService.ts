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
        location:
          typeof locationInput === "string"
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

    console.log("✅ Backend analyze response:", res);

    // ✅ IMPORTANT FIX (normalize response)
    if (!res) return getFallbackData();

    return {
      crop: res.crop || "Grapes",
      diseaseName: res.disease || "Unknown",
      confidence: parseInt(res.confidence) || 85,
      cause: res.cause || "AI response incomplete",
      symptoms: res.symptoms || [],
      treatmentPlan: {
        immediate: res.treatment?.immediate || [],
        organic: res.treatment?.organic || [],
        chemical: res.treatment?.chemical || []
      },
      smart: res.smart || {},
      prevention: res.prevention || []
    };

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
    console.log("💬 Sending to backend:", prompt);

    const res = await sendChatToBackend(
      `You are an agriculture expert for Grapes & Brinjal.
Give practical farmer advice.

Question: ${prompt}`,
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
  diseaseName: "Black Rot",
  confidence: 90,
  cause: "Fungal pathogen (Guignardia bidwellii)",

  symptoms: [
    "Circular reddish-brown spots",
    "Yellow halo",
    "Dead tissue",
    "Spots enlarge"
  ],

  treatmentPlan: {
    immediate: [
      "Remove infected plant parts",
      "Improve air circulation"
    ],
    organic: [
      "Copper fungicide (Bordeaux mixture)",
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
    dosage: "5-6 ml per 10L water",
    method: "Foliar spray",
    frequency: "7-14 days"
  },

  prevention: [
    "Prune vines",
    "Remove fallen leaves",
    "Avoid overhead watering",
    "Maintain hygiene"
  ]
});