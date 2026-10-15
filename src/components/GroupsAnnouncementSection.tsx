import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { ClassNumber } from '../types/competition';
import { Users, Shield, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/sound';

export const GroupsAnnouncementSection: React.FC = () => {
  const { teams, candidates, t, language } = useCompetition();
  const [selectedClassTab, setSelectedClassTab] = useState<ClassNumber>('Class 01');

  const classesList: ClassNumber[] = ['Class 01', 'Class 02', 'Class 03', 'Class 04', 'Class 05'];

  const currentTeam = teams.find((t) => t.classRepresented === selectedClassTab) || teams[0];
  const classCandidates = candidates.filter((c) => c.classDivision === selectedClassTab);

  return (
    <section id="gruppen" className="py-20 border-t border-neutral-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Brochure Page 9 Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            {t.groups.kicker}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-neutral-900 mt-1 leading-[0.95]">
            {t.groups.title}
            <br />
            <span className="text-red-600">{t.groups.titleHighlight}</span>
          </h2>
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-700 mt-2">
            {t.groups.subtitle}
          </p>
        </div>

        <div className="p-3 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-600 max-w-sm">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-0.5">
            <Shield className="w-3.5 h-3.5 text-red-600" />
            <span>{t.groups.officialNoticeTitle}</span>
          </div>
          {t.groups.officialNoticeText}
        </div>
      </div>

      {/* Class Selector Tabs matching Brochure Style */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {classesList.map((cls, idx) => {
          const isSelected = selectedClassTab === cls;
          const assignedTeam = teams.find((t) => t.classRepresented === cls);

          return (
            <button
              key={cls}
              onClick={() => {
                setSelectedClassTab(cls);
                playClickSound();
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900'
                  : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300 shadow-xs'
              }`}
            >
              <span
                className={`text-2xs font-mono font-bold tracking-widest block uppercase ${
                  isSelected ? 'text-red-400' : 'text-neutral-400'
                }`}
              >
                CLASS 0{idx + 1}
              </span>
              <span className="text-2xl font-display font-black block mt-0.5">
                0{idx + 1}
              </span>
              <span
                className={`text-xs font-semibold block mt-1 truncate ${
                  isSelected ? 'text-neutral-200' : 'text-neutral-600'
                }`}
              >
                {assignedTeam?.name || `Team ${cls}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Team Roster Showcase Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-mono font-bold uppercase tracking-widest text-red-600">
                {language === 'de' ? `Offizielles Klassen-Team · ${currentTeam.classRepresented}` : `Official Class Squad · ${currentTeam.classRepresented}`}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {language === 'de' ? 'Vom Quizmeister Bestätigt' : 'Ratified by Quiz Master'}
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-display font-black uppercase text-neutral-900 mt-1">
              {currentTeam.name}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {language === 'de'
                ? `Vertretung im Inter-Class Championship · ${currentTeam.members.length} nominierte Schüler`
                : `Official Representation in Championship · ${currentTeam.members.length} nominated candidates`}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div>
              <span className="text-2xs text-neutral-400 block font-mono uppercase">
                {language === 'de' ? 'Aktuelle Punkte' : 'Current Points'}
              </span>
              <span className="text-2xl font-extrabold font-mono tabular-nums text-neutral-900">
                {currentTeam.totalPoints}
              </span>
            </div>
            <div className="border-l border-neutral-200 pl-4">
              <span className="text-2xs text-neutral-400 block font-mono uppercase">
                {t.groups.rank}
              </span>
              <span className="text-2xl font-extrabold font-mono tabular-nums text-red-600">
                #{currentTeam.rank}
              </span>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="mt-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            <span>{t.groups.assignedStudents}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTeam.members.map((member, idx) => {
              const fullCandidate = candidates.find((c) => c.id === member.id);

              return (
                <div
                  key={member.id}
                  className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-mono font-bold text-neutral-400">
                        POSITION 0{idx + 1}
                      </span>
                      <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-800">
                        Goethe {member.germanLevel}
                      </span>
                    </div>

                    <h5 className="text-base font-bold text-neutral-900 mt-2">
                      {member.name}
                    </h5>
                    <p className="text-xs font-semibold text-red-600 mt-0.5">
                      {member.role || (language === 'de' ? 'Team-Mitglied' : 'Squad Member')}
                    </p>

                    {fullCandidate && (
                      <p className="text-2xs text-neutral-500 mt-2 line-clamp-2 italic">
                        &bdquo;{fullCandidate.projectTitle}&ldquo;
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-200/60 flex items-center justify-between text-2xs text-neutral-500 font-mono">
                    <span>ID: {member.id}</span>
                    {fullCandidate && (
                      <span className="text-neutral-700 font-bold">
                        {language === 'de' ? `Quali: ${fullCandidate.qualifierScore} Pkt.` : `Score: ${fullCandidate.qualifierScore} pts`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual Candidate Qualifier Pool for this Class */}
        <div className="mt-10 pt-6 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {language === 'de'
                ? `Gesamter Bewerber-Pool ${selectedClassTab} (${classCandidates.length} Schüler)`
                : `Total Applicant Pool ${selectedClassTab} (${classCandidates.length} Candidates)`}
            </h4>
            <span className="text-2xs text-neutral-400 font-mono">
              {language === 'de' ? 'Individuelle Qualifikationsstufe' : 'Individual Qualification Stage'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
            {classCandidates.map((c) => (
              <div
                key={c.id}
                className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-neutral-900 block">{c.name}</span>
                  <span className="text-2xs text-neutral-500 font-mono">ID {c.id} · {c.germanLevel}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-neutral-800">
                    {c.qualifierScore} {language === 'de' ? 'Pkt.' : 'pts'}
                  </span>
                  <span className="text-2xs text-emerald-600 block font-semibold">
                    {c.status === 'assigned_to_team'
                      ? (language === 'de' ? 'Im Team' : 'Selected')
                      : (language === 'de' ? 'Eingereicht' : 'Registered')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
