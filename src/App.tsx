import { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Dashboard } from './components/Dashboard';
import { ChatWidget } from './components/ChatWidget';
import { WeeklyReview } from './components/WeeklyReview';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'dashboard'>('onboarding');
  const [showWeeklyReview, setShowWeeklyReview] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    northStar: '',
    quests: [] as any[]
  });

  const handleOnboardingComplete = (data: any) => {
    setUserData(data);
    setCurrentScreen('dashboard');
  };

  const handleOpenChatForQuest = () => {
    setChatContext('new-quest');
    setChatOpen(true);
  };

  const handleAskAIAboutTask = (taskText: string, questName: string, dayOfWeek: string) => {
    setChatContext(`task-help: ${taskText}|${questName}|${dayOfWeek}`);
    setChatOpen(true);
  };

  const handleAskAIAboutQuest = (questName: string, progress: number, currentMilestone: string) => {
    setChatContext(`quest-help: ${questName}|${progress}|${currentMilestone}`);
    setChatOpen(true);
  };

  const handleAskAIAboutWeek = () => {
    setChatContext('weekly-review: full-week');
    setChatOpen(true);
  };

  const handleAskAIAboutDay = (day: string, tasksCompleted: number) => {
    setChatContext(`weekly-review: day|${day}|${tasksCompleted}`);
    setChatOpen(true);
  };

  const handleAskAIAboutNextWeek = () => {
    setChatContext('weekly-review: next-week-plan');
    setChatOpen(true);
  };

  const handleAskAIAboutPlanDay = (day: string) => {
    setChatContext(`weekly-review: plan-day|${day}`);
    setChatOpen(true);
  };

  const handleAskAIAboutPlanTask = (taskText: string, questName: string) => {
    setChatContext(`weekly-review: task|${taskText}|${questName}`);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {currentScreen === 'onboarding' ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : (
        <>
          <Dashboard 
            userData={userData} 
            onOpenWeeklyReview={() => setShowWeeklyReview(true)}
            onOpenChatForQuest={handleOpenChatForQuest}
            onAskAIAboutTask={handleAskAIAboutTask}
            onAskAIAboutQuest={handleAskAIAboutQuest}
          />
          {showWeeklyReview && (
            <WeeklyReview 
              onClose={() => setShowWeeklyReview(false)}
              onAskAIAboutWeek={handleAskAIAboutWeek}
              onAskAIAboutDay={handleAskAIAboutDay}
              onAskAIAboutNextWeek={handleAskAIAboutNextWeek}
              onAskAIAboutPlanDay={handleAskAIAboutPlanDay}
              onAskAIAboutTask={handleAskAIAboutPlanTask}
              isChatOpen={chatOpen}
            />
          )}
          <ChatWidget 
            isOpen={chatOpen}
            setIsOpen={setChatOpen}
            context={chatContext}
            onContextHandled={() => setChatContext(null)}
            isWeeklyReviewOpen={showWeeklyReview}
          />
        </>
      )}
    </div>
  );
}
