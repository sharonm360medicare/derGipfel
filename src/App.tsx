/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CompetitionProvider, useCompetition } from './context/CompetitionContext';
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
import { SubMasterDashboard } from './components/SubMasterDashboard';

const MainCompetitionApp: React.FC = () => {
  const { currentUser } = useCompetition();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'public' | 'dashboard'>('public');

  const scrollToRegister = () => {
    const el = document.getElementById('anmeldung');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthSuccess = () => {
    setActiveView('dashboard');
  };

  // If in Dashboard view and authenticated
  if (activeView === 'dashboard' && currentUser) {
    if (currentUser.role === 'HEAD_MASTER') {
      return (
        <>
          <HeadMasterDashboard onExit={() => setActiveView('public')} />
          <CelebrationModal />
        </>
      );
    }

    if (currentUser.role === 'SUB_MASTER') {
      return (
        <>
          <SubMasterDashboard onExit={() => setActiveView('public')} />
          <CelebrationModal />
        </>
      );
    }
  }

  // Public Landing & Competition Portal
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#121214] flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDashboard={() => setActiveView('dashboard')}
        onScrollToRegister={scrollToRegister}
      />

      {/* Main Content Area */}
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

      {/* Footer */}
      <Footer />

      {/* Celebration Modal (Appears when Quiz Master ratifies marks or user triggers celebration) */}
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
      <MainCompetitionApp />
    </CompetitionProvider>
  );
}
