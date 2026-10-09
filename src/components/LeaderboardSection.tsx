import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { Trophy, ChevronDown, ChevronUp, Sparkles, Search, Award } from 'lucide-react';
import { playClickSound } from '../utils/sound';

export const LeaderboardSection: React.FC = () => {
  const { teams, openCelebration, celebrationData } = useCompetition();
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = [...teams]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.classRepresented.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const toggleExpand = (teamId: string) => {
    playClickSound();
    setExpandedTeamId((prev) => (prev === teamId ? null : teamId));
  };

  return (
    <section id="rangliste" className="py-20 border-t border-neutral-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Brochure Page 10 Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            07 — DIE RANGLISTE
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight text-neutral-900 mt-1 leading-[0.9]">
            THE CLIMB
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-mono">
            LIVE RESULTS WILL BE UPDATED DURING THE COMPETITION.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Team oder Klasse suchen..."
              className="pl-8 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 w-full sm:w-56"
            />
          </div>

          <button
            onClick={() => {
              playClickSound();
              openCelebration();
            }}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Feier-Popup öffnen</span>
          </button>
        </div>
      </div>

      {/* Official Leaderboard Table Structure matching Brochure */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Table Header Row */}
        <div className="grid grid-cols-12 px-6 py-4 bg-neutral-100/70 border-b border-neutral-200 text-2xs font-mono font-bold uppercase tracking-widest text-neutral-500">
          <div className="col-span-2 sm:col-span-1">RANK</div>
          <div className="col-span-6 sm:col-span-5">TEAM</div>
          <div className="hidden sm:block sm:col-span-3 text-right">POINTS</div>
          <div className="col-span-4 sm:col-span-3 text-right">STATUS</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-neutral-100">
          {filteredTeams.map((team, index) => {
            const rank = index + 1;
            const isExpanded = expandedTeamId === team.id;
            const isLeader = rank === 1;

            return (
              <div key={team.id} className="transition-colors hover:bg-neutral-50/70">
                <div
                  onClick={() => toggleExpand(team.id)}
                  className="grid grid-cols-12 px-6 py-4.5 items-center cursor-pointer select-none"
                >
                  {/* Rank Column */}
                  <div className="col-span-2 sm:col-span-1 font-display font-black text-xl sm:text-2xl text-neutral-900">
                    <span className={isLeader ? 'text-red-600' : 'text-neutral-900'}>
                      0{rank}
                    </span>
                  </div>

                  {/* Team Column */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base sm:text-lg font-display font-black uppercase text-neutral-900 tracking-tight">
                          {team.name}
                        </h4>
                        {isLeader && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-bold">
                            LEADER
                          </span>
                        )}
                      </div>
                      <span className="text-2xs font-mono text-neutral-400 block mt-0.5">
                        {team.classRepresented} · {team.members.length} Mitstreiter
                      </span>
                    </div>
                  </div>

                  {/* Points Column */}
                  <div className="hidden sm:block sm:col-span-3 text-right">
                    <span className="font-mono font-black text-xl tabular-nums text-neutral-900">
                      {team.totalPoints > 0 ? team.totalPoints : '—'}
                    </span>
                    <span className="text-2xs font-mono text-neutral-400 ml-1">Pkt.</span>
                  </div>

                  {/* Status Column */}
                  <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-2">
                    <div className="text-right">
                      <span
                        className={`text-2xs font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                          isLeader
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : rank === 2
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {isLeader ? 'SUMMIT LEADER' : rank === 2 ? 'QUALIFIED' : 'ACTIVE'}
                      </span>
                      {/* Mobile points fallback */}
                      <span className="block sm:hidden text-xs font-mono font-bold text-neutral-900 mt-0.5">
                        {team.totalPoints} Pkt.
                      </span>
                    </div>

                    <button
                      className="text-neutral-400 hover:text-neutral-700 p-1"
                      aria-label="Details umschalten"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Breakdown */}
                {isExpanded && (
                  <div className="px-6 py-4 bg-neutral-50/80 border-t border-neutral-100 space-y-4 animate-fade-in">
                    <div>
                      <span className="text-2xs font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                        Punkteaufschlüsselung Nach Runden
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                          <span className="text-2xs text-neutral-400 block font-mono">01 Play The Scene</span>
                          <span className="text-base font-extrabold font-mono text-neutral-900">
                            {team.roundScores.round1} <span className="text-2xs text-neutral-400 font-normal">/ 100</span>
                          </span>
                        </div>
                        <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                          <span className="text-2xs text-neutral-400 block font-mono">02 Guard Your Grid</span>
                          <span className="text-base font-extrabold font-mono text-neutral-900">
                            {team.roundScores.round2} <span className="text-2xs text-neutral-400 font-normal">/ 100</span>
                          </span>
                        </div>
                        <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                          <span className="text-2xs text-neutral-400 block font-mono">03 Ace or Base</span>
                          <span className="text-base font-extrabold font-mono text-neutral-900">
                            {team.roundScores.round3} <span className="text-2xs text-neutral-400 font-normal">/ 150</span>
                          </span>
                        </div>
                        <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                          <span className="text-2xs text-neutral-400 block font-mono">04 The Summit</span>
                          <span className="text-base font-extrabold font-mono text-neutral-900">
                            {team.roundScores.round4} <span className="text-2xs text-neutral-400 font-normal">/ 200</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-2xs font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                        Team-Aufstellung:
                      </span>
                      <p className="text-xs text-neutral-700">
                        {team.members.map((m) => `${m.name} (${m.role || 'Mitglied'})`).join(' · ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
