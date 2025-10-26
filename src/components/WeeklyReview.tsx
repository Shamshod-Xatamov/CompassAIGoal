import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { X, TrendingUp, CheckCircle2, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyReviewProps {
  onClose: () => void;
}

export function WeeklyReview({ onClose }: WeeklyReviewProps) {
  const [step, setStep] = useState<'celebrate' | 'reflect' | 'plan'>('celebrate');
  const [reflection, setReflection] = useState('');

  const weekData = [
    { day: 'Mon', tasks: 5 },
    { day: 'Tue', tasks: 7 },
    { day: 'Wed', tasks: 4 },
    { day: 'Thu', tasks: 8 },
    { day: 'Fri', tasks: 6 },
    { day: 'Sat', tasks: 3 },
    { day: 'Sun', tasks: 5 },
  ];

  const achievements = [
    { title: 'Tasks Completed', value: '38', icon: CheckCircle2 },
    { title: 'Quest Progress', value: '+12%', icon: TrendingUp },
    { title: 'Longest Streak', value: '28 days', icon: Calendar },
  ];

  const nextWeekTasks = [
    { id: 1, text: 'Complete user authentication flow', quest: 'Launch Side Project', priority: 'high' },
    { id: 2, text: 'Design database schema', quest: 'Launch Side Project', priority: 'high' },
    { id: 3, text: 'Learn fingerpicking pattern', quest: 'Learn Guitar', priority: 'medium' },
    { id: 4, text: 'Morning workouts (5 days)', quest: 'Health & Fitness', priority: 'medium' },
    { id: 5, text: 'Write project documentation', quest: 'Launch Side Project', priority: 'low' },
  ];

  const handleCommit = () => {
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
          
          {/* Title with Calendar Icon */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-3xl">Weekly Review</h2>
          </div>
          <p className="text-indigo-100">Let's reflect on your journey</p>

          {/* Step Indicator with Numbers and Labels */}
          <div className="flex items-center justify-between mt-8 px-4">
            {[
              { id: 'celebrate', label: 'Celebrate', number: 1 },
              { id: 'reflect', label: 'Reflect', number: 2 },
              { id: 'plan', label: 'Plan', number: 3 }
            ].map((item, idx) => (
              <div key={item.id} className="flex items-center flex-1">
                {/* Step Circle and Label */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step === item.id
                        ? 'bg-white text-indigo-600 shadow-lg scale-110'
                        : 'bg-white/20 text-white border-2 border-white/40'
                    }`}
                  >
                    {item.number}
                  </div>
                  <span
                    className={`text-sm transition-all duration-300 ${
                      step === item.id ? 'opacity-100' : 'opacity-70'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Connecting Line */}
                {idx < 2 && (
                  <div className="flex-1 h-0.5 bg-white/30 mx-2 -mt-8" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto pb-6" style={{ maxHeight: 'calc(90vh - 240px)' }}>
          {step === 'celebrate' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl mb-6">This Week's Wins</h3>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {achievements.map((achievement, idx) => (
                    <Card key={idx} className="p-6 text-center">
                      <achievement.icon className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
                      <div className="text-3xl mb-1">{achievement.value}</div>
                      <div className="text-sm text-slate-600">{achievement.title}</div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-4">Daily Activity</h4>
                <Card className="p-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weekData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="tasks" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep('reflect')}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 w-full"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'reflect' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl mb-6">Reflection</h3>
                <p className="text-slate-600 mb-4">
                  Take a moment to reflect on your week. What went well? What challenges did you face?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2">What went well this week?</label>
                  <Textarea
                    placeholder="I made consistent progress on my side project and felt energized by..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2">What was challenging?</label>
                  <Textarea
                    placeholder="I struggled with time management when..."
                    rows={4}
                    className="w-full"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2">What will you do differently?</label>
                  <Textarea
                    placeholder="Next week, I'll..."
                    rows={4}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep('celebrate')}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep('plan')}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Continue to Planning
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'plan' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl mb-2">Plan for Next Week</h3>
                <p className="text-slate-600">
                  Here's what I recommend focusing on. Drag to reorder or remove items.
                </p>
              </div>

              <Card className="p-6">
                <div className="space-y-3">
                  {nextWeekTasks.map((task, idx) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-move"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded bg-white border text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="mb-1">{task.text}</p>
                        <p className="text-xs text-slate-500">{task.quest}</p>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep('reflect')}
                >
                  Back
                </Button>
                <Button
                  onClick={handleCommit}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 px-8"
                >
                  Commit to My Week
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
