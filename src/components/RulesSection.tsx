import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext';
import { RuleCategory } from '../types/competition';
import { playClickSound } from '../utils/sound';

export const RulesSection: React.FC = () => {
  const { rules } = useCompetition();
  const [activeCategory, setActiveCategory] = useState<RuleCategory | 'ALL'>('ALL');

  const filteredRules =
    activeCategory === 'ALL'
      ? rules
      : rules.filter((r) => r.category === activeCategory);

  return (
    <section id="rules" className="py-16 lg:py-24 bg-white border-t border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              <span>WETTKAMPF-REGLEMENT</span>
              <span aria-hidden="true">·</span>
              <span>STUFE 01 BIS BUNDESFINALE</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight">
              Regeln & Wettkampf-Ablauf
            </h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-2xl leading-relaxed">
              Verbindliche Leitlinien für die Qualifikation zum nationalen Deutsch-Wettbewerb DER GIPFEL 2026. Diese Regeln werden laufend durch die Spielleitung aktualisiert.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {(
              [
                { id: 'ALL', label: 'Alle Regeln' },
                { id: 'Ablauf', label: 'Ablauf' },
                { id: 'Teilnahme', label: 'Teilnahme' },
                { id: 'Bewertung', label: 'Bewertung' },
                { id: 'Fairplay', label: 'Fairplay' },
              ] as Array<{ id: RuleCategory | 'ALL'; label: string }>
            ).map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playClickSound();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Competition Stages Pipeline Cards */}
        <div className="my-10 p-6 bg-[#FBFBFA] border border-neutral-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-red-600" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-800">
              Die 4 Stufen des Wettbewerbs
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs relative">
              <span className="text-2xs font-mono font-bold text-red-600 block uppercase mb-1">
                Stufe 01 (Aktuell)
              </span>
              <h4 className="text-sm font-bold text-neutral-900">Online-Qualifikation</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Individuelle 20-minütige Prüfung auf dieser Plattform. 70% Qualifikationsschwelle.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs relative">
              <span className="text-2xs font-mono font-bold text-amber-600 block uppercase mb-1">
                Stufe 02
              </span>
              <h4 className="text-sm font-bold text-neutral-900">Gruppenphase (Klassen-Teams)</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Die besten Einzelteilnehmenden formieren die 5 offiziellen Klassen-Teams (Alpha bis Echo).
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs relative">
              <span className="text-2xs font-mono font-bold text-neutral-500 block uppercase mb-1">
                Stufe 03
              </span>
              <h4 className="text-sm font-bold text-neutral-900">Halbfinale</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Interaktive Live-Buzzer-Runden und szenische Dialoge im Auditorium.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs relative">
              <span className="text-2xs font-mono font-bold text-emerald-600 block uppercase mb-1">
                Stufe 04
              </span>
              <h4 className="text-sm font-bold text-neutral-900">Bundesfinale Berlin</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Der Gipfelsturm im Festsaal in Berlin um den offiziellen Wanderpokal 2026.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRules.map((rule, idx) => (
            <div
              key={rule.id}
              className="bg-[#FBFBFA] p-5 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-2xs font-mono font-semibold text-neutral-500 uppercase">
                    § 0{idx + 1} · {rule.category}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <h4 className="text-base font-bold text-neutral-900 font-display">
                  {rule.title}
                </h4>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
