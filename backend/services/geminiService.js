import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiRequestQueue } from '../utils/requestQueue.js';
import { cacheManager } from '../utils/cache.js';
import { getFallbackAnalysisResponse, getFallbackChatResponse } from '../utils/fallbackResponses.js';

const SYSTEM_INSTRUCTION_BASE = `
You are Kissan GPT, a farming expert for Brinjal and Grapes in India.
You specialize in crop health, disease identification, and agricultural advice.

Instructions:
- Answer questions specifically about Brinjal (Eggplant) or Grapes
- Provide practical, farmer-friendly advice
- Be concise and direct
- If asked about other crops, politely say you specialize in Brinjal and Grapes only
- Generate FRESH, UNIQUE answers every time (no repeated responses)
- Be specific to the question asked
`;

const getSystemInstruction = (language, contextData) => {
  const contextString = `
Location: ${contextData?.weather?.location || 'Unknown'}
Weather: ${contextData?.weather?.condition || 'N/A'} - ${contextData?.weather?.temp || 'N/A'}°C
Forecast: ${contextData?.weather?.rainForecast || 'N/A'}
Soil: ${contextData?.soil?.type || 'N/A'}, Nitrogen: ${contextData?.soil?.nitrogen || 'N/A'}
Language: ${language || 'English'}
`;

  return `${SYSTEM_INSTRUCTION_BASE}\n${contextString}`;
};

const extractJSON = (text) => {
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstOpen = cleanText.indexOf('{');
    const lastClose = cleanText.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1) {
      cleanText = cleanText.substring(firstOpen, lastClose + 1);
    }
    return JSON.parse(cleanText);
  } catch (e) {
    throw new Error(`Failed to parse JSON response: ${e.message}`);
  }
};

const validateApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment variables');
  }
  return apiKey;
};

// Chat Service
export const sendChatMessage = async (prompt, imageBase64, language, contextData) => {
  try {
    // ⚠️ NO CACHING for chat - users expect fresh responses every time
    // Caching is disabled to ensure each question gets a unique answer

    const apiKey = validateApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const systemInstruction = getSystemInstruction(language, contextData);

    console.log(`🗣️ Chat Service Called - Language: ${language || 'English'}`);
    console.log(`📝 Prompt: ${prompt.substring(0, 50)}...`);

    const parts = [];
    if (imageBase64) {
      const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
        console.log(`🖼️ Image attached: ${match[1]}`);
      }
    }
    parts.push({ text: prompt });

    const response = await geminiRequestQueue.execute(async () => {
      return await Promise.race([
        model.generateContent({
          contents: [{ role: 'user', parts: parts }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            topP: 0.9,
            topK: 40,
          },
          systemInstruction: systemInstruction,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout after 30s')), 30000))
      ]);
    });

    const result = {
      success: true,
      message: response.text || 'I could not generate a response.',
      language: language || 'English'
    };

    console.log(`✅ Chat message processed successfully in ${language || 'English'}`);
    return result;
  } catch (error) {
    console.error('❌ Chat Service Error:', error);
    
    // If API fails, generate dynamic fallback response
    if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota')) {
      console.warn('⚠️ API quota exceeded - Using dynamic fallback');
      const fallback = getFallbackChatResponse(prompt, language);
      return {
        success: true,
        message: fallback.message || fallback,
        language: language || 'English',
        fallback: true
      };
    }
    
    if (error.message.includes('API_KEY') || error.message.includes('not configured')) {
      return {
        success: true,
        message: `I'm currently helping farmers with Brinjal and Grapes farming advice. Please try again in a moment.`,
        language: language || 'English',
        fallback: true
      };
    }
    
    // For any other error, provide helpful fallback
    return {
      success: true,
      message: `Temporarily unavailable. I specialize in Brinjal and Grapes farming. Your question is important!`,
      language: language || 'English',
      fallback: true
    };
  }
};

// Analysis Service
export const analyzeCropHealthService = async (imageBase64, language, contextData) => {
  try {
    // Check cache first - use first 100 chars of image as key
    const cacheKey = { type: 'analysis', imageHash: imageBase64.substring(0, 100), language };
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const apiKey = validateApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      throw new Error('Invalid image format');
    }

    console.log(`🔍 Crop Analysis Started - Language: ${language || 'English'}`);
    console.log(`🖼️ Image type: ${match[1]}`);

    const systemInstruction = getSystemInstruction(language, contextData);

    const response = await geminiRequestQueue.execute(async () => {
      return await Promise.race([
        model.generateContent({
          contents: [{
            role: 'user',
            parts: [
              { inlineData: { mimeType: match[1], data: match[2] } },
              { text: 'Analyze this crop image for diseases. Focus ONLY on Brinjal or Grapes. If it\'s not one of these, say so. Return a detailed JSON response with keys: crop, diseaseName, confidence, cause, symptoms, treatmentPlan (with immediate, organic, chemical), and recommendations (with fertilizers, warnings).' }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
          },
          systemInstruction: systemInstruction,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout after 30s')), 30000))
      ]);
    });

    const result = {
      success: true,
      analysis: extractJSON(response.text),
      language: language || 'English'
    };

    // Cache the successful response
    cacheManager.set(cacheKey, result);
    console.log(`✅ Crop analysis completed successfully in ${language || 'English'}`);
    return result;
  } catch (error) {
    console.error('❌ Analysis Service Error:', error);
    
    // If it's a quota/rate limit error, use fallback response
    if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota')) {
      console.warn('⚠️ API quota exceeded - Using fallback analysis response');
      const fallback = {
        success: true,
        analysis: getFallbackAnalysisResponse(language),
        language: language || 'English',
        source: 'fallback'
      };
      return fallback;
    }
    
    throw error;
  }
};

// Location Data Service
export const getLocationContextData = async (locationInput) => {
  try {
    const apiKey = validateApiKey();
    const ai = new GoogleGenAI({ apiKey });

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
    console.log('✅ Location data fetched successfully');
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('❌ Location Service Error:', error);
    // Return default data on error
    return {
      success: false,
      data: {
        weather: {
          temp: 27,
          condition: 'Partly Cloudy',
          rainForecast: 'Light rain expected',
          location: typeof locationInput === 'string' ? locationInput : 'Your Location'
        },
        soil: {
          type: 'Black Soil',
          nitrogen: 'Medium',
          moisture: 'Moderate'
        }
      }
    };
  }
};
