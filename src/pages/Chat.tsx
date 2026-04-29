import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2, MapPin, RefreshCw } from 'lucide-react';
import { sendMessageToGemini } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import { ChatBubble } from '../../components/ChatBubble';
import { Button } from '../../components/Button';
import { useAppContext } from '../context/AppContext';
import { useLocationData } from '../hooks/useLocationData';

export const Chat: React.FC = () => {
  const { selectedLanguage, contextData, setContextData } = useAppContext();
  const { contextData: locationData, setLocationByName } = useLocationData();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaste! I am Kissan GPT, your specialist for **Brinjal** and **Grapes**. \n\nI can help you detect diseases, suggest treatments, and provide expert advice for these crops. \n\nनमस्कार! मी किसान GPT आहे. मी वांगी आणि द्राक्षे पिकांसाठी तुमचा तज्ञ आहे.",
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualLocationInput, setManualLocationInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContextData(locationData);
  }, [locationData, setContextData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleManualLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLocationInput.trim()) return;

    setShowLocationModal(false);
    try {
      await setLocationByName(manualLocationInput);
      setMessages((prev) => [
        ...prev,
        {
          id: `loc-manual-${Date.now()}`,
          role: 'model',
          text: `📍 Location updated to: **${manualLocationInput}**`,
          timestamp: Date.now()
        }
      ]);
      setManualLocationInput('');
    } catch (err) {
      console.error(err);
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

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(
        userMessage.text || (selectedImage ? 'Analyze this image for Brinjal or Grapes' : ''),
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

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: 'Sorry, I encountered an error. Please try again.',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-stone-50 relative overflow-hidden">
      {/* Header */}
      <header className="bg-emerald-700 text-white p-4 shadow-md flex justify-between items-center sticky top-16 z-10">
        <div className="flex items-center gap-3">
          <div className="font-bold text-lg">Kissan GPT Chat</div>
          <p className="text-[11px] text-emerald-200 uppercase tracking-widest font-bold hidden sm:block">
            Brinjal & Grapes Specialist
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLocationModal(true)}
            className="p-2 hover:bg-emerald-600 rounded-lg transition-colors"
            title="Change Location"
          >
            <MapPin size={20} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
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
              <img
                src={selectedImage}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-xl border-2 border-emerald-500"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
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
      </main>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Set Location</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleManualLocationSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-stone-700 mb-2 block">
                  Enter Location (City/District)
                </label>
                <input
                  type="text"
                  value={manualLocationInput}
                  onChange={(e) => setManualLocationInput(e.target.value)}
                  placeholder="e.g., Nashik, Maharashtra"
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Button type="submit" className="w-full">
                  <MapPin size={18} />
                  Update Location
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setShowLocationModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>

            <p className="text-xs text-stone-500 text-center mt-4">
              Current: <strong>{contextData.weather.location}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
