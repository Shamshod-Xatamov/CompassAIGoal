import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Compass, Sparkles, Send } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (data: any) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<'welcome' | 'conversation' | 'summary'>('welcome');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const startConversation = () => {
    setStep('conversation');
    setTimeout(() => {
      setMessages([
        { sender: 'ai', text: "Hi there! 👋 I'm your Compass guide. I'm here to help you discover your goals and create your personal quest map. What brings you here today?" }
      ]);
    }, 500);
  };

  const getAIResponse = (userMessage: string, count: number): string => {
    const responses = [
      "That's interesting! Tell me more about what drives you.",
      "I love that! What would achieving this mean to you?",
      "That's wonderful! How do you envision your journey?",
      "Great insight! What's the first step you'd like to take?",
      "I'm getting a clearer picture now. How do you want to measure your progress?",
      "Fantastic! I think we have enough to create something amazing. Ready to build your quest map?"
    ];
    
    // Return appropriate response based on message count
    if (count >= 5) {
      return "This is amazing! I have a great sense of your direction now. Let's turn this into your personalized Quest Map! 🎯";
    }
    
    return responses[count] || responses[responses.length - 1];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      setIsTyping(false);
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      
      const aiResponse = getAIResponse(userMessage, newCount);
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      
      // Show completion button after 5+ exchanges
      if (newCount >= 5) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            sender: 'ai', 
            text: "Click below when you're ready to see your Quest Map! 🗺️✨" 
          }]);
        }, 1000);
      }
      
      // Auto-focus input after AI responds
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, 800 + Math.random() * 400);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleShowSummary = () => {
    setStep('summary');
  };

  const handleBuildQuestMap = () => {
    // Create quest with simple milestone strings - QuestMap will generate the full structure
    const questData = {
      id: 1,
      name: 'Launch Side Project',
      type: 'primary',
      progress: 0,
      currentMilestone: 0,
      milestones: [
        'Define MVP',
        'Build Core Features',
        'Beta Testing',
        'Launch'
      ]
    };

    onComplete({
      northStar: 'To feel a sense of creative accomplishment',
      quests: [questData]
    });
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel - Immersive Branding (hidden during conversation) */}
      {step !== 'conversation' && (
        <motion.div
          className="w-1/2 relative overflow-hidden flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              backgroundSize: '200% 200%'
            }}
          />

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut'
              }}
            />
          ))}

          {/* Constellation Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <motion.line
              x1="20%" y1="20%" x2="40%" y2="35%"
              stroke="white"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.line
              x1="40%" y1="35%" x2="60%" y2="30%"
              stroke="white"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.7 }}
            />
            <motion.line
              x1="60%" y1="30%" x2="75%" y2="50%"
              stroke="white"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.9 }}
            />
            <motion.line
              x1="40%" y1="35%" x2="50%" y2="60%"
              stroke="white"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1.1 }}
            />
          </svg>

          {/* Main Content */}
          <div className="relative z-10 text-white text-center px-12">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              >
                <Compass className="w-24 h-24 mx-auto mb-8 drop-shadow-2xl" strokeWidth={1.5} />
              </motion.div>
              <motion.h1 
                className="text-6xl mb-4 tracking-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Compass
              </motion.h1>
              <motion.p 
                className="text-2xl opacity-90"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Find your North Star
              </motion.p>
            </motion.div>
          </div>

          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          
          {/* Water-like blend effect - right edge */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-indigo-600/10 to-indigo-400/20 pointer-events-none blur-2xl" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-purple-500/15 pointer-events-none blur-xl" />
        </motion.div>
      )}

      {/* Right Panel - Interactive Onboarding */}
      <div className={`${step === 'conversation' ? 'w-full' : 'w-1/2'} bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-16 relative overflow-y-auto`}>
        {/* Water-like blend effect - left edge (only when split view) */}
        {step !== 'conversation' && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-l from-transparent via-indigo-50 to-indigo-100/30 pointer-events-none blur-2xl" />
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-l from-transparent to-purple-50/50 pointer-events-none blur-xl" />
          </>
        )}
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />

        {step === 'welcome' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="max-w-xl text-center relative z-10"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: 'reverse' 
              }}
            >
              <Sparkles className="w-16 h-16 mx-auto mb-8 text-indigo-500 drop-shadow-lg" />
            </motion.div>
            <h2 className="text-5xl mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Compass
            </h2>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Let's have a conversation to discover what truly matters to you. I'll be your guide,
              helping you uncover your <span className="text-indigo-600">North Star</span>—the deeper purpose that will light your way forward.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={startConversation}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-10 py-7 shadow-xl shadow-indigo-500/30"
              >
                Let's Begin
              </Button>
            </motion.div>
          </motion.div>
        )}

        {step === 'conversation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-3xl h-full flex flex-col relative z-10 py-8"
          >
            {/* Chat Header */}
            <motion.div 
              className="mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-indigo-100">
                <div className="relative">
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                  >
                    <Compass className="w-5 h-5 text-white" strokeWidth={2} />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-800">Compass AI</p>
                  <p className="text-xs text-slate-500">Online</p>
                </div>
              </div>
            </motion.div>

            {/* Chat Messages - Scrollable Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-4 mb-6 px-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.1,
                    type: 'spring',
                    stiffness: 150,
                    damping: 15
                  }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    >
                      <Compass className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </motion.div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`max-w-lg px-5 py-3.5 rounded-2xl shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-sm'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </motion.div>
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0 shadow-md text-white text-sm">
                      You
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                  >
                    <Compass className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </motion.div>
                  <div className="px-5 py-3.5 rounded-2xl rounded-tl-sm bg-white border border-slate-100 shadow-md">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15
                          }}
                          className="w-2 h-2 bg-indigo-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Complete Button - Shows after enough messages */}
            {messageCount >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <Button
                  onClick={handleShowSummary}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 py-6 shadow-lg text-white"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Continue to Summary
                </Button>
              </motion.div>
            )}

            {/* Input Area */}
            <motion.div 
              className="flex gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-5 py-6 text-base border-2 border-slate-200 focus:border-indigo-400 rounded-2xl shadow-md bg-white/80 backdrop-blur-sm"
                  autoFocus
                  disabled={isTyping}
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSendMessage}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-7 py-6 shadow-lg"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {step === 'summary' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            className="w-full max-w-4xl relative z-10"
          >
            <Card className="p-12 shadow-2xl border-0 bg-white/90 backdrop-blur-xl relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-pink-50/80" />
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              {/* Floating Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-indigo-400 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
              
              <div className="relative z-10">
                {/* Header with Compass Icon */}
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2 
                    }}
                    className="inline-block mb-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl"
                      >
                        <Compass className="w-10 h-10 text-white" strokeWidth={2} />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -inset-2 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-xl opacity-30"
                      />
                    </div>
                  </motion.div>
                  
                  <motion.h2 
                    className="text-4xl mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Your Journey Begins
                  </motion.h2>
                  <motion.p 
                    className="text-slate-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Here's what we discovered together
                  </motion.p>
                </div>

                {/* North Star Section */}
                <motion.div 
                  className="mb-10 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/50 border border-indigo-200/50 mb-4">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm text-indigo-700">Your North Star</span>
                  </div>
                  <motion.p 
                    className="text-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent px-8"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                  >
                    "To feel a sense of creative accomplishment"
                  </motion.p>
                </motion.div>

                {/* Quests Grid */}
                <motion.div 
                  className="mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="text-center text-slate-700 mb-6">Your Quest Map</h3>
                  <div className="grid grid-cols-3 gap-5">
                    {[
                      { name: 'Launch Side Project', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
                      { name: 'Learn Guitar', icon: '🎸', color: 'from-purple-500 to-pink-500' },
                      { name: 'Health & Fitness', icon: '💪', color: 'from-emerald-500 to-teal-500' }
                    ].map((quest, idx) => (
                      <motion.div
                        key={quest.name}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.8 + idx * 0.1, type: 'spring' }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative group"
                      >
                        <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${quest.color} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                            {quest.icon}
                          </div>
                          <p className="text-slate-800">{quest.name}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${quest.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: '40%' }}
                                transition={{ delay: 1 + idx * 0.1, duration: 0.8 }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Button
                      onClick={handleBuildQuestMap}
                      size="lg"
                      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 px-12 py-7 shadow-2xl shadow-indigo-500/30 text-lg"
                    >
                      <Compass className="w-6 h-6 mr-3" />
                      Launch Quest Map
                      <Sparkles className="w-5 h-5 ml-3" />
                    </Button>
                  </motion.div>
                  <motion.p 
                    className="text-sm text-slate-500 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                  >
                    Your personalized journey awaits
                  </motion.p>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}

      </div>
    </div>
  );
}