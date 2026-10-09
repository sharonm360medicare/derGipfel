import React from 'react';
import { BookOpen, Trophy, Sparkles, Award } from 'lucide-react';
import quizAuditoriumImg from '../assets/images/quiz_stage_hall_1791279973808.jpg';

export const AboutSection: React.FC = () => {
  const visionPillars = [
    {
      stage: 'STAGE 01',
      title: 'LEARNING',
      subtitle: 'Build knowledge.',
      desc: 'Grundlegendes Eintauchen in Wortschatz, Grammatik, Kultur und Hörverstehen.',
      icon: BookOpen,
    },
    {
      stage: 'STAGE 02',
      title: 'COMPETITION',
      subtitle: 'Test your skills.',
      desc: 'Wettbewerbsorientierte Klassen-Runden unter realistischem Zeitdruck.',
      icon: Trophy,
    },
    {
      stage: 'STAGE 03',
      title: 'EXCELLENCE',
      subtitle: 'Push beyond limits.',
      desc: 'Sprachpräzision, Spontaneität und strategisches Teamwork im Fokus.',
      icon: Sparkles,
    },
    {
      stage: 'STAGE 04',
      title: 'RECOGNITION',
      subtitle: 'Earn your place at the summit.',
      desc: 'Der Einzug in das große Finale und die Krönung der besten Deutsch-Talente.',
      icon: Award,
    },
  ];

  const climbSteps = [
    { num: '01', title: 'ALL STUDENTS', desc: 'Individuelle Teilnahme für alle registrierten Schüler' },
    { num: '02', title: 'CLASS QUALIFIER', desc: 'Schriftliche Qualifikationsrunde & Projektbewertung' },
    { num: '03', title: 'TOP 6 STUDENTS', desc: 'Die besten 6 Kandidaten werden je Klasse nominiert' },
    { num: '04', title: 'CLASS SELECTION', desc: 'Strategisches Auswahl-Duell der Nominierten' },
    { num: '05', title: 'ONE REPRESENTATIVE TEAM', desc: 'Ein offizielles Delegations-Team je Klasse (Alpha bis Echo)' },
    { num: '06', title: 'INTER-CLASS CHAMPIONSHIP', desc: 'Großes Turnier der Klassen-Teams über 4 Runden' },
    { num: '07', title: 'TOP 2 TEAMS', desc: 'Die zwei stärksten Teams erreichen das Finale' },
    { num: '08', title: 'THE SUMMIT', desc: 'Der finale Aufstieg zum prestigeträchtigen Gipfel' },
  ];

  return (
    <section id="wettbewerb" className="py-20 border-t border-neutral-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 01 — Über den Wettbewerb Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            01 — ÜBER DEN WETTBEWERB
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-neutral-900 leading-[0.95]">
            ONE LANGUAGE.
            <br />
            ONE CHALLENGE.
            <br />
            <span className="text-red-600">ONE SUMMIT.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed pt-2">
            <strong>DER GIPFEL</strong> ist der führende deutsche Sprachwettbewerb, bei dem fundiertes
            Sprachwissen, strategisches Denken und intensive Zusammenarbeit aufeinandertreffen.
          </p>
        </div>

        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
          <p className="text-lg font-display font-bold text-neutral-900">
            Schülerinnen und Schüler beantworten nicht einfach nur Fragen:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="border-l-2 border-red-600 pl-4 py-1">
              <span className="text-xs font-mono font-bold text-red-600">01</span>
              <h4 className="text-base font-display font-extrabold text-neutral-900 mt-1 uppercase">
                They compete.
              </h4>
              <p className="text-xs text-neutral-500 mt-1">Ehrgeiziger akademischer Wettbewerb auf höchstem Niveau.</p>
            </div>
            <div className="border-l-2 border-neutral-900 pl-4 py-1">
              <span className="text-xs font-mono font-bold text-neutral-400">02</span>
              <h4 className="text-base font-display font-extrabold text-neutral-900 mt-1 uppercase">
                They collaborate.
              </h4>
              <p className="text-xs text-neutral-500 mt-1">Gemeinsame Strategie und gegenseitige Stärkung im Team.</p>
            </div>
            <div className="border-l-2 border-amber-500 pl-4 py-1">
              <span className="text-xs font-mono font-bold text-amber-600">03</span>
              <h4 className="text-base font-display font-extrabold text-neutral-900 mt-1 uppercase">
                They climb.
              </h4>
              <p className="text-xs text-neutral-500 mt-1">Stufe für Stufe bis zum Erreichen des Gipfels.</p>
            </div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <p className="text-xs text-neutral-700 italic">
              &bdquo;THE SUMMIT IS WAITING. Der Weg fordert Ausdauer, Neugier und die Liebe zur deutschen Sprache.&ldquo;
            </p>
          </div>
        </div>
      </div>

      {/* 02 — DIE VISION */}
      <div className="mt-24 space-y-8">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            02 — DIE VISION
          </span>
          <h3 className="text-3xl sm:text-4xl font-display font-black uppercase text-neutral-900 mt-1">
            WHY DER GIPFEL?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visionPillars.map((item) => {
            const Icon = item.icon;
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
              04 — DER AUFSTIEG
            </span>
            <h3 className="text-3xl sm:text-4xl font-display font-black uppercase text-neutral-900 mt-1">
              THE CLIMB BEGINS
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Von der individuellen Schuleingabe zur Krönung am Gipfel: Der 8-stufige Aufstieg.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1 bg-neutral-200 rounded-full text-neutral-700">
            5 Klassen · 1 Champion
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {climbSteps.map((step, idx) => (
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
                  STUFE {step.num}
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
