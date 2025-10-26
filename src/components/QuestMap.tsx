import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, MapPin, X, Calendar, Target, Trophy, Sparkles, Star, Flag } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface QuestMapProps {
  quest: any;
}

export function QuestMap({ quest }: QuestMapProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Generate weeks data (4 weeks per milestone)
  const totalWeeks = quest.milestones.length * 4;
  const currentWeek = Math.floor((quest.progress / 100) * totalWeeks);

  const weeks = Array.from({ length: totalWeeks }, (_, i) => {
    const weekNumber = i + 1;
    const milestoneIndex = Math.floor(i / 4);
    const isComplete = i < currentWeek;
    const isCurrent = i === currentWeek;

    return {
      week: weekNumber,
      milestone: quest.milestones[milestoneIndex],
      isComplete,
      isCurrent,
      tasks: [
        `Work on ${quest.milestones[milestoneIndex]} - Part ${(i % 4) + 1}`,
        `Review and iterate on progress`,
        `Practice daily habits and routines`,
        `Document learnings and insights`
      ]
    };
  });

  // Dynamic height calculation - more compact with more weeks
  const baseHeight = 600;
  const heightPerWeek = Math.max(30, 80 - totalWeeks * 2);
  const containerHeight = Math.min(900, baseHeight + (totalWeeks * heightPerWeek));

  // Create organic path points - path goes THROUGH each circle
  const pathPoints = weeks.map((_, index) => {
    const progress = index / (totalWeeks - 1);
    
    // Vertical - bottom to top with dynamic spacing
    const y = 88 - (progress * 78);
    
    // Horizontal - forest path meandering
    const baseX = 50;
    const wave1 = Math.sin(progress * Math.PI * 2.8) * 28;
    const wave2 = Math.sin(progress * Math.PI * 4.5 + 0.8) * 12;
    const wave3 = Math.cos(progress * Math.PI * 6.2 + 1.5) * 6;
    
    const x = baseX + wave1 + wave2 + wave3;

    return { x, y };
  });

  // Create smooth path that goes THROUGH all points
  const createPathThroughPoints = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      const prev = i > 0 ? points[i - 1] : current;
      const afterNext = i < points.length - 2 ? points[i + 2] : next;
      
      const cp1x = current.x + (next.x - prev.x) * 0.25;
      const cp1y = current.y + (next.y - prev.y) * 0.25;
      const cp2x = next.x - (afterNext.x - current.x) * 0.25;
      const cp2y = next.y - (afterNext.y - current.y) * 0.25;
      
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }
    
    return path;
  };

  const fullPathString = createPathThroughPoints(pathPoints);
  const progressPathString = createPathThroughPoints(pathPoints.slice(0, currentWeek + 1));

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-slate-50 to-white">
        {/* Liquid hint bubble */}
        <div className="absolute top-5 left-5 z-30">
          <motion.div
            className="relative px-5 py-2.5 bg-gradient-to-r from-indigo-500/90 to-purple-500/90 backdrop-blur-xl rounded-full shadow-xl"
            animate={{
              boxShadow: [
                '0 4px 20px rgba(99, 102, 241, 0.3)',
                '0 4px 30px rgba(139, 92, 246, 0.4)',
                '0 4px 20px rgba(99, 102, 241, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-white text-xs font-medium flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💡
              </motion.span>
              Drag to explore your journey
            </p>
            
            {/* Liquid drip effect */}
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-500/80 rounded-full"
              animate={{
                y: [0, 4, 0],
                scaleY: [1, 1.5, 1],
                opacity: [0.8, 0.4, 0.8]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Draggable container */}
        <div
          className={`relative w-full bg-gradient-to-b from-indigo-50/40 via-purple-50/30 to-emerald-50/50 overflow-hidden ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ height: `${containerHeight}px` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Pannable content */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              width: '100%',
              height: '100%',
              position: 'relative'
            }}
          >
            {/* LIQUID DESTINATION - Flowing achievement marker */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
              >
                {/* Flowing liquid aura */}
                <motion.div
                  className="absolute inset-0 -m-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <div className="w-28 h-28 bg-gradient-to-br from-amber-300/50 via-orange-400/50 to-pink-400/60 rounded-full blur-3xl" />
                </motion.div>

                {/* Liquid blob container */}
                <motion.div
                  className="relative px-6 py-4 bg-gradient-to-br from-amber-100/95 via-orange-100/95 to-pink-100/90 backdrop-blur-lg shadow-2xl overflow-hidden"
                  style={{
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%'
                  }}
                  animate={{
                    borderRadius: [
                      '40% 60% 70% 30% / 40% 50% 60% 50%',
                      '60% 40% 30% 70% / 50% 60% 40% 60%',
                      '40% 60% 70% 30% / 40% 50% 60% 50%'
                    ]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {/* Flowing particles */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${10 + Math.sin(i) * 20}%`
                      }}
                      animate={{
                        y: [-8, -20, -8],
                        x: [0, Math.sin(i * 2) * 10, 0],
                        opacity: [0.3, 0.9, 0.3],
                        scale: [0.6, 1.2, 0.6]
                      }}
                      transition={{
                        duration: 2.5 + i * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <div className="w-2 h-2 bg-yellow-400/60 rounded-full blur-sm" />
                    </motion.div>
                  ))}

                  {/* Content */}
                  <div className="relative flex items-center gap-3">
                    <motion.div
                      animate={{
                        rotate: [-3, 3, -3],
                        y: [0, -3, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>
                    
                    <div>
                      <p className="font-semibold text-orange-900 text-sm">Destination</p>
                      <p className="text-xs text-orange-700/80">Achievement Awaits</p>
                    </div>

                    {/* Floating star */}
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        rotate: { duration: 5, repeat: Infinity, ease: 'linear' },
                        scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      }}
                    >
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-400 drop-shadow-lg" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Liquid shimmer rays */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        width: '2px',
                        height: '80px',
                        background: 'linear-gradient(to top, transparent, rgba(251, 191, 36, 0.4), transparent)',
                        transformOrigin: 'top center',
                        transform: `rotate(${(i * 360) / 8}deg)`,
                        filter: 'blur(1px)'
                      }}
                      animate={{
                        opacity: [0.2, 0.6, 0.2],
                        scaleY: [0.8, 1.1, 0.8]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Forest atmosphere */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-0 left-10 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl" />
              <div className="absolute top-0 right-16 w-56 h-56 bg-purple-200/20 rounded-full blur-3xl" />
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/15 rounded-full blur-3xl" />
              <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-teal-200/15 rounded-full blur-3xl" />
              <div className="absolute bottom-32 left-16 w-80 h-80 bg-green-300/20 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-300/25 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/3 w-96 h-48 bg-green-400/20 rounded-full blur-3xl" />
            </div>

            {/* Tree silhouettes */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="absolute top-[20%] left-[12%] w-2 h-16 bg-green-800 rounded-full blur-sm" />
              <div className="absolute top-[30%] right-[18%] w-2 h-20 bg-green-800 rounded-full blur-sm" />
              <div className="absolute top-[45%] left-[22%] w-2 h-14 bg-green-800 rounded-full blur-sm" />
              <div className="absolute top-[60%] right-[25%] w-2 h-18 bg-green-700 rounded-full blur-sm" />
              <div className="absolute top-[75%] left-[30%] w-2 h-16 bg-green-700 rounded-full blur-sm" />
            </div>

            {/* SVG Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#86efac" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#a5b4fc" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0.8" />
                </linearGradient>
                
                <linearGradient id="progressGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="40%" stopColor="#6366f1" />
                  <stop offset="80%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>

                <filter id="glow">
                  <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* White outline */}
              <motion.path
                d={fullPathString}
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
              />

              {/* Complete path */}
              <motion.path
                d={fullPathString}
                stroke="url(#pathGradient)"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
              />

              {/* Progress path */}
              <motion.path
                d={progressPathString}
                stroke="url(#progressGradient)"
                strokeWidth="2.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: 'easeInOut', delay: 0.3 }}
              />
            </svg>

            {/* Week Nodes */}
            {weeks.map((week, index) => {
              const point = pathPoints[index];

              return (
                <motion.div
                  key={index}
                  className="absolute cursor-pointer group z-10 pointer-events-auto"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.06, type: 'spring', stiffness: 180, damping: 15 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWeek(index);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    {/* Week Node - liquid style */}
                    <motion.div
                      className={`w-11 h-11 rounded-full flex items-center justify-center border-4 transition-all shadow-xl backdrop-blur-sm ${
                        week.isCurrent
                          ? 'bg-gradient-to-br from-orange-400 to-pink-500 border-white shadow-2xl'
                          : week.isComplete
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-white shadow-indigo-400/60'
                            : 'bg-white/95 border-slate-300 group-hover:border-indigo-400 group-hover:shadow-indigo-300/50'
                      }`}
                      animate={week.isCurrent ? {
                        boxShadow: [
                          '0 4px 30px rgba(251, 146, 60, 0.5)',
                          '0 4px 40px rgba(236, 72, 153, 0.6)',
                          '0 4px 30px rgba(251, 146, 60, 0.5)'
                        ],
                        scale: [1.25, 1.3, 1.25]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {week.isComplete || week.isCurrent ? (
                        <CheckCircle2 className="w-5 h-5 text-white drop-shadow-lg" />
                      ) : (
                        <div className="text-sm font-medium text-slate-600">{week.week}</div>
                      )}
                    </motion.div>

                    {/* Liquid tooltip */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20">
                      <motion.div
                        className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl shadow-2xl backdrop-blur-xl"
                        style={{
                          borderRadius: '40% 60% 50% 50% / 60% 40% 60% 40%'
                        }}
                      >
                        <p className="text-sm font-medium">Week {week.week}</p>
                        {week.isCurrent && <p className="text-xs text-orange-300">You're here!</p>}
                      </motion.div>
                    </div>

                    {/* LIQUID "You are here" marker */}
                    {week.isCurrent && (
                      <motion.div
                        className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                        initial={{ opacity: 0, y: -15, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 1.8, type: 'spring', stiffness: 150 }}
                      >
                        <motion.div
                          className="relative px-5 py-2 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 shadow-2xl backdrop-blur-lg overflow-hidden"
                          style={{
                            borderRadius: '45% 55% 60% 40% / 50% 60% 40% 50%'
                          }}
                          animate={{
                            borderRadius: [
                              '45% 55% 60% 40% / 50% 60% 40% 50%',
                              '55% 45% 40% 60% / 40% 50% 60% 50%',
                              '45% 55% 60% 40% / 50% 60% 40% 50%'
                            ],
                            boxShadow: [
                              '0 8px 30px rgba(249, 115, 22, 0.5)',
                              '0 8px 40px rgba(236, 72, 153, 0.6)',
                              '0 8px 30px rgba(249, 115, 22, 0.5)'
                            ]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                        >
                          {/* Flowing gradient overlay */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                              x: ['-100%', '200%']
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: 'linear'
                            }}
                          />

                          <p className="relative text-white font-medium text-sm flex items-center gap-2">
                            <motion.span
                              animate={{ y: [0, -2, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <MapPin className="w-4 h-4" />
                            </motion.span>
                            You are here
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Milestone Labels - liquid style */}
            {quest.milestones.map((milestone: string, index: number) => {
              const weekIndex = index * 4;
              const point = pathPoints[weekIndex];
              if (!point) return null;

              const isLeftSide = point.x < 50;
              const xOffset = isLeftSide ? -12 : 12;

              return (
                <motion.div
                  key={index}
                  className="absolute font-medium text-indigo-900 bg-gradient-to-br from-white/95 to-indigo-50/95 backdrop-blur-lg shadow-xl pointer-events-none overflow-hidden"
                  style={{
                    left: `${point.x + xOffset}%`,
                    top: `${point.y}%`,
                    transform: isLeftSide ? 'translate(-100%, -50%)' : 'translate(0%, -50%)',
                    borderRadius: '40% 60% 55% 45% / 60% 40% 60% 40%',
                    padding: '0.6rem 1rem'
                  }}
                  initial={{ opacity: 0, x: isLeftSide ? 15 : -15 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    borderRadius: [
                      '40% 60% 55% 45% / 60% 40% 60% 40%',
                      '50% 50% 60% 40% / 50% 50% 50% 50%',
                      '40% 60% 55% 45% / 60% 40% 60% 40%'
                    ]
                  }}
                  transition={{ 
                    opacity: { delay: 1.2 + index * 0.25, type: 'spring' },
                    x: { delay: 1.2 + index * 0.25, type: 'spring' },
                    borderRadius: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-200/30 to-transparent"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: index * 0.5
                    }}
                  />

                  <div className="relative flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="whitespace-nowrap text-xs">{milestone}</span>
                  </div>
                </motion.div>
              );
            })}

            {/* LIQUID "Start Journey" marker */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
            >
              <motion.div
                className="relative px-7 py-3.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-2xl backdrop-blur-lg overflow-hidden"
                style={{
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
                }}
                animate={{
                  borderRadius: [
                    '50% 50% 50% 50% / 60% 60% 40% 40%',
                    '40% 60% 60% 40% / 50% 50% 50% 50%',
                    '50% 50% 50% 50% / 60% 60% 40% 40%'
                  ],
                  boxShadow: [
                    '0 10px 40px rgba(16, 185, 129, 0.4)',
                    '0 10px 50px rgba(20, 184, 166, 0.5)',
                    '0 10px 40px rgba(16, 185, 129, 0.4)'
                  ]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {/* Flowing shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />

                {/* Liquid bubbles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bottom-0 w-1.5 h-1.5 bg-white/40 rounded-full"
                    style={{ left: `${30 + i * 20}%` }}
                    animate={{
                      y: [0, -40],
                      opacity: [0.6, 0],
                      scale: [1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6
                    }}
                  />
                ))}

                <p className="relative text-white font-semibold flex items-center gap-2">
                  <motion.span
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🚀
                  </motion.span>
                  Start Your Journey
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Week Details Modal */}
      <AnimatePresence>
        {selectedWeek !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedWeek(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-[500px] max-h-[80vh] overflow-hidden shadow-2xl border-2 border-indigo-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedWeek(null)}
                    className="absolute top-4 right-4 text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl">Week {weeks[selectedWeek].week}</h3>
                      <p className="text-indigo-100 text-sm">
                        {weeks[selectedWeek].isComplete ? 'Completed' : weeks[selectedWeek].isCurrent ? 'Current Week' : 'Upcoming'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <Badge className={`text-sm px-4 py-2 ${
                      weeks[selectedWeek].isComplete
                        ? 'bg-green-600'
                        : weeks[selectedWeek].isCurrent
                          ? 'bg-indigo-600'
                          : 'bg-slate-400'
                    }`}>
                      {weeks[selectedWeek].isComplete ? '✓ Completed' : weeks[selectedWeek].isCurrent ? '◉ In Progress' : '○ Upcoming'}
                    </Badge>
                  </div>

                  {/* Milestone Info */}
                  <div>
                    <p className="text-sm text-slate-600 mb-2 uppercase tracking-wide">Focus Area</p>
                    <Card className="p-4 bg-indigo-50 border-indigo-200">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-600" />
                        <p className="text-indigo-900 font-medium">{weeks[selectedWeek].milestone}</p>
                      </div>
                    </Card>
                  </div>

                  {/* Weekly Tasks */}
                  <div>
                    <p className="text-sm text-slate-600 mb-3 uppercase tracking-wide">Weekly Tasks</p>
                    <div className="space-y-3">
                      {weeks[selectedWeek].tasks.map((task, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                            weeks[selectedWeek].isComplete ? 'bg-green-50' : 'bg-slate-50'
                          }`}
                        >
                          <div className="mt-0.5">
                            {weeks[selectedWeek].isComplete ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <span className={weeks[selectedWeek].isComplete ? 'text-slate-700' : 'text-slate-600'}>
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current week highlight */}
                  {weeks[selectedWeek].isCurrent && (
                    <div>
                      <p className="text-sm text-slate-600 mb-2 uppercase tracking-wide">This Week</p>
                      <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                        <p className="text-sm text-orange-900">
                          🔥 You're on week {weeks[selectedWeek].week} of your journey. Keep up the great work!
                        </p>
                      </Card>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
