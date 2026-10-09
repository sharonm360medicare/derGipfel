import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { AttendanceStatus } from '../types/competition';
import {
  ShieldAlert,
  UserCheck,
  Trophy,
  ExternalLink,
  CheckCircle,
  XCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

export const SubMasterDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const {
    candidates,
    updateCandidateAttendance,
    teams,
    rounds,
    activeRoundId,
    currentUser,
  } = useCompetition();

  const [activeTab, setActiveTab] = useState<'attendance' | 'scoreboard'>('attendance');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  const filteredCandidates = candidates.filter((c) => {
    if (selectedClass === 'ALL') return true;
    return c.classDivision === selectedClass;
  });

  const presentCount = candidates.filter((c) => c.attendance === 'present').length;
  const absentCount = candidates.filter((c) => c.attendance === 'absent').length;
  const unmarkedCount = candidates.filter((c) => c.attendance === 'unmarked').length;

  const handleAttendanceChange = (id: string, status: AttendanceStatus) => {
    updateCandidateAttendance(id, status);
    playClickSound();
  };

  const activeRoundMeta = rounds.find((r) => r.id === activeRoundId) || rounds[0];

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-neutral-900 pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#16161A] text-white border-b border-neutral-800 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-neutral-900 font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-display uppercase tracking-wide">
                  Sub-Quizmeister Portal
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  EINGESCHRÄNKTE RECHTE
                </span>
              </div>
              <p className="text-2xs text-neutral-400">
                Angemeldet: <span className="text-neutral-200">{currentUser?.name}</span> (ID: <span className="text-amber-300 font-mono">{currentUser?.username || currentUser?.id}</span>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onExit}
              className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Zurück zur Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">
        {/* Notice of Restricted Powers */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-bold">
              Sicherheitsmodus: Lese- und Anwesenheitszugriff
            </p>
            <p className="text-amber-800">
              Als Sub-Quizmeister können Sie die Anwesenheit der registrierten Teilnehmer in den Klassen
              erfassen und die Live-Punktestände einsehen. Die Vergabe von Wertungspunkten und die
              offizielle Veröffentlichung von Ergebnissen obliegt ausschließlich dem Obersten Quizmeister.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-neutral-300 pb-3">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Anwesenheitskontrolle ({candidates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scoreboard')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'scoreboard'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-red-500" />
            <span>Live-Punkte Monitor (View-Only)</span>
          </button>
        </div>

        {/* TAB 1: ATTENDANCE STATION */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-2xs uppercase tracking-wider text-neutral-500 font-semibold">Anwesend</span>
                  <div className="text-2xl font-black font-mono text-emerald-600 mt-0.5">{presentCount}</div>
                </div>
                <CheckCircle className="w-7 h-7 text-emerald-500/30" />
              </div>

              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-2xs uppercase tracking-wider text-neutral-500 font-semibold">Abwesend</span>
                  <div className="text-2xl font-black font-mono text-red-600 mt-0.5">{absentCount}</div>
                </div>
                <XCircle className="w-7 h-7 text-red-500/30" />
              </div>

              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-2xs uppercase tracking-wider text-neutral-500 font-semibold">Ausstehend</span>
                  <div className="text-2xl font-black font-mono text-neutral-600 mt-0.5">{unmarkedCount}</div>
                </div>
                <HelpCircle className="w-7 h-7 text-neutral-400/30" />
              </div>
            </div>

            {/* Attendance Roster */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs font-bold text-neutral-700">Klassenfilter:</span>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-neutral-300 rounded-lg"
                  >
                    <option value="ALL">Alle Klassen anzeigen</option>
                    <option value="Class 01">Klasse 01</option>
                    <option value="Class 02">Klasse 02</option>
                    <option value="Class 03">Klasse 03</option>
                    <option value="Class 04">Klasse 04</option>
                    <option value="Class 05">Klasse 05</option>
                  </select>
                </div>

                <span className="text-xs text-neutral-500 font-mono">
                  {filteredCandidates.length} Schüler gelistet
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {filteredCandidates.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-900">{c.name}</span>
                        <span className="text-2xs font-mono px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded font-semibold">
                          {c.classDivision}
                        </span>
                        <span className="text-2xs font-bold px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded">
                          {c.germanLevel}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Schule: {c.school} · ID: <span className="font-mono">{c.id}</span>
                      </p>
                    </div>

                    {/* Attendance status toggle buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAttendanceChange(c.id, 'present')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          c.attendance === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Anwesend</span>
                      </button>

                      <button
                        onClick={() => handleAttendanceChange(c.id, 'absent')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          c.attendance === 'absent'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-red-50 hover:text-red-700'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Abwesend</span>
                      </button>

                      <button
                        onClick={() => handleAttendanceChange(c.id, 'unmarked')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          c.attendance === 'unmarked'
                            ? 'bg-neutral-800 text-white'
                            : 'text-neutral-400 hover:text-neutral-700'
                        }`}
                        title="Zurücksetzen"
                      >
                        Offen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE SCOREBOARD MONITOR */}
        {activeTab === 'scoreboard' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <span className="text-2xs font-mono font-bold uppercase tracking-widest text-red-600">
                    Echtzeit-Synchronisation
                  </span>
                  <h3 className="text-xl font-display font-bold text-neutral-900 mt-0.5">
                    Live-Punkteübersicht (Lesezugriff)
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Aktive Runde: <span className="font-semibold text-neutral-800">{activeRoundMeta.germanTitle}</span>
                  </p>
                </div>
                <div className="px-3 py-1 bg-neutral-100 rounded-lg text-2xs font-mono text-neutral-600 font-semibold">
                  LIVE-MODUS AKTIV
                </div>
              </div>

              <div className="mt-5 divide-y divide-neutral-100">
                {teams.map((t) => (
                  <div
                    key={t.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                        #{t.rank}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">{t.name}</h4>
                        <span className="text-2xs text-neutral-500">
                          {t.classRepresented} · {t.members.length} Mitglieder
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div className="text-xs font-mono text-neutral-500">
                        R1: {t.roundScores.round1} · R2: {t.roundScores.round2} · R3: {t.roundScores.round3} · R4: {t.roundScores.round4}
                      </div>
                      <div>
                        <span className="text-2xs text-neutral-400 block uppercase font-mono">Gesamt</span>
                        <span className="text-base font-extrabold font-mono text-neutral-900 tabular-nums">
                          {t.totalPoints} Pkt.
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
