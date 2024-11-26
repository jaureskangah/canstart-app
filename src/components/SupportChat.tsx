import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hello! I'm your CanStart assistant. How can I help you with your immigration and settlement process?",
    sender: 'bot',
    timestamp: new Date()
  }
];

const suggestedQuestions = [
  "What documents do I need for permanent residence?",
  "How do I apply for a Social Insurance Number?",
  "What healthcare coverage is available?",
  "How can I find housing in Canada?",
  "What are the job market requirements?"
];

export function SupportChat() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Simulate API call to get bot response
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate response based on user input
      let response = '';
      const lowercaseContent = content.toLowerCase();

      if (lowercaseContent.includes('document') || lowercaseContent.includes('permanent residence')) {
        response = "For permanent residence, you'll need: valid passport, language test results (IELTS/TEF), educational credentials assessment, and work experience letters. Would you like more specific details about any of these?";
      } else if (lowercaseContent.includes('sin') || lowercaseContent.includes('social insurance')) {
        response = "To get your Social Insurance Number (SIN), visit a Service Canada office with your permanent resident card or work permit and valid passport. The process usually takes about 15 minutes.";
      } else if (lowercaseContent.includes('health') || lowercaseContent.includes('healthcare')) {
        response = "Healthcare coverage varies by province. Generally, there's a waiting period of up to 3 months after arrival. During this time, it's recommended to get private health insurance. Would you like information about a specific province?";
      } else if (lowercaseContent.includes('housing') || lowercaseContent.includes('rent')) {
        response = "To find housing, you can: 1) Use our housing search tool, 2) Contact local real estate agents, 3) Check rental websites. What type of housing are you looking for?";
      } else if (lowercaseContent.includes('job') || lowercaseContent.includes('work')) {
        response = "For job searching in Canada, ensure you have: 1) An updated resume in Canadian format, 2) Required certifications/licenses, 3) References. Would you like help with any of these?";
      } else {
        response = "I understand you're asking about " + content + ". Could you please provide more specific details about what you'd like to know?";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Failed to get response');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-red-600" />
          <div>
            <h2 className="font-semibold text-gray-900">Support Assistant</h2>
            <p className="text-sm text-gray-500">Ask me anything about moving to Canada</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex gap-3 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {message.sender === 'user' ? (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-red-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
              <div
                className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader className="h-4 w-4 animate-spin" />
            <span className="text-sm">Assistant is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleSend(question)}
                className="text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
            rows={1}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}