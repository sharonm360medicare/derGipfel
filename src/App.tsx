/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CompetitionProvider } from './context/CompetitionContext';
import { Navbar } from './components/Navbar';
import { HeroCountdownSection } from './components/HeroCountdownSection';
import { PracticeArenaSection } from './components/PracticeArenaSection';
import { RulesSection } from './components/RulesSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { Footer } from './components/Footer';
import { OfficialExamModal } from './components/OfficialExamModal';
import { QuizMasterControlCenter } from './components/QuizMasterControlCenter';

const CompetitionEntryPlatform: React.FC = () => {
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isQuizMasterOpen, setIsQuizMasterOpen] = useState(false);

  const handleOpenPractice = () => {
    const el = document.getElementById('practice-arena');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewLeaderboard = () => {
    const el = document.getElementById('leaderboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#121214] flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top 3-Zone Navigation */}
      <Navbar
        onOpenQuizMaster={() => setIsQuizMasterOpen(true)}
        onOpenExam={() => setIsExamModalOpen(true)}
      />

      {/* Main Experience */}
      <main className="flex-1">
        {/* Hero with Mountain Backdrop, Live Countdown, and Release Indicator */}
        <HeroCountdownSection
          onOpenExam={() => setIsExamModalOpen(true)}
          onOpenPractice={handleOpenPractice}
        />

        {/* Public Practice Arena with German Trivia Bank & Instant Explanations */}
        <PracticeArenaSection />

        {/* Official Competition Rules (Updated dynamically by Quiz Master) */}
        <RulesSection />

        {/* Official Qualification Leaderboard */}
        <LeaderboardSection />
      </main>

      {/* Footer */}
      <Footer onOpenQuizMaster={() => setIsQuizMasterOpen(true)} />

      {/* Official Timed Examination Modal */}
      <OfficialExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        onViewLeaderboard={handleViewLeaderboard}
      />

      {/* Quiz Master Control Center (Password Protected Admin Space) */}
      <QuizMasterControlCenter
        isOpen={isQuizMasterOpen}
        onClose={() => setIsQuizMasterOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CompetitionProvider>
      <CompetitionEntryPlatform />
    </CompetitionProvider>
  );
}
