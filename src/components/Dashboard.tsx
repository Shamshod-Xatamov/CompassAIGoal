import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { QuestMap } from './QuestMap';
import { GoalProgress } from './GoalProgress';
import { Target, Flame, Trophy, Calendar } from 'lucide-react';

interface DashboardProps {
  userData: any;
  onOpenWeeklyReview: () => void;
}

export function Dashboard({ userData, onOpenWeeklyReview }: DashboardProps) {
  const [selectedQuest, setSelectedQuest] = useState(userData.quests[0]);

  const todaysTasks = [
    { id: 1, text: 'Design landing page mockup', quest: 'Launch Side Project' },
    { id: 2, text: 'Practice C major scale', quest: 'Learn Guitar' },
    { id: 3, text: '30-min morning workout', quest: 'Health & Fitness' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-indigo-600" />
            <span className="text-xl">Compass</span>
          </div>
          <Button 
            variant="outline" 
            onClick={onOpenWeeklyReview}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Weekly Review
          </Button>
        </div>
      </header>

      {/* Three Column Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Column - The "Why" */}
        <div className="w-80 border-r bg-gradient-to-b from-white to-slate-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* North Star */}
            <div>
              <h3 className="text-sm uppercase tracking-wide text-slate-500 mb-3">Your North Star</h3>
              <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <p className="text-indigo-900 leading-relaxed">{userData.northStar}</p>
                </div>
              </Card>
            </div>

            <Separator />

            {/* Active Quests */}
            <div>
              <h3 className="text-sm uppercase tracking-wide text-slate-500 mb-3">Active Quests</h3>
              <div className="space-y-3">
                {userData.quests.map((quest: any, index: number) => (
                  <Card
                    key={quest.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedQuest.id === quest.id
                        ? 'bg-indigo-600 text-white shadow-lg scale-105'
                        : 'hover:bg-slate-50 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedQuest(quest)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{quest.name}</span>
                      {index === 0 && selectedQuest.id !== quest.id && (
                        <Badge variant="secondary" className="text-xs">Primary</Badge>
                      )}
                    </div>
                    <Progress 
                      value={quest.progress} 
                      className={`h-2 ${selectedQuest.id === quest.id ? 'bg-indigo-400' : ''}`}
                    />
                    <div className={`text-xs mt-2 ${
                      selectedQuest.id === quest.id ? 'text-indigo-200' : 'text-slate-500'
                    }`}>
                      {quest.progress}% complete
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
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
              <QuestMap quest={selectedQuest} />
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

        {/* Right Column - The "How" */}
        <div className="w-96 border-l bg-gradient-to-b from-white to-slate-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Today's Focus */}
            <div>
              <h3 className="text-sm uppercase tracking-wide text-slate-500 mb-3">Today's Focus</h3>
              <Card className="p-5 shadow-sm">
                <div className="space-y-4">
                  {todaysTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 group">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 rounded border-slate-300 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="mb-1 leading-snug group-hover:text-indigo-600 transition-colors">{task.text}</p>
                        <p className="text-xs text-slate-500">{task.quest}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
