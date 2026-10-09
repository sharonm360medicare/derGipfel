import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { Shield, UserCheck, Menu, X, ArrowUpRight, LogOut } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onScrollToRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenDashboard,
  onScrollToRegister,
}) => {
  const { currentUser, logout } = useCompetition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Wettbewerb', href: '#wettbewerb' },
    { label: 'Die Runden', href: '#runden' },
    { label: 'Klassen & Gruppen', href: '#gruppen' },
    { label: 'Rangliste', href: '#rangliste' },
    { label: 'Zeitplan', href: '#zeitplan' },
    { label: 'Regeln', href: '#regeln' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with iconic peak motif */}
        <a
          href="#"
          className="flex items-center gap-2 group text-neutral-900 focus:outline-none"
        >
          {/* Geometric Mountain Peak SVG Icon */}
          <svg
            className="w-7 h-7 text-neutral-900 group-hover:text-red-600 transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m2 20 7-13 4 7 3-5 6 11H2z" />
          </svg>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-tighter uppercase leading-none">
              DER GIPFEL
            </span>
            <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase leading-none mt-0.5">
              German Excellence
            </span>
          </div>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => playClickSound()}
              className="hover:text-neutral-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  onOpenDashboard();
                }}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg text-white transition-all flex items-center gap-1.5 shadow-xs ${
                  currentUser.role === 'HEAD_MASTER'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {currentUser.role === 'HEAD_MASTER' ? (
                  <Shield className="w-3.5 h-3.5" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5" />
                )}
                <span>
                  {currentUser.role === 'HEAD_MASTER' ? 'Leitstelle' : 'Sub-Portal'}
                </span>
              </button>

              <button
                onClick={() => {
                  logout();
                  playClickSound();
                }}
                className="p-2 text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded-lg transition-colors"
                title="Abmelden"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                onOpenAuth();
              }}
              className="px-3.5 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 border border-neutral-300 hover:border-neutral-400 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <Shield className="w-3.5 h-3.5 text-neutral-500" />
              <span>Quizmeister Login</span>
            </button>
          )}

          <button
            onClick={() => {
              playClickSound();
              onScrollToRegister();
            }}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <span>Jetzt Anmelden</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          {currentUser && (
            <button
              onClick={onOpenDashboard}
              className="p-2 text-white bg-neutral-900 rounded-lg text-xs"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-neutral-900 rounded-lg border border-neutral-200"
            aria-label="Navigation öffnen"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-5 py-4 space-y-3 animate-fade-in">
          <nav className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-red-600 py-1.5"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDashboard();
                }}
                className="w-full py-2.5 text-xs font-bold text-center bg-neutral-900 text-white rounded-lg"
              >
                Zum Quizmeister Dashboard ({currentUser.role === 'HEAD_MASTER' ? 'Leitstelle' : 'Sub-Portal'})
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 text-xs font-bold text-center border border-neutral-300 rounded-lg text-neutral-800"
              >
                Quizmeister Login
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToRegister();
              }}
              className="w-full py-2.5 text-xs font-bold text-center bg-red-600 text-white rounded-lg"
            >
              Kandidat Anmelden
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
