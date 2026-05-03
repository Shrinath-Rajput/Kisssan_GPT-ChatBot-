import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiRequestQueue } from '../utils/requestQueue.js';
import { cacheManager } from '../utils/cache.js';
import { getFallbackAnalysisResponse, getFallbackChatResponse } from '../utils/fallbackResponses.js';

const SYSTEM_INSTRUCTION_BASE = `
You are Kissan GPT, an AI specialist for Indian farmers, specifically focusing on Brinjal (Eggplant) and Grapes.
Your job is to analyze images and text queries to provide expert agricultural advice RELATED ONLY TO THESE TWO CROPS.

🎯 CRITICAL INSTRUCTIONS
1. ANSWER THE EXACT QUESTION THE USER ASKS - Be direct and specific
2. If user asks "what is grapes" - give DETAILED info about grapes (characteristics, uses, climate, soil, water needs, diseases, etc.)
3. If user asks "what is brinjal" - give DETAILED info about brinjal (characteristics, uses, climate, soil, water needs, diseases, etc.)
4. If user asks "what is virat kohli" or any non-agricultural question - politely say "I only specialize in Brinjal and Grapes farming"
5. NEVER give generic farming advice when user asks about a specific topic
6. NEVER repeat the same answer for different questions

🎯 CROP SPECIFICATIONS
BRINJAL (Solanum melongena):
- Uses: Vegetable crop for cooking, market sale, high nutritional value
- Growing Season: 8-9 months from seed to harvest
- Ideal Temperature: 20-30°C
- Soil: Well-drained, fertile, pH 6.0-6.8
- Water: Regular but avoid waterlogging
- Spacing: 45cm x 60cm
- Yield: 40-50 tonnes per hectare
- Common Diseases: Leaf Spot, Damping Off, Powdery Mildew, Bacterial Wilt
- Common Pests: Spider Mites, Shoot & Fruit Borer

GRAPES (Vitis spp.):
- Uses: Fresh consumption, raisins, juice, wine production
- Growing: Perennial plant, productive for 50+ years
- Ideal Temperature: 15-25°C
- Soil: Well-drained, slightly acidic, pH 6.0-7.0
- Water: Deep but infrequent watering
- Spacing: 8-10 feet between vines
- Yield: 20-40 tonnes per hectare
- Common Diseases: Powdery Mildew, Black Rot, Downy Mildew, Anthracnose
- Common Pests: Japanese Beetle, Spider Mites, Leafhoppers

🎯 RESPONSE RULES
1. Language: Match user's language selection (English, Hindi, Marathi)
2. Format: Be concise, practical, and farmer-friendly
3. Questions about grapes → ONLY grape information
4. Questions about brinjal → ONLY brinjal information
5. Questions about non-farm topics → Politely redirect
6. Image analysis → Identify crop, disease, symptoms, treatment plan
7. For chemicals → Always mention safe usage and dilution rates

⚠️ DO NOT:
- Give generic answers when specific crop is mentioned
- Repeat cached responses
- Give answers about crops other than Brinjal/Grapes
- Use hardcoded responses - always generate fresh answers

🎯 GENERATE DYNAMIC, FRESH ANSWERS
Each conversation is unique. Generate new, contextual answers based on:
- Weather data provided
- Soil data provided  
- User's specific question
- Selected language
`;

const getSystemInstruction = (language, contextData) => {
  const contextString = `
  🌍 LIVE CONTEXT DATA FOR THIS CONVERSATION:
  - Weather: ${contextData?.weather?.condition || 'N/A'}, ${contextData?.weather?.temp || 'N/A'}°C
  - Rain Forecast: ${contextData?.weather?.rainForecast || 'N/A'}
  - Location: ${contextData?.weather?.location || 'N/A'}
  - Soil Type: ${contextData?.soil?.type || 'N/A'}
  - Nitrogen Level: ${contextData?.soil?.nitrogen || 'N/A'}
  - Soil Moisture: ${contextData?.soil?.moisture || 'N/A'}
  - User Language: ${language || 'English'}
  
  ⚡ REMEMBER: Answer the user's EXACT question with specific, dynamic information. Do NOT use generic responses.
  `;

  return `${SYSTEM_INSTRUCTION_BASE}\n\n${contextString}`;
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
    
    // ⚠️ NEVER use fallback for chat - always return fresh AI response
    // If API fails, throw error so frontend knows about it
    if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('⚠️ API quota exceeded. Please try again in a moment.');
    }
    
    if (error.message.includes('API_KEY')) {
      throw new Error('❌ BACKEND ERROR: GEMINI_API_KEY is not configured.');
    }
    
    // Re-throw original error
    throw error;
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
