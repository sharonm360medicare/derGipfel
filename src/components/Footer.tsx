import React from 'react';
import { Shield } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface FooterProps {
  onOpenQuizMaster: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuizMaster }) => {
  const handleNavClick = (id: string) => {
    playClickSound();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                ▲
              </span>
              <span className="font-display font-black text-lg text-white tracking-tight">
                DER GIPFEL 2026
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Offizielle Qualifikations- und Eintrittsplattform für den nationalen Deutsch-Wettbewerb. Stufe 01: Individuelle Landeskunde-Prüfung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-neutral-300">
            <button
              onClick={() => handleNavClick('countdown')}
              className="hover:text-white transition-colors"
            >
              Zeitplan & Countdown
            </button>
            <button
              onClick={() => handleNavClick('practice-arena')}
              className="hover:text-white transition-colors"
            >
              Übungsarena
            </button>
            <button
              onClick={() => handleNavClick('rules')}
              className="hover:text-white transition-colors"
            >
              Wettbewerbsregeln
            </button>
            <button
              onClick={() => handleNavClick('leaderboard')}
              className="hover:text-white transition-colors"
            >
              Bestenliste
            </button>
            <button
              onClick={() => {
                playClickSound();
                onOpenQuizMaster();
              }}
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Spielleitung</span>
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-neutral-400">
          <p>© 2026 DER GIPFEL · Nationaler Deutsch-Wettbewerb. Alle Rechte vorbehalten.</p>
          <p>Entwickelt für faire, zeitgesteuerte Qualifikationsrunden bundesweit.</p>
        </div>
      </div>
    </footer>
  );
};
