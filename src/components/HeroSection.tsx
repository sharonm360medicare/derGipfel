import React from 'react';
import { ArrowDown, Award, Sparkles } from 'lucide-react';
import summitHeroImg from '../assets/images/gipfel_summit_hero_1791279947399.jpg';
import { playClickSound } from '../utils/sound';
import { useCompetition } from '../context/CompetitionContext';

interface HeroSectionProps {
  onRegisterClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onRegisterClick }) => {
  const { t, language } = useCompetition();

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Top Tagline from Brochure Page 1 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-red-600 rounded-xs" />
          <span className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-neutral-500 font-semibold">
            {t.hero.badge}
          </span>
        </div>

        {/* Massive Editorial Header matching PDF */}
        <div className="relative">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.88] text-neutral-900 select-none">
            {t.hero.title1}<span className="text-red-600">.</span>
            <br />
            {t.hero.title2}
          </h1>

          <div className="mt-6 sm:mt-8 space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold uppercase tracking-tight text-neutral-800">
              {t.hero.tagline}
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 font-medium">
              {t.hero.subtagline}
            </p>
          </div>
        </div>
      </div>

      {/* Hero Visual Card with Leica Alpine Summit Photography */}
      <div className="my-10 relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-950 aspect-[16/9] sm:aspect-[21/9] max-h-[480px] shadow-xl group">
        <img
          src={summitHeroImg}
          alt="Der Gipfel Alpine Mountain Peak"
          className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent pointer-events-none" />

        {/* Overlay Badges */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold block">
              {t.hero.nationalBadge}
            </span>
            <p className="text-base sm:text-lg font-display font-bold max-w-lg leading-snug">
              {t.hero.heroQuote}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                onRegisterClick();
              }}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.hero.qualifierButton}</span>
            </button>
            <a
              href="#wettbewerb"
              onClick={() => playClickSound()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>{language === 'de' ? 'Entdecken' : 'Explore'}</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Features Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-200 text-neutral-600">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-red-600">01</span>
          <h3 className="text-sm font-bold text-neutral-900">
            {language === 'de' ? 'Individuelle Qualifikation' : 'Individual Qualification'}
          </h3>
          <p className="text-xs text-neutral-500">
            {language === 'de'
              ? 'Schriftliche Projekt- und Wissensrunde für jeden Schüler zur Vorauswahl.'
              : 'Written project and trivia exam for every student to qualify for the summit.'}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-red-600">02</span>
          <h3 className="text-sm font-bold text-neutral-900">
            {language === 'de' ? 'Offizielle Gruppenbildung' : 'Official Team Formation'}
          </h3>
          <p className="text-xs text-neutral-500">
            {language === 'de'
              ? 'Die Top-6 jeder Klasse bilden das Team (Alpha bis Echo) für die Meisterschaft.'
              : 'Top candidates from each grade form official teams (Alpha through Echo).'}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-red-600">03</span>
          <h3 className="text-sm font-bold text-neutral-900">
            {language === 'de' ? 'Automatisierte Feier-Verkündung' : 'Celebration Ceremony'}
          </h3>
          <p className="text-xs text-neutral-500">
            {language === 'de'
              ? 'Punktefreigabe durch den Quizmeister mit ästhetischer Feier-Animation.'
              : 'Official score ratification by the Quiz Master with sound & confetti ceremonies.'}
          </p>
        </div>
      </div>
    </section>
  );
};
