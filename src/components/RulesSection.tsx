import React, { useState } from 'react';
import { Users, Clock, Compass, ShieldCheck, Languages, X, FileText, ChevronRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import { useCompetition } from '../context/CompetitionContext';

export const RulesSection: React.FC = () => {
  const { t, language } = useCompetition();
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const ruleIcons = [Users, Clock, Compass, ShieldCheck, Languages];

  return (
    <section id="regeln" className="py-20 border-t border-neutral-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Brochure Page 12 Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            {t.rules.kicker}
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight text-neutral-900 mt-1 leading-[0.9]">
            {t.rules.title}
            <br />
            <span className="text-red-600">{t.rules.titleHighlight}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-mono">
            {t.rules.subtitle}
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
          <span>{t.rules.openModalBtn}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.rules.rulesList.map((rule, idx) => {
          const Icon = ruleIcons[idx] || ShieldCheck;
          const isFifth = idx === 4;
          return (
            <div
              key={rule.title}
              style={isFifth ? { width: '935px', maxWidth: '100%' } : undefined}
              className={`bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-colors ${
                isFifth ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
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
                  {language === 'de' ? 'Regelwerk · Ausgabe 2026' : 'Official Code · 2026 Edition'}
                </span>
                <h3 className="text-xl font-display font-bold text-white mt-0.5">
                  {t.rules.modalTitle}
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
                  {language === 'de' ? '§ 1 Teilnahmeberechtigung & Qualifikationsstufe' : '§ 1 Eligibility & Qualification Stage'}
                </h5>
                <p>
                  {language === 'de'
                    ? 'Alle registrierten Schüler der Klassen 01 bis 05 nehmen zunächst an der individuellen Stufe 01 teil. Aus den erzielten Punkten in der schriftlichen Einreichung wählt die Wettbewerbsleitung (Oberster Quizmeister) die jeweils besten 6 Kandidaten aus, um die offizielle Klassen-Delegation zu bilden.'
                    : 'All registered students in grades 01 through 05 initially sit for the individual Stage 01 qualifier. Based on scores earned in the written project rubric, the tournament directors nominate the top 6 candidates per grade to form official class delegation squads.'}
                </p>
              </section>

              <section className="space-y-1.5">
                <h5 className="text-sm font-bold uppercase text-neutral-900 font-display">
                  {language === 'de' ? '§ 2 Wertungsrunden & Zeitmanagement' : '§ 2 Tournament Rounds & Timing'}
                </h5>
                <p>
                  {language === 'de'
                    ? 'Der Wettbewerb gliedert sich in vier Spielrunden. Antwortzeiten sind streng limitiert. Nach Ablauf des akustischen Signals verfällt das Antworterecht der jeweiligen Runde.'
                    : 'The competition comprises four championship rounds. Answer countdowns are strictly enforced. Upon expiration of the audio cue, answering rights for that question lapse.'}
                </p>
              </section>

              <section className="space-y-1.5">
                <h5 className="text-sm font-bold uppercase text-neutral-900 font-display">
                  {language === 'de' ? '§ 3 Punktefreigabe & Ratifizierung' : '§ 3 Score Ratification & Ceremony'}
                </h5>
                <p>
                  {language === 'de'
                    ? 'Punkte werden in Echtzeit erfasst und nach Ende jeder Runde ausschließlich durch die autorisierte Freigabe des Obersten Quizmeisters publiziert. Die Freigabe löst die offizielle Siegesbekanntgabe auf der Plattform aus.'
                    : 'Scores are logged in real-time and published solely upon authorized ratification by the Head Quiz Master. Ratification activates official celebratory fanfare and live leaderboard standings.'}
                </p>
              </section>

              <section className="space-y-1.5">
                <h5 className="text-sm font-bold uppercase text-neutral-900 font-display">
                  {language === 'de' ? '§ 4 Schiedsgericht & Sub-Quizmeister' : '§ 4 Arbiters & Fair Play Oversight'}
                </h5>
                <p>
                  {language === 'de'
                    ? 'Sub-Quizmeister überwachen die Anwesenheit und den fairen Ablauf. Einsprüche sind unmittelbar nach Rundenende bei der Hauptspielleitung einzureichen. Die Entscheidung des Obersten Quizmeisters ist unanfechtbar.'
                    : 'Assigned Sub-Quiz Masters monitor candidate attendance and fair play. Inquiries must be filed with tournament directors immediately following round conclusion. Decisions of the Head Quiz Master are final.'}
                </p>
              </section>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {t.rules.modalClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
