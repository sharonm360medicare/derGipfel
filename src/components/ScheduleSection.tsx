import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext';

export const ScheduleSection: React.FC = () => {
  const { t, language } = useCompetition();

  const [timeLeft, setTimeLeft] = useState({
    days: 91,
    hours: 23,
    minutes: 58,
    seconds: 44,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="zeitplan" className="py-20 border-t border-neutral-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Brochure Page 11 Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            {t.schedule.kicker}
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight text-neutral-900 mt-1 leading-[0.9]">
            {t.schedule.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-mono">
            {t.schedule.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-white px-3 py-1.5 rounded-lg border border-neutral-200">
          <Calendar className="w-3.5 h-3.5 text-red-600" />
          <span>{language === 'de' ? 'Saison 2026 / 2027' : 'Season 2026 / 2027'}</span>
        </div>
      </div>

      {/* Countdown Clock matching Brochure Page 16 */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-10 mb-12 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-2xs font-mono tracking-[0.3em] uppercase text-red-400 font-bold block">
            {t.schedule.countdownLabel}
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight">
            The Summit Awaits.
          </h3>
          <p className="text-xs text-neutral-400">
            {language === 'de'
              ? 'Verbleibende Zeit bis zur Austragung der Inter-Class Championship'
              : 'Remaining time until the live Inter-Class Championship'}
          </p>
        </div>

        {/* 4 Digital Timer Units */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-4 sm:p-6 text-center">
            <span className="text-4xl sm:text-6xl font-display font-black font-mono tabular-nums text-white block">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-2xs sm:text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase mt-1 block">
              {t.schedule.days} (DD)
            </span>
          </div>

          <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-4 sm:p-6 text-center">
            <span className="text-4xl sm:text-6xl font-display font-black font-mono tabular-nums text-white block">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-2xs sm:text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase mt-1 block">
              {t.schedule.hours} (HH)
            </span>
          </div>

          <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-4 sm:p-6 text-center">
            <span className="text-4xl sm:text-6xl font-display font-black font-mono tabular-nums text-white block">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-2xs sm:text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase mt-1 block">
              {t.schedule.minutes} (MM)
            </span>
          </div>

          <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-4 sm:p-6 text-center">
            <span className="text-4xl sm:text-6xl font-display font-black font-mono tabular-nums text-red-500 block">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-2xs sm:text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase mt-1 block">
              {t.schedule.seconds} (SS)
            </span>
          </div>
        </div>
      </div>

      {/* Stages Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {t.schedule.stages.map((stg) => (
          <div
            key={stg.stage}
            className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-red-600">
                  {stg.stage}
                </span>
                <span className="text-2xs font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                  {stg.date}
                </span>
              </div>
              <h4 className="text-xl font-display font-black uppercase text-neutral-900">
                {stg.title}
              </h4>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                {stg.desc}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-2xs font-semibold text-neutral-400 uppercase">Status</span>
              <span className="text-2xs font-bold text-neutral-800 font-mono">{stg.status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
