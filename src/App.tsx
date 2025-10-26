import { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Dashboard } from './components/Dashboard';
import { ChatWidget } from './components/ChatWidget';
import { WeeklyReview } from './components/WeeklyReview';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'dashboard'>('onboarding');
  const [showWeeklyReview, setShowWeeklyReview] = useState(false);
  const [userData, setUserData] = useState({
    northStar: '',
    quests: [] as any[]
  });

  const handleOnboardingComplete = (data: any) => {
    setUserData(data);
    setCurrentScreen('dashboard');
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
          />
          <ChatWidget />
          {showWeeklyReview && (
            <WeeklyReview onClose={() => setShowWeeklyReview(false)} />
          )}
        </>
      )}
    </div>
  );
}
