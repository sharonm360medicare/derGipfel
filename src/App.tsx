import React, { useState } from 'react';
import { CompetitionProvider } from './context/CompetitionContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { RoundsSection } from './components/RoundsSection';
import { GroupsAnnouncementSection } from './components/GroupsAnnouncementSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { RegistrationSection } from './components/RegistrationSection';
import { ScheduleSection } from './components/ScheduleSection';
import { RulesSection } from './components/RulesSection';
import { Footer } from './components/Footer';
import { CelebrationModal } from './components/CelebrationModal';
import { MasterAuthModal } from './components/MasterAuthModal';
import { HeadMasterDashboard } from './components/HeadMasterDashboard';

const MainApp: React.FC = () => {
  const [activeView, setActiveView] = useState<'public' | 'dashboard'>('public');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const scrollToRegister = () => {
    const el = document.getElementById('anmeldung');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthSuccess = () => {
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#121214] flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top 3-Zone Navigation (Visible in both Public website and Command Centre) */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDashboard={() => setActiveView('dashboard')}
        onScrollToRegister={scrollToRegister}
        activeView={activeView}
        onExitDashboard={() => setActiveView('public')}
        onNavigateSection={(sectionId) => {
          setActiveView('public');
          setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 60);
        }}
      />

      {/* Main View: Command Centre or Public Landing Experience */}
      {activeView === 'dashboard' ? (
        <HeadMasterDashboard onExit={() => setActiveView('public')} />
      ) : (
        <>
          <main className="flex-1">
            <HeroSection onRegisterClick={scrollToRegister} />
            <AboutSection />
            <RoundsSection />
            <GroupsAnnouncementSection />
            <LeaderboardSection />
            <RegistrationSection />
            <ScheduleSection />
            <RulesSection />
          </main>
          <Footer />
        </>
      )}

      {/* Celebration Modal (Confetti & Fanfare) */}
      <CelebrationModal />

      {/* Quiz Master Key Access Modal */}
      <MasterAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default function App() {
  return (
    <CompetitionProvider>
      <MainApp />
    </CompetitionProvider>
  );
}
