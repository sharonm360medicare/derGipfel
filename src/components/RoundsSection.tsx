import React from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { Video, Grid, Zap, Mountain, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { playClickSound } from '../utils/sound';

export const RoundsSection: React.FC = () => {
  const { rounds, activeRoundId, openCelebration } = useCompetition();

  const roundIcons = [Video, Grid, Zap, Mountain];

  return (
    <section id="runden" className="py-20 border-t border-neutral-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            05 — DIE RUNDEN
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-neutral-900 mt-1">
            THE CHALLENGE
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 mt-1">
            Every round takes you one step closer to the summit.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 bg-white px-3 py-1.5 rounded-lg border border-neutral-200">
          <Clock className="w-3.5 h-3.5 text-red-600" />
          <span>Turnierphase: 4 Hauptrunden</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rounds.map((round, idx) => {
          const Icon = roundIcons[idx] || Mountain;
          const isActive = round.id === activeRoundId;
          const isPublished = round.status === 'scores_published';

          return (
            <div
              key={round.id}
              className={`bg-white rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-all ${
                isActive
                  ? 'border-neutral-900 ring-2 ring-neutral-900 shadow-md'
                  : 'border-neutral-200 hover:border-neutral-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-600">
                      ROUND 0{round.id}
                    </span>
                    <span aria-hidden="true" className="text-neutral-300">·</span>
                    <span className="text-2xs font-mono font-medium text-neutral-400 uppercase">
                      Max. {round.maxScore} Pkt.
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {isPublished ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Ergebnisse Bestätigt
                      </span>
                    ) : isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        Aktiv Im Gange
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-neutral-100 text-neutral-500">
                        Demnächst
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black uppercase text-neutral-900">
                      {round.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-red-600 mt-0.5">
                      {round.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 mt-4 leading-relaxed">
                  {round.tagline}
                </p>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {round.description}
                </p>
              </div>

              {/* Bottom interactive action */}
              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-2xs font-mono text-neutral-400">
                  Format: {round.format}
                </span>

                {isPublished && (
                  <button
                    onClick={() => {
                      playClickSound();
                      openCelebration();
                    }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Feier-Verkündung ansehen</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
