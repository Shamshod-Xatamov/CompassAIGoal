import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Sparkles, Compass } from 'lucide-react';

interface ChatScreenProps {
  onComplete?: (data: any) => void;
}

export function ChatScreen({ onComplete }: ChatScreenProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: "Hi! I'm Compass AI, your guide to discovering your North Star. 🌟\n\nI'm here to help you uncover what truly matters to you through a simple conversation. Ready to start?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-focus textarea on mount
    textareaRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      
      if (messages.length === 1) {
        // First user message
        aiResponse = "That's wonderful! Let me help you dig deeper. 🎯\n\nThink about what you just shared. Why is that important to you? What does it mean for your life?";
      } else if (messages.length === 3) {
        aiResponse = "I can see this really matters to you. Let's go one level deeper.\n\nWhy does that aspect resonate so strongly with you? What would achieving this give you?";
      } else if (messages.length === 5) {
        aiResponse = "We're getting to the core now. 💫\n\nIf you achieved all of this, how would your life be different? What would that enable you to do or become?";
      } else if (messages.length === 7) {
        aiResponse = "This is powerful. I can see your North Star emerging.\n\nOne more question: When you imagine yourself living this way, what feeling do you have? What's the deepest desire underneath it all?";
      } else if (messages.length === 9) {
        aiResponse = "✨ Beautiful! I think we've found your North Star.\n\nBased on our conversation, your North Star is about creating a life of meaningful impact and personal fulfillment—where you're making a difference while staying true to yourself.\n\nWould you like to create your first Quest to start moving toward this vision?";
      } else {
        aiResponse = "That's a great insight. Tell me more about what drives you in this area.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const suggestedPrompts = [
    "I want to build something meaningful",
    "I want to improve my health and energy",
    "I want to develop new skills",
    "I want better relationships",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg text-slate-900">Compass AI</h1>
              <p className="text-xs text-slate-500">Your North Star Guide</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span className="text-xs text-indigo-600">Discovery Mode</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex gap-3 max-w-[80%]">
                  {msg.sender === 'ai' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`px-5 py-3 rounded-2xl whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-sm">You</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-slate-400 rounded-full"
                            animate={{
                              y: [0, -8, 0],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggested Prompts (only show at start) */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-start"
              >
                <div className="flex flex-col gap-2 ml-11">
                  <p className="text-xs text-slate-500 mb-1">Try one of these:</p>
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(prompt)}
                      className="text-left px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Share what's on your mind..."
                className="resize-none min-h-[56px] max-h-[200px] pr-12 bg-white border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-2xl shadow-sm"
                rows={1}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
          
          <p className="text-xs text-slate-400 mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
