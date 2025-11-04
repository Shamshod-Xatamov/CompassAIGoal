import { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from './ui/dropdown-menu';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from './ui/alert-dialog';
import { QuestMap } from './QuestMap';
import { GoalProgress } from './GoalProgress';
import { 
  Target, Flame, Trophy, Calendar, 
  CheckCircle2, Circle, Edit2, Trash2, Plus, GripVertical, Check, XCircle,
  MoreVertical, Pause, Play, Archive, TrendingUp, AlertCircle, Sparkles, Star, MessageCircle,
  Compass, User, Settings, LogOut, HelpCircle, Bell, Shield, CreditCard, Keyboard,
  Moon, Sun, Palette, Zap, Mail, Lock, Eye, Download, Upload
} from 'lucide-react';

interface Task {
  id: string;
  text: string;
  quest: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface DashboardProps {
  userData: any;
  onOpenWeeklyReview: () => void;
  onOpenChatForQuest?: () => void;
  onAskAIAboutTask?: (taskText: string, questName: string, dayOfWeek: string) => void;
  onAskAIAboutQuest?: (questName: string, progress: number, currentMilestone: string) => void;
}

export function Dashboard({ userData, onOpenWeeklyReview, onOpenChatForQuest, onAskAIAboutTask, onAskAIAboutQuest }: DashboardProps) {
  const [selectedQuest, setSelectedQuest] = useState(userData.quests[0]);
  
  // North Star state
  const [northStar, setNorthStar] = useState(userData.northStar);
  const [editingNorthStar, setEditingNorthStar] = useState(false);
  const [northStarText, setNorthStarText] = useState(userData.northStar);
  
  // Quests state
  const [quests, setQuests] = useState(userData.quests);
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
  const [editingQuestName, setEditingQuestName] = useState('');
  const [questToDelete, setQuestToDelete] = useState<any>(null);
  const [pausedQuests, setPausedQuests] = useState<Set<string>>(new Set());
  
  // Interactive tasks state
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([
    { 
      id: '1', 
      text: 'Design landing page mockup', 
      quest: 'Launch Side Project',
      completed: false,
      priority: 'high'
    },
    { 
      id: '2', 
      text: 'Practice C major scale', 
      quest: 'Learn Guitar',
      completed: false,
      priority: 'medium'
    },
    { 
      id: '3', 
      text: '30-min morning workout', 
      quest: 'Health & Fitness',
      completed: true,
      priority: 'medium'
    },
  ]);

  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Task management functions
  const toggleTaskComplete = (taskId: string) => {
    setTodaysTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditTask = (taskId: string, currentText: string) => {
    setEditingTask(taskId);
    setEditText(currentText);
  };

  const saveEditTask = (taskId: string) => {
    if (editText.trim()) {
      setTodaysTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, text: editText.trim() } : task
        )
      );
    }
    setEditingTask(null);
    setEditText('');
  };

  const deleteTask = (taskId: string) => {
    setTodaysTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const addNewTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: 'New task',
      quest: selectedQuest.name,
      completed: false,
      priority: 'medium'
    };
    setTodaysTasks(prev => [...prev, newTask]);
    startEditTask(newTask.id, newTask.text);
  };

  const changePriority = (taskId: string) => {
    setTodaysTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const priorities: Array<'high' | 'medium' | 'low'> = ['low', 'medium', 'high'];
          const currentIndex = priorities.indexOf(task.priority);
          const nextPriority = priorities[(currentIndex + 1) % 3];
          return { ...task, priority: nextPriority };
        }
        return task;
      })
    );
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200';
    }
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
    }
  };

  const completedCount = todaysTasks.filter(t => t.completed).length;

  // North Star management
  const saveNorthStar = () => {
    if (northStarText.trim()) {
      setNorthStar(northStarText.trim());
    }
    setEditingNorthStar(false);
  };

  // Quest management functions
  const startEditQuest = (questId: string, currentName: string) => {
    setEditingQuestId(questId);
    setEditingQuestName(currentName);
  };

  const saveEditQuest = (questId: string) => {
    if (editingQuestName.trim()) {
      setQuests(prev =>
        prev.map(q =>
          q.id === questId ? { ...q, name: editingQuestName.trim() } : q
        )
      );
    }
    setEditingQuestId(null);
    setEditingQuestName('');
  };

  const deleteQuest = (questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
    if (selectedQuest.id === questId && quests.length > 1) {
      const remainingQuests = quests.filter(q => q.id !== questId);
      setSelectedQuest(remainingQuests[0]);
    }
    setQuestToDelete(null);
  };

  const togglePauseQuest = (questId: string) => {
    setPausedQuests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questId)) {
        newSet.delete(questId);
      } else {
        newSet.add(questId);
      }
      return newSet;
    });
  };

  const addNewQuest = () => {
    const newQuest = {
      id: Date.now().toString(),
      name: 'New Quest',
      progress: 0,
      currentMilestone: 0,
      milestones: ['Getting Started', 'First Steps', 'Making Progress'],
      weeks: []
    };
    setQuests(prev => [...prev, newQuest]);
    startEditQuest(newQuest.id, newQuest.name);
  };

  const getQuestHealth = (quest: any) => {
    if (quest.progress >= 80) return { status: 'excellent', color: 'emerald', icon: TrendingUp };
    if (quest.progress >= 50) return { status: 'good', color: 'blue', icon: TrendingUp };
    if (quest.progress >= 20) return { status: 'okay', color: 'amber', icon: AlertCircle };
    return { status: 'needs-attention', color: 'red', icon: AlertCircle };
  };

  const avgProgress = quests.length > 0 
    ? Math.round(quests.reduce((sum, q) => sum + q.progress, 0) / quests.length) 
    : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <Compass className="w-6 h-6 text-indigo-600" strokeWidth={2} />
            </motion.div>
            <span className="text-xl">Compass</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={onOpenWeeklyReview}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              Weekly Review
            </Button>
            
            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 ring-2 ring-indigo-100 hover:ring-indigo-300 transition-all">
                    <AvatarImage src="" alt="Explorer" />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                {/* User Info Header */}
                <div className="flex items-center gap-3 px-2 py-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-t-lg">
                  <Avatar className="h-12 w-12 ring-2 ring-white">
                    <AvatarImage src="" alt="Explorer" />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1">
                    <p className="font-medium">Explorer</p>
                    <p className="text-xs text-muted-foreground">explorer@compass.app</p>
                    <Badge className="w-fit mt-1 text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Pro Plan
                    </Badge>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Account Section */}
                <div className="px-2 py-1.5">
                  <p className="text-xs text-muted-foreground px-2 mb-1">Account</p>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Mail className="w-4 h-4" />
                    <span>Email Preferences</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Lock className="w-4 h-4" />
                    <span>Password & Security</span>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Preferences Section */}
                <div className="px-2 py-1.5">
                  <p className="text-xs text-muted-foreground px-2 mb-1">Preferences</p>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                    <Badge className="ml-auto text-xs bg-red-100 text-red-700">3</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Palette className="w-4 h-4" />
                    <span>Appearance</span>
                    <span className="ml-auto text-xs text-muted-foreground">Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Eye className="w-4 h-4" />
                    <span>Privacy Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Keyboard className="w-4 h-4" />
                    <span>Keyboard Shortcuts</span>
                    <span className="ml-auto text-xs text-muted-foreground">⌘K</span>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Subscription Section */}
                <div className="px-2 py-1.5">
                  <p className="text-xs text-muted-foreground px-2 mb-1">Subscription</p>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <CreditCard className="w-4 h-4" />
                    <span>Billing & Plans</span>
                    <Zap className="ml-auto w-4 h-4 text-amber-500" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Help Section */}
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Logout */}
                <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Three Column Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Column - The "Why" - REDESIGNED & INTERACTIVE */}
        <div className="w-80 border-r bg-gradient-to-b from-white via-indigo-50/20 to-purple-50/30 overflow-y-auto relative">
          {/* Floating particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="p-6 space-y-6 relative z-10">
            {/* Quick Stats Widget */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-2"
            >
              <Card className="p-3 text-center bg-white/60 backdrop-blur-sm border-indigo-200/50">
                <div className="text-2xl text-indigo-600 mb-1">{quests.length}</div>
                <div className="text-xs text-slate-600">Quests</div>
              </Card>
              <Card className="p-3 text-center bg-white/60 backdrop-blur-sm border-purple-200/50">
                <div className="text-2xl text-purple-600 mb-1">{avgProgress}%</div>
                <div className="text-xs text-slate-600">Avg</div>
              </Card>
              <Card className="p-3 text-center bg-white/60 backdrop-blur-sm border-emerald-200/50">
                <div className="text-2xl text-emerald-600 mb-1">28</div>
                <div className="text-xs text-slate-600">Streak</div>
              </Card>
            </motion.div>

            {/* North Star - EDITABLE */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Your North Star
                </h3>
                {!editingNorthStar && (
                  <motion.button
                    onClick={() => {
                      setEditingNorthStar(true);
                      setNorthStarText(northStar);
                    }}
                    className="p-1 hover:bg-slate-200 rounded-md transition-colors opacity-0 hover:opacity-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit2 className="w-3 h-3 text-slate-500" />
                  </motion.button>
                )}
              </div>
              
              <motion.div layout>
                <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg relative overflow-hidden group">
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-purple-400/10 to-indigo-400/0"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  
                  <div className="relative z-10">
                    {editingNorthStar ? (
                      <div className="space-y-3">
                        <Textarea
                          value={northStarText}
                          onChange={(e) => setNorthStarText(e.target.value)}
                          className="min-h-[100px] bg-white/80 resize-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setEditingNorthStar(false);
                          }}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={saveNorthStar}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                          >
                            <Check className="w-3.5 h-3.5 mr-1.5" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNorthStar(false)}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Target className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                        </motion.div>
                        <p className="text-indigo-900 leading-relaxed">{northStar}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>

            <Separator />

            {/* Active Quests - FULLY INTERACTIVE */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Active Quests
                </h3>
                <motion.button
                  onClick={onOpenChatForQuest || addNewQuest}
                  className="p-1.5 hover:bg-indigo-100 rounded-md transition-colors text-indigo-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
              
              <Reorder.Group 
                axis="y" 
                values={quests} 
                onReorder={setQuests}
                className="space-y-3"
              >
                <AnimatePresence>
                  {quests.map((quest: any, index: number) => {
                    const health = getQuestHealth(quest);
                    const HealthIcon = health.icon;
                    const isPaused = pausedQuests.has(quest.id);
                    
                    return (
                      <Reorder.Item 
                        key={quest.id} 
                        value={quest}
                        className="group/quest"
                      >
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                        >
                          <Card
                            className={`p-4 transition-all relative overflow-hidden ${
                              selectedQuest.id === quest.id
                                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl ring-2 ring-indigo-400 ring-offset-2'
                                : 'hover:bg-slate-50 hover:shadow-lg cursor-pointer bg-white/80 backdrop-blur-sm'
                            } ${isPaused ? 'opacity-60' : ''}`}
                            onClick={() => !editingQuestId && setSelectedQuest(quest)}
                          >
                            {/* Drag handle */}
                            <motion.div
                              className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/quest:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                              whileHover={{ scale: 1.2 }}
                            >
                              <GripVertical className={`w-3.5 h-3.5 ${
                                selectedQuest.id === quest.id ? 'text-white/60' : 'text-slate-400'
                              }`} />
                            </motion.div>

                            <div className="pl-3">
                              {/* Header row */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                  {editingQuestId === quest.id ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        value={editingQuestName}
                                        onChange={(e) => setEditingQuestName(e.target.value)}
                                        className="h-8 text-sm"
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                          e.stopPropagation();
                                          if (e.key === 'Enter') saveEditQuest(quest.id);
                                          if (e.key === 'Escape') setEditingQuestId(null);
                                        }}
                                      />
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          saveEditQuest(quest.id);
                                        }}
                                      >
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium truncate">{quest.name}</span>
                                      {isPaused && (
                                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 bg-amber-100 text-amber-700 border-amber-300">
                                          Paused
                                        </Badge>
                                      )}
                                      {index === 0 && selectedQuest.id !== quest.id && (
                                        <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">Primary</Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Actions dropdown */}
                                {editingQuestId !== quest.id && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                      <motion.button
                                        className={`p-1 rounded-md transition-colors opacity-0 group-hover/quest:opacity-100 ${
                                          selectedQuest.id === quest.id 
                                            ? 'hover:bg-white/20 text-white' 
                                            : 'hover:bg-slate-200 text-slate-600'
                                        }`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </motion.button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        if (onAskAIAboutQuest) {
                                          onAskAIAboutQuest(
                                            quest.name, 
                                            quest.progress, 
                                            quest.milestones[quest.currentMilestone]
                                          );
                                        }
                                      }}>
                                        <MessageCircle className="w-4 h-4 mr-2 text-indigo-600" />
                                        <span className="text-indigo-600">Ask AI</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        startEditQuest(quest.id, quest.name);
                                      }}>
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit Name
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        togglePauseQuest(quest.id);
                                      }}>
                                        {isPaused ? (
                                          <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Resume Quest
                                          </>
                                        ) : (
                                          <>
                                            <Pause className="w-4 h-4 mr-2" />
                                            Pause Quest
                                          </>
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                        <Archive className="w-4 h-4 mr-2" />
                                        Archive
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        className="text-red-600"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setQuestToDelete(quest);
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>

                              {/* Quest health indicator */}
                              <div className="flex items-center gap-2 mb-2">
                                <HealthIcon className={`w-3.5 h-3.5 ${
                                  selectedQuest.id === quest.id 
                                    ? 'text-white/80' 
                                    : `text-${health.color}-500`
                                }`} />
                                <span className={`text-xs ${
                                  selectedQuest.id === quest.id 
                                    ? 'text-white/80' 
                                    : 'text-slate-500'
                                }`}>
                                  Milestone {quest.currentMilestone + 1}/{quest.milestones.length}
                                </span>
                              </div>

                              {/* Progress bar */}
                              <Progress 
                                value={quest.progress} 
                                className={`h-2 ${selectedQuest.id === quest.id ? 'bg-indigo-400' : ''}`}
                              />
                              
                              <div className={`text-xs mt-2 flex items-center justify-between ${
                                selectedQuest.id === quest.id ? 'text-indigo-200' : 'text-slate-500'
                              }`}>
                                <span>{quest.progress}% complete</span>
                                {quest.progress === 100 && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                  >
                                    🏆
                                  </motion.span>
                                )}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      </Reorder.Item>
                    );
                  })}
                </AnimatePresence>
              </Reorder.Group>

              {/* Add Quest Button - Big & Beautiful */}
              {quests.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="text-slate-400 mb-3">No quests yet</div>
                  <Button onClick={addNewQuest} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Quest
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Delete confirmation dialog */}
          <AlertDialog open={!!questToDelete} onOpenChange={() => setQuestToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Quest?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{questToDelete?.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => questToDelete && deleteQuest(questToDelete.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Center Column - The "What" */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-8 space-y-6">
            {/* Quest Header */}
            <div className="pb-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-4xl">{selectedQuest.name}</h2>
                <Badge className="bg-indigo-600 text-lg px-4 py-2">{selectedQuest.progress}%</Badge>
              </div>
              <p className="text-slate-600 text-lg">
                Milestone {selectedQuest.currentMilestone + 1} of {selectedQuest.milestones.length}: {selectedQuest.milestones[selectedQuest.currentMilestone]}
              </p>
            </div>

            {/* Quest Map - Now Full Width */}
            <div>
              <h3 className="text-xl mb-4 text-slate-700">Your Quest Journey</h3>
              <QuestMap quest={selectedQuest} onAskAI={onAskAIAboutTask} />
            </div>

            {/* Goal Progress */}
            <div>
              <h3 className="text-xl mb-4 text-slate-700">Progress Over Time</h3>
              <Card className="p-6">
                <GoalProgress quest={selectedQuest} />
              </Card>
            </div>
          </div>
        </div>

        {/* Right Column - The "How" - NOW INTERACTIVE! */}
        <div className="w-96 border-l bg-gradient-to-b from-white to-slate-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Today's Focus - FULLY INTERACTIVE */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm uppercase tracking-wide text-slate-500">Today's Focus</h3>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-100"
                >
                  <span className="text-xs text-indigo-700 font-medium">
                    {completedCount}/{todaysTasks.length}
                  </span>
                  {completedCount === todaysTasks.length && todaysTasks.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs"
                    >
                      🎉
                    </motion.span>
                  )}
                </motion.div>
              </div>
              
              <Card className="p-5 shadow-sm">
                {/* Ask AI about Today's Tasks button */}
                <div className="mb-4 flex items-center justify-end">
                  <motion.button
                    onClick={() => {
                      if (onAskAIAboutTask) {
                        const taskList = todaysTasks.map(t => `${t.text} (${t.quest})`).join(', ');
                        onAskAIAboutTask(taskList, 'Today\'s Tasks', new Date().toLocaleDateString('en-US', { weekday: 'long' }));
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Ask AI about Today's Tasks
                  </motion.button>
                </div>

                <Reorder.Group 
                  axis="y" 
                  values={todaysTasks} 
                  onReorder={setTodaysTasks}
                  className="space-y-3"
                >
                  <AnimatePresence>
                    {todaysTasks.map((task) => (
                      <Reorder.Item 
                        key={task.id} 
                        value={task}
                        className="group/task"
                      >
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="flex items-start gap-2.5 p-3 rounded-lg hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Drag handle */}
                          <motion.div
                            className="opacity-0 group-hover/task:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                            whileHover={{ scale: 1.1 }}
                          >
                            <GripVertical className="w-4 h-4 text-slate-400 mt-0.5" />
                          </motion.div>

                          {/* Checkbox */}
                          <motion.button
                            onClick={() => toggleTaskComplete(task.id)}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            className="mt-0.5"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 flex-shrink-0 group-hover/task:text-slate-600 transition-colors" />
                            )}
                          </motion.button>

                          {/* Task content */}
                          <div className="flex-1 min-w-0">
                            {editingTask === task.id ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="h-8 text-sm"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') saveEditTask(task.id);
                                      if (e.key === 'Escape') setEditingTask(null);
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => saveEditTask(task.id)}
                                  >
                                    <Check className="w-4 h-4 text-emerald-600" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setEditingTask(null)}
                                  >
                                    <XCircle className="w-4 h-4 text-slate-400" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start gap-2 mb-1">
                                  <p className={`leading-snug transition-colors flex-1 ${
                                    task.completed 
                                      ? 'line-through text-slate-400' 
                                      : 'group-hover/task:text-indigo-600'
                                  }`}>
                                    {task.text}
                                  </p>
                                  
                                  {/* Priority badge */}
                                  <motion.button
                                    onClick={() => changePriority(task.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs px-2 py-0 h-5 ${getPriorityColor(task.priority)} cursor-pointer`}
                                    >
                                      {getPriorityIcon(task.priority)}
                                    </Badge>
                                  </motion.button>
                                </div>
                                <p className="text-xs text-slate-500">{task.quest}</p>
                              </>
                            )}
                          </div>

                          {/* Action buttons */}
                          {editingTask !== task.id && (
                            <div className="flex items-center gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity">
                              <motion.button
                                onClick={() => {
                                  if (onAskAIAboutTask) {
                                    onAskAIAboutTask(task.text, task.quest, new Date().toLocaleDateString('en-US', { weekday: 'long' }));
                                  }
                                }}
                                className="p-1.5 hover:bg-indigo-100 rounded-md transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-indigo-600" />
                              </motion.button>
                              <motion.button
                                onClick={() => startEditTask(task.id, task.text)}
                                className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                              </motion.button>
                              <motion.button
                                onClick={() => deleteTask(task.id)}
                                className="p-1.5 hover:bg-red-100 rounded-md transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>

                {/* Add new task button */}
                <motion.button
                  onClick={addNewTask}
                  className="w-full mt-4 px-3 py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-lg text-sm text-slate-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Plus className="w-4 h-4" />
                  Add new task
                </motion.button>

                {/* All done celebration */}
                <AnimatePresence>
                  {completedCount === todaysTasks.length && todaysTasks.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      className="mt-4 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200"
                    >
                      <p className="text-sm text-emerald-800 font-medium flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        All tasks complete! Amazing work! 🎉
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>

            <Separator />

            {/* Effort Streak */}
            <div>
              <h3 className="text-sm uppercase tracking-wide text-slate-500 mb-3">Effort Streak</h3>
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-100">
                    <Flame className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-4xl text-orange-900">28</div>
                    <div className="text-sm text-orange-700">days strong</div>
                  </div>
                </div>
                <p className="text-sm text-orange-700">
                  Your longest streak yet! Keep going.
                </p>
              </Card>
            </div>

            {/* Celebrations */}
            <div>
              <h3 className="text-sm uppercase tracking-wide text-slate-500 mb-3">Recent Achievements</h3>
              <Card className="p-5 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 flex-shrink-0">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="mb-1">First Month</p>
                      <p className="text-xs text-slate-500">Completed 30 consecutive days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 flex-shrink-0">
                      <Trophy className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="mb-1">Milestone Reached</p>
                      <p className="text-xs text-slate-500">Completed "Basic Chords" in Learn Guitar</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
