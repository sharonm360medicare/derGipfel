import React, { useState } from 'react';
import { Volume2, VolumeX, Shield, Lock, Unlock, Trophy } from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext';
import { getSoundMuted, setSoundMuted, playClickSound } from '../utils/sound';

interface NavbarProps {
  onOpenQuizMaster: () => void;
  onOpenExam: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuizMaster, onOpenExam }) => {
  const { isQuizMasterLoggedIn, isExamUnlocked } = useCompetition();
  const [muted, setMuted] = useState(getSoundMuted());

  const handleToggleSound = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
  };

  const handleNavClick = (id: string) => {
    playClickSound();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-display font-bold text-sm tracking-tighter group-hover:bg-red-600 transition-colors shadow-xs">
            ▲
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-black text-lg tracking-tight text-neutral-900 whitespace-nowrap">
              DER GIPFEL
            </span>
            <span className="font-mono text-xs font-semibold text-red-600 whitespace-nowrap">
              2026
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links (4-5 single-line clean text links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
          <button
            onClick={() => handleNavClick('countdown')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            Zeitplan & Countdown
          </button>
          <button
            onClick={() => handleNavClick('practice-arena')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            Übungsarena
          </button>
          <button
            onClick={() => handleNavClick('rules')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            Wettbewerbsregeln
          </button>
          <button
            onClick={() => handleNavClick('leaderboard')}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            Bestenliste
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            title={muted ? 'Ton aktivieren' : 'Ton stummschalten'}
            aria-label="Sound Toggle"
          >
            {muted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* Exam Trigger CTA (if unlocked) */}
          {isExamUnlocked ? (
            <button
              onClick={() => {
                playClickSound();
                onOpenExam();
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 animate-pulse"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Prüfung Starten</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('countdown')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Gesperrt bis Start</span>
            </button>
          )}

          {/* Quiz Master Portal Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenQuizMaster();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              isQuizMasterLoggedIn
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-white border border-neutral-300 text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${isQuizMasterLoggedIn ? 'text-amber-400' : 'text-neutral-500'}`} />
            <span>{isQuizMasterLoggedIn ? 'Quizmeister-Deck' : 'Quizmeister'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
