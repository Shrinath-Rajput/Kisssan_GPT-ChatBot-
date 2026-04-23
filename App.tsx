import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Mic, X, Loader2, Leaf, MapPin, RefreshCw, Activity, ShieldCheck, ChevronRight } from 'lucide-react';
import { sendMessageToGemini, getLiveContextData } from './services/geminiService';
import { ChatMessage, Language, AppContextData } from './types';
import { Widgets } from './components/Widgets';
import { ChatBubble } from './components/ChatBubble';
import { CropHealthAnalyzer } from './components/CropHealthAnalyzer';

const DEFAULT_DATA: AppContextData = {
  weather: {
    temp: 0,
    condition: 'Detecting...',
    rainForecast: 'Fetching forecast...',
    location: 'Locating...'
  },
  soil: {
    type: 'Detecting...',
    nitrogen: 'Medium',
    moisture: 'Moderate'
  }
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaste! I am Kissan GPT, your specialist for **Brinjal** and **Grapes**. \n\nI can help you detect diseases, suggest treatments, and provide expert advice for these crops. \n\nनमस्कार! मी किसान GPT आहे. मी वांगी आणि द्राक्षे पिकांसाठी तुमचा तज्ञ आहे.",
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.ENGLISH);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(true);
  const [contextData, setContextData] = useState<AppContextData>(DEFAULT_DATA);
  
  // UI State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [manualLocationInput, setManualLocationInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchCurrentLocationData();
  }, []);

  const fetchCurrentLocationData = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const liveData = await getLiveContextData({ lat: latitude, long: longitude });
            
            if (liveData) {
              setContextData(liveData);
              setMessages(prev => [
                ...prev, 
                {
                  id: `loc-found-${Date.now()}`,
                  role: 'model',
                  text: `📍 Location detected: **${liveData.weather.location}**\nLive weather and soil data updated.`,
                  timestamp: Date.now()
                }
              ]);
            }
          } catch (e) {
            console.error("Error fetching live data", e);
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Geolocation denied", error);
          setIsLocating(false);
          setContextData(prev => ({
             ...prev,
             weather: { ...prev.weather, location: "Select Location", condition: "Unknown" }
           }));
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleManualLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLocationInput.trim()) return;

    setShowLocationModal(false);
    setIsLocating(true);
    
    try {
        const liveData = await getLiveContextData(manualLocationInput);
        if (liveData) {
            setContextData(liveData);
            setMessages(prev => [
                ...prev, 
                {
                  id: `loc-manual-${Date.now()}`,
                  role: 'model',
                  text: `📍 Location set to: **${liveData.weather.location}**`,
                  timestamp: Date.now()
                }
            ]);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsLocating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    const responseText = await sendMessageToGemini(
      userMessage.text || (selectedImage ? "Analyze this image for Brinjal or Grapes" : ""),
      userMessage.image,
      selectedLanguage,
      contextData
    );

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-stone-50 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-emerald-700 text-white p-4 shadow-md flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Leaf className="text-emerald-300" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Kissan GPT</h1>
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-bold">Brinjal & Grapes Specialist</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as Language)}
            className="bg-emerald-800 text-xs border-none rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
          >
            <option value={Language.ENGLISH}>English</option>
            <option value={Language.HINDI}>Hindi</option>
            <option value={Language.MARATHI}>Marathi</option>
          </select>
          <button 
            onClick={() => setShowLocationModal(true)}
            className="p-2 hover:bg-emerald-600 rounded-lg transition-colors"
            title="Change Location"
          >
            <MapPin size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar / Widgets */}
        <aside className="w-full md:w-72 p-4 bg-stone-50 border-b md:border-b-0 md:border-r border-stone-200 overflow-y-auto scrollbar-hide">
          <Widgets data={contextData} onAnalyzeClick={() => setShowAnalyzer(true)} />
          
          <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-800 uppercase mb-2 flex items-center gap-1">
              <ShieldCheck size={14} /> Expert Support
            </h4>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              I am trained to identify diseases like **Leaf Spot**, **Bacterial Wilt** in Brinjal and **Downy Mildew**, **Powdery Mildew** in Grapes.
            </p>
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col bg-white relative">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-stone-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-emerald-600" />
                  <span className="text-xs text-stone-500">Kissan GPT is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-stone-100 bg-white">
            {selectedImage && (
              <div className="mb-3 relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-xl border-2 border-emerald-500" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-stone-100 p-2 rounded-2xl border border-stone-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-stone-500 hover:text-emerald-600 transition-colors"
                title="Upload Image"
              >
                <ImageIcon size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Brinjal or Grapes..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
              />
              
              <button 
                onClick={handleSend}
                disabled={(!inputText.trim() && !selectedImage) || isLoading}
                className="bg-emerald-600 text-white p-2 rounded-xl disabled:opacity-50 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Set Location</h3>
              <button onClick={() => setShowLocationModal(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleManualLocationSubmit} className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="text"
                  value={manualLocationInput}
                  onChange={(e) => setManualLocationInput(e.target.value)}
                  placeholder="Enter City or Village Name"
                  className="w-full pl-10 pr-4 py-3 bg-stone-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  autoFocus
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
              >
                Update Data
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowLocationModal(false);
                  fetchCurrentLocationData();
                }}
                className="w-full flex items-center justify-center gap-2 text-emerald-600 font-semibold py-2"
              >
                <RefreshCw size={16} /> Use My GPS
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Crop Health Analyzer Modal */}
      {showAnalyzer && (
        <CropHealthAnalyzer 
          contextData={contextData} 
          language={selectedLanguage} 
          onClose={() => setShowAnalyzer(false)} 
        />
      )}
    </div>
  );
};

export default App;
