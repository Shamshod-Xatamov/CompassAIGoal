import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Compass, Sparkles, ArrowRight, Map, MessageCircle, CalendarCheck, Star, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Soft Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gentle floating orbs */}
        <motion.div
          className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Subtle stars */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-indigo-300/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-6 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Animated Compass Logo */}
            <motion.div
              className="inline-block mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 150,
                damping: 20,
                duration: 1 
              }}
            >
              <div className="relative">
                {/* Soft glow rings */}
                <motion.div
                  className="absolute inset-0 -m-6"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.3, 0.15, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-28 h-28 rounded-full border-2 border-indigo-300/30" />
                </motion.div>

                {/* Main compass with glassmorphism */}
                <motion.div
                  className="relative w-20 h-20 rounded-full bg-white/60 backdrop-blur-xl border border-indigo-200/50 flex items-center justify-center shadow-lg"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Compass className="w-10 h-10 text-indigo-600" />
                </motion.div>

                {/* Orbiting stars */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5"
                    style={{
                      marginLeft: '-3px',
                      marginTop: '-3px',
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 1.67,
                    }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm"
                      style={{
                        transform: 'translateX(45px)',
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-6xl mb-6 text-slate-900 leading-tight">
                Discover Your
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  North Star
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                A peaceful journey to uncover what truly matters. Visualize your path, track your progress, and achieve your goals with AI-guided support.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-16"
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="mt-4 text-sm text-slate-500">
                Free forever • No credit card • 5 minutes to begin
              </p>
            </motion.div>

            {/* Abstract Visual Elements */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative max-w-4xl mx-auto h-80"
            >
              {/* Floating gradient orbs */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-500/20 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-pink-400/15 to-indigo-500/15 blur-3xl"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -40, 0],
                    y: [0, 30, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Minimalist path visualization */}
              <div className="relative z-10 flex items-center justify-center h-full">
                {/* Progress dots in a flowing path */}
                <div className="relative w-full max-w-2xl">
                  <svg viewBox="0 0 600 200" className="w-full h-48">
                    {/* Curved path line */}
                    <motion.path
                      d="M 50 100 Q 150 50, 250 100 T 550 100"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="8 8"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.4 }}
                      transition={{ duration: 2, delay: 0.8 }}
                    />
                    
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="50%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Milestone dots */}
                  {[
                    { x: '10%', y: '50%', delay: 1.0 },
                    { x: '30%', y: '30%', delay: 1.1 },
                    { x: '50%', y: '50%', delay: 1.2 },
                    { x: '70%', y: '30%', delay: 1.3 },
                    { x: '90%', y: '50%', delay: 1.4 },
                  ].map((dot, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full bg-white border-2 border-indigo-400 shadow-lg"
                      style={{
                        left: dot.x,
                        top: dot.y,
                        transform: 'translate(-50%, -50%)',
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: dot.delay,
                        type: "spring"
                      }}
                    />
                  ))}

                  {/* Glowing star at the end */}
                  <motion.div
                    className="absolute"
                    style={{
                      left: '90%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Star className="w-6 h-6 text-indigo-600 fill-indigo-400" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Floating info cards */}
              <motion.div
                className="absolute top-8 left-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-indigo-100/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-500">Progress</div>
                    <div className="text-sm text-slate-700">Week 4 of 12</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-purple-100/50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-slate-700">AI-Guided Journey</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4 text-slate-900">
              Your Journey, Beautifully Guided
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to discover your purpose and make meaningful progress.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Compass,
                title: 'Find Your North Star',
                description: 'AI-guided "5 Whys" helps you discover your deepest motivations and true direction.',
                gradient: 'from-indigo-100 to-indigo-50'
              },
              {
                icon: Map,
                title: 'Visual Quest Maps',
                description: 'See your journey as a winding forest path with interactive weekly nodes.',
                gradient: 'from-purple-100 to-purple-50'
              },
              {
                icon: MessageCircle,
                title: 'AI Coach',
                description: 'Chat with a supportive AI that feels like a real coach, not a machine.',
                gradient: 'from-pink-100 to-pink-50'
              },
              {
                icon: CalendarCheck,
                title: 'Weekly Rituals',
                description: 'Reflect and plan with structured reviews that keep you aligned.',
                gradient: 'from-blue-100 to-blue-50'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`p-6 h-full bg-gradient-to-br ${feature.gradient} border-2 border-white/80 hover:shadow-xl transition-shadow backdrop-blur-sm`}>
                  <div className="inline-flex p-3 rounded-xl bg-white/80 mb-4 shadow-md">
                    <feature.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white/40 backdrop-blur-sm relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4 text-slate-900">
              A Simple, Beautiful Process
            </h2>
            <p className="text-xl text-slate-600">
              From discovery to achievement in three peaceful steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Discover',
                description: 'Share your thoughts with our AI guide. Through gentle questions, uncover your North Star—what truly matters to you.',
                color: 'indigo'
              },
              {
                step: '2',
                title: 'Visualize',
                description: 'See your journey as an interactive Quest Map. Each week is a step forward on a peaceful forest path.',
                color: 'purple'
              },
              {
                step: '3',
                title: 'Achieve',
                description: 'Track progress with weekly reviews and AI coaching. Stay aligned and moving toward your goals.',
                color: 'pink'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 text-white text-2xl mb-6 shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="text-2xl mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl mb-4 text-slate-900">
                Why Compass?
              </h2>
              <p className="text-xl text-slate-600">
                A premium experience designed for meaningful achievement.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Clear direction through AI-guided discovery',
                'Beautiful Quest Maps that inspire action',
                'Personalized coaching available 24/7',
                'Weekly rituals that build lasting habits',
                'Minimalist design that keeps you focused',
                'Privacy-first approach to your goals'
              ].map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-12 shadow-2xl border-0 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              
              <div className="relative z-10 text-center">
                <h2 className="text-4xl mb-4">
                  Ready to Find Your North Star?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands discovering their true direction and making meaningful progress every day.
                </p>
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-slate-100 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all group"
                >
                  Begin Your Journey Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="mt-4 text-sm text-white/70">
                  Free forever • No credit card • Start in 5 minutes
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white/40 backdrop-blur-sm border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl text-slate-900">Compass</span>
            </div>
            
            <p className="text-slate-500 text-sm">
              © 2025 Compass. Your journey to meaningful achievement.
            </p>

            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-slate-600">Built with care for goal achievers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}