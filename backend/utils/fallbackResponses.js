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
  // Detect what the user is asking about
  const msgLower = message.toLowerCase();
  const isAboutGrapes = msgLower.includes('grape') || msgLower.includes('wine') || msgLower.includes('raisin') || msgLower.includes('vitis');
  const isAboutBrinjal = msgLower.includes('brinjal') || msgLower.includes('eggplant') || msgLower.includes('baingan') || msgLower.includes('वांग') || msgLower.includes('बैंगन') || msgLower.includes('solanum');
  
  const responses = {
    English: {
      grapes: [
        'Grapes are a perennial fruit crop that can produce for 50+ years. They need well-drained soil, regular pruning, and trellising for support. Ideal temperature is 15-25°C for best quality fruit. They can be used for fresh consumption, raisins, juice, or wine production.',
        'For grape cultivation, provide deep but infrequent watering. Space vines 8-10 feet apart for proper air circulation. The growing season is 120-180 days. Common diseases include Powdery Mildew, Black Rot, and Downy Mildew which can be controlled with proper fungicide application.',
        'Grapes require consistent mineral nutrition throughout the growing season. Apply balanced fertilizers (NPK) and ensure adequate Boron, Zinc, and Magnesium for quality fruit development. Harvest when sugar content reaches 18-20 Brix for optimal flavor.',
        'To prevent grape diseases like Powdery Mildew, ensure good air circulation through proper pruning. Use sulfur-based fungicides during dry seasons (every 7-14 days). Maintain proper canopy management to allow sunlight penetration and reduce humidity.',
        'Grapes can yield 20-40 tonnes per hectare. Prune during dormancy to maintain vine shape. Remove diseased leaves immediately. Use certified disease-free vines from authorized nurseries. Monitor for Japanese Beetles and Spider Mites as common pests.',
        'Grape vines need support structures (trellises or stakes). They require 6-8 hours of direct sunlight daily. Soil pH should be 6.0-7.0. Drip irrigation is better than overhead watering to reduce disease pressure and save water.'
      ],
      brinjal: [
        'Brinjal (Eggplant - Solanum melongena) is a warm-season vegetable that thrives in 20-30°C temperature. It requires 8-9 months from seed to harvest. Space plants 45cm x 60cm apart for good air circulation. Expected yield is 40-50 tonnes per hectare with proper management.',
        'For brinjal cultivation, ensure regular but measured watering to avoid waterlogging which causes root rot. Use well-drained fertile soil with good organic matter (5-10 tonnes compost/hectare). Common pests include Spider Mites, Shoot & Fruit Borer, and Lace Bugs.',
        'Brinjal is rich in vitamins, minerals, and antioxidants. It is widely used in cooking and has high market value. Pick fruits when they are glossy dark purple for best market price. Each plant can produce 15-25 fruits under good management.',
        'To control brinjal diseases like Leaf Spot (Phomopsis Blight), remove infected plant parts immediately and destroy them. Use Bordeaux mixture (1%) or neem oil (5%) as organic solutions. Chemical options include Mancozeb (0.2%) or Carbendazim (0.05%) with proper dilution ratios.',
        'Brinjal plants need good fertilization schedule. Apply NPK (20:20:20) every 2 weeks along with micronutrients (Zn, B, Mg). Ensure 6-8 hours of daily sunlight for maximum yield. Remove lower leaves for better air circulation and disease prevention.',
        'Start brinjal from seeds indoors 8-10 weeks before transplanting. Transplant seedlings when they have 4-6 true leaves. Support plants with stakes or strings as they grow. Scout regularly for early signs of diseases like Damping Off in nursery and Powdery Mildew in field.'
      ],
      general: [
        'For both Brinjal and Grapes farming, the key to success is regular field scouting. Check plants 2-3 times per week for early signs of diseases, pests, or nutrient deficiencies. Early detection allows for timely intervention and better crop protection.',
        'Organic farming improves soil health significantly over time. Practice crop rotation yearly, add 5-10 tonnes of compost per hectare, and use green manuring. This reduces pest and disease buildup naturally.',
        'Always use certified disease-free seeds and planting materials from authorized agricultural centers. This is the first and most important step in crop management to avoid introducing diseases into your fields.',
        'Integrated Pest Management (IPM) is the best sustainable approach. Combine cultural methods (pruning, sanitation), biological controls (beneficial insects), and chemical methods (when necessary) only as last resort.',
        'Monitor soil pH regularly. Most crops perform best at pH 6.0-7.0. Test soil annually and amend with lime or sulfur as needed. Proper pH ensures optimal nutrient availability and uptake by plants.',
        'Water management is critical. Provide 25-30mm water per week for Brinjal and deep but infrequent watering for Grapes. Use drip irrigation to save water and reduce disease pressure. Avoid overhead watering in evenings.'
      ]
    },
    Marathi: {
      grapes: [
        'द्राक्ष हे बहुवर्षीय फसल आहे जी ५०+ वर्षे देते. त्याला चांगले ड्रेनेज असलेली मातीची गरज आहे, नियमित प्रुनिंग करावी लागते. आदर्श तापमान १५-२५°C आहे. ताजे फल, किसमिस, रस किंवा वाइन बनवण्यासाठी वापरले जाते.',
        'द्राक्षासाठी खोल पण कमी वारंवार पाणी द्या. वेलींमधील अंतर ८-१० फूट ठेवा. पावडरी मिल्ड्यू आणि ब्लॅक रॉट हे मुख्य रोग आहेत. सल्फर आधारित फंजिसाइड वापरा.',
        'द्राक्षावेली नियमित निरीक्षण करा. रोग लक्षण दिसले तर लगेच उपचार करा. सुप्तावस्थेत शाखा छेदन (प्रुनिंग) करावे. रोग मुक्त वेली लागवड करा.',
        'द्राक्षाला संतुलित खते (NPK) आणि सूक्ष्म पोषक द्रव्य (जस्त, बोरॉन) लागतात. २०-४० टन उत्पादन हेक्टरी मिळते. बोरॉक्स मिश्रण साल्फरसह फंजिसाइड वापरा.'
      ],
      brinjal: [
        'वांगी (बेनगन) हे उष्ण ऋतूचे भाजीपाला आहे जी २०-३०°C तापमानात उगतो. लागवड पासून कापणी पर्यंत ८-९ महिने लागतात. पौधे ४५x६० सेमी दूरावर लावा. ४०-५० टन उत्पादन मिळते.',
        'वांग्यासाठी नियमित पाणी द्या पण जलभराव टाळा. सड़े माटीला जैव पदार्थ मिळवा. पत्र्याचे डाग, शूट बोअर हे मुख्य कीटक आहेत. बॉर्डो मिश्रण वापरा.',
        'वांगी पोषकांनी समृद्ध आहे. फल गडद जांभळ्या रंगाचे झाल्यावर तोडा. प्रत्येक रोप १५-२५ फल देते. मल्चिंग करून आर्द्रता राखा.',
        'वांग्याला NPK (२०:२०:२०) खते हर २ आठवड्यांअंतराने द्या. सूक्ष्म पोषक द्रव्य मिळवा. ६-८ तास सूर्यप्रकाश लागतो. निचली पाने काढा.'
      ]
    },
    Hindi: {
      grapes: [
        'अंगूर एक बहुवर्षीय फसल है जो 50+ साल तक पैदावार देता है। अच्छी जल निकासी वाली मिट्टी, नियमित प्रूनिंग जरूरी है। आदर्श तापमान 15-25°C है। ताजे फल, किसमिस, जूस या वाइन बनाने में उपयोग होता है।',
        'अंगूरों को गहरा पर कम बार पानी दें। बेलों के बीच 8-10 फीट की दूरी रखें। पाउडरी मिल्ड्यू और ब्लैक रॉट मुख्य रोग हैं। सल्फर आधारित कवकनाशी का उपयोग करें।',
        'अंगूर की बेलों का नियमित निरीक्षण करें। रोग के लक्षण दिखें तो तुरंत इलाज करें। सर्दियों में प्रूनिंग करें। रोग-मुक्त बेलें लगाएं।',
        'अंगूरों को संतुलित खाद (NPK) और सूक्ष्म पोषक तत्व (जस्ता, बोरॉन) चाहिए। 20-40 टन प्रति हेक्टेयर पैदावार मिलती है। ड्रिप सिंचाई बेहतर है।'
      ],
      brinjal: [
        'बैंगन गर्म मौसम की सब्जी है जो 20-30°C तापमान में उगती है। बीज से कटाई तक 8-9 महीने लगते हैं। पौधे 45x60 सेमी दूरी पर लगाएं। 40-50 टन प्रति हेक्टेयर उत्पादन मिलता है।',
        'बैंगन को नियमित पर नियंत्रित पानी दें। जलभराव से बचें। उपजाऊ मिट्टी में जैव पदार्थ मिलाएं। पत्ती धब्बा और शूट बोअर मुख्य कीटक हैं।',
        'बैंगन विटामिन और खनिजों से भरपूर है। फल गहरे बैंगनी रंग के होने पर तोड़ें। प्रत्येक पौधा 15-25 फल दे सकता है। मल्चिंग करके नमी बनाए रखें।',
        'बैंगन को NPK (20:20:20) खाद हर 2 हफ्ते दें। सूक्ष्म पोषक तत्व जोड़ें। 6-8 घंटे धूप चाहिए। निचली पत्तियां हटाएं।'
      ]
    }
  };

  const langResponses = responses[language] || responses['English'];
  let selectedCategory = 'general';
  
  if (isAboutGrapes) {
    selectedCategory = 'grapes';
  } else if (isAboutBrinjal) {
    selectedCategory = 'brinjal';
  }

  const categoryResponses = langResponses[selectedCategory] || langResponses['general'];
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  
  return categoryResponses[randomIndex];
};
