import React from 'react';
import { Clock, Play, BookOpen, CheckCircle, ShieldAlert } from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext';
import { playClickSound } from '../utils/sound';
import summitHeroImg from '../assets/images/gipfel_summit_hero_1791279947399.jpg';

interface HeroCountdownSectionProps {
  onOpenExam: () => void;
  onOpenPractice: () => void;
}

export const HeroCountdownSection: React.FC<HeroCountdownSectionProps> = ({
  onOpenExam,
  onOpenPractice,
}) => {
  const { countdownConfig, isExamUnlocked, timeRemainingSeconds } = useCompetition();

  // Format seconds into Days, Hours, Mins, Secs
  const days = Math.floor(timeRemainingSeconds / 86400);
  const hours = Math.floor((timeRemainingSeconds % 86400) / 3600);
  const minutes = Math.floor((timeRemainingSeconds % 3600) / 60);
  const seconds = timeRemainingSeconds % 60;

  const targetDateObj = new Date(countdownConfig.targetDate);
  const formattedDate = targetDateObj.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section id="countdown" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Background Hero Photography with Dark Editorial Scrim */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={summitHeroImg}
          alt="Alpen Gipfel Bergkulisse"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/85 to-[#FBFBFA]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Kicker */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-neutral-300 uppercase mb-4">
          <span className="text-red-500">DER GIPFEL 2026</span>
          <span aria-hidden="true">·</span>
          <span>STUFE 01 QUALIFIKATION</span>
          <span aria-hidden="true">·</span>
          <span>INDIVIDUELLER WETTBEWERBSEINTRITT</span>
        </div>

        {/* Hero Title & Subtitle (Fully controlled by Quiz Master) */}
        <div className="max-w-3xl mb-8">
          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] text-balance">
            {countdownConfig.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
            {countdownConfig.subtitle}
          </p>
        </div>

        {/* Main Countdown Deck */}
        <div className="max-w-4xl bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
            <div>
              <span className="text-2xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                Offizieller Prüfungsstart (Freigabe durch Spielleitung)
              </span>
              <p className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{formattedDate} Uhr</span>
              </p>
            </div>

            {/* Status Indicator */}
            <div>
              {isExamUnlocked ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>JETZT FREIGESCHALTET</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>GESPERRT BIS FREIGABE</span>
                </div>
              )}
            </div>
          </div>

          {/* Countdown Numbers Grid */}
          {!isExamUnlocked ? (
            <div className="grid grid-cols-4 gap-2 sm:gap-4 my-6">
              <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3 sm:p-5 text-center">
                <span className="font-mono tabular-nums font-black text-2xl sm:text-5xl text-white block">
                  {String(days).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider block mt-1">
                  Tage
                </span>
              </div>
              <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3 sm:p-5 text-center">
                <span className="font-mono tabular-nums font-black text-2xl sm:text-5xl text-white block">
                  {String(hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider block mt-1">
                  Stunden
                </span>
              </div>
              <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3 sm:p-5 text-center">
                <span className="font-mono tabular-nums font-black text-2xl sm:text-5xl text-white block">
                  {String(minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider block mt-1">
                  Minuten
                </span>
              </div>
              <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3 sm:p-5 text-center">
                <span className="font-mono tabular-nums font-black text-2xl sm:text-5xl text-red-500 block">
                  {String(seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider block mt-1">
                  Sekunden
                </span>
              </div>
            </div>
          ) : (
            <div className="my-6 p-6 rounded-xl bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-900 border border-red-500/30 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white font-display">
                  Die Qualifikationsrunde ist live!
                </h3>
                <p className="text-xs text-neutral-300 mt-1 max-w-xl">
                  Die Prüfung ist jetzt für alle Teilnehmenden geöffnet. Sie haben {countdownConfig.examDurationMinutes} Minuten Zeit für {countdownConfig.examQuestionCount} Fragen.
                </p>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            {isExamUnlocked ? (
              <button
                onClick={() => {
                  playClickSound();
                  onOpenExam();
                }}
                className="flex-1 py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide uppercase transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                <Play className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform" />
                <span>Offizielle Prüfung Jetzt Starten</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  playClickSound();
                  onOpenPractice();
                }}
                className="flex-1 py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-sm tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <BookOpen className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                <span>In die Übungsarena (Jetzt Trainieren)</span>
              </button>
            )}

            <button
              onClick={() => {
                playClickSound();
                const el = document.getElementById('rules');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-3.5 px-6 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm transition-colors text-center"
            >
              Prüfungsregeln lesen
            </button>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl">
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <span className="text-2xs font-mono font-bold text-red-600 uppercase block mb-1">
              Format 01
            </span>
            <h4 className="text-sm font-bold text-neutral-900">Individuelle Teilnahme</h4>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Jede/r Teilnehmende tritt eigenständig an. Bei Erreichen von {countdownConfig.qualifyingScorePercentage}% erfolgt die Qualifikation.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <span className="text-2xs font-mono font-bold text-amber-600 uppercase block mb-1">
              Format 02
            </span>
            <h4 className="text-sm font-bold text-neutral-900">4 Wissensgebiete</h4>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Fragen aus Geschichte, Kultur & Kunst, Essen & Kulinarik sowie Geografie der 16 Bundesländer.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-neutral-200/80 shadow-xs">
            <span className="text-2xs font-mono font-bold text-emerald-600 uppercase block mb-1">
              Format 03
            </span>
            <h4 className="text-sm font-bold text-neutral-900">Offene Übungsarena</h4>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Trainieren Sie vor dem Starttermin mit originalgetreuen 4-Optionen-Fragen und Hintergrundnotizen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
