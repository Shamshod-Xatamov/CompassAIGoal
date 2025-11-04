import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { MessageCircle, X, Send, GripVertical } from 'lucide-react';

interface ChatWidgetProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  context?: string | null;
  onContextHandled?: () => void;
  isWeeklyReviewOpen?: boolean;
}

export function ChatWidget({ 
  isOpen: externalIsOpen, 
  setIsOpen: externalSetIsOpen,
  context,
  onContextHandled,
  isWeeklyReviewOpen = false
}: ChatWidgetProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: "Hi! I'm your Compass AI. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const dragConstraintsRef = useRef(null);

  // Use external state if provided, otherwise use internal
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

  // Handle context changes (e.g., opening chat for new quest or task help)
  useEffect(() => {
    if (context === 'new-quest' && isOpen) {
      // Auto-send message about creating a new quest
      const questMessage = "I'd like to create a new Quest. Can you help me think through what I want to achieve?";
      setMessages(prev => [...prev, { sender: 'user', text: questMessage }]);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = "Absolutely! I'd love to help you create a meaningful Quest. Let's start by exploring what matters most to you.\n\nWhat area of your life would you like to focus on? For example:\n• Career & Skills\n• Health & Fitness\n• Creative pursuits\n• Relationships\n• Personal growth\n\nTell me what's on your mind, and we'll work together to shape it into a clear, actionable Quest.";
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      }, 1000);
      
      // Clear the context
      if (onContextHandled) {
        onContextHandled();
      }
    } else if (context?.startsWith('task-help:') && isOpen) {
      // Handle task-specific help
      const [, contextData] = context.split('task-help: ');
      const [taskText, questName, dayOfWeek] = contextData.split('|');
      
      const taskMessage = `Can you help me with this task: "${taskText}"?`;
      setMessages(prev => [...prev, { sender: 'user', text: taskMessage }]);
      
      // Simulate AI response with task-specific context
      setTimeout(() => {
        const aiResponse = `Of course! I'd be happy to help with "${taskText}" from your ${questName} Quest (scheduled for ${dayOfWeek}).\n\nWhat would you like help with?\n• Breaking this task into smaller steps\n• Finding the best approach or resources\n• Setting a realistic time estimate\n• Understanding how it connects to your bigger goal\n• Staying motivated to complete it\n\nWhat's on your mind?`;
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      }, 1000);
      
      // Clear the context
      if (onContextHandled) {
        onContextHandled();
      }
    } else if (context?.startsWith('quest-help:') && isOpen) {
      // Handle quest-specific help
      const [, contextData] = context.split('quest-help: ');
      const [questName, progress, currentMilestone] = contextData.split('|');
      
      const questMessage = `Can you help me with my "${questName}" Quest?`;
      setMessages(prev => [...prev, { sender: 'user', text: questMessage }]);
      
      // Simulate AI response with quest-specific context
      setTimeout(() => {
        const aiResponse = `I'd be glad to help with your ${questName} Quest! You're currently at ${progress}% completion, working on "${currentMilestone}".\n\nHow can I assist you?\n• Adjusting your milestones or timeline\n• Breaking down the current milestone into actionable steps\n• Finding resources or strategies for this goal\n• Overcoming specific challenges or blockers\n• Staying motivated and focused\n• Re-evaluating if this Quest still aligns with your North Star\n\nWhat's on your mind about this Quest?`;
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      }, 1000);
      
      // Clear the context
      if (onContextHandled) {
        onContextHandled();
      }
    } else if (context?.startsWith('weekly-review:') && isOpen) {
      // Handle weekly review contexts
      const [, contextData] = context.split('weekly-review: ');
      
      if (contextData === 'full-week') {
        const weekMessage = "Can you help me analyze my full week?";
        setMessages(prev => [...prev, { sender: 'user', text: weekMessage }]);
        
        setTimeout(() => {
          const aiResponse = "I'd love to help you reflect on your week! 🌟\n\nLet's look at the big picture:\n\n📊 What patterns do you notice in your completed tasks?\n🎯 Which days were most productive?\n💡 What might have contributed to your successes?\n⚠️ Were there any obstacles that slowed you down?\n\nShare your thoughts, and I'll help you gain insights for next week!";
          setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        }, 1000);
      } else if (contextData.startsWith('day|')) {
        const [, day, tasksCompleted] = contextData.split('|');
        const dayMessage = `What insights can you give me about ${day}?`;
        setMessages(prev => [...prev, { sender: 'user', text: dayMessage }]);
        
        setTimeout(() => {
          const aiResponse = `Great question! On ${day}, you completed ${tasksCompleted} tasks. 🎯\n\nLet's reflect:\n• What made this day successful (or challenging)?\n• What time of day were you most productive?\n• Did you feel energized or drained?\n• What would you repeat or change?\n\nUnderstanding your daily patterns helps optimize your schedule!`;
          setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        }, 1000);
      } else if (contextData === 'next-week-plan') {
        const planMessage = "Help me plan my next week effectively";
        setMessages(prev => [...prev, { sender: 'user', text: planMessage }]);
        
        setTimeout(() => {
          const aiResponse = "Let's create an amazing week ahead! 🚀\n\nHere's my approach:\n\n1️⃣ **Prioritize ruthlessly** - Focus on high-impact tasks\n2️⃣ **Balance your energy** - Mix challenging and lighter tasks\n3️⃣ **Build in buffer time** - Don't overpack your days\n4️⃣ **Align with your North Star** - Every task should serve your bigger goal\n\nWhat's your biggest priority for next week?";
          setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        }, 1000);
      } else if (contextData.startsWith('plan-day|')) {
        const [, day] = contextData.split('|');
        const dayPlanMessage = `Help me plan my ${day}`;
        setMessages(prev => [...prev, { sender: 'user', text: dayPlanMessage }]);
        
        setTimeout(() => {
          const aiResponse = `Let's make ${day} productive! 📅\n\nConsider these questions:\n• What's your energy level typically like on ${day}?\n• Any fixed commitments or time blocks?\n• High-focus tasks vs. routine tasks?\n• Time for breaks and self-care?\n\nI recommend:\n✅ 2-3 high-priority tasks\n✅ 1-2 medium tasks as backups\n✅ Buffer time for unexpected items\n\nWhat tasks are you thinking about for this day?`;
          setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        }, 1000);
      } else if (contextData.startsWith('task|')) {
        const [, taskText, questName] = contextData.split('|');
        const taskMessage = `Help me with this task: "${taskText}"`;
        setMessages(prev => [...prev, { sender: 'user', text: taskMessage }]);
        
        setTimeout(() => {
          const aiResponse = `I'd be happy to help with "${taskText}" from your ${questName} Quest! 🎯\n\nWhat would be most helpful?\n\n🔹 Break it into smaller sub-tasks\n🔹 Estimate time needed\n🔹 Suggest the best approach\n🔹 Find resources or tools\n🔹 Set a specific deadline\n🔹 Identify potential obstacles\n\nWhat aspect would you like to explore?`;
          setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        }, 1000);
      }
      
      // Clear the context
      if (onContextHandled) {
        onContextHandled();
      }
    }
  }, [context, isOpen, onContextHandled]);

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
      } else if (userMessage.toLowerCase().includes('quest') || userMessage.toLowerCase().includes('goal')) {
        aiResponse = "Great! Let's dig deeper. What specific outcome are you hoping to achieve with this Quest? Try to describe it in one sentence.";
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
            key="chat-button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={() => {
                console.log('Opening chat');
                setIsOpen(true);
              }}
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
          <motion.div
            key="chat-window"
            drag
            dragMomentum={true}
            dragElastic={0.1}
            dragTransition={{ 
              bounceStiffness: 600, 
              bounceDamping: 20,
              power: 0.3,
              timeConstant: 200
            }}
            dragConstraints={{
              top: -100,
              left: -100,
              right: typeof window !== 'undefined' ? window.innerWidth - 250 : 500,
              bottom: typeof window !== 'undefined' ? window.innerHeight - 100 : 500,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0.9,
              y: 20
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9,
              y: 20
            }}
            transition={{
              type: "spring",
              duration: 0.3,
              bounce: 0.2
            }}
            className="fixed bottom-8 right-8 z-[100] w-[350px]"
            style={{ 
              pointerEvents: 'auto'
            }}
          >
            <Card className="shadow-2xl border-2 overflow-hidden bg-white">
              {/* Header - Draggable */}
              <div 
                className="bg-indigo-600 text-white p-4 flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Compass AI</span>
                  <GripVertical className="w-4 h-4 text-white/60 ml-1" />
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Closing chat');
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-indigo-700 cursor-pointer"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div 
                className="h-[320px] overflow-y-auto p-4 bg-slate-50"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
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
              <div 
                className="p-4 bg-white border-t"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
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
                    className="resize-none"
                    rows={2}
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSend();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    size="icon"
                    className="bg-indigo-600 hover:bg-indigo-700 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
