import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { User, Bot, Volume2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const { selectedLanguage } = useAppContext();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    // Only speak bot messages
    if (isUser) return;

    // Stop if already speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    // Remove markdown formatting for speech
    const plainText = message.text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/###\s/g, '')
      .replace(/##\s/g, '')
      .replace(/#\s/g, '')
      .replace(/`/g, '')
      .replace(/\n/g, ' ');

    const utterance = new SpeechSynthesisUtterance(plainText);

    // Set language based on selected language
    const languageMap: { [key: string]: string } = {
      'English': 'en-US',
      'Marathi': 'mr-IN',
      'Hindi': 'hi-IN'
    };

    utterance.lang = languageMap[selectedLanguage] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
          isUser ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-600 text-white'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message Content */}
        <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
          isUser 
            ? 'bg-emerald-600 text-white rounded-tr-none' 
            : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'
        }`}>
          {message.image && (
            <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
              <img src={message.image} alt="Uploaded crop" className="w-full h-auto max-h-64 object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
          <div className="prose prose-sm max-w-none prose-stone dark:prose-invert prose-p:leading-relaxed prose-pre:bg-stone-800 prose-pre:text-stone-100">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
          
          {/* Speak Button for Bot Messages */}
          {!isUser && (
            <button
              onClick={handleSpeak}
              className={`mt-3 flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                isSpeaking
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
              }`}
              title={selectedLanguage === 'Marathi' ? 'बोला' : selectedLanguage === 'Hindi' ? 'बोलें' : 'Speak'}
            >
              <Volume2 size={14} />
              {isSpeaking ? 'Stop' : 'Speak'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
