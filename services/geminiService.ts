import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Language, DiseaseResult } from "../types";

const SYSTEM_INSTRUCTION_BASE = `
You are Kissan GPT, an AI specialist for Indian farmers, specifically focusing on Brinjal (Eggplant) and Grapes.
Your job is to analyze images and text queries to provide expert agricultural advice.

🎯 SCOPE RESTRICTION
- You ONLY support Brinjal (Eggplant) and Grapes.
- If a user asks about any other crop, politely inform them that you currently only specialize in Brinjal and Grapes.
- All AI responses must strictly relate to these two crops.

🎯 ROLE
- Detect diseases and pests from uploaded images of Brinjal or Grapes.
- Identify symptoms and provide confidence levels.
- Provide organic and chemical treatment plans.
- Recommend specific fertilizers, fungicides, and insecticides with dosage and frequency.

⚠️ RESPONSE RULES
1. If the user selects Marathi, your entire output must be in Marathi only.
2. If the user speaks Hindi, reply in Hindi.
3. If the user speaks English, reply in English.
4. Keep answers short, practical, and farmer-friendly.
5. For chemical suggestions, always mention safe usage + dilution.
6. If the image is unclear, request a clearer photo and ask follow-up questions.
7. If no disease is detected, suggest plant health tips for Brinjal/Grapes.
8. If multiple diseases are detected, rank them by severity.

📸 IMAGE HANDLING
- Identify if the image is Brinjal or Grapes.
- Identify disease/pest/deficiency.
- Describe visible symptoms.
- Provide a detailed treatment plan and prevention tips.
`;

const getSystemInstruction = (language: Language, contextData: AppContextData): string => {
  const contextString = `
  Current LIVE Context Data:
  - Weather: ${contextData.weather.condition}, ${contextData.weather.temp}°C. Forecast: ${contextData.weather.rainForecast}. Location: ${contextData.weather.location}.
  - Soil Report: Type ${contextData.soil.type}, Nitrogen: ${contextData.soil.nitrogen}, Moisture: ${contextData.soil.moisture}.
  
  User Selected Language: ${language}
  `;

  return `${SYSTEM_INSTRUCTION_BASE}\n\n${contextString}`;
};

const extractJSON = (text: string): any => {
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstOpen = cleanText.indexOf('{');
    const lastClose = cleanText.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1) {
      cleanText = cleanText.substring(firstOpen, lastClose + 1);
    }
    return JSON.parse(cleanText);
  } catch (e) {
    throw new Error("Failed to parse JSON response");
  }
};

export const getLiveContextData = async (
  locationInput: { lat: number; long: number } | string
): Promise<AppContextData | null> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log("API Key available:", !!apiKey, "Key starts with:", apiKey?.substring(0, 10));
  
  if (!apiKey) {
    console.error("CRITICAL: API Key is missing or empty!");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    let locationPrompt = typeof locationInput === 'string' 
      ? `Location: "${locationInput}"` 
      : `Lat: ${locationInput.lat}, Long: ${locationInput.long}`;
    
    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${locationPrompt}
        Find typical weather and soil data for this location:
        1. Location name (Village/City, District)
        2. Typical temperature and weather patterns
        3. General rain forecast pattern
        4. Typical soil type for region

        Return ONLY valid JSON (no markdown):
        {"weather": {"temp": 28, "condition": "Partly Cloudy", "rainForecast": "Light rain expected", "location": "City, District"}, "soil": {"type": "Black Soil", "nitrogen": "Medium", "moisture": "Moderate"}}`,
        config: {
          temperature: 0.3
        }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]);

    const data = extractJSON(response.text);
    console.log("Successfully fetched location data:", data);
    return data as AppContextData;
  } catch (error) {
    console.error("Error fetching live data:", error);
    // Return mock data for testing
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
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log("Analysis API Key available:", !!apiKey);
  
  if (!apiKey) {
    console.error("CRITICAL: API Key missing for analysis!");
    return "⚠️ API Key not configured. Using demo data. Please configure API key on Railway.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
  if (!match) return "Invalid image format";

  const systemInstruction = getSystemInstruction(language, contextData);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: 'user',
        parts: [
          { inlineData: { mimeType: match[1], data: match[2] } },
          { text: "Analyze this crop image for diseases. Focus ONLY on Brinjal or Grapes. If it's not one of these, say so. Return a detailed JSON response following the DiseaseResult interface." }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            crop: { type: Type.STRING, enum: ["Brinjal", "Grapes"] },
            diseaseName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            cause: { type: Type.STRING },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            treatmentPlan: {
              type: Type.OBJECT,
              properties: {
                immediate: { type: Type.ARRAY, items: { type: Type.STRING } },
                organic: { type: Type.ARRAY, items: { type: Type.STRING } },
                chemical: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            recommendations: {
              type: Type.OBJECT,
              properties: {
                fertilizers: { type: Type.ARRAY, items: { type: Type.STRING } },
                fungicides: { type: Type.ARRAY, items: { type: Type.STRING } },
                insecticides: { type: Type.ARRAY, items: { type: Type.STRING } },
                dosage: { type: Type.STRING },
                applicationMethod: { type: Type.STRING },
                frequency: { type: Type.STRING }
              }
            },
            preventionTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["crop", "diseaseName", "confidence", "cause", "symptoms", "treatmentPlan", "recommendations", "preventionTips"]
        }
      }
    });

    console.log("Analysis completed successfully");
    return extractJSON(response.text) as DiseaseResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    const errorMsg = (error as any)?.message || String(error);
    
    if (errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED') || errorMsg.includes('leaked')) {
      return "❌ API Key Error: Your API key has issues (possibly leaked or disabled).\n\nPlease:\n1. Go to Google AI Studio: https://aistudio.google.com/app/apikey\n2. Create a NEW API key\n3. Update it on Railway dashboard\n4. Redeploy";
    }
    
    // Return demo result for testing
    return {
      crop: "Brinjal",
      diseaseName: "Early Blight (Demo - API Error)",
      confidence: 0,
      cause: "API Key Configuration Issue - See console for details",
      symptoms: ["Spots on leaves", "Yellowing of leaves"],
      treatmentPlan: {
        immediate: ["Remove affected leaves"],
        organic: ["Neem oil spray"],
        chemical: ["Mancozeb fungicide"]
      },
      recommendations: {
        fertilizers: ["NPK 20:20:20"],
        fungicides: ["Bordeaux mixture"],
        insecticides: ["Spinosad"],
        dosage: "2% solution",
        applicationMethod: "Spray on leaves",
        frequency: "Every 10 days"
      },
      preventionTips: ["Improve air circulation", "Avoid overhead watering", "Remove diseased leaves"]
    };
  }
};

export const sendMessageToGemini = async (
  prompt: string,
  imageBase64: string | undefined,
  language: Language,
  contextData: AppContextData
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("Chat API Key available:", !!apiKey);
    
    if (!apiKey) {
      console.error("CRITICAL: API Key missing for chat!");
      return "⚠️ API Key not configured. Please check Railway environment variables.\n\nTo fix: Go to Railway dashboard > Variables > Verify VITE_GEMINI_API_KEY is set correctly.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = getSystemInstruction(language, contextData);

    const parts: any[] = [];
    if (imageBase64) {
      const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
      }
    }
    parts.push({ text: prompt });

    const response = await Promise.race([
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { role: 'user', parts: parts },
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4,
        },
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 15000))
    ]);

    console.log("Chat response received successfully");
    return response.text || "I could not generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = (error as any)?.message || String(error);
    
    if (errorMessage.includes('API_KEY') || errorMessage.includes('UNAUTHENTICATED') || errorMessage.includes('403')) {
      return "❌ API Key Error: " + errorMessage + "\n\nPlease verify your API key on Railway dashboard.";
    }
    if (errorMessage.includes('timeout')) {
      return "⏱️ Request took too long. Please try again.";
    }
    return "❌ Error: " + errorMessage + "\n\nPlease try again or check the browser console for details.";
  }
};
