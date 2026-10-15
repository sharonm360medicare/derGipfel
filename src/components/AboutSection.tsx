import React from 'react';
import { BookOpen, Trophy, Sparkles, Award } from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext';

export const AboutSection: React.FC = () => {
  const { t } = useCompetition();
  const pillarIcons = [BookOpen, Trophy, Sparkles, Award];

  return (
    <section id="wettbewerb" className="py-20 border-t border-neutral-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 01 — Über den Wettbewerb Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            {t.about.kicker}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-neutral-900 leading-[0.95]">
            {t.about.titleLine1}
            <br />
            {t.about.titleLine2}
            <br />
            <span className="text-red-600">{t.about.titleLine3}</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed pt-2">
            <strong>DER GIPFEL</strong> — {t.about.intro}
          </p>
        </div>

        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
          <p className="text-lg font-display font-bold text-neutral-900">
            {t.about.studentsNotJust}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="border-l-2 border-red-600 pl-4 py-1">
              <span className="text-xs font-mono font-bold text-red-600">01</span>
              <h4 className="text-base font-display font-extrabold text-neutral-900 mt-1 uppercase">
                {t.about.compete}
              </h4>
              <p className="text-xs text-neutral-500 mt-1">{t.about.competeDesc}</p>
            </div>
            <div className="border-l-2 border-neutral-900 pl-4 py-1">
              <span className="text-xs font-mono font-bold text-neutral-400">02</span>
              <h4 className="text-base font-display font-extrabold text-neutral-900 mt-1 uppercase">
                {t.about.collaborate}
              </h4>
              <p className="text-xs text-neutral-500 mt-1">{t.about.collaborateDesc}</p>
            </div>
            <div className="border-l-2 border-amber-500 pl-4 py-1">
              <span className="text-xs font-mono font-bold text-amber-600">03</span>
              <h4 className="text-base font-display font-extrabold text-neutral-900 mt-1 uppercase">
                {t.about.climb}
              </h4>
              <p className="text-xs text-neutral-500 mt-1">{t.about.climbDesc}</p>
            </div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <p className="text-xs text-neutral-700 italic">
              {t.about.quote}
            </p>
          </div>
        </div>
      </div>

      {/* 02 — DIE VISION */}
      <div className="mt-24 space-y-8">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            {t.about.visionKicker}
          </span>
          <h3 className="text-3xl sm:text-4xl font-display font-black uppercase text-neutral-900 mt-1">
            {t.about.whyTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.about.pillars.map((item, idx) => {
            const Icon = pillarIcons[idx] || Award;
            return (
              <div
                key={item.stage}
                className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xs font-mono font-bold tracking-widest text-neutral-400">
                      {item.stage}
                    </span>
                    <Icon className="w-4 h-4 text-red-600" />
                  </div>
                  <h4 className="text-xl font-display font-black uppercase text-neutral-900">
                    {item.title}
                  </h4>
                  <p className="text-xs font-semibold text-neutral-500 mt-0.5">{item.subtitle}</p>
                  <p className="text-xs text-neutral-600 mt-3 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 04 — DER AUFSTIEG (THE CLIMB BEGINS) */}
      <div className="mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
              {t.about.climbKicker}
            </span>
            <h3 className="text-3xl sm:text-4xl font-display font-black uppercase text-neutral-900 mt-1">
              {t.about.climbTitle}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              {t.about.climbSubtitle}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1 bg-neutral-200 rounded-full text-neutral-700">
            {t.about.climbBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.about.steps.map((step, idx) => (
            <div
              key={step.num}
              className={`p-5 rounded-xl border transition-all ${
                idx === 7
                  ? 'bg-neutral-950 text-white border-neutral-800 shadow-md'
                  : idx === 6
                  ? 'bg-amber-500/10 border-amber-300 text-neutral-900'
                  : 'bg-white border-neutral-200 text-neutral-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold ${
                    idx === 7 ? 'text-red-400' : 'text-neutral-400'
                  }`}
                >
                  {step.num}
                </span>
                {idx === 7 && <Trophy className="w-4 h-4 text-amber-400" />}
              </div>
              <h5
                className={`text-sm font-display font-black uppercase mt-2 ${
                  idx === 7 ? 'text-white' : 'text-neutral-900'
                }`}
              >
                {step.title}
              </h5>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  idx === 7 ? 'text-neutral-300' : 'text-neutral-500'
                }`}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
