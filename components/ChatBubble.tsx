import React from 'react';
import { ChatMessage } from '../types';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

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
        </div>
      </div>
    </div>
  );
};
