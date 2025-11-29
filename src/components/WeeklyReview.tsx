import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { X, TrendingUp, CheckCircle2, Trophy, Lightbulb, Target, MessageCircle, Edit2, Trash2, Save, XCircle, Sparkles, Plus, ArrowLeft, Compass, MapPin, Flag, Zap, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WeeklyReviewProps {
  onClose: () => void;
  onAskAIAboutProgress?: () => void;
  onAskAIAboutMilestone?: (milestoneName: string) => void;
  onAskAIAboutTask?: (taskText: string, questName: string) => void;
}

export function WeeklyReview({ onClose, onAskAIAboutProgress, onAskAIAboutMilestone, onAskAIAboutTask }: WeeklyReviewProps) {
  const [step, setStep] = useState<'celebrate' | 'reflect' | 'plan'>('celebrate');
  const [reflection, setReflection] = useState('');
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);

  // Mock milestone data - in real app, this would come from props
  const milestoneData = [
    { name: 'Setup', progress: 100, tasks: 5 },
    { name: 'Design', progress: 75, tasks: 6 },
    { name: 'Build MVP', progress: 40, tasks: 8 },
    { name: 'Testing', progress: 15, tasks: 4 },
    { name: 'Launch', progress: 0, tasks: 3 },
  ];

  const achievements = [
    { title: 'Milestones Completed', value: '1', icon: Flag },
    { title: 'Quest Progress', value: '46%', icon: TrendingUp },
    { title: 'Tasks Finished', value: '12', icon: CheckCircle2 },
  ];

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete user authentication flow', quest: 'Launch Side Project', milestone: 'Build MVP', priority: 'high' as const },
    { id: 2, text: 'Design database schema', quest: 'Launch Side Project', milestone: 'Design', priority: 'high' as const },
    { id: 3, text: 'Learn fingerpicking pattern', quest: 'Learn Guitar', milestone: 'Practice Basics', priority: 'medium' as const },
    { id: 4, text: 'Morning workouts (5 days)', quest: 'Health & Fitness', milestone: 'Build Routine', priority: 'medium' as const },
    { id: 5, text: 'Write project documentation', quest: 'Launch Side Project', milestone: 'Launch', priority: 'low' as const },
    { id: 6, text: 'Create wireframes', quest: 'Launch Side Project', milestone: 'Design', priority: 'high' as const },
    { id: 7, text: 'Build landing page', quest: 'Launch Side Project', milestone: 'Build MVP', priority: 'high' as const },
    { id: 8, text: 'Meal prep planning', quest: 'Health & Fitness', milestone: 'Build Routine', priority: 'medium' as const },
  ]);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [addingTaskForMilestone, setAddingTaskForMilestone] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskQuest, setNewTaskQuest] = useState('Launch Side Project');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleCommit = () => {
    onClose();
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleEditTask = (taskId: number, currentText: string) => {
    setEditingTaskId(taskId);
    setEditText(currentText);
  };

  const handleSaveEdit = (taskId: number) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, text: editText } : t
    ));
    setEditingTaskId(null);
  };

  const handleChangeMilestone = (taskId: number, newMilestone: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, milestone: newMilestone } : t
    ));
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText('');
  };

  const handleAddTask = (milestone: string) => {
    if (!newTaskText.trim()) return;
    
    const newTask = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      text: newTaskText,
      quest: newTaskQuest,
      priority: newTaskPriority,
      milestone: milestone
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setNewTaskPriority('medium');
    setAddingTaskForMilestone(null);
  };

  const handleCancelAddTask = () => {
    setNewTaskText('');
    setNewTaskPriority('medium');
    setAddingTaskForMilestone(null);
  };

  const handleChangePriority = (taskId: number, newPriority: 'high' | 'medium' | 'low') => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, priority: newPriority } : t
    ));
  };

  // Get unique milestones from tasks
  const uniqueMilestones = Array.from(new Set(tasks.map(t => t.milestone)));

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="!max-w-[88vw] w-[88vw] h-[88vh] p-0 gap-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 shadow-2xl">
        <DialogTitle className="sr-only">Quest Review</DialogTitle>
        <DialogDescription className="sr-only">
          Review your progress, reflect on achievements, and plan upcoming tasks
        </DialogDescription>
        
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm flex-shrink-0 z-10">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              >
                <Compass className="w-6 h-6 text-indigo-600" strokeWidth={2} />
              </motion.div>
              <span className="text-xl">Quest Review</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* Review Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 relative overflow-hidden flex-shrink-0">
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/20 to-purple-500/0"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -40, 0],
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
          
          {/* Title with Animated Icon */}
          <div className="flex items-center gap-3 mb-1 relative z-10">
            <motion.div 
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <MapPin className="w-5 h-5" />
            </motion.div>
            <div>
              <motion.h2 
                className="text-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Quest Review
              </motion.h2>
            </div>
          </div>
          <motion.p 
            className="text-indigo-100 text-sm ml-13"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Reflect on your progress and plan your next steps
          </motion.p>

          {/* Enhanced Step Indicator with Icons and Animated Progress */}
          <div className="flex items-center justify-between mt-6 px-4 relative z-10">
            {[
              { id: 'celebrate', label: 'Celebrate', icon: Trophy },
              { id: 'reflect', label: 'Reflect', icon: Lightbulb },
              { id: 'plan', label: 'Plan', icon: Target }
            ].map((item, idx) => {
              const isActive = step === item.id;
              const isCompleted = 
                (step === 'reflect' && item.id === 'celebrate') ||
                (step === 'plan' && (item.id === 'celebrate' || item.id === 'reflect'));
              const Icon = item.icon;

              return (
                <div key={item.id} className="flex items-center flex-1">
                  {/* Step Circle with Icon and Label */}
                  <div className="flex flex-col items-center gap-1.5 relative z-10">
                    <motion.div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 relative ${
                        isActive
                          ? 'bg-white text-indigo-600 shadow-2xl'
                          : isCompleted
                          ? 'bg-white/90 text-purple-600'
                          : 'bg-white/20 text-white border-2 border-white/40'
                      }`}
                      animate={isActive ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 10px 30px rgba(255,255,255,0.3)',
                          '0 15px 40px rgba(255,255,255,0.5)',
                          '0 10px 30px rgba(255,255,255,0.3)',
                        ],
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {/* Pulse effect for active step */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-white"
                          initial={{ opacity: 0.5, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.4 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        />
                      )}
                      
                      <Icon className={`w-5 h-5 relative z-10 ${
                        isActive ? 'animate-bounce' : ''
                      }`} />
                      
                      {/* Checkmark for completed steps */}
                      {isCompleted && !isActive && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                    <motion.span
                      className={`text-xs transition-all duration-300 font-medium ${
                        isActive ? 'opacity-100 scale-110' : 'opacity-70'
                      }`}
                      animate={isActive ? { y: [0, -2, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {item.label}
                    </motion.span>
                  </div>

                  {/* Animated Connecting Line */}
                  {idx < 2 && (
                    <div className="flex-1 mx-3 -mt-6 relative h-1">
                      {/* Background line */}
                      <div className="absolute inset-0 h-1 bg-white/20 rounded-full" />
                      
                      {/* Animated progress line */}
                      <motion.div
                        className="absolute inset-0 h-1 rounded-full bg-gradient-to-r from-white to-emerald-300"
                        initial={{ scaleX: 0 }}
                        animate={{ 
                          scaleX: isCompleted ? 1 : 0,
                        }}
                        style={{ originX: 0 }}
                        transition={{ 
                          duration: 0.6,
                          ease: 'easeOut',
                        }}
                      />
                      
                      {/* Shimmer effect on active connection */}
                      {isCompleted && (
                        <motion.div
                          className="absolute inset-0 h-1 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'celebrate' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl">Your Progress</h3>
                  {onAskAIAboutProgress && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={onAskAIAboutProgress}
                      className="gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:from-indigo-100 hover:to-purple-100"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Ask AI About My Progress
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map((achievement, idx) => (
                    <Card key={idx} className="p-4 text-center">
                      <achievement.icon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                      <div className="text-2xl mb-0.5">{achievement.value}</div>
                      <div className="text-xs text-slate-600">{achievement.title}</div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm mb-3">Milestone Progress</h4>
                <Card className="p-4 relative">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart 
                      data={milestoneData}
                      onMouseMove={(state) => {
                        if (state.isTooltipActive && state.activePayload) {
                          setHoveredMilestone(state.activePayload[0].payload.name);
                        }
                      }}
                      onMouseLeave={() => setHoveredMilestone(null)}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                                <p className="font-medium mb-2">{data.name}</p>
                                <p className="text-sm text-slate-600 mb-1">
                                  {data.progress}% complete
                                </p>
                                <p className="text-xs text-slate-500 mb-3">
                                  {data.tasks} tasks
                                </p>
                                {onAskAIAboutMilestone && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onAskAIAboutMilestone(data.name)}
                                    className="w-full gap-2 text-xs bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    Ask AI About {data.name}
                                  </Button>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="progress" radius={[8, 8, 0, 0]}>
                        {milestoneData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={hoveredMilestone === entry.name ? '#6366f1' : '#4f46e5'} 
                            className="transition-all cursor-pointer"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-slate-500 text-center mt-2">
                    Hover over bars to ask AI about specific milestones
                  </p>
                </Card>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep('reflect')}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 px-8"
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
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl mb-3">Reflection</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Take a moment to reflect on your quest. What progress have you made? What obstacles did you overcome?
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1.5">Which milestones made the most progress?</label>
                  <Textarea
                    placeholder="I made great progress on the Design milestone by completing all wireframes and..."
                    rows={3}
                    className="w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1.5">What obstacles did you overcome?</label>
                  <Textarea
                    placeholder="I struggled with authentication flow complexity, but found a solution by..."
                    rows={3}
                    className="w-full text-sm"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1.5">What's your next focus area?</label>
                  <Textarea
                    placeholder="I'll focus on completing the Build MVP milestone by..."
                    rows={3}
                    className="w-full text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('celebrate')}
                  className="px-6"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep('plan')}
                  className="bg-indigo-600 hover:bg-indigo-700 px-6"
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
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl mb-1.5">Plan Your Next Steps</h3>
                  <p className="text-sm text-slate-600">
                    Organize tasks by milestone. Focus on what moves you forward.
                  </p>
                </div>
              </div>

              {/* Milestone Navigation */}
              <div className="grid grid-cols-5 gap-2">
                {uniqueMilestones.map((milestone, idx) => {
                  const milestoneTasks = tasks.filter(t => t.milestone === milestone);
                  const isSelected = selectedMilestone === milestone;
                  
                  return (
                    <Card 
                      key={milestone}
                      onClick={() => setSelectedMilestone(selectedMilestone === milestone ? null : milestone)}
                      className={`p-3 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer border-2 ${
                        isSelected
                          ? 'bg-gradient-to-br from-indigo-100 to-blue-100 border-indigo-500 ring-2 ring-indigo-400'
                          : 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 hover:border-indigo-400'
                      }`}
                    >
                      {/* Milestone Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-xs text-slate-500 mb-0.5">Step {idx + 1}</div>
                          <div className="font-medium text-xs">{milestone}</div>
                        </div>
                        <Flag className="w-4 h-4 text-indigo-600" />
                      </div>

                      {/* Task Count Badge */}
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs mb-2 bg-indigo-100 text-indigo-700">
                        <Target className="w-2.5 h-2.5" />
                        {milestoneTasks.length} {milestoneTasks.length === 1 ? 'task' : 'tasks'}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddingTaskForMilestone(milestone);
                          }}
                          className="flex-1 gap-1 text-xs h-7 hover:bg-indigo-100 text-indigo-700"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          Add
                        </Button>
                        {onAskAIAboutMilestone && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAskAIAboutMilestone(milestone);
                            }}
                            className="flex-1 gap-1 text-xs h-7 hover:bg-indigo-100 text-indigo-700"
                          >
                            <MessageCircle className="w-2.5 h-2.5" />
                            AI
                          </Button>
                        )}
                      </div>

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-600" />
                      )}

                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-200/30 rounded-bl-full -mr-4 -mt-4" />
                    </Card>
                  );
                })}
              </div>

              {/* Add Task Form */}
              {addingTaskForMilestone && (
                <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-indigo-900">Add Task for {addingTaskForMilestone}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelAddTask}
                      className="h-6 w-6 p-0 text-slate-600 hover:text-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <Input
                      placeholder="What needs to be done?"
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      className="bg-white"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTask(addingTaskForMilestone);
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Select value={newTaskQuest} onValueChange={setNewTaskQuest}>
                        <SelectTrigger className="flex-1 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Launch Side Project">Launch Side Project</SelectItem>
                          <SelectItem value="Learn Guitar">Learn Guitar</SelectItem>
                          <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={newTaskPriority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewTaskPriority(value)}>
                        <SelectTrigger className="w-32 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">🔥 High</SelectItem>
                          <SelectItem value="medium">⚡ Medium</SelectItem>
                          <SelectItem value="low">💧 Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() => handleAddTask(addingTaskForMilestone)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      disabled={!newTaskText.trim()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </Card>
              )}

              {/* Tasks List - Filtered by Selected Milestone */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-slate-700">
                      {selectedMilestone ? `Tasks for ${selectedMilestone}` : 'All Tasks'}
                    </h4>
                    {selectedMilestone && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer"
                        onClick={() => setSelectedMilestone(null)}
                      >
                        {selectedMilestone} • Click to clear
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      {selectedMilestone 
                        ? `${tasks.filter(t => t.milestone === selectedMilestone).length} tasks` 
                        : `${tasks.length} tasks planned`
                      }
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {(selectedMilestone ? tasks.filter(t => t.milestone === selectedMilestone) : tasks).map((task, idx) => (
                    <Card
                      key={task.id}
                      className="p-3 hover:shadow-md transition-all group border-l-4"
                      style={{
                        borderLeftColor: 
                          task.priority === 'high' ? '#ef4444' : 
                          task.priority === 'medium' ? '#f59e0b' : 
                          '#3b82f6'
                      }}
                    >
                      {editingTaskId === task.id ? (
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-xs flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <Input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="mb-1 h-8 text-sm"
                              autoFocus
                            />
                            <p className="text-xs text-slate-500">{task.quest}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSaveEdit(task.id)}
                              className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEdit}
                              className="h-7 w-7 p-0 text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-xs flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex-1">
                                <p className="text-sm mb-1">{task.text}</p>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                                    📋 {task.quest}
                                  </span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    task.priority === 'high'
                                      ? 'bg-red-100 text-red-700'
                                      : task.priority === 'medium'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                  </span>
                                  <span className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded flex items-center gap-1">
                                    <Flag className="w-2.5 h-2.5" />
                                    {task.milestone}
                                  </span>
                                </div>
                              </div>

                              {/* Task Actions */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                {onAskAIAboutTask && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onAskAIAboutTask(task.text, task.quest)}
                                    className="h-6 w-6 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                    title="Ask AI"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditTask(task.id, task.text)}
                                  className="h-6 w-6 p-0 text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                  
                  {(selectedMilestone ? tasks.filter(t => t.milestone === selectedMilestone) : tasks).length === 0 && (
                    <Card className="p-6 text-center">
                      <Target className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm text-slate-500 mb-0.5">
                        {selectedMilestone ? `No tasks for ${selectedMilestone}` : 'No tasks planned yet'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {selectedMilestone 
                          ? 'Click "Add" to create tasks for this milestone' 
                          : 'Tasks you create will appear here'
                        }
                      </p>
                    </Card>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setStep('reflect')}
                  className="px-6"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCommit}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 shadow-lg"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Commit to My Plan ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
                </Button>
              </div>
            </motion.div>
          )}
        </div>
        </motion.div>
      </div>
      </DialogContent>
    </Dialog>
  );
}