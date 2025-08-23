import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  X,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askNeoRishi } from '@/services/panchangaService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface NeoRishiChatProps {
  isOpen: boolean;
  onClose: () => void;
  contextData: {
    date: string;
    ritu: string;
    tithi: string;
    nakshatra: string;
    moonPhase: string;
    dosha?: string;
    sankalpa?: string;
  };
}

export const NeoRishiChat: React.FC<NeoRishiChatProps> = ({ 
  isOpen, 
  onClose, 
  contextData 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Namaste! I'm NeoRishi, your AI spiritual guide. I can see you're exploring ${contextData.date} during ${contextData.ritu} season.\n\nI have access to your current Panchanga data, moon phase, and daily context. Ask me anything about:\n\n• Spiritual practices for today\n• Astrological insights\n• Personalized recommendations\n• Daily guidance based on lunar cycles\n\nHow can I assist you on your journey today?`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, contextData]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askNeoRishi(inputValue, contextData);
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const contextInfo = [
    { label: 'Date', value: contextData.date },
    { label: 'Ritu', value: contextData.ritu },
    { label: 'Tithi', value: contextData.tithi },
    { label: 'Nakshatra', value: contextData.nakshatra },
    { label: 'Moon Phase', value: contextData.moonPhase },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl max-h-[90vh] md:max-h-[80vh]"
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-primary to-accent">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <span>Ask NeoRishi</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-tulsi rounded-full animate-pulse" />
                      <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                  </div>
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowContext(!showContext)}
                    className="text-muted-foreground"
                  >
                    <Sparkles className="w-4 h-4" />
                    Context
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Context Panel */}
              <AnimatePresence>
                {showContext && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-muted/50 rounded-lg p-3 mt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Context being sent to NeoRishi:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {contextInfo.map(item => (
                          <div key={item.label} className="text-xs">
                            <span className="text-muted-foreground">{item.label}:</span>
                            <span className="ml-1 font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 max-h-96">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="p-2 rounded-full bg-gradient-to-r from-primary to-accent flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  } rounded-2xl px-4 py-3`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' 
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="p-2 rounded-full bg-secondary flex-shrink-0">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="p-2 rounded-full bg-gradient-to-r from-primary to-accent">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">NeoRishi is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about today's spiritual guidance..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Press Enter to send • AI responses are for guidance only
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};