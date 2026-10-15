import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useCompetition } from '../context/CompetitionContext';
import { Volume2, VolumeX, Sparkles, X, ChevronRight, Award } from 'lucide-react';
import germanTrophyImg from '../assets/images/german_trophy_gipfel_1791279960776.jpg';

export const CelebrationModal: React.FC = () => {
  const {
    celebrationData,
    isCelebrationOpen,
    closeCelebration,
    soundEnabled,
    toggleSound,
    teams,
    language,
  } = useCompetition();

  const confettiFired = useRef(false);

  useEffect(() => {
    if (isCelebrationOpen) {
      // Fire festive multi-angle confetti cannon
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#DC2626', '#D97706', '#FFFFFF', '#000000', '#F59E0B'];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 65,
          origin: { x: 0, y: 0.65 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 65,
          origin: { x: 1, y: 0.65 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
      confettiFired.current = true;
    } else {
      confettiFired.current = false;
    }
  }, [isCelebrationOpen]);

  if (!isCelebrationOpen || !celebrationData) return null;

  const topTeam = celebrationData.topTeam || teams[0];
  const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);

  const fireMoreConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* Festive Alpine Peak Header Banner */}
        <div className="relative bg-[#111216] text-white p-6 sm:p-8 overflow-hidden border-b border-neutral-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400">
                {language === 'de' ? 'Offizielle Bekanntgabe · Der Gipfel 2026' : 'Official Announcement · Der Gipfel 2026'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title={soundEnabled ? (language === 'de' ? 'Stummschalten' : 'Mute Sound') : (language === 'de' ? 'Ton aktivieren' : 'Unmute Sound')}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={closeCelebration}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight uppercase text-white">
              {language === 'de' ? 'Ergebnisse Veröffentlicht' : 'Official Results Published'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-medium mt-1 flex items-center gap-2">
              <span className="text-red-400 font-semibold">{celebrationData.roundName}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-400 font-mono">
                {language === 'de' ? `Freigabe ${celebrationData.publishedAt}` : `Released ${celebrationData.publishedAt}`}
              </span>
            </p>
          </div>
        </div>

        {/* Celebration Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Climber Champion Spotlight */}
          <div className="relative p-5 rounded-xl bg-gradient-to-br from-amber-50 via-white to-neutral-50 border border-amber-200 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-amber-300 bg-neutral-900 shadow-md">
              <img
                src={germanTrophyImg}
                alt="Gipfel Trophy"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{language === 'de' ? 'Spitzenreiter Am Gipfel' : 'Current Summit Leader'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 mt-1">
                {topTeam.name}
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                {language === 'de' ? 'Vertretung: ' : 'Representing: '}
                <span className="font-semibold text-neutral-900">{topTeam.classRepresented}</span>
                {' · '}
                <span className="font-mono text-neutral-800 font-bold">
                  {topTeam.members.length} {language === 'de' ? 'Teilnehmende' : 'Members'}
                </span>
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0 bg-white/80 px-4 py-2 rounded-lg border border-amber-100 shadow-sm">
              <span className="text-2xs text-neutral-500 uppercase tracking-widest block font-medium">
                {language === 'de' ? 'Gesamtpunkte' : 'Total Points'}
              </span>
              <span className="text-2xl font-extrabold font-mono tabular-nums text-neutral-900">
                {topTeam.totalPoints}
              </span>
              <span className="text-xs font-semibold text-emerald-600 block">
                {language === 'de' ? 'Rang 1' : 'Rank 1'}
              </span>
            </div>
          </div>

          {/* Quiz Master Ratification Statement */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <p className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-1">
              {language === 'de' ? 'Mitteilung Der Wettbewerbsleitung' : 'Official Statement from Tournament Directors'}
            </p>
            <p className="text-sm text-neutral-700 italic leading-relaxed">
              &ldquo;{celebrationData.highlightNote}&rdquo;
            </p>
          </div>

          {/* Leaderboard Standings Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {language === 'de' ? 'Aktuelle Rangliste (The Climb)' : 'Current Standings (The Climb)'}
              </h4>
              <button
                onClick={fireMoreConfetti}
                className="text-xs text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'de' ? 'Konfetti Feiern' : 'Celebrate with Confetti'}</span>
              </button>
            </div>

            <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100 bg-white shadow-xs">
              {sortedTeams.map((team, idx) => (
                <div
                  key={team.id}
                  className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                    idx === 0 ? 'bg-amber-50/40 font-semibold' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        idx === 0
                          ? 'bg-amber-500 text-white'
                          : idx === 1
                          ? 'bg-neutral-300 text-neutral-800'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-neutral-900">{team.name}</span>
                      <span className="text-2xs text-neutral-400 block font-normal">
                        {team.classRepresented}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="text-right">
                      <span className="font-mono font-bold tabular-nums text-neutral-900 text-base">
                        {team.totalPoints}
                      </span>
                      <span className="text-2xs text-neutral-400 block">
                        {language === 'de' ? 'Pkt.' : 'pts'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 text-center sm:text-left">
            {language === 'de'
              ? 'Die Punkte werden automatisch in der öffentlichen Rangliste aktualisiert.'
              : 'Scores are automatically synced with the public leaderboard.'}
          </p>
          <button
            onClick={() => {
              closeCelebration();
              const el = document.getElementById('rangliste');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{language === 'de' ? 'Zur Rangliste' : 'Go to Leaderboard'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
