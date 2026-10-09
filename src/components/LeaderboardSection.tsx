import React, { useState, useMemo } from 'react';
import { Trophy, Medal, Search, CheckCircle, Clock } from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext';
import { ClassDivision } from '../types/competition';
import { playClickSound } from '../utils/sound';

export const LeaderboardSection: React.FC = () => {
  const { submissions, countdownConfig } = useCompetition();

  const [selectedClass, setSelectedClass] = useState<ClassDivision | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Sorted by score (desc), then time spent (asc)
  const rankedSubmissions = useMemo(() => {
    const list = [...submissions].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSpentSeconds - b.timeSpentSeconds;
    });

    return list.filter((sub) => {
      const matchesClass =
        selectedClass === 'ALL' || sub.candidateClass === selectedClass;
      const matchesSearch =
        sub.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.schoolOrCity.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [submissions, selectedClass, searchQuery]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  };

  return (
    <section id="leaderboard" className="py-16 lg:py-24 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              <span>OFFIZIELLE RANGLISTE</span>
              <span aria-hidden="true">·</span>
              <span>STUFE 01 ERGEBNISSE</span>
              <span aria-hidden="true">·</span>
              <span>LIVE AUSWERTUNG</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight">
              Qualifikations-Bestenliste
            </h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-2xl leading-relaxed">
              Die aktuellen Platzierungen der individuellen Qualifikationsprüfung. Teilnehmende mit mindestens {countdownConfig.qualifyingScorePercentage}% Punkten sichern sich das Ticket für die Gruppenphase (Stufe 02).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-neutral-500">
              Gesamt-Abgaben:{' '}
              <strong className="text-neutral-900 font-bold">
                {submissions.length}
              </strong>
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-6">
          {/* Class Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'ALL', label: 'Alle Klassen' },
                { id: 'Klasse 01', label: 'Klasse 01' },
                { id: 'Klasse 02', label: 'Klasse 02' },
                { id: 'Klasse 03', label: 'Klasse 03' },
                { id: 'Klasse 04', label: 'Klasse 04' },
                { id: 'Klasse 05', label: 'Klasse 05' },
              ] as Array<{ id: ClassDivision | 'ALL'; label: string }>
            ).map((c) => {
              const isActive = selectedClass === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedClass(c.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name oder Schule suchen..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/60 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-3.5 px-4 w-16 text-center">Rang</th>
                  <th className="py-3.5 px-4">Kandidat/in</th>
                  <th className="py-3.5 px-4">Klassenstufe</th>
                  <th className="py-3.5 px-4">Schule / Ort</th>
                  <th className="py-3.5 px-4 text-center">Punkte</th>
                  <th className="py-3.5 px-4 text-center">Quote</th>
                  <th className="py-3.5 px-4 text-center">Zeit</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {rankedSubmissions.length > 0 ? (
                  rankedSubmissions.map((sub, index) => {
                    const rank = index + 1;
                    const isTop3 = rank <= 3;

                    return (
                      <tr
                        key={sub.id}
                        className={`hover:bg-neutral-50/80 transition-colors ${
                          rank === 1 ? 'bg-amber-50/30 font-medium' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          {rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-bold font-mono text-xs">
                              1
                            </span>
                          ) : rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-200 text-neutral-900 font-bold font-mono text-xs">
                              2
                            </span>
                          ) : rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-800 font-bold font-mono text-xs">
                              3
                            </span>
                          ) : (
                            <span className="font-mono text-neutral-500">
                              #{rank}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-bold text-neutral-900">
                          {sub.candidateName}
                        </td>

                        <td className="py-3 px-4 font-mono text-neutral-600">
                          {sub.candidateClass}
                        </td>

                        <td className="py-3 px-4 text-neutral-600 max-w-xs truncate">
                          {sub.schoolOrCity}
                        </td>

                        <td className="py-3 px-4 text-center font-mono font-bold text-neutral-900">
                          {sub.score} / {sub.totalQuestions}
                        </td>

                        <td className="py-3 px-4 text-center font-mono font-bold text-neutral-900">
                          {sub.percentage}%
                        </td>

                        <td className="py-3 px-4 text-center font-mono text-neutral-500">
                          {formatSeconds(sub.timeSpentSeconds)}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {sub.isQualified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Qualifiziert</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-neutral-500 font-medium">
                              Teilgenommen
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-xs text-neutral-500"
                    >
                      Keine Einreichungen für diesen Filter gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
