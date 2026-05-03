import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2, MapPin } from 'lucide-react';
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
      text: "Namaste! I am Kissan GPT 🌱\n\nI help with Brinjal & Grapes diseases, treatment & farming tips.",
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
  }, [locationData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // IMAGE UPLOAD
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // SEND MESSAGE (🔥 FIXED)
  const handleSend = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText || (selectedImage ? "Analyze this crop image" : ""),
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const res = await sendMessageToGemini(
        userMsg.text,
        userMsg.image,
        selectedLanguage,
        contextData
      );

      // ✅ FIX: handle object or string
      let replyText = '';

      if (typeof res === 'string') {
        replyText = res;
      } else if (res?.reply) {
        replyText = res.reply;
      } else {
        replyText = JSON.stringify(res);
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: replyText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMsg]);

    } catch (err) {
      console.error(err);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: "❌ Chat failed. Try again.",
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // LOCATION
  const handleManualLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLocationInput.trim()) return;

    await setLocationByName(manualLocationInput);

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'model',
        text: `📍 Location updated to ${manualLocationInput}`,
        timestamp: Date.now()
      }
    ]);

    setManualLocationInput('');
    setShowLocationModal(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-stone-50">

      {/* HEADER */}
      <header className="bg-emerald-700 text-white p-4 flex justify-between">
        <h2 className="font-bold">Kissan GPT Chat</h2>
        <button onClick={() => setShowLocationModal(true)}>
          <MapPin />
        </button>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex gap-2">
            <Loader2 className="animate-spin" />
            <span>Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white border-t">

        {selectedImage && (
          <div className="mb-2">
            <img src={selectedImage} className="h-16 rounded" />
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={() => fileInputRef.current?.click()}>
            <ImageIcon />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Ask about crops..."
            className="flex-1 border p-2 rounded"
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />

          <button
            onClick={handleSend}
            className="bg-emerald-600 text-white px-4 rounded"
          >
            <Send />
          </button>
        </div>
      </div>

      {/* LOCATION MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={handleManualLocationSubmit} className="bg-white p-5 rounded">
            <input
              value={manualLocationInput}
              onChange={(e) => setManualLocationInput(e.target.value)}
              placeholder="Enter city"
              className="border p-2 w-full mb-2"
            />
            <Button type="submit">Update</Button>
          </form>
        </div>
      )}
    </div>
  );
};