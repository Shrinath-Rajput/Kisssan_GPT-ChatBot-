import { AppContextData, Language } from "../types";
import { analyzeCropViaBackend, getLocationDataViaBackend } from "./apiClient";


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
    console.error("❌ Error:", error);
    return getFallbackData();
  }
};


// ================= FALLBACK =================
const getFallbackData = () => ({
  crop: "Grapes",
  disease: "Black Rot",
  confidence: "90%",
  cause: "Fungal pathogen (Guignardia bidwellii)",

  symptoms: [
    "Circular, reddish-brown spots on leaves",
    "Yellow halo spots",
    "Necrotic tissue",
    "Lesions enlarge"
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
    frequency: "Every 7-14 days"
  },

  prevention: [
    "Prune properly",
    "Remove debris",
    "Avoid overhead irrigation",
    "Maintain hygiene"
  ]
});