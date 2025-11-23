import { motion } from 'motion/react';
import { CheckCircle2, Circle, Trophy, Star, Target, Sparkles, Flag, Zap, Award, TrendingUp } from 'lucide-react';

interface GoalProgressProps {
  quest: any;
}

export function GoalProgress({ quest }: GoalProgressProps) {
  // Calculate milestone statistics
  const totalMilestones = quest.milestones?.length || 0;
  const completedMilestones = quest.milestones?.filter((m: any) => m.completed).length || 0;
  const currentMilestoneIndex = completedMilestones;
  const currentMilestone = quest.milestones?.[currentMilestoneIndex];
  
  // Calculate subgoal statistics
  const totalSubGoals = quest.milestones?.reduce((sum: number, m: any) => sum + (m.subGoals?.length || 0), 0) || 0;
  const completedSubGoals = quest.milestones?.reduce((sum: number, m: any) => 
    sum + (m.subGoals?.filter((s: any) => s.completed).length || 0), 0) || 0;
  
  // Calculate task statistics
  const totalTasks = quest.milestones?.reduce((sum: number, m: any) => 
    sum + (m.subGoals?.reduce((subSum: number, sg: any) => subSum + (sg.tasks?.length || 0), 0) || 0), 0) || 0;
  const completedTasks = quest.milestones?.reduce((sum: number, m: any) => 
    sum + (m.subGoals?.reduce((subSum: number, sg: any) => 
      subSum + (sg.tasks?.filter((t: any) => t.completed).length || 0), 0) || 0), 0) || 0;

  // Calculate current milestone progress
  const currentMilestoneProgress = currentMilestone?.subGoals?.length > 0
    ? (currentMilestone.subGoals.filter((s: any) => s.completed).length / currentMilestone.subGoals.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Clean Progress Overview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-500 text-sm mb-1">Overall Progress</p>
            <h2 className="text-6xl text-indigo-600">{quest.progress}%</h2>
          </div>
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-indigo-50">
            <Trophy className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        {/* Simple Progress Bar */}
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${quest.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Clean Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl text-slate-800 mb-1">{completedMilestones}/{totalMilestones}</div>
            <p className="text-xs text-slate-500">Milestones</p>
          </div>
          <div className="text-center">
            <div className="text-2xl text-slate-800 mb-1">{completedSubGoals}/{totalSubGoals}</div>
            <p className="text-xs text-slate-500">Subgoals</p>
          </div>
          <div className="text-center">
            <div className="text-2xl text-slate-800 mb-1">{completedTasks}/{totalTasks}</div>
            <p className="text-xs text-slate-500">Tasks</p>
          </div>
        </div>
      </div>

      {/* Current Focus */}
      {currentMilestone && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-indigo-600" />
            <span className="text-xs text-slate-500">Current Focus</span>
          </div>
          
          <h3 className="text-slate-900 mb-4">{currentMilestone.title}</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Progress</span>
              <span className="text-slate-900">{Math.round(currentMilestoneProgress)}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentMilestoneProgress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
            <span>{currentMilestone.subGoals?.filter((s: any) => s.completed).length || 0} completed</span>
            <span>·</span>
            <span>{currentMilestone.subGoals?.filter((s: any) => !s.completed).length || 0} remaining</span>
          </div>
        </div>
      )}

      {/* Milestones List */}
      <div>
        <h3 className="text-slate-800 mb-4">All Milestones</h3>
        
        <div className="space-y-3">
          {quest.milestones?.map((milestone: any, index: number) => {
            const isCompleted = milestone.completed;
            const isCurrent = !isCompleted && index === completedMilestones;
            const subgoalProgress = milestone.subGoals?.length > 0
              ? (milestone.subGoals.filter((s: any) => s.completed).length / milestone.subGoals.length) * 100
              : 0;
            
            return (
              <div
                key={milestone.id || `milestone-${index}`}
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 border ${
                  isCompleted 
                    ? 'border-emerald-200' 
                    : isCurrent
                    ? 'border-indigo-200'
                    : 'border-slate-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-emerald-100' 
                      : isCurrent
                      ? 'bg-indigo-100'
                      : 'bg-slate-100'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm mb-2 ${
                      isCompleted ? 'text-emerald-900' : isCurrent ? 'text-indigo-900' : 'text-slate-700'
                    }`}>
                      {milestone.title}
                    </h4>
                    
                    {!isCompleted && (
                      <div className="space-y-1.5">
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCurrent ? 'bg-indigo-600' : 'bg-slate-300'
                            }`}
                            style={{ width: `${subgoalProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500">
                          {milestone.subGoals?.filter((s: any) => s.completed).length || 0}/{milestone.subGoals?.length || 0} subgoals
                        </p>
                      </div>
                    )}
                    
                    {isCompleted && (
                      <p className="text-xs text-emerald-600">Complete</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}