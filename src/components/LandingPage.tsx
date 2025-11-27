import React, { useState, useEffect } from 'react';
import { Compass, Star, Map, MessageCircle, Sparkles, ArrowRight, Check, Target, TrendingUp, Heart } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);

  // Dynamic title variations
  const titleVariations = [
    { line1: "Your Journey", line2: "to Your", line3: "North Star" },
    { line1: "Your Path", line2: "to Your", line3: "True Purpose" },
    { line1: "Your Quest", line2: "to Your", line3: "Dream Life" },
    { line1: "Your Adventure", line2: "to Your", line3: "Best Self" },
    { line1: "Your Mission", line2: "to Your", line3: "Big Vision" }
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Rotate titles every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titleVariations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "5 Whys Discovery",
      description: "Dig deep with AI-guided questions that reveal your true motivations and core values"
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: "Visual Quest Maps",
      description: "Transform abstract goals into beautiful, interactive journey maps you can actually follow"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "AI Coach",
      description: "Get personalized insights and encouragement exactly when you need them most"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      text: "Finally found clarity on what I actually want from my career. The 5 Whys process was mind-blowing.",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Entrepreneur",
      text: "The quest maps made my goals feel achievable for the first time. I'm actually making progress now.",
      avatar: "MR"
    },
    {
      name: "Aisha Patel",
      role: "Student",
      text: "The AI coach keeps me accountable without being pushy. It's like having a wise friend in my pocket.",
      avatar: "AP"
    }
  ];

  const milestones = [
    "Define Your Vision",
    "Discover Your Why",
    "Map Your Journey",
    "Set Milestones",
    "Take Action",
    "Celebrate Wins"
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-2xl">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span>Compass</span>
        </div>
        <button className="px-6 py-2 bg-white/60 backdrop-blur-sm rounded-full hover:bg-white/80 transition-all duration-300 border border-indigo-200/50 text-slate-700 shadow-sm">
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-12 grid md:grid-cols-2 gap-8 items-center max-w-screen-2xl mx-auto">
        <div className="space-y-8 md:pl-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 backdrop-blur-sm rounded-full border border-indigo-200/50">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-slate-700">Find Your True Direction</span>
          </div>
          
          <h1 className="text-6xl leading-tight transition-all duration-500 ease-in-out">
            {titleVariations[titleIndex].line1}<br />{titleVariations[titleIndex].line2}<br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {titleVariations[titleIndex].line3}
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed">
            Stop wandering aimlessly. Discover what truly matters through AI-guided reflection, 
            map your goals as an organic quest, and grow naturally toward your dreams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-lg text-white hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Begin Your Quest
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full text-lg hover:bg-white/80 transition-all duration-300 border border-indigo-200/50 text-slate-700 shadow-sm">
              Watch Demo
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Free forever • No credit card • Start in 5 minutes</span>
          </div>
        </div>

        {/* Animated Quest Path Visualization */}
        <div className="relative h-[600px] flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 300 600">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            
            {/* Curved Path */}
            <path
              d="M 150 550 Q 100 450 150 350 Q 200 250 150 150 Q 100 50 150 50"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="3"
              strokeDasharray="8,8"
              className="opacity-40"
            />

            {/* Milestone Nodes */}
            {milestones.map((milestone, index) => {
              const positions = [
                { x: 150, y: 550 },
                { x: 115, y: 450 },
                { x: 150, y: 350 },
                { x: 185, y: 250 },
                { x: 150, y: 150 },
                { x: 150, y: 50 }
              ];
              
              const isActive = index <= activeStep;
              const isCurrent = index === activeStep;
              
              return (
                <g key={index}>
                  <circle
                    cx={positions[index].x}
                    cy={positions[index].y}
                    r={isCurrent ? 24 : 18}
                    fill={isActive ? 'url(#pathGradient)' : '#ffffff'}
                    stroke={isActive ? '#6366f1' : '#cbd5e1'}
                    strokeWidth="2"
                    className="transition-all duration-500"
                  />
                  {isActive && (
                    <text
                      x={positions[index].x}
                      y={positions[index].y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-xl"
                    >
                      ✓
                    </text>
                  )}
                  <text
                    x={positions[index].x + (index % 2 === 0 ? 40 : -40)}
                    y={positions[index].y + 5}
                    textAnchor={index % 2 === 0 ? 'start' : 'end'}
                    className="fill-slate-700 text-sm font-medium"
                  >
                    {milestone}
                  </text>
                </g>
              );
            })}

            {/* Goal Star at Top */}
            <g>
              <circle cx="150" cy="50" r="35" fill="#fbbf24" className="opacity-20 animate-pulse" />
              <text x="150" y="58" textAnchor="middle" className="text-4xl">⭐</text>
            </g>
          </svg>

          {/* Floating Progress Card */}
          <div className="absolute top-8 right-8 bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-indigo-100/50 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Progress</div>
                <div className="text-slate-800">{activeStep + 1} of 6 milestones</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-12 max-w-screen-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Powerful Tools for Your Journey</h2>
          <p className="text-xl text-slate-600">Everything you need to discover and achieve your goals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100 hover:border-indigo-300 hover:bg-white/80 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-200/50 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg text-white">
                {feature.icon}
              </div>
              <h3 className="text-2xl mb-4">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-12 max-w-screen-2xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-100/80 to-purple-100/80 backdrop-blur-sm rounded-3xl p-12 border border-indigo-200/50 shadow-xl">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-8 h-8 text-indigo-600" />
                <div className="text-5xl text-slate-900">10k+</div>
              </div>
              <div className="text-slate-600">Goals Discovered</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="text-5xl text-slate-900">85%</div>
              </div>
              <div className="text-slate-600">Success Rate</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-8 h-8 text-pink-600" />
                <div className="text-5xl text-slate-900">5k+</div>
              </div>
              <div className="text-slate-600">Active Questers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-12 max-w-screen-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Loved by Goal-Seekers Worldwide</h2>
          <p className="text-xl text-slate-600">Real stories from people who found their North Star</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-12 max-w-screen-2xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl text-white">
          <h2 className="text-4xl mb-6">Ready to Find Your North Star?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of people discovering what truly matters to them</p>
          <button 
            onClick={onGetStarted}
            className="group px-10 py-5 bg-white text-indigo-600 rounded-full text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            Start Your Journey Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-6 text-sm opacity-75">No credit card required • 5 minute setup • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-indigo-200/50 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span>Compass</span>
          </div>
          <div className="flex gap-8 text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">About</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          </div>
          <div className="text-slate-500 text-sm">© 2025 Compass. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}