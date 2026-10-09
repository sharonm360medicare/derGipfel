import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import {
  RoundId,
  ClassNumber,
  Team,
  Candidate,
} from '../types/competition';
import {
  Trophy,
  Users,
  Key,
  Shield,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  Trash2,
  Copy,
  ExternalLink,
  RotateCcw,
  UserPlus,
  Award,
  Layers,
  ArrowRight,
  Send,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { playScoreChime, playClickSound } from '../utils/sound';

export const HeadMasterDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const {
    teams,
    rounds,
    activeRoundId,
    setActiveRoundId,
    adjustTeamRoundScore,
    updateTeamRoundScore,
    updateTeamName,
    publishRoundMarks,
    candidates,
    updateCandidateScore,
    groupCandidatesIntoTeam,
    subMasters,
    addSubMaster,
    removeSubMaster,
    resetTournamentData,
    currentUser,
  } = useCompetition();

  const [activeTab, setActiveTab] = useState<'scoring' | 'candidates' | 'submasters' | 'settings'>('scoring');
  const [selectedRound, setSelectedRound] = useState<RoundId>(activeRoundId);
  const [celebrationNote, setCelebrationNote] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Group / Team Renaming state
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingTeamName, setEditingTeamName] = useState<string>('');

  // Sub-Master Form state
  const [newSubMasterName, setNewSubMasterName] = useState('');
  const [newSubMasterId, setNewSubMasterId] = useState('');
  const [newSubMasterPassword, setNewSubMasterPassword] = useState('');
  const [newSubMasterClass, setNewSubMasterClass] = useState<ClassNumber | 'ALL'>('ALL');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [subMasterStatusMsg, setSubMasterStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Group maker state
  const [targetTeamId, setTargetTeamId] = useState<string>('team-alpha');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [candidateFilterClass, setCandidateFilterClass] = useState<string>('ALL');

  const currentRoundMeta = rounds.find((r) => r.id === selectedRound) || rounds[0];

  const handleScoreDelta = (teamId: string, delta: number) => {
    adjustTeamRoundScore(teamId, selectedRound, delta);
    playScoreChime();
  };

  const handlePublishMarks = () => {
    publishRoundMarks(
      selectedRound,
      celebrationNote.trim() ||
        `Die Ergebnisse der ${currentRoundMeta.germanTitle} wurden von der Wettbewerbsleitung bestätigt! Hervorragende Sprachleistungen aller Teams.`
    );
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  const handleStartEditTeam = (team: Team) => {
    setEditingTeamId(team.id);
    setEditingTeamName(team.name);
    playClickSound();
  };

  const handleSaveTeamName = (teamId: string) => {
    if (editingTeamName.trim()) {
      updateTeamName(teamId, editingTeamName);
      playScoreChime();
    }
    setEditingTeamId(null);
    setEditingTeamName('');
  };

  const handleCancelEditTeam = () => {
    setEditingTeamId(null);
    setEditingTeamName('');
  };

  const generateRandomSubMasterPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'Gipfel@';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewSubMasterPassword(pass);
  };

  const suggestSubMasterId = () => {
    if (newSubMasterName.trim()) {
      const sanitized = newSubMasterName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 12);
      const rand = Math.floor(10 + Math.random() * 90);
      setNewSubMasterId(`sub_${sanitized || 'qm'}_${rand}`);
    } else {
      const rand = Math.floor(100 + Math.random() * 900);
      setNewSubMasterId(`sub_master_${rand}`);
    }
  };

  const handleCreateSubMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubMasterName.trim() || !newSubMasterId.trim() || !newSubMasterPassword.trim()) {
      setSubMasterStatusMsg({
        text: 'Bitte Name, Quizmeister-ID und Passwort vollständig eingeben.',
        type: 'error',
      });
      return;
    }

    const result = addSubMaster(
      newSubMasterName,
      newSubMasterId,
      newSubMasterPassword,
      newSubMasterClass
    );

    if (result.success && result.subMaster) {
      setSubMasterStatusMsg({
        text: `Sub-Quizmeister "${newSubMasterName}" erfolgreich zugewiesen! ID: ${newSubMasterId} | Passwort: ${newSubMasterPassword}`,
        type: 'success',
      });
      setNewSubMasterName('');
      setNewSubMasterId('');
      setNewSubMasterPassword('');
      playClickSound();
    } else {
      setSubMasterStatusMsg({
        text: result.message || 'Fehler beim Zuweisen des Sub-Quizmeisters.',
        type: 'error',
      });
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCandidateSelectionToggle = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCommitTeamGrouping = () => {
    if (selectedCandidateIds.length === 0) return;
    groupCandidatesIntoTeam(targetTeamId, selectedCandidateIds);
    setSelectedCandidateIds([]);
    playClickSound();
  };

  const filteredCandidates = candidates.filter((c) => {
    if (candidateFilterClass === 'ALL') return true;
    return c.classDivision === candidateFilterClass;
  });

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-neutral-900 pb-16">
      {/* Top Bar for Head Quiz Master */}
      <header className="sticky top-0 z-30 bg-[#0F0F12] text-white border-b border-neutral-800 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-display uppercase tracking-wide">
                  Oberster Quizmeister · Leitstelle
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                  VOLLZUGRIFF
                </span>
              </div>
              <p className="text-2xs text-neutral-400">
                Wettkampfleitung: <span className="text-neutral-200">{currentUser?.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                publishRoundMarks(selectedRound);
              }}
              className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              title="Testet das Feier-Popup der aktuellen Runde"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Feier-Test</span>
            </button>

            <button
              onClick={onExit}
              className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Öffentliche Ansicht</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-300 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('scoring')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'scoring'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-red-500" />
            <span>1. Runden-Scoring & Feier</span>
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'candidates'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>2. Kandidaten & Gruppen-Bildung</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-200 text-neutral-800 rounded">
              {candidates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('submasters')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'submasters'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-emerald-500" />
            <span>3. Sub-Quizmeister Verwaltung</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-200 text-neutral-800 rounded">
              {subMasters.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ml-auto ${
              activeTab === 'settings'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
            <span>System zurücksetzen</span>
          </button>
        </div>

        {/* TAB 1: SCORING & CELEBRATION CONSOLE */}
        {activeTab === 'scoring' && (
          <div className="space-y-6">
            {/* Round Switcher Banner */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
                <div>
                  <span className="text-2xs font-mono font-bold uppercase tracking-widest text-red-600">
                    Aktiver Runden-Monitor
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-neutral-900 mt-0.5">
                    {currentRoundMeta.germanTitle}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    {currentRoundMeta.tagline} · Max. {currentRoundMeta.maxScore} Punkte
                  </p>
                </div>

                {/* Round Selector Buttons */}
                <div className="flex items-center gap-1.5 bg-neutral-100 p-1.5 rounded-xl">
                  {rounds.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedRound(r.id);
                        setActiveRoundId(r.id);
                        playClickSound();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedRound === r.id
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      Runde 0{r.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Celebration Marks Release Action Card */}
              <div className="mt-5 p-5 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 text-white rounded-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border border-neutral-700">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-amber-300">
                      Offizielle Punkte-Verkündigung (Celebration Theme)
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 max-w-2xl">
                    Sobald Sie die Punkte für Runde 0{selectedRound} freigeben, erscheint auf der gesamten
                    Website das ästhetische Feier-Popup mit Fanfare, Konfetti und aktualisiertem Ranking.
                  </p>
                  <input
                    type="text"
                    value={celebrationNote}
                    onChange={(e) => setCelebrationNote(e.target.value)}
                    placeholder="Optionale Botschaft des Quizmeisters für die Siegerehrung..."
                    className="w-full max-w-xl px-3 py-2 bg-neutral-800/90 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={handlePublishMarks}
                    className="px-5 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold tracking-wide uppercase rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Punkte Freigeben & Feiern</span>
                  </button>
                </div>
              </div>

              {publishSuccess && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Die Punkte für Runde 0{selectedRound} wurden offiziell verkündet und die Siegesfeier ausgelöst!
                  </span>
                </div>
              )}
            </div>

            {/* Real-time Team Scoring Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                    Live-Punkte Eingabe · Runde 0{selectedRound} ({currentRoundMeta.name})
                  </h3>
                  <p className="text-2xs text-neutral-500">
                    Direkte Punktezählung für alle 5 Klassen-Teams in Echtzeit
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-neutral-600">
                  5 Repräsentative Teams
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {teams.map((team, idx) => {
                  const roundKey = `round${selectedRound}` as keyof Team['roundScores'];
                  const currentScore = team.roundScores[roundKey] || 0;

                  return (
                    <div
                      key={team.id}
                      className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
                    >
                      {/* Team Info */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm ${
                            idx === 0
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          #{team.rank}
                        </div>
                        <div>
                          {editingTeamId === team.id ? (
                            <div className="flex items-center gap-1.5 py-0.5">
                              <input
                                type="text"
                                value={editingTeamName}
                                onChange={(e) => setEditingTeamName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveTeamName(team.id);
                                  if (e.key === 'Escape') handleCancelEditTeam();
                                }}
                                autoFocus
                                className="px-2.5 py-1 text-sm font-bold bg-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 font-display uppercase tracking-tight shadow-inner"
                              />
                              <button
                                onClick={() => handleSaveTeamName(team.id)}
                                className="p-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-md transition-colors"
                                title="Gruppenname speichern"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              </button>
                              <button
                                onClick={handleCancelEditTeam}
                                className="p-1.5 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-md transition-colors"
                                title="Abbrechen"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group/edit">
                              <h4 className="text-base font-bold text-neutral-900">{team.name}</h4>
                              <button
                                onClick={() => handleStartEditTeam(team)}
                                className="opacity-70 group-hover/edit:opacity-100 p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                                title="Gruppenname bearbeiten"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-2xs font-mono px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded font-semibold">
                                {team.classRepresented}
                              </span>
                            </div>
                          )}
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Mitglieder: {team.members.map((m) => m.name).join(', ') || 'Ausstehende Einteilung'}
                          </p>
                        </div>
                      </div>

                      {/* Score Controls */}
                      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap justify-end">
                        {/* Current round score badge */}
                        <div className="text-right px-3 py-1 bg-neutral-100 rounded-lg">
                          <span className="text-2xs text-neutral-500 block uppercase font-mono">
                            Runde 0{selectedRound}
                          </span>
                          <span className="text-lg font-extrabold font-mono tabular-nums text-neutral-900">
                            {currentScore}
                          </span>
                          <span className="text-2xs text-neutral-400"> / {currentRoundMeta.maxScore}</span>
                        </div>

                        {/* Increment / Decrement buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleScoreDelta(team.id, -5)}
                            className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 border border-neutral-200 rounded-lg transition-colors"
                            title="Abzug -5 Punkte"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleScoreDelta(team.id, 5)}
                            className="px-2.5 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleScoreDelta(team.id, 10)}
                            className="px-2.5 py-1.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleScoreDelta(team.id, 25)}
                            className="px-2.5 py-1.5 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors"
                          >
                            +25
                          </button>
                        </div>

                        {/* Direct input */}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max={currentRoundMeta.maxScore}
                            value={currentScore}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              updateTeamRoundScore(team.id, selectedRound, val);
                            }}
                            className="w-16 px-2 py-1.5 text-xs text-center font-mono font-bold bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                          />
                        </div>

                        {/* Overall Total Points */}
                        <div className="text-right border-l border-neutral-200 pl-4 min-w-[70px]">
                          <span className="text-2xs text-neutral-400 block uppercase font-mono">Gesamt</span>
                          <span className="text-lg font-black font-mono tabular-nums text-neutral-900">
                            {team.totalPoints}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CANDIDATES & GROUP FORMATION */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            {/* Explanatory banner */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-2xs font-mono font-bold uppercase tracking-widest text-amber-600">
                    Stufe 01 (Lernen & Qualifikation) → Stufe 03 (Klassenauswahl)
                  </span>
                  <h3 className="text-xl font-display font-bold text-neutral-900 mt-0.5">
                    Einzelne Kandidaten & Offizielle Gruppenbildung
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 max-w-3xl">
                    Die erste Runde ist ein individueller Projekt- und Wissenstest für jeden Schüler.
                    Nach Auswertung der Ergebnisse stellt der Quizmeister hier die offiziellen Klassen-Teams
                    zusammen (Team Alpha bis Echo), die dann auf der Website als Gruppen bekannt gegeben werden!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Filter Klasse:</span>
                  <select
                    value={candidateFilterClass}
                    onChange={(e) => setCandidateFilterClass(e.target.value)}
                    className="px-3 py-1.5 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-lg"
                  >
                    <option value="ALL">Alle Klassen (01 - 05)</option>
                    <option value="Class 01">Klasse 01</option>
                    <option value="Class 02">Klasse 02</option>
                    <option value="Class 03">Klasse 03</option>
                    <option value="Class 04">Klasse 04</option>
                    <option value="Class 05">Klasse 05</option>
                  </select>
                </div>
              </div>

              {/* Group Assignment Action Bar */}
              <div className="mt-5 p-4 bg-neutral-100 rounded-xl border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-700">
                    Ausgewählte Kandidaten ({selectedCandidateIds.length}):
                  </span>
                  <select
                    value={targetTeamId}
                    onChange={(e) => setTargetTeamId(e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.classRepresented})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleCommitTeamGrouping}
                  disabled={selectedCandidateIds.length === 0}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gruppe Formieren & Auf Website Veröffentlichen</span>
                </button>
              </div>

              {/* Team Names Management Cards */}
              <div className="mt-5 pt-4 border-t border-neutral-200">
                <span className="text-2xs font-bold uppercase tracking-wider text-neutral-500 block mb-2.5">
                  Offizielle Team- & Gruppennamen anpassen:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {teams.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">
                          {t.classRepresented}
                        </span>
                        {editingTeamId === t.id ? (
                          <div className="mt-1 space-y-1">
                            <input
                              type="text"
                              value={editingTeamName}
                              onChange={(e) => setEditingTeamName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTeamName(t.id);
                                if (e.key === 'Escape') handleCancelEditTeam();
                              }}
                              autoFocus
                              className="w-full px-2 py-1 text-xs font-bold bg-white border border-red-500 rounded focus:outline-none"
                            />
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleSaveTeamName(t.id)}
                                className="flex-1 py-1 bg-neutral-900 text-white rounded text-2xs font-bold"
                              >
                                Speichern
                              </button>
                              <button
                                onClick={handleCancelEditTeam}
                                className="px-2 py-1 bg-neutral-200 text-neutral-700 rounded text-2xs"
                              >
                                X
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-bold text-neutral-900 truncate">
                              {t.name}
                            </span>
                            <button
                              onClick={() => handleStartEditTeam(t)}
                              className="p-1 text-neutral-400 hover:text-red-600 hover:bg-neutral-200 rounded transition-colors"
                              title="Gruppenname ändern"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-2 block font-mono">
                        {t.members.length} Mitglieder
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Eingereichte Kandidaten-Profile & Qualifikations-Projekte
                </h4>
                <span className="text-xs text-neutral-500 font-mono">
                  {filteredCandidates.length} Einträge
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {filteredCandidates.map((c) => {
                  const isSelected = selectedCandidateIds.includes(c.id);
                  const isTopScore = c.qualifierScore >= 90;

                  return (
                    <div
                      key={c.id}
                      className={`p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
                        isSelected ? 'bg-amber-50/60' : 'hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCandidateSelectionToggle(c.id)}
                          className="mt-1 w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-neutral-900">{c.name}</span>
                            <span className="text-2xs font-mono font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                              {c.classDivision}
                            </span>
                            <span className="text-2xs font-bold px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded">
                              Niveau {c.germanLevel}
                            </span>
                            {isTopScore && (
                              <span className="text-2xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded inline-flex items-center gap-1">
                                <Award className="w-3 h-3 text-emerald-600" />
                                Top-Performer
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-neutral-700">
                            Thema: &ldquo;{c.projectTitle}&rdquo;
                          </p>
                          <p className="text-xs text-neutral-500 line-clamp-1">
                            {c.projectDescription}
                          </p>
                          <div className="flex items-center gap-3 text-2xs text-neutral-400">
                            <span>ID: {c.id}</span>
                            <span>·</span>
                            <span>{c.school}</span>
                            <span>·</span>
                            <span>Reg: {c.registrationDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Grading and Status */}
                      <div className="flex items-center gap-4 shrink-0 pl-7 lg:pl-0">
                        <div>
                          <label className="text-2xs text-neutral-500 uppercase font-mono block">
                            Qualifikations-Punkte
                          </label>
                          <div className="flex items-center gap-1 mt-0.5">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={c.qualifierScore}
                              onChange={(e) => {
                                const score = parseInt(e.target.value) || 0;
                                updateCandidateScore(c.id, score);
                              }}
                              className="w-16 px-2 py-1 text-xs text-center font-mono font-bold bg-neutral-50 border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                            <span className="text-xs text-neutral-400 font-mono">/ 100</span>
                          </div>
                        </div>

                        <div className="min-w-[130px] text-right">
                          <span className="text-2xs text-neutral-400 block font-mono">Team-Zuweisung</span>
                          <span className="text-xs font-bold text-neutral-900 block mt-0.5">
                            {c.assignedTeamId ? (
                              <span className="text-emerald-700 font-semibold flex items-center justify-end gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {teams.find((t) => t.id === c.assignedTeamId)?.name || c.assignedTeamId}
                              </span>
                            ) : (
                              <span className="text-neutral-400 italic">Noch kein Team</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUB-QUIZ MASTERS MANAGEMENT & ALLOCATION */}
        {activeTab === 'submasters' && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <span className="text-2xs font-mono font-bold uppercase tracking-widest text-emerald-600">
                Sicherheitsverwaltung & Rollen-Zuweisung
              </span>
              <h3 className="text-xl font-display font-bold text-neutral-900 mt-0.5">
                Sub-Quizmeister Zuweisen (ID & Passwort)
              </h3>
              <p className="text-xs text-neutral-600 mt-1 max-w-3xl">
                Als Oberster Quizmeister können Sie hier persönliche Zugänge für Assistenz- und Sub-Quizmeister
                mit individueller ID und sicherem Passwort anlegen. Sub-Quizmeister erhalten ausschließlich
                eingeschränkten Zugriff (Anwesenheitsprüfung und Live-Punkte-Monitor), können jedoch keine
                Wertungen manipulieren oder andere Spielleiter anlegen.
              </p>

              {subMasterStatusMsg && (
                <div
                  className={`mt-4 p-3.5 rounded-xl border text-xs flex items-center gap-2.5 animate-fade-in ${
                    subMasterStatusMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {subMasterStatusMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span className="font-medium">{subMasterStatusMsg.text}</span>
                </div>
              )}

              {/* Add & Allocate Sub-Master Form */}
              <form onSubmit={handleCreateSubMaster} className="mt-5 p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Name des Sub-Quizmeisters *
                    </label>
                    <input
                      type="text"
                      value={newSubMasterName}
                      onChange={(e) => {
                        setNewSubMasterName(e.target.value);
                        if (subMasterStatusMsg) setSubMasterStatusMsg(null);
                      }}
                      placeholder="z.B. Herr Prof. Fischer oder Thomas Klein"
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium"
                      required
                    />
                  </div>

                  {/* Assigned Class / Scope */}
                  <div>
                    <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Zuständiger Klassenbereich *
                    </label>
                    <select
                      value={newSubMasterClass}
                      onChange={(e) => setNewSubMasterClass(e.target.value as ClassNumber | 'ALL')}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg font-medium text-neutral-800"
                    >
                      <option value="ALL">Zuständig: Alle Klassen (01 - 05)</option>
                      <option value="Class 01">Klasse 01</option>
                      <option value="Class 02">Klasse 02</option>
                      <option value="Class 03">Klasse 03</option>
                      <option value="Class 04">Klasse 04</option>
                      <option value="Class 05">Klasse 05</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sub-Master ID / Username */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700">
                        Zuzuweisende Quizmeister-ID *
                      </label>
                      <button
                        type="button"
                        onClick={suggestSubMasterId}
                        className="text-2xs text-red-600 hover:text-red-700 font-semibold"
                      >
                        + ID-Vorschlag
                      </button>
                    </div>
                    <div className="relative">
                      <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={newSubMasterId}
                        onChange={(e) => {
                          setNewSubMasterId(e.target.value);
                          if (subMasterStatusMsg) setSubMasterStatusMsg(null);
                        }}
                        placeholder="z.B. sub_fischer_01"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Sub-Master Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700">
                        Passwort *
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomSubMasterPassword}
                        className="text-2xs text-amber-700 hover:text-amber-800 font-semibold"
                      >
                        + Sicher generieren
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newSubMasterPassword}
                        onChange={(e) => {
                          setNewSubMasterPassword(e.target.value);
                          if (subMasterStatusMsg) setSubMasterStatusMsg(null);
                        }}
                        placeholder="z.B. Fischer@Gipfel26"
                        className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                        title={showNewPassword ? 'Verbergen' : 'Anzeigen'}
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sub-Quizmeister Zuweisen & Speichern</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Sub-Masters List */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Aktuell Zuweisene Sub-Quizmeister ({subMasters.length})
                </h4>
                <span className="text-2xs text-neutral-400">
                  Rechte: Anwesenheitskontrolle & Live-Scoreboard
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {subMasters.map((sm) => {
                  const isPwRevealed = !!revealedPasswords[sm.id || sm.username];
                  const credsText = `ID: ${sm.username} | Passwort: ${sm.password || 'SubBerlin@2026'}`;

                  return (
                    <div
                      key={sm.id || sm.username}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-neutral-900">{sm.name}</span>
                          <span className="text-2xs font-mono px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded font-semibold">
                            Bereich: {sm.assignedClass || 'ALL'}
                          </span>
                          <span className="text-2xs text-neutral-400">
                            Registriert: {sm.createdAt}
                          </span>
                        </div>

                        {/* ID and Password Display */}
                        <div className="flex items-center gap-3 flex-wrap text-xs">
                          {/* ID */}
                          <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
                            <span className="text-2xs text-neutral-500 font-mono uppercase font-bold">ID:</span>
                            <span className="font-mono font-bold text-neutral-900">{sm.username}</span>
                          </div>

                          {/* Password */}
                          <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
                            <span className="text-2xs text-neutral-500 font-mono uppercase font-bold">Passwort:</span>
                            <span className="font-mono font-semibold text-neutral-900">
                              {isPwRevealed ? sm.password || '••••••••' : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(sm.id || sm.username)}
                              className="text-neutral-400 hover:text-neutral-700 ml-1 p-0.5"
                              title={isPwRevealed ? 'Passwort verbergen' : 'Passwort anzeigen'}
                            >
                              {isPwRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Copy credentials button */}
                          <button
                            onClick={() => copyToClipboard(credsText)}
                            className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md text-neutral-700 font-mono text-2xs font-semibold inline-flex items-center gap-1 transition-colors"
                            title="ID und Passwort in die Zwischenablage kopieren"
                          >
                            <Copy className="w-3 h-3 text-neutral-500" />
                            <span>Zugangsdaten Kopieren</span>
                          </button>

                          {copiedKey === credsText && (
                            <span className="text-2xs text-emerald-600 font-bold animate-fade-in">
                              Kopiert!
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => removeSubMaster(sm.id || sm.username)}
                          className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5 font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Zugang Sperren</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-display font-bold text-neutral-900">
                Turnierdaten & Speicher-Steuerung
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Verwalten Sie den Status des gesamten DER GIPFEL Turniers.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  Auf Standard-Turnierdaten zurücksetzen
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Setzt alle Kandidaten, Punktestände und Runden auf die offiziellen Startdaten zurück.
                </p>
              </div>

              <button
                onClick={() => {
                  if (confirm('Möchten Sie alle Punktestände und Eingaben wirklich auf die Ausgangsdaten zurücksetzen?')) {
                    resetTournamentData();
                  }
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Daten Zurücksetzen</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
