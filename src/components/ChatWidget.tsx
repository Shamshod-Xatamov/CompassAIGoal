import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { MessageCircle, X, Send } from 'lucide-react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: "Hi! I'm your Compass AI. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { sender: 'user', text: userMessage }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "I'm here to help! What would you like to know?";
      
      if (userMessage.toLowerCase().includes('pause')) {
        aiResponse = "Done. I've paused the Quest and will archive your tasks for now. This will free up more focus for your other goals.";
      } else if (userMessage.toLowerCase().includes('help')) {
        aiResponse = "I can help you adjust your goals, pause quests, review your progress, or answer questions about your journey.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 1000);
  };

  const suggestedPrompts = [
    "How's my progress this week?",
    "Pause my Learn Guitar Quest",
    "Add a new milestone",
  ];

  return (
    <>
      {/* Chat Icon */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-2xl"
              size="icon"
            >
              <MessageCircle className="w-7 h-7" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-8 right-8 z-50">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-80 mb-3"
            >
              <Card className="shadow-2xl border-2 overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 text-white p-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">Compass AI</span>
                </div>

                {/* Messages */}
                <div className="h-64 overflow-y-auto p-3 bg-slate-50">
                  <div className="space-y-3">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                            msg.sender === 'user'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-slate-800 border'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Suggested Prompts */}
                  {messages.length <= 1 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-slate-500 mb-1">Suggested actions:</p>
                      {suggestedPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInput(prompt);
                          }}
                          className="block w-full text-left px-3 py-1.5 text-xs bg-white border rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-2 bg-white border-t">
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type your message..."
                      className="resize-none text-sm"
                      rows={1}
                    />
                    <Button
                      onClick={handleSend}
                      size="icon"
                      className="bg-indigo-600 hover:bg-indigo-700 flex-shrink-0 h-8 w-8"
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Floating Close Button */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex justify-end"
            >
              <Button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-xl"
                size="icon"
              >
                <X className="w-4 h-4 text-white" />
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
