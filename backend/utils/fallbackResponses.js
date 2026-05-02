// Fallback/Demo responses when API quota is exceeded
// Allows the app to continue functioning with realistic sample data

export const getFallbackAnalysisResponse = (language = 'English', imageType = 'brinjal') => {
  const responses = {
    English: {
      brinjal: {
        crop: 'Brinjal (Eggplant)',
        diseaseName: 'Leaf Spot (Phomopsis Blight)',
        confidence: '85%',
        cause: 'Fungal infection (Phomopsis vexans) - common in humid weather above 25°C',
        symptoms: 'Brown circular spots with concentric rings on leaves and stems, yellowing of affected areas, premature leaf drop',
        treatmentPlan: {
          immediate: 'Remove affected leaves and destroy them. Improve air circulation by pruning lower branches.',
          organic: 'Spray Bordeaux mixture (1%) every 7-10 days. Apply neem oil (5%) early morning or late evening.',
          chemical: 'Spray Mancozeb (0.2%) or Carbendazim (0.05%) alternately every 10 days. Use fungicides with copper sulfate.'
        },
        recommendations: {
          fertilizers: 'Apply balanced NPK (20:20:20) + Micronutrients (Zn, B, Mg) every 2 weeks',
          warnings: '⚠️ Avoid overhead watering - water at soil level only. Remove infected plant debris immediately. Disinfect tools between cuts.',
          nextSteps: 'Spray preventive fungicide every 15 days. Monitor closely for disease spread.'
        }
      },
      grapes: {
        crop: 'Grapes (Vitis spp.)',
        diseaseName: 'Powdery Mildew',
        confidence: '80%',
        cause: 'Fungal infection (Uncinula necator) - spreads in warm, dry weather (20-26°C)',
        symptoms: 'White powdery coating on leaves, berries, and shoots. Clusters may remain small and acid.',
        treatmentPlan: {
          immediate: 'Prune affected shoots to remove spores. Increase air circulation through canopy.',
          organic: 'Spray sulfur powder (2-3%) or potassium bicarbonate solution (1%) every 7-10 days.',
          chemical: 'Use Triazole fungicides like Triadimefon (0.1%) or Tebuconazole (0.05%) alternately.'
        },
        recommendations: {
          fertilizers: 'Apply K-rich fertilizer (Potassium Sulphate) 20g per plant every 2 weeks',
          warnings: '⚠️ Don\'t spray when temperature >30°C. Sulfur requires 2-week gap with other fungicides. Harvest fruit before spraying.',
          nextSteps: 'Continue preventive sprays through fruit development. Monitor for botrytis after mildew control.'
        }
      }
    },
    Marathi: {
      brinjal: {
        crop: 'वांगी (बेनगन)',
        diseaseName: 'पत्र्याचे डाग (लीफ स्पॉट)',
        confidence: '85%',
        cause: 'बुरशीचा संसर्ग - उच्च आर्द्रतेमुळे अधिक होतो',
        symptoms: 'पत्र्यांवर तपकिरी गोल डाग, आणि ते वळणे - पीळपणा होतो',
        treatmentPlan: {
          immediate: 'संक्रमित पान काढून टाकून मिट्टीत गाडा',
          organic: 'बोर्डो मिश्रण (१%) छिडकावा - १० दिवसांअंतराने',
          chemical: 'मॅंकोजेब (०.२%) किंवा कार्बेंडाजिम (०.०५%) छिडकावा'
        },
        recommendations: {
          fertilizers: 'संतुलित खते (NPK) आणि सूक्ष्म पोषक द्रव्य २ आठवड्यांअंतराने',
          warnings: '⚠️ वरून पाणी देऊ नका - मुळांजवळ पाणी देवे. संक्रमित भाग लगेच काढून टाका.',
          nextSteps: 'रोग नियंत्रण हेतू नियमित छिडकाव चालू ठेवा'
        }
      }
    },
    Hindi: {
      brinjal: {
        crop: 'बैंगन',
        diseaseName: 'पत्ती धब्बा (लीफ स्पॉट)',
        confidence: '85%',
        cause: 'फंगल संक्रमण - उच्च नमी में अधिक होता है',
        symptoms: 'पत्तियों पर भूरे गोल धब्बे, पीलापन, पत्तियां गिरना',
        treatmentPlan: {
          immediate: 'संक्रमित पत्तियों को हटाकर नष्ट करें',
          organic: 'बोर्डो मिश्रण (1%) को 10 दिन के अंतराल पर छिड़कें',
          chemical: 'मैंकोजेब (0.2%) या कार्बेंडाजिम (0.05%) छिड़कें'
        },
        recommendations: {
          fertilizers: 'संतुलित खाद (NPK) २ हफ्तों में दें',
          warnings: '⚠️ ऊपर से पानी न दें। संक्रमित भाग तुरंत हटाएं।',
          nextSteps: 'रोग नियंत्रण के लिए नियमित छिड़काव करें'
        }
      }
    }
  };

  const lang = responses[language] || responses['English'];
  const defaultCrop = imageType.toLowerCase().includes('grape') ? 'grapes' : 'brinjal';
  return lang[defaultCrop] || lang['brinjal'];
};

export const getFallbackWeatherResponse = (location = 'Unknown') => {
  return {
    location: location || 'Your Location',
    temp: '28',
    condition: 'Partly Cloudy',
    humidity: '65%',
    windSpeed: '12 km/h',
    rainForecast: 'Low (10%)',
    soilMoisture: 'Good (70%)',
    timestamp: new Date().toISOString()
  };
};

export const getFallbackChatResponse = (message = '', language = 'English') => {
  const responses = {
    English: [
      'For brinjal, ensure regular watering but avoid waterlogging. Space plants 45cm apart for good air circulation.',
      'Grapes need regular pruning to maintain shape and improve fruit quality. Prune during dormancy.',
      'Always scout your fields regularly for early signs of diseases. Early detection saves crops!',
      'Organic farming improves soil health. Rotate crops yearly and add compost regularly.',
      'For maximum yield, ensure adequate sunlight (6-8 hours daily) and proper drainage.',
      'Use certified disease-free seeds from authorized agricultural centers.',
      'Monitor soil pH regularly. Most vegetables prefer slightly acidic soil (6.0-6.8 pH).',
      'Integrated Pest Management (IPM) is the best approach - combine cultural, biological, and chemical methods.'
    ],
    Marathi: [
      'वांग्यासाठी नियमित पाणी द्या पण जलभराव टाळा। पौधे ४५ सेमी अंतरावर लावा।',
      'द्राक्षावेली नियमित प्रुनिंग करावी. सुप्तावस्थेत प्रुनिंग करावे.',
      'नियमित शेत निरीक्षण करा - रोग लवकर आढळले तर नियंत्रण सोपे होते.',
      'जैव शेती करा - प्रतिवर्ष पिकांचे चक्रीकरण करा आणि खाद मिळवा.'
    ],
    Hindi: [
      'बैंगन के लिए नियमित पानी दें पर जलभराव से बचें। पौधे 45cm दूरी पर लगाएं।',
      'अंगूरों को नियमित प्रूनिंग की जरूरत है। सर्दियों में प्रूनिंग करें।',
      'खेत का नियमित निरीक्षण करें - शुरुआती चेतावनी बेहतर है।',
      'जैविक खेती करें - हर साल फसलें घुमाएं और खाद डालें।'
    ]
  };

  const langResponses = responses[language] || responses['English'];
  const randomIndex = Math.floor(Math.random() * langResponses.length);
  
  return {
    success: true,
    message: langResponses[randomIndex],
    language: language,
    source: 'demo'
  };
};
