import React, { useState } from 'react';
import { Users, Clock, Compass, ShieldCheck, Languages, X, FileText, ChevronRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';

export const RulesSection: React.FC = () => {
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const rules = [
    {
      num: '01',
      title: 'TEAMWORK',
      subtitle: 'Work together. Think together. Decide together.',
      desc: 'Innerhalb des Teams werden Antworten gemeinsam abgestimmt. Jedes Mitglied bringt seine individuellen Sprachstärken ein.',
      icon: Users,
    },
    {
      num: '02',
      title: 'TIME',
      subtitle: 'Every challenge has a time limit.',
      desc: 'Sekundengenaue Zeitlimits in allen 4 Runden. Zögern kostet Punkte; Schnelligkeit belohnt mutige Teams.',
      icon: Clock,
    },
    {
      num: '03',
      title: 'STRATEGY',
      subtitle: 'Choose wisely. Every decision matters.',
      desc: 'In Runden wie "Guard Your Grid" und "Ace or Base" entscheidet die gewählte Risikokategorie über den Rangaufstieg.',
      icon: Compass,
    },
    {
      num: '04',
      title: 'FAIR PLAY',
      subtitle: 'Respect your opponents and the competition.',
      desc: 'Einhaltung akademischer Integrität und gegenseitiger Respekt. Keine unzulässigen Hilfsmittel oder Translation-Software.',
      icon: ShieldCheck,
    },
    {
      num: '05',
      title: 'LANGUAGE',
      subtitle: 'German knowledge is at the heart of every challenge.',
      desc: 'Kommunikation, Argumentation und spontane Antworten erfolgen vollständig auf Deutsch (Niveau A1 bis B2).',
      icon: Languages,
    },
  ];

  return (
    <section id="regeln" className="py-20 border-t border-neutral-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Brochure Page 12 Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            09 — REGELN
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight text-neutral-900 mt-1 leading-[0.9]">
            KNOW THE RULES.
            <br />
            <span className="text-red-600">MASTER THE GAME.</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-mono">
            VERHALTENSKODEX UND REGLEMENT DER INTER-CLASS CHAMPIONSHIP
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound();
            setIsRulesModalOpen(true);
          }}
          className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-xs whitespace-nowrap"
        >
          <FileText className="w-3.5 h-3.5 text-red-500" />
          <span>Vollständiges Reglement (PDF)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <div
              key={rule.title}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-red-600">
                    {rule.num}
                  </span>
                  <Icon className="w-4 h-4 text-neutral-400" />
                </div>
                <h4 className="text-xl font-display font-black uppercase text-neutral-900">
                  {rule.title}
                </h4>
                <p className="text-xs font-bold text-red-600 mt-1">
                  {rule.subtitle}
                </p>
                <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Rules Modal */}
      {isRulesModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
        >
          <div className="relative w-full max-w-2xl bg-white border border-neutral-200 shadow-2xl rounded-2xl overflow-hidden my-8 max-h-[85vh] flex flex-col">
            <div className="bg-[#101014] text-white p-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-2xs font-mono uppercase tracking-widest text-red-500 font-semibold block">
                  Regelwerk · Ausgabe 2026
                </span>
                <h3 className="text-xl font-display font-bold text-white mt-0.5">
                  DER GIPFEL — Offizielle Turnierordnung
                </h3>
              </div>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-neutral-700 leading-relaxed">
              <section className="space-y-1.5">
                <h5 className="text-sm font-bold uppercase text-neutral-900 font-display">
                  § 1 Teilnahmeberechtigung & Qualifikationsstufe
                </h5>
                <p>
                  Alle registrierten Schüler der Klassen 01 bis 05 nehmen zunächst an der individuellen
                  Stufe 01 teil. Aus den erzielten Punkten in der schriftlichen Einreichung wählt die
                  Wettbewerbsleitung (Oberster Quizmeister) die jeweils besten 6 Kandidaten aus, um die
                  offizielle Klassen-Delegation zu bilden.
                </p>
              </section>

              <section className="space-y-1.5">
                <h5 className="text-sm font-bold uppercase text-neutral-900 font-display">
                  § 2 Wertungsrunden & Zeitmanagement
                </h5>
                <p>
                  Der Wettbewerb gliedert sich in vier Spielrunden (01 Play The Scene, 02 Guard Your Grid,
                  03 Ace or Base, 04 The Summit). Antwortzeiten sind streng limitiert. Nach Ablauf des
                  akustischen Signals verfällt das Antworterecht der jeweiligen Runde.
                </p>
              </section>

              <section className="space-y-1.5">
                <h5 className="text-sm font-bold uppercase text-neutral-900 font-display">
                  § 3 Punktefreigabe & Ratifizierung
                </h5>
                <p>
                  Punkte werden in Echtzeit erfasst und nach Ende jeder Runde ausschließlich durch die
                  autorisierte Freigabe des Obersten Quizmeisters publiziert. Die Freigabe löst die
                  offizielle Siegesbekanntgabe auf der Plattform aus.
                </p>
              </section>

              <section className="space-y-1.5">
                <h5 className="text-sm font-bold uppercase text-neutral-900 font-display">
                  § 4 Schiedsgericht & Sub-Quizmeister
                </h5>
                <p>
                  Sub-Quizmeister überwachen die Anwesenheit und den fairen Ablauf. Einsprüche sind
                  unmittelbar nach Rundenende bei der Hauptspielleitung einzureichen. Die Entscheidung
                  des Obersten Quizmeisters ist unanfechtbar.
                </p>
              </section>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Verstanden & Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
