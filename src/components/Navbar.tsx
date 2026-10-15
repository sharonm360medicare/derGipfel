import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { Shield, UserCheck, Menu, X, ArrowUpRight, LogOut } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onScrollToRegister: () => void;
  activeView?: 'public' | 'dashboard';
  onExitDashboard?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenDashboard,
  onScrollToRegister,
  activeView = 'public',
  onExitDashboard,
  onNavigateSection,
}) => {
  const { currentUser, logout, language, setLanguage, t, gamesPublic } = useCompetition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.competition, href: '#wettbewerb' },
    ...(gamesPublic ? [{ label: t.nav.rounds, href: '#runden' }] : []),
    { label: t.nav.groups, href: '#gruppen' },
    { label: t.nav.leaderboard, href: '#rangliste' },
    { label: t.nav.schedule, href: '#zeitplan' },
    { label: t.nav.rules, href: '#regeln' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with iconic peak motif */}
        <a
          href="#"
          onClick={(e) => {
            if (activeView === 'dashboard') {
              e.preventDefault();
              playClickSound();
              onExitDashboard?.();
            }
          }}
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
              onClick={(e) => {
                playClickSound();
                if (activeView === 'dashboard') {
                  e.preventDefault();
                  onNavigateSection?.(link.href.replace('#', ''));
                }
              }}
              className="hover:text-neutral-900 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions + Language Toggle */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Small Language Toggle DE | EN */}
          <div className="flex items-center p-0.5 bg-neutral-200/90 rounded-lg text-[11px] font-bold font-mono tracking-tight shrink-0 border border-neutral-300/60 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setLanguage('de');
              }}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'de'
                  ? 'bg-white text-neutral-900 shadow-2xs font-extrabold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Deutsch"
              aria-label="Auf Deutsch umschalten"
            >
              DE
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setLanguage('en');
              }}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-neutral-900 shadow-2xs font-extrabold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="English"
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              {activeView === 'dashboard' ? (
                <>
                  <div className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600/10 text-red-700 border border-red-500/25 flex items-center gap-1.5 shadow-2xs">
                    <Shield className="w-3.5 h-3.5 text-red-600" />
                    <span>{currentUser.role === 'HEAD_MASTER' ? t.nav.commandCenter : t.nav.subPortal}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="Aktiv" />
                  </div>
                  <button
                    onClick={() => {
                      playClickSound();
                      onExitDashboard?.();
                    }}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                  >
                    <span>{t.nav.publicView}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </>
              ) : (
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
                    {currentUser.role === 'HEAD_MASTER' ? t.nav.commandCenter : t.nav.subPortal}
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  playClickSound();
                  if (activeView === 'dashboard') {
                    onExitDashboard?.();
                  }
                }}
                className="p-2 text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded-lg transition-colors"
                title={t.nav.logout}
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
              <span>{t.nav.quizMasterLogin}</span>
            </button>
          )}

          <button
            onClick={() => {
              playClickSound();
              if (activeView === 'dashboard') {
                onNavigateSection?.('anmeldung');
              } else {
                onScrollToRegister();
              }
            }}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <span>{t.nav.registerNow}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>

        {/* Mobile Actions & Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile small language toggle */}
          <div className="flex items-center p-0.5 bg-neutral-200/90 rounded-lg text-[10px] font-bold font-mono tracking-tight shrink-0 border border-neutral-300/50">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setLanguage('de');
              }}
              className={`px-1.5 py-0.5 rounded transition-all ${
                language === 'de'
                  ? 'bg-white text-neutral-900 shadow-2xs font-extrabold'
                  : 'text-neutral-500'
              }`}
            >
              DE
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setLanguage('en');
              }}
              className={`px-1.5 py-0.5 rounded transition-all ${
                language === 'en'
                  ? 'bg-white text-neutral-900 shadow-2xs font-extrabold'
                  : 'text-neutral-500'
              }`}
            >
              EN
            </button>
          </div>

          {currentUser && (
            <button
              onClick={() => {
                if (activeView === 'dashboard') {
                  onExitDashboard?.();
                } else {
                  onOpenDashboard();
                }
              }}
              className="p-2 text-white bg-neutral-900 rounded-lg text-xs"
              title={activeView === 'dashboard' ? t.nav.publicView : t.nav.commandCenter}
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
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (activeView === 'dashboard') {
                    e.preventDefault();
                    onNavigateSection?.(link.href.replace('#', ''));
                  }
                }}
                className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-red-600 py-1.5"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                {activeView === 'dashboard' ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onExitDashboard?.();
                    }}
                    className="w-full py-2.5 px-4 bg-neutral-900 text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2"
                  >
                    <span>{t.nav.publicView}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDashboard();
                    }}
                    className="w-full py-2.5 px-4 bg-red-600 text-white rounded-lg text-xs font-bold text-center"
                  >
                    {currentUser.role === 'HEAD_MASTER' ? t.nav.commandCenter : t.nav.subPortal}
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    if (activeView === 'dashboard') {
                      onExitDashboard?.();
                    }
                  }}
                  className="w-full py-2 px-4 border border-neutral-200 text-neutral-600 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.nav.logout}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 text-xs font-bold text-center border border-neutral-300 rounded-lg text-neutral-800"
              >
                {t.nav.quizMasterLogin}
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (activeView === 'dashboard') {
                  onNavigateSection?.('anmeldung');
                } else {
                  onScrollToRegister();
                }
              }}
              className="w-full py-2.5 text-xs font-bold text-center bg-red-600 text-white rounded-lg"
            >
              {t.nav.registerNow}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
