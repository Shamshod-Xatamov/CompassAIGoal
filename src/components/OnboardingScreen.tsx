import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Compass, Sparkles, Send } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (data: any) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<'welcome' | 'conversation' | 'summary'>('welcome');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationStep, setConversationStep] = useState(0);

  const startConversation = () => {
    setStep('conversation');
    setTimeout(() => {
      setMessages([
        { sender: 'ai', text: "I'm excited to help you find your direction. Let's start simple: What would you like to accomplish? What's been on your mind?" }
      ]);
    }, 500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');

    // AI responses based on the 5 Whys conversation flow
    const aiResponses = [
      "That sounds meaningful. Can you tell me why that's important to you?",
      "I understand. If you dig a little deeper, why does that matter?",
      "Interesting. And why is achieving that so important?",
      "That's really insightful. One more question - why does that feeling matter to you?",
      "Beautiful. I think I'm beginning to see your North Star - the deeper purpose guiding you. Let me capture what I'm hearing..."
    ];

    setTimeout(() => {
      if (conversationStep < aiResponses.length) {
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponses[conversationStep] }]);
        setConversationStep(conversationStep + 1);

        // After the last question, show summary
        if (conversationStep === aiResponses.length - 1) {
          setTimeout(() => {
            setStep('summary');
          }, 2000);
        }
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBuildQuestMap = () => {
    onComplete({
      northStar: 'To feel a sense of creative accomplishment',
      quests: [
        {
          id: 1,
          name: 'Launch Side Project',
          type: 'primary',
          progress: 35,
          milestones: ['Define MVP', 'Build Core Features', 'Beta Testing', 'Launch'],
          currentMilestone: 1
        },
        {
          id: 2,
          name: 'Learn Guitar',
          type: 'active',
          progress: 60,
          milestones: ['Basic Chords', 'First Song', 'Fingerpicking', 'Performance'],
          currentMilestone: 2
        },
        {
          id: 3,
          name: 'Health & Fitness',
          type: 'active',
          progress: 45,
          milestones: ['Routine Established', 'First 30 Days', 'Habit Locked', 'Goal Weight'],
          currentMilestone: 1
        }
      ]
    });
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel - Immersive Branding */}
      <motion.div
        className="w-2/5 relative overflow-hidden flex items-center justify-center"
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
      </motion.div>

      {/* Right Panel - Interactive Onboarding */}
      <div className="w-3/5 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-16 relative overflow-y-auto">
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
            className="w-full max-w-2xl h-full flex flex-col relative z-10"
          >
            {/* Progress Indicator */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < conversationStep ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: i < conversationStep ? 1 : 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 text-center">
                Question {Math.min(conversationStep + 1, 5)} of 5 — The 5 Whys Journey
              </p>
            </motion.div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ 
                    delay: 0.1,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20
                  }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-md px-6 py-4 rounded-3xl shadow-lg ${msg.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-white text-slate-800 border border-slate-200'
                      }`}
                  >
                    {msg.text}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <motion.div 
              className="flex gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts..."
                  className="w-full px-6 py-6 text-base border-2 border-slate-200 focus:border-indigo-400 rounded-2xl shadow-lg"
                  autoFocus
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSendMessage}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 shadow-lg"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {step === 'summary' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-full max-w-3xl relative z-10 my-8"
          >
            {/* Main Content Card */}
            <Card className="p-10 shadow-2xl border-0 bg-white relative overflow-hidden">
              {/* Radial Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-60" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                {/* North Star Section */}
                <div className="text-center mb-8">
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
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-4 shadow-xl"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl mb-3 text-slate-700">Your North Star</h3>
                  <motion.p 
                    className="text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    To feel a sense of creative accomplishment
                  </motion.p>
                </div>

                {/* Two Column Layout for Quests and Habits */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="mb-3 text-slate-600">Your Quests</h4>
                    <div className="space-y-2">
                      {['Launch Side Project', 'Learn Guitar', 'Health & Fitness'].map((quest, idx) => (
                        <motion.div
                          key={quest}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="p-3 bg-gradient-to-r from-white to-indigo-50 rounded-lg shadow-sm border border-indigo-100 text-sm"
                        >
                          {quest}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h4 className="mb-3 text-slate-600">Daily Habits</h4>
                    <div className="space-y-2">
                      {[
                        'Creative session (30m)',
                        'Guitar practice (20m)',
                        'Evening reflection (10m)'
                      ].map((habit, idx) => (
                        <motion.div
                          key={habit}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                          className="p-3 bg-gradient-to-r from-white to-purple-50 rounded-lg shadow-sm border border-purple-100 text-sm"
                        >
                          {habit}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Prominent CTA Section with Visual Cues */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="relative"
                >
                  {/* Pulsing Glow Effect */}
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl"
                  />
                  
                  {/* CTA Card */}
                  <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 shadow-xl">
                    <div className="text-center mb-3">
                      <p className="text-white mb-1">
                        Ready to begin your journey?
                      </p>
                      <p className="text-indigo-100 text-sm">
                        Let's visualize your path to accomplishment
                      </p>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleBuildQuestMap}
                        size="lg"
                        className="w-full bg-white text-indigo-600 hover:bg-indigo-50 py-6 shadow-lg"
                      >
                        Build My Quest Map
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}