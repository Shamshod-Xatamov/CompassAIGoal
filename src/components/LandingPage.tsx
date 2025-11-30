import React, { useState, useEffect } from "react";
import {
  Compass,
  Star,
  Map,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Check,
  Target,
  TrendingUp,
  Heart,
  Workflow,
  Shield,
  Code,
  Linkedin,
  Twitter,
  Github,
  Mail,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
const teamLeadImage = "/team-lead.png";
const aiEngineerImage = "/ai-engineer.png";
const frontendEngineerImage = "/frontend.png";
const backendEngineerImage = "/backend.png";

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
    { line1: "Your Mission", line2: "to Your", line3: "Big Vision" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      description:
        "Dig deep with AI-guided questions that reveal your true motivations and core values",
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: "Visual Quest Maps",
      description:
        "Transform abstract goals into beautiful, interactive journey maps you can actually follow",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "AI Coach",
      description:
        "Get personalized insights and encouragement exactly when you need them most",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      text: "Finally found clarity on what I actually want from my career. The 5 Whys process was mind-blowing.",
      avatar: "SC",
    },
    {
      name: "Marcus Rodriguez",
      role: "Entrepreneur",
      text: "The quest maps made my goals feel achievable for the first time. I'm actually making progress now.",
      avatar: "MR",
    },
    {
      name: "Aisha Patel",
      role: "Student",
      text: "The AI coach keeps me accountable without being pushy. It's like having a wise friend in my pocket.",
      avatar: "AP",
    },
  ];

  const milestones = [
    "Define Your Vision",
    "Discover Your Why",
    "Map Your Journey",
    "Set Milestones",
    "Take Action",
    "Celebrate Wins",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 w-full">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-20 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 text-2xl">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span>Compass</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-8 md:pl-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 backdrop-blur-sm rounded-full border border-indigo-200/50">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-slate-700">
              Find Your True Direction
            </span>
          </div>

          <h1 className="text-6xl leading-tight">
            <span className="text-slate-800">Stop Managing Tasks.</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
              Start Achieving Dreams.
            </span>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed">
            Compass is the AI Co-Pilot that turns your biggest ambitions into an
            interactive, step-by-step Quest.
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
              <linearGradient
                id="pathGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
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
                { x: 150, y: 50 },
              ];

              const isActive = index <= activeStep;
              const isCurrent = index === activeStep;

              return (
                <g key={index}>
                  <circle
                    cx={positions[index].x}
                    cy={positions[index].y}
                    r={isCurrent ? 24 : 18}
                    fill={isActive ? "url(#pathGradient)" : "#ffffff"}
                    stroke={isActive ? "#6366f1" : "#cbd5e1"}
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
                    textAnchor={index % 2 === 0 ? "start" : "end"}
                    className="fill-slate-700 text-sm font-medium"
                  >
                    {milestone}
                  </text>
                </g>
              );
            })}

            {/* Goal Star at Top */}
            <g>
              <circle
                cx="150"
                cy="50"
                r="35"
                fill="#fbbf24"
                className="opacity-20 animate-pulse"
              />
              <text x="150" y="58" textAnchor="middle" className="text-4xl">
                ⭐
              </text>
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
                <div className="text-slate-800">
                  {activeStep + 1} of 6 milestones
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Productivity Crisis Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
            The Productivity Crisis
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Most people fail to achieve their goals not because they lack
            ability, but because they lack a system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* The Problem */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-xl">
            <h3 className="text-2xl mb-6 text-slate-800">The Problem</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg mb-2 text-slate-800">Overwhelm</h4>
                <p className="text-slate-600">
                  The "Blank Page" syndrome makes starting impossible. Where do
                  you even begin?
                </p>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-slate-800">Rigidity</h4>
                <p className="text-slate-600">
                  Traditional tools like linear to-do lists don't reflect the
                  complexity of real life. They break under pressure.
                </p>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-slate-800">Isolation</h4>
                <p className="text-slate-600">
                  Managing goals alone leads to motivation burnout. You need a
                  partner in the journey.
                </p>
              </div>
            </div>
          </div>

          {/* The Compass Solution */}
          <div className="bg-gradient-to-br from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-8 border border-cyan-200 shadow-xl">
            <h3 className="text-2xl mb-4 text-slate-800">
              The Compass Solution
            </h3>
            <p className="text-slate-600 mb-6">
              Compass replaces rigid lists with a{" "}
              <span className="text-cyan-600">Conversational AI Partner</span>.
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg mb-2 text-cyan-700 flex items-center gap-2">
                  <span>⚡</span> It Plans for You
                </h4>
                <p className="text-slate-600">
                  You speak naturally, and Compass breaks your goal into a
                  visual roadmap using Generative AI.
                </p>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-cyan-700 flex items-center gap-2">
                  <span>🧭</span> It Visualizes Success
                </h4>
                <p className="text-slate-600">
                  Switch between a linear "Journey Map" and a holistic
                  "Goalscape" view to see exactly where you stand.
                </p>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-cyan-700 flex items-center gap-2">
                  <span>⏰</span> It Adapts
                </h4>
                <p className="text-slate-600">
                  Life happens. Compass proactively re-plans based on your
                  energy and available resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Powerful Tools for Your Journey</h2>
          <p className="text-xl text-slate-600">
            Everything you need to discover and achieve your goals
          </p>
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
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-8 py-12"></section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-8 py-12">
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-2 bg-indigo-50/80 backdrop-blur-sm rounded-full mb-4 border border-indigo-100">
            <span className="text-sm text-indigo-600">
              🔍 Under the Hood: How We Use AI
            </span>
          </div>
          <h2 className="text-4xl mb-4">
            Built Different.{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Powered by Generative AI.
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-6">
            Unlike apps that just use AI for text, we use AI to{" "}
            <span className="text-slate-800">structure data</span>. Our system
            converts natural language into a hierarchical goal tree, creates
            Resource Scores, and dynamically prioritizes your work.
          </p>
          <div className="inline-block px-4 py-2 bg-emerald-50/80 backdrop-blur-sm rounded-full border border-emerald-100">
            <span className="text-sm text-emerald-600">
              ✅ Prototype Status: Design & Interactive UI Ready
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-12">
          {/* Chat-to-JSON Goal Generation */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <Workflow className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl mb-3 text-slate-800">
              Chat-to-JSON Goal Generation
            </h3>
            <p className="text-slate-600 mb-4">
              You describe your dream. Our LLM converts natural language into a
              hierarchical goal tree with sub-goals and actionable tasks. Each
              node has estimated time, energy, and resource requirements.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm border border-cyan-100">
                LLM Integration
              </span>
              <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm border border-cyan-100">
                Prompt Engineering
              </span>
              <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm border border-cyan-100">
                JSON Structuring
              </span>
            </div>
          </div>

          {/* Interactive Quest Visualization */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl mb-3 text-slate-800">
              Interactive Quest Visualization
            </h3>
            <p className="text-slate-600 mb-4">
              Switch between a linear "Journey Map" and a holistic "Goalscape"
              view powered by D3.js. See your progress, dependencies, and
              milestones at a glance. Every interaction is smooth and
              responsive.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-100">
                D3.js Visualization
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-100">
                Interactive Maps
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-100">
                Dynamic Rendering
              </span>
            </div>
          </div>

          {/* Dynamic Re-planning Engine */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl mb-3 text-slate-800">
              Dynamic Re-planning Engine
            </h3>
            <p className="text-slate-600 mb-4">
              Compass continuously monitors your energy, available resources,
              and calendar. When life changes, your plan adapts automatically.
              No rigid schedules—just fluid, intelligent guidance.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Resource Scoring
              </span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Real-time Signals
              </span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100">
                Adaptive Logic
              </span>
            </div>
          </div>

          {/* Modern Tech Stack */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center mb-4">
              <Code className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl mb-3 text-slate-800">Modern Tech Stack</h3>
            <p className="text-slate-600 mb-4">
              Built with React/Next.js for responsive UI, D3.js for stunning
              visualizations, and integrated LLM APIs for intelligent goal
              decomposition. Scalable, maintainable, production-ready.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm border border-teal-100">
                React/Next.js
              </span>
              <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm border border-teal-100">
                D3.js
              </span>
              <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm border border-teal-100">
                LLM APIs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="relative z-10 px-8 py-24">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-cyan-50/40 rounded-3xl -mx-6"></div>

        <div className="relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl mb-6 text-slate-800">
              From Prototype to Launch{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                in Three Months
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We're currently in the prototype phase with design and clickable
              UI complete. Here's our path to launch and beyond.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Phase 1 - Current */}
              <div className="relative group">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-indigo-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-sm text-slate-500 leading-tight pr-2">
                      Phase 1: Concept & Prototype (Current)
                    </h3>
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-xs whitespace-nowrap shadow-md">
                      Active
                    </span>
                  </div>

                  <h4 className="text-3xl mb-6 text-slate-800">
                    Current Status
                  </h4>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-indigo-400 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Market Research & Problem Definition
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-indigo-400 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        UI/UX Design in Figma (Quest Map & Dashboard)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-indigo-400 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Core AI Prompt Engineering (Goal Decomposition Logic)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-indigo-400 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Clickable Web App Development
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative group">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100/60 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-sm text-slate-500 leading-tight pr-2">
                      Phase 2: MVP Development
                    </h3>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs whitespace-nowrap">
                      Planned
                    </span>
                  </div>

                  <h4 className="text-3xl mb-6 text-slate-800">Month 1</h4>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Implement Chat-to-JSON Goal Generation
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Build the Interactive "Quest Map" (Roadmap view)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Backend integration with LLM APIs
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Initial testing with early beta users
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative group">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100/60 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-sm text-slate-500 leading-tight pr-2">
                      Phase 3: Advanced Features
                    </h3>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs whitespace-nowrap">
                      Planned
                    </span>
                  </div>

                  <h4 className="text-3xl mb-6 text-slate-800">Month 2</h4>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Implement "Goalscape" (Sunburst) View
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Develop "Resource Gauge" logic (Energy/Time analysis)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Dynamic re-planning engine
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Beta Testing with 50 users
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="relative group">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100/60 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-sm text-slate-500 leading-tight pr-2">
                      Phase 4: Launch
                    </h3>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs whitespace-nowrap">
                      Planned
                    </span>
                  </div>

                  <h4 className="text-3xl mb-6 text-slate-800">Month 3</h4>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Public Release & Marketing campaign
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Mobile App adaptation
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Community building & feedback loops
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-1"></div>
                      <span className="text-slate-700 leading-snug">
                        Continuous feature iteration
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Can Deliver This Section */}
      <section className="relative z-10 px-8 py-24">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-transparent to-purple-50/40 rounded-[4rem] -z-10"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h2 className="text-5xl mb-6 text-slate-800 leading-tight">
              Built by Team Ad Astra
            </h2>
            <h3 className="text-4xl mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Codifying the Psychology of Success
            </h3>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              We combine deep technical expertise in fullstack development and
              AI engineering with a passion for product design and user
              psychology. Every role is essential. Every perspective matters.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Team Lead & Fullstack Engineer */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100/60 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={teamLeadImage}
                    alt="Team Lead"
                    className="w-32 h-32 rounded-2xl object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl mb-2 text-slate-800">
                    Team Lead & Fullstack Engineer
                  </h4>
                  <p className="text-indigo-600 mb-4">
                    Product Vision, Architecture, and Integration
                  </p>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Leads the overall product strategy and vision. Handles
                    full-stack development, ensuring seamless integration
                    between frontend UI and backend systems. Manages technical
                    roadmap execution.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://www.linkedin.com/in/mukhammad-pardaboev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.github.com/mukhammad-pardaboev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="https://drive.google.com/file/d/1IxRjBptTsV2FoS8WFW8Yso8WHMu7EKFp/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Engineer */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100/60 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={aiEngineerImage}
                    alt="AI Engineer"
                    className="w-32 h-32 rounded-2xl object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl mb-2 text-slate-800">AI Engineer</h4>
                  <p className="text-indigo-600 mb-4">
                    LLM Engineering, Logic Design, and Model Integration
                  </p>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Specializes in engineering robust LLM workflows for goal
                    decomposition. Designs the core logic that converts natural
                    language into structured goal hierarchies. Integrates LLM
                    APIs for maximum performance.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://www.linkedin.com/in/shamshodbek-khatamov-6b7079282/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href="https://github.com/Shamshod-Xatamov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="https://drive.google.com/file/d/1JOGwwJlJXZdFF6jH-PZqlNFzLqiTR-AN/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend Engineer */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100/60 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={backendEngineerImage}
                    alt="Backend Engineer"
                    className="w-32 h-32 rounded-2xl object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl mb-2 text-slate-800">
                    Backend Engineer
                  </h4>
                  <p className="text-indigo-600 mb-4">
                    API Development, Database Management, and Security
                  </p>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Builds robust APIs and manages scalable database
                    architecture. Ensures data integrity, security, and
                    performance. Handles infrastructure and deployment
                    pipelines.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://uz.linkedin.com/in/jamshid-komilov-ab689a242"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href="https://github.com/jamshidCo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="/cv.pdf"
                      download="CV.pdf"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Frontend Engineer */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100/60 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={frontendEngineerImage}
                    alt="Frontend Engineer"
                    className="w-32 h-32 rounded-2xl object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl mb-2 text-slate-800">
                    Frontend Engineer
                  </h4>
                  <p className="text-indigo-600 mb-4">
                    UI/UX Design, Figma Prototyping, and Client-side
                    Implementation
                  </p>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Designs and builds the interactive user interface. Creates
                    stunning visualizations using D3.js. Brings the Quest Map
                    and Goalscape to life with responsive, delightful
                    interactions.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://www.linkedin.com/in/temurbek-pardaboyev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href="https://github.com/TP-Interprice"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="https://drive.google.com/file/d/1LS0Rs20g0ibkCDeCdSediZVn7w7DJCdG/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 py-12">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl text-white">
          <h2 className="text-4xl mb-6">Ready to Find Your North Star?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people discovering what truly matters to them
          </p>
          <button
            onClick={onGetStarted}
            className="group px-10 py-5 bg-white text-indigo-600 rounded-full text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            Start Your Journey Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-6 text-sm opacity-75">
            No credit card required • 5 minute setup • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-24 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-8 py-16">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl text-white">Compass AI</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
                Transforming how humans navigate their daily lives through
                intelligent, adaptive productivity technology.
              </p>
              {/* Social Icons */}
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-indigo-400/50"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-indigo-400/50"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-indigo-400/50"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-indigo-400/50"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="md:col-span-3">
              <h4 className="text-white mb-6">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    Roadmap
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    Changelog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="md:col-span-3">
              <h4 className="text-white mb-6">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    Press Kit
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter or CTA (Creative Addition) */}
            <div className="md:col-span-2">
              <h4 className="text-white mb-6">Stay Updated</h4>
              <p className="text-slate-400 text-sm mb-4">
                Get notified when we launch
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400/50 transition-colors backdrop-blur-sm"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-400 text-sm">
                © 2026 Compass AI. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm">
                <a
                  href="#"
                  className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
