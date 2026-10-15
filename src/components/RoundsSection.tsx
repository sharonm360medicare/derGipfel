import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { Lock, EyeOff, ShieldAlert, Sparkles, AlertTriangle, KeyRound, ChevronRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface SecretTeaser {
  id: number;
  codename: string;
  categoryHint: string;
  teaser: string;
  maxScore: number;
  clue: string;
  suspenseLevel: string;
}

const secretTeasersData = {
  de: [
    {
      id: 1,
      codename: 'PROJEKT TEMPO & REFLEX',
      categoryHint: 'Schnelligkeit & Deutsche Grammatik',
      teaser: 'Nerven aus Stahl und Millisekunden-Entscheidungen. Ein kompromissloses Schnellfeuer-Format, bei dem Zögern sofort wertvolle Punkte kostet.',
      maxScore: 25,
      clue: 'Hinweis: Reaktionszeit zählt genauso wie Sprachpräzision.',
      suspenseLevel: 'Stufe 1 Versiegelt',
    },
    {
      id: 2,
      codename: 'PROJEKT DIE SPRACHFALLE',
      categoryHint: 'Wortschatz & Tabu-Mechanik',
      teaser: 'Reines sprachliches Feingefühl. Bestimmte Schlüsselwörter sind streng verboten – wer in die Falle tappt, schenkt der gegnerischen Gruppe den Vorteil.',
      maxScore: 30,
      clue: 'Hinweis: Umschreiben ohne die offensichtlichen Begriffe.',
      suspenseLevel: 'Stufe 2 Versiegelt',
    },
    {
      id: 3,
      codename: 'PROJEKT SCHATTENBILD',
      categoryHint: 'Visuelle Kultur & Landeskunde',
      teaser: 'Verschlüsselte Kulturikonen, fragmentierte Wahrzeichen und optische Deduktion. Nur wer Deutschlands Geschichte mit den Augen liest, schlägt rechtzeitig an.',
      maxScore: 25,
      clue: 'Hinweis: Details in historischen Monumenten und Geografie.',
      suspenseLevel: 'Stufe 3 Versiegelt',
    },
    {
      id: 4,
      codename: 'DER FINALE GIPFELSTURM',
      categoryHint: 'Königsdisziplin · Alle Fachbereiche',
      teaser: 'Der ultimative Aufstieg zum Wanderpokal. Die anspruchsvollste Disziplin des gesamten Wettbewerbs – das genaue Format kennt bis zur Live-Bühne ausschließlich die Turnierleitung.',
      maxScore: 50,
      clue: 'Hinweis: Hier entscheidet sich der Bundessieg 2026.',
      suspenseLevel: 'Höchste Geheimhaltungsstufe',
    },
  ],
  en: [
    {
      id: 1,
      codename: 'PROJECT TEMPO & REFLEX',
      categoryHint: 'Speed & German Grammar Precision',
      teaser: 'Nerves of steel and millisecond reflexes. An uncompromising rapid-fire round where hesitation immediately costs valuable points.',
      maxScore: 25,
      clue: 'Clue: Reaction speed matters just as much as language precision.',
      suspenseLevel: 'Stage 1 Sealed',
    },
    {
      id: 2,
      codename: 'PROJECT THE LANGUAGE TRAP',
      categoryHint: 'Vocabulary & Taboo Rules',
      teaser: 'Pure linguistic finesse. Specific key phrases are strictly forbidden — triggering a forbidden term hands the advantage to the rival team.',
      maxScore: 30,
      clue: 'Clue: Paraphrase accurately without saying the obvious words.',
      suspenseLevel: 'Stage 2 Sealed',
    },
    {
      id: 3,
      codename: 'PROJECT SHADOW IMAGE',
      categoryHint: 'Visual Culture & Landmarks',
      teaser: 'Obscured cultural icons, fragmented monuments, and visual deduction. Only those who recognize German history visually can buzz in on time.',
      maxScore: 25,
      clue: 'Clue: Focus on historical architecture and geography.',
      suspenseLevel: 'Stage 3 Sealed',
    },
    {
      id: 4,
      codename: 'THE FINAL SUMMIT CLIMB',
      categoryHint: 'Championship Round · All Disciplines',
      teaser: 'The ultimate ascent to the championship cup. The most demanding discipline of the tournament — the exact format is held strictly confidential until the grand stage.',
      maxScore: 50,
      clue: 'Clue: The national championship 2026 is decided here.',
      suspenseLevel: 'Highest Classification',
    },
  ],
};

export const RoundsSection: React.FC = () => {
  const { rounds, activeRoundId, openCelebration, language, t, gamesPublic } = useCompetition();
  const [selectedSecret, setSelectedSecret] = useState<number | null>(null);
  const [showDenialModal, setShowDenialModal] = useState(false);

  // Keep completely hidden on website until Quiz Master toggles it in his dashboard
  if (!gamesPublic) {
    return null;
  }

  const secretTeasers = secretTeasersData[language] || secretTeasersData.de;

  const handleInspectSecret = (id: number) => {
    playClickSound();
    setSelectedSecret(id);
    setShowDenialModal(true);
  };

  return (
    <section id="runden" className="py-20 border-t border-neutral-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Outer Suspense Shell */}
      <div className="relative rounded-3xl bg-[#111216] text-white p-6 sm:p-10 lg:p-12 overflow-hidden border border-neutral-800 shadow-2xl">
        {/* Ambient Confidential Background Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold tracking-wider uppercase mb-3">
              <Lock className="w-3.5 h-3.5 text-red-500" />
              <span>{t.rounds.kicker}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white">
              {t.rounds.title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl leading-relaxed">
              {t.rounds.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 bg-neutral-900/90 border border-neutral-700/80 px-4 py-2 rounded-xl">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{t.rounds.statusSealed}</span>
            </div>
          </div>
        </div>

        {/* Suspense Teaser Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {secretTeasers.map((secret, idx) => {
            const actualRound = rounds[idx];
            const isPublished = actualRound?.status === 'scores_published';

            return (
              <div
                key={secret.id}
                className="group relative rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800 hover:border-neutral-700 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg"
              >
                {/* Confidential Stamp Watermark */}
                <div className="absolute top-4 right-4 pointer-events-none select-none">
                  <span className="text-2xs font-mono font-bold tracking-widest px-2 py-0.5 rounded border border-neutral-700/60 text-neutral-400 bg-neutral-800/40 uppercase">
                    {secret.suspenseLevel}
                  </span>
                </div>

                <div>
                  {/* Round Index Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono font-bold text-red-500">
                      {language === 'de' ? `RUNDE 0${secret.id}` : `ROUND 0${secret.id}`}
                    </span>
                    <span aria-hidden="true" className="text-neutral-700">·</span>
                    <span className="text-2xs font-mono text-neutral-400">
                      {t.rounds.maxPoints.replace('{pts}', secret.maxScore.toString())}
                    </span>
                  </div>

                  {/* Title & Mystery Icon */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700/70 text-red-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      <EyeOff className="w-6 h-6 text-neutral-300" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white group-hover:text-red-400 transition-colors">
                        {secret.codename}
                      </h3>
                      <p className="text-xs font-semibold text-amber-400/90 mt-0.5">
                        {t.rounds.field} {secret.categoryHint}
                      </p>
                    </div>
                  </div>

                  {/* Shrouded Teaser Content */}
                  <div className="mt-5 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 relative">
                    <div className="flex items-start gap-2.5">
                      <Lock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                        {secret.teaser}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-2xs text-neutral-400 font-mono">
                      <span>{secret.clue}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 pt-5 border-t border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => handleInspectSecret(secret.id)}
                    className="text-xs font-medium text-neutral-300 hover:text-white inline-flex items-center gap-1.5 transition-colors group/btn"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400 group-hover/btn:rotate-45 transition-transform" />
                    <span>{t.rounds.unlockRules}</span>
                    <ChevronRight className="w-3 h-3 text-neutral-500 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  {isPublished && (
                    <button
                      onClick={() => {
                        playClickSound();
                        openCelebration();
                      }}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.rounds.viewCelebration}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Suspense Assurance Banner */}
        <div className="relative z-10 mt-10 rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                {t.rounds.fairplayTitle}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                {t.rounds.fairplayDesc}
              </p>
            </div>
          </div>

          <a
            href="#ueben"
            onClick={playClickSound}
            className="shrink-0 px-4 py-2 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-xs transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.rounds.trainNow}</span>
          </a>
        </div>
      </div>

      {/* Access Denied / Suspense Modal */}
      {showDenialModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center">
              <span className="text-2xs font-mono font-bold tracking-widest text-red-400 uppercase">
                {t.rounds.modalKicker}
              </span>
              <h3 className="text-2xl font-display font-black uppercase text-white mt-1">
                {t.rounds.modalTitle}
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                {language === 'de'
                  ? `Das offizielle Regelwerk zu ${secretTeasers.find(s => s.id === selectedSecret)?.codename} ist bis zum Rundenbeginn mit dem Master-Key verschlüsselt.`
                  : `The official rule dossier for ${secretTeasers.find(s => s.id === selectedSecret)?.codename} is encrypted with the Master Key until the round begins.`}
              </p>
            </div>

            <div className="my-5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {t.rounds.modalNotice}
              </span>
            </div>

            <button
              onClick={() => {
                playClickSound();
                setShowDenialModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              {t.rounds.modalButton}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
