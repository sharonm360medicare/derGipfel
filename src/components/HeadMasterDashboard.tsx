import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import {
  RoundId,
  ClassNumber,
  GermanLevel,
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
    deleteCandidate,
    deleteMultipleCandidates,
    updateCandidate,
    resetCandidatesToDefault,
    registerCandidate,
    subMasters,
    addSubMaster,
    removeSubMaster,
    resetTournamentData,
    currentUser,
    gamesPublic,
    toggleGamesPublic,
    language,
    t,
  } = useCompetition();

  const d = t.dashboard;

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
  const [groupSuccessMsg, setGroupSuccessMsg] = useState<string | null>(null);
  const [teamNoticeMsg, setTeamNoticeMsg] = useState<string | null>(null);
  const [isTeamCardsDiscarded, setIsTeamCardsDiscarded] = useState<boolean>(false);
  const [isBulkEditingTeams, setIsBulkEditingTeams] = useState<boolean>(false);
  const [bulkTeamNames, setBulkTeamNames] = useState<Record<string, string>>({});

  // Candidate editing & deleting state
  const [editingCandidateId, setEditingCandidateId] = useState<string | null>(null);
  const [candidateEditForm, setCandidateEditForm] = useState<Partial<Candidate>>({});
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);
  const [candidateActionNotice, setCandidateActionNotice] = useState<string | null>(null);

  // Table title editing state
  const [isEditingTableTitle, setIsEditingTableTitle] = useState<boolean>(false);
  const [customTableTitle, setCustomTableTitle] = useState<string | null>(null);
  const [tempTableTitle, setTempTableTitle] = useState<string>('');

  // Add candidate form state
  const [isAddingCandidate, setIsAddingCandidate] = useState<boolean>(false);
  const [newCandidateForm, setNewCandidateForm] = useState({
    name: '',
    classDivision: 'Class 01' as ClassNumber,
    germanLevel: 'A2' as GermanLevel,
    school: 'Gipfelstürmer Gymnasium München',
    projectTitle: '',
    projectDescription: '',
    qualifierScore: 85,
  });

  const currentRoundMeta = rounds.find((r) => r.id === selectedRound) || rounds[0];
  const roundTitle = language === 'de' ? currentRoundMeta.germanTitle : currentRoundMeta.name;

  const handleScoreDelta = (teamId: string, delta: number) => {
    adjustTeamRoundScore(teamId, selectedRound, delta);
    playScoreChime();
  };

  const handlePublishMarks = () => {
    const defaultNote = language === 'de'
      ? `Die Ergebnisse der ${currentRoundMeta.germanTitle} wurden von der Wettbewerbsleitung bestätigt! Hervorragende Sprachleistungen aller Teams.`
      : `The results of ${currentRoundMeta.name} have been verified by the Tournament Committee! Outstanding language excellence across all teams.`;

    publishRoundMarks(
      selectedRound,
      celebrationNote.trim() || defaultNote
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
        text: d.submasters.errorRequired,
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
        text: d.submasters.successCreated
          .replace('{name}', newSubMasterName)
          .replace('{id}', newSubMasterId)
          .replace('{pw}', newSubMasterPassword),
        type: 'success',
      });
      setNewSubMasterName('');
      setNewSubMasterId('');
      setNewSubMasterPassword('');
      playClickSound();
    } else {
      setSubMasterStatusMsg({
        text: result.message || d.submasters.errorGeneric,
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

  const filteredCandidates = candidates.filter((c) => {
    if (candidateFilterClass === 'ALL') return true;
    return c.classDivision === candidateFilterClass;
  });

  const handleCandidateSelectionToggle = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllFiltered = () => {
    const currentFilteredIds = filteredCandidates.map((c) => c.id);
    const allSelected =
      currentFilteredIds.length > 0 &&
      currentFilteredIds.every((id) => selectedCandidateIds.includes(id));

    if (allSelected) {
      setSelectedCandidateIds((prev) =>
        prev.filter((id) => !currentFilteredIds.includes(id))
      );
    } else {
      setSelectedCandidateIds((prev) =>
        Array.from(new Set([...prev, ...currentFilteredIds]))
      );
    }
    playClickSound();
  };

  const handleCommitTeamGrouping = () => {
    let idsToAssign = [...selectedCandidateIds];

    // If no candidate selected yet, automatically pick from current filter so button always works!
    if (idsToAssign.length === 0) {
      const unassignedInView = filteredCandidates.filter(
        (c) => c.status !== 'assigned_to_team' || c.assignedTeamId !== targetTeamId
      );
      const pool = unassignedInView.length > 0 ? unassignedInView : filteredCandidates;
      if (pool.length > 0) {
        idsToAssign = pool.slice(0, 4).map((c) => c.id);
      } else {
        setGroupSuccessMsg(
          language === 'de'
            ? 'Keine Kandidaten zum Zuweisen verfügbar.'
            : 'No candidates available to assign.'
        );
        setTimeout(() => setGroupSuccessMsg(null), 3500);
        return;
      }
    }

    const team = teams.find((t) => t.id === targetTeamId);
    groupCandidatesIntoTeam(targetTeamId, idsToAssign);
    setSelectedCandidateIds([]);
    playScoreChime();

    setGroupSuccessMsg(
      language === 'de'
        ? `✓ ${idsToAssign.length} Kandidat(en) erfolgreich "${team?.name || 'Team'}" zugewiesen!`
        : `✓ ${idsToAssign.length} candidate(s) successfully assigned to "${team?.name || 'Team'}"!`
    );
    setTimeout(() => setGroupSuccessMsg(null), 4000);
  };

  const handleResetTeamToDefault = (teamId: string) => {
    const defaultNames: Record<string, string> = {
      'team-alpha': 'Team Alpha',
      'team-bravo': 'Team Bravo',
      'team-charlie': 'Team Charlie',
      'team-delta': 'Team Delta',
      'team-echo': 'Team Echo',
    };
    const defaultName = defaultNames[teamId] || `Team ${teamId.toUpperCase()}`;
    updateTeamName(teamId, defaultName);
    playClickSound();
    setTeamNoticeMsg(
      language === 'de'
        ? `Team-Name auf "${defaultName}" zurückgesetzt.`
        : `Team name reverted to "${defaultName}".`
    );
    setTimeout(() => setTeamNoticeMsg(null), 3000);
  };

  const handleClearTeamMembers = (teamId: string) => {
    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam || targetTeam.members.length === 0) return;
    groupCandidatesIntoTeam(teamId, []);
    playClickSound();
    setTeamNoticeMsg(
      language === 'de'
        ? `Mitglieder von "${targetTeam.name}" wurden verworfen / entfernt.`
        : `Members of "${targetTeam.name}" were discarded / removed.`
    );
    setTimeout(() => setTeamNoticeMsg(null), 3000);
  };

  const handleStartBulkEditTeams = () => {
    const initialMap: Record<string, string> = {};
    teams.forEach((t) => {
      initialMap[t.id] = t.name;
    });
    setBulkTeamNames(initialMap);
    setIsBulkEditingTeams(true);
    playClickSound();
  };

  const handleSaveBulkTeams = () => {
    Object.entries(bulkTeamNames).forEach(([teamId, newName]) => {
      if (newName.trim()) {
        updateTeamName(teamId, newName.trim());
      }
    });
    setIsBulkEditingTeams(false);
    playScoreChime();
    setTeamNoticeMsg(
      language === 'de'
        ? 'Alle Team-Namen erfolgreich aktualisiert!'
        : 'All team names successfully updated!'
    );
    setTimeout(() => setTeamNoticeMsg(null), 3000);
  };

  const handleDiscardBulkTeams = () => {
    setBulkTeamNames({});
    setIsBulkEditingTeams(false);
    playClickSound();
    setTeamNoticeMsg(
      language === 'de'
        ? 'Änderungen verworfen.'
        : 'Bulk changes discarded.'
    );
    setTimeout(() => setTeamNoticeMsg(null), 3000);
  };

  // Candidate Editing & Deleting Handlers
  const handleStartEditCandidate = (c: Candidate) => {
    setEditingCandidateId(c.id);
    setCandidateEditForm({
      name: c.name,
      classDivision: c.classDivision,
      germanLevel: c.germanLevel,
      projectTitle: c.projectTitle,
      projectDescription: c.projectDescription,
      school: c.school,
      qualifierScore: c.qualifierScore,
    });
    setCandidateToDelete(null);
    playClickSound();
  };

  const handleCancelEditCandidate = () => {
    setEditingCandidateId(null);
    setCandidateEditForm({});
    playClickSound();
  };

  const handleSaveCandidate = (id: string) => {
    if (!candidateEditForm.name?.trim()) return;
    updateCandidate(id, {
      name: candidateEditForm.name.trim(),
      classDivision: candidateEditForm.classDivision,
      germanLevel: candidateEditForm.germanLevel,
      projectTitle: candidateEditForm.projectTitle?.trim() || 'Projektbeitrag',
      projectDescription: candidateEditForm.projectDescription?.trim() || '',
      school: candidateEditForm.school?.trim() || 'Gymnasium',
      qualifierScore: candidateEditForm.qualifierScore ?? 75,
    });
    const savedName = candidateEditForm.name.trim();
    setEditingCandidateId(null);
    setCandidateEditForm({});
    playScoreChime();
    setCandidateActionNotice(
      language === 'de'
        ? `Kandidat "${savedName}" erfolgreich gespeichert.`
        : `Candidate "${savedName}" saved successfully.`
    );
    setTimeout(() => setCandidateActionNotice(null), 3500);
  };

  const handleDeleteCandidate = (id: string, name: string) => {
    deleteCandidate(id);
    setSelectedCandidateIds((prev) => prev.filter((i) => i !== id));
    setCandidateToDelete(null);
    playClickSound();
    setCandidateActionNotice(
      language === 'de'
        ? `Kandidat "${name}" erfolgreich gelöscht.`
        : `Candidate "${name}" deleted.`
    );
    setTimeout(() => setCandidateActionNotice(null), 3500);
  };

  const handleDeleteSelectedCandidates = () => {
    if (selectedCandidateIds.length === 0) return;
    const count = selectedCandidateIds.length;
    deleteMultipleCandidates(selectedCandidateIds);
    setSelectedCandidateIds([]);
    playClickSound();
    setCandidateActionNotice(
      language === 'de'
        ? `${count} ausgewählte Kandidaten wurden gelöscht.`
        : `${count} selected candidate(s) deleted.`
    );
    setTimeout(() => setCandidateActionNotice(null), 3500);
  };

  const handleCreateNewCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateForm.name.trim()) return;
    const safeSlug = newCandidateForm.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '.');
    const created = registerCandidate({
      name: newCandidateForm.name.trim(),
      email: `${safeSlug}@schueler.gipfel-bayern.de`,
      submissionLink: `https://gipfelstuerzer.cloud/portfolio/${safeSlug}`,
      classDivision: newCandidateForm.classDivision,
      germanLevel: newCandidateForm.germanLevel,
      school: newCandidateForm.school.trim() || 'Schulzentrum',
      projectTitle: newCandidateForm.projectTitle.trim() || 'Präsentation Deutsch',
      projectDescription: newCandidateForm.projectDescription.trim() || 'Wettbewerbsbeitrag',
    });
    if (newCandidateForm.qualifierScore) {
      updateCandidateScore(created.id, newCandidateForm.qualifierScore);
    }
    const createdName = newCandidateForm.name.trim();
    setIsAddingCandidate(false);
    setNewCandidateForm({
      name: '',
      classDivision: 'Class 01' as ClassNumber,
      germanLevel: 'A2' as GermanLevel,
      school: 'Gipfelstürmer Gymnasium München',
      projectTitle: '',
      projectDescription: '',
      qualifierScore: 85,
    });
    playScoreChime();
    setCandidateActionNotice(
      language === 'de'
        ? `Kandidat "${createdName}" erfolgreich angelegt!`
        : `Candidate "${createdName}" created successfully!`
    );
    setTimeout(() => setCandidateActionNotice(null), 3500);
  };

  const handleResetAllCandidates = () => {
    resetCandidatesToDefault();
    setSelectedCandidateIds([]);
    setCandidateToDelete(null);
    setEditingCandidateId(null);
    playClickSound();
    setCandidateActionNotice(
      language === 'de'
        ? 'Alle 12 Standard-Kandidaten wurden wiederhergestellt!'
        : 'All 12 default candidates have been restored!'
    );
    setTimeout(() => setCandidateActionNotice(null), 3500);
  };

  const handleStartEditTableTitle = () => {
    setTempTableTitle(customTableTitle ?? d.candidates.tableTitle);
    setIsEditingTableTitle(true);
    playClickSound();
  };

  const handleSaveTableTitle = () => {
    if (tempTableTitle.trim()) {
      setCustomTableTitle(tempTableTitle.trim());
    }
    setIsEditingTableTitle(false);
    playClickSound();
  };

  const handleResetTableTitle = () => {
    setCustomTableTitle(null);
    setIsEditingTableTitle(false);
    playClickSound();
  };

  return (
    <div className="flex-1 bg-[#F4F4F1] text-neutral-900 pb-16">
      {/* Top Bar for Head Quiz Master */}
      <div className="sticky top-18 sm:top-[72px] z-30 bg-[#0F0F12] text-white border-b border-neutral-800 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-display uppercase tracking-wide">
                  {d.headerTitle}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                  {d.fullAccess}
                </span>
              </div>
              <p className="text-2xs text-neutral-400">
                {d.director} <span className="text-neutral-200">{currentUser?.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onExit}
              className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{d.publicView}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {/* Executive Suspense & Visibility Controller Banner */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-neutral-900 text-white border border-neutral-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
              gamesPublic
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {gamesPublic ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400">
                  {d.gamesVisibilityTitle}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  gamesPublic
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {gamesPublic ? d.statusPublic : d.statusHidden}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {gamesPublic ? d.descPublic : d.descHidden}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              toggleGamesPublic();
            }}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm shrink-0 ${
              gamesPublic
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
            }`}
          >
            {gamesPublic ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4" />}
            <span>{gamesPublic ? d.btnHideGames : d.btnShowGames}</span>
          </button>
        </div>

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
            <span>{d.tabs.scoring}</span>
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
            <span>{d.tabs.candidates}</span>
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
            <span>{d.tabs.submasters}</span>
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
            <span>{d.tabs.settings}</span>
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
                    {d.scoring.activeRoundMonitor}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-neutral-900 mt-0.5">
                    {roundTitle}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    {currentRoundMeta.tagline} · Max. {currentRoundMeta.maxScore} {d.scoring.maxPoints}
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
                      {d.scoring.roundLabel} 0{r.id}
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
                      {d.scoring.celebrationTitle}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 max-w-2xl">
                    {d.scoring.celebrationDesc.replace('{round}', selectedRound.toString())}
                  </p>
                  <input
                    type="text"
                    value={celebrationNote}
                    onChange={(e) => setCelebrationNote(e.target.value)}
                    placeholder={d.scoring.notePlaceholder}
                    className="w-full max-w-xl px-3 py-2 bg-neutral-800/90 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={handlePublishMarks}
                    className="px-5 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold tracking-wide uppercase rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{d.scoring.btnPublish}</span>
                  </button>
                </div>
              </div>

              {publishSuccess && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {d.scoring.publishSuccessMsg.replace('{round}', selectedRound.toString())}
                  </span>
                </div>
              )}
            </div>

            {/* Real-time Team Scoring Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                    {d.scoring.liveTableTitle.replace('{round}', selectedRound.toString())} ({roundTitle})
                  </h3>
                  <p className="text-2xs text-neutral-500">
                    {d.scoring.liveTableSubtitle}
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-neutral-600">
                  {d.scoring.repTeamsCount}
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
                                title={d.scoring.saveTeamName}
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              </button>
                              <button
                                onClick={handleCancelEditTeam}
                                className="p-1.5 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-md transition-colors"
                                title={d.scoring.cancel}
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
                                title={d.scoring.editTeamName}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-2xs font-mono px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded font-semibold">
                                {team.classRepresented}
                              </span>
                            </div>
                          )}
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {d.scoring.members} {team.members.map((m) => m.name).join(', ') || d.scoring.pendingAssignment}
                          </p>
                        </div>
                      </div>

                      {/* Score Controls */}
                      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap justify-end">
                        {/* Current round score badge */}
                        <div className="text-right px-3 py-1 bg-neutral-100 rounded-lg">
                          <span className="text-2xs text-neutral-500 block uppercase font-mono">
                            {d.scoring.roundLabel} 0{selectedRound}
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
                            title={d.scoring.deduct5}
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
                          <span className="text-2xs text-neutral-400 block uppercase font-mono">{d.scoring.total}</span>
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
                    {d.candidates.stageKicker}
                  </span>
                  <h3 className="text-xl font-display font-bold text-neutral-900 mt-0.5">
                    {d.candidates.stageTitle}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 max-w-3xl">
                    {d.candidates.stageDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">{d.candidates.filterClass}</span>
                  <select
                    value={candidateFilterClass}
                    onChange={(e) => setCandidateFilterClass(e.target.value)}
                    className="px-3 py-1.5 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-lg"
                  >
                    <option value="ALL">{d.candidates.allClasses}</option>
                    <option value="Class 01">{d.candidates.classOption} 01</option>
                    <option value="Class 02">{d.candidates.classOption} 02</option>
                    <option value="Class 03">{d.candidates.classOption} 03</option>
                    <option value="Class 04">{d.candidates.classOption} 04</option>
                    <option value="Class 05">{d.candidates.classOption} 05</option>
                  </select>
                </div>
              </div>

              {/* Group Assignment Action Bar */}
              <div className="mt-5 p-4 bg-neutral-100 rounded-xl border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold text-neutral-700">
                    {d.candidates.selectedCandidates} ({selectedCandidateIds.length}):
                  </span>
                  <select
                    value={targetTeamId}
                    onChange={(e) => setTargetTeamId(e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.classRepresented})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleToggleSelectAllFiltered}
                    className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-neutral-200 border border-neutral-300 rounded-lg text-neutral-800 transition-colors cursor-pointer"
                  >
                    {filteredCandidates.length > 0 &&
                    filteredCandidates.every((c) => selectedCandidateIds.includes(c.id))
                      ? (language === 'de' ? 'Auswahl aufheben' : 'Deselect All')
                      : (language === 'de' ? 'Alle auswählen' : 'Select All')}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCommitTeamGrouping}
                  className="w-full md:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>{d.candidates.btnCommitGroup}</span>
                  {selectedCandidateIds.length > 0 ? (
                    <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-neutral-950 rounded-full text-[10px] font-mono font-black">
                      {selectedCandidateIds.length}
                    </span>
                  ) : (
                    <span className="ml-1 px-1.5 py-0.2 bg-neutral-700 text-neutral-300 rounded text-[10px] font-normal">
                      {language === 'de' ? 'Auto / Klick' : 'Auto'}
                    </span>
                  )}
                </button>
              </div>

              {groupSuccessMsg && (
                <div className="mt-2.5 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{groupSuccessMsg}</span>
                </div>
              )}

              {/* Team Names Management Cards */}
              <div className="mt-5 pt-4 border-t border-neutral-200">
                {isTeamCardsDiscarded ? (
                  <div className="p-4 bg-neutral-50 border border-dashed border-neutral-300 rounded-xl flex items-center justify-between gap-3 text-xs text-neutral-600">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="font-medium">
                        {language === 'de'
                          ? 'Team-Verwaltungsbereich wurde verworfen / ausgeblendet.'
                          : 'Team management panel has been discarded / hidden.'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTeamCardsDiscarded(false);
                        playClickSound();
                      }}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'de' ? 'Bereich wiederherstellen' : 'Restore Team Cards'}</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xs font-bold uppercase tracking-wider text-neutral-500">
                          {d.candidates.editTeamNamesTitle}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-100 text-neutral-600 rounded">
                          {teams.length} Teams
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!isBulkEditingTeams ? (
                          <button
                            type="button"
                            onClick={handleStartBulkEditTeams}
                            className="px-2.5 py-1 text-2xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            title={language === 'de' ? 'Alle Teams gleichzeitig bearbeiten' : 'Edit all teams simultaneously'}
                          >
                            <Pencil className="w-3 h-3 text-neutral-500" />
                            <span>{language === 'de' ? 'Alle bearbeiten' : 'Edit All'}</span>
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={handleSaveBulkTeams}
                              className="px-2.5 py-1 text-2xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              <span>{language === 'de' ? 'Alle speichern' : 'Save All'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleDiscardBulkTeams}
                              className="px-2.5 py-1 text-2xs font-bold bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                              <span>{language === 'de' ? 'Verwerfen' : 'Discard'}</span>
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setIsTeamCardsDiscarded(true);
                            playClickSound();
                          }}
                          className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                          title={language === 'de' ? 'Diesen Bereich verwerfen / ausblenden' : 'Discard / hide this panel'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {teamNoticeMsg && (
                      <div className="mb-2 p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-center gap-1.5 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{teamNoticeMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                      {teams.map((t) => {
                        const isSingleEditing = editingTeamId === t.id;
                        const isBulk = isBulkEditingTeams;

                        return (
                          <div
                            key={t.id}
                            className="p-3 bg-neutral-50 hover:bg-neutral-100/60 border border-neutral-200 rounded-xl flex flex-col justify-between transition-colors group/card"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">
                                  {t.classRepresented}
                                </span>
                                <div className="flex items-center gap-0.5 opacity-60 group-hover/card:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => handleResetTeamToDefault(t.id)}
                                    className="p-1 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                    title={language === 'de' ? 'Team-Name auf Standard zurücksetzen' : 'Reset team name to default'}
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                  </button>
                                  {t.members.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleClearTeamMembers(t.id)}
                                      className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                      title={language === 'de' ? 'Mitgliederzuweisung verwerfen' : 'Discard / clear team members'}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {isBulk ? (
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    value={bulkTeamNames[t.id] ?? t.name}
                                    onChange={(e) =>
                                      setBulkTeamNames((prev) => ({ ...prev, [t.id]: e.target.value }))
                                    }
                                    className="w-full px-2 py-1 text-xs font-bold bg-white border border-neutral-300 rounded focus:border-amber-500 focus:outline-none"
                                  />
                                </div>
                              ) : isSingleEditing ? (
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
                                      type="button"
                                      onClick={() => handleSaveTeamName(t.id)}
                                      className="flex-1 py-1 bg-neutral-900 text-white rounded text-2xs font-bold hover:bg-neutral-800 transition-colors"
                                    >
                                      {d.candidates.save}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCancelEditTeam}
                                      className="px-2 py-1 bg-neutral-200 text-neutral-700 hover:bg-neutral-300 rounded text-2xs font-medium transition-colors"
                                      title={language === 'de' ? 'Verwerfen' : 'Discard'}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleStartEditTeam(t)}
                                  className="flex items-center justify-between mt-1 cursor-pointer group/title p-0.5 rounded hover:bg-white/80 transition-colors"
                                  title={language === 'de' ? 'Klicken zum Bearbeiten' : 'Click to edit'}
                                >
                                  <span className="text-xs font-bold text-neutral-900 truncate">
                                    {t.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartEditTeam(t);
                                    }}
                                    className="p-1 text-neutral-400 group-hover/title:text-red-600 rounded transition-colors"
                                    title={d.scoring.editTeamName}
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="mt-2 pt-1 border-t border-neutral-200/60 flex items-center justify-between">
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {t.members.length} {d.candidates.membersCount}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-neutral-700">
                                {t.totalPoints} pts
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/50">
                <div className="flex items-center gap-2">
                  {isEditingTableTitle ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={tempTableTitle}
                        onChange={(e) => setTempTableTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTableTitle();
                          if (e.key === 'Escape') setIsEditingTableTitle(false);
                        }}
                        autoFocus
                        className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-white border border-neutral-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={handleSaveTableTitle}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
                        title={language === 'de' ? 'Titel speichern' : 'Save Title'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingTableTitle(false)}
                        className="p-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg transition-colors cursor-pointer"
                        title={language === 'de' ? 'Verwerfen' : 'Discard'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                        <span>{customTableTitle ?? d.candidates.tableTitle}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={handleStartEditTableTitle}
                        className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded transition-colors cursor-pointer"
                        title={language === 'de' ? 'Überschrift bearbeiten' : 'Edit heading'}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      {customTableTitle && (
                        <button
                          type="button"
                          onClick={handleResetTableTitle}
                          className="p-1 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                          title={language === 'de' ? 'Auf Standard-Titel zurücksetzen' : 'Reset to default title'}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {selectedCandidateIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteSelectedCandidates}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>
                        {language === 'de'
                          ? `${selectedCandidateIds.length} Löschen`
                          : `Delete ${selectedCandidateIds.length}`}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsAddingCandidate(!isAddingCandidate)}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'de' ? 'Kandidat hinzufügen' : 'Add Candidate'}</span>
                  </button>

                  {candidates.length < 12 && (
                    <button
                      type="button"
                      onClick={handleResetAllCandidates}
                      className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      title={language === 'de' ? 'Alle Standard-Kandidaten wiederherstellen' : 'Restore all original candidates'}
                    >
                      <RotateCcw className="w-3 h-3 text-neutral-500" />
                      <span>{language === 'de' ? 'Wiederherstellen' : 'Restore'}</span>
                    </button>
                  )}

                  <span className="text-xs text-neutral-500 font-mono pl-1">
                    {filteredCandidates.length} {d.candidates.entries}
                  </span>
                </div>
              </div>

              {/* Feedback Notice */}
              {candidateActionNotice && (
                <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{candidateActionNotice}</span>
                </div>
              )}

              {/* Add Candidate Form Accordion */}
              {isAddingCandidate && (
                <form
                  onSubmit={handleCreateNewCandidate}
                  className="p-5 bg-amber-50/40 border-b border-amber-200/80 space-y-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-amber-600" />
                      {language === 'de' ? 'Neuen Kandidaten registrieren & hinzufügen' : 'Register & Add New Candidate'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingCandidate(false)}
                      className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-2xs font-mono font-bold uppercase text-neutral-500 block mb-1">
                        {language === 'de' ? 'Vollständiger Name *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newCandidateForm.name}
                        onChange={(e) => setNewCandidateForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="z.B. Lukas Weber"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-2xs font-mono font-bold uppercase text-neutral-500 block mb-1">
                        {language === 'de' ? 'Klasse *' : 'Class *'}
                      </label>
                      <select
                        value={newCandidateForm.classDivision}
                        onChange={(e) => setNewCandidateForm((p) => ({ ...p, classDivision: e.target.value as ClassNumber }))}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      >
                        {['Class 01', 'Class 02', 'Class 03', 'Class 04', 'Class 05'].map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-2xs font-mono font-bold uppercase text-neutral-500 block mb-1">
                        {language === 'de' ? 'Deutsch-Niveau *' : 'German Level *'}
                      </label>
                      <select
                        value={newCandidateForm.germanLevel}
                        onChange={(e) => setNewCandidateForm((p) => ({ ...p, germanLevel: e.target.value as GermanLevel }))}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      >
                        {['A1', 'A2', 'B1', 'B2'].map((lvl) => (
                          <option key={lvl} value={lvl}>
                            Level {lvl}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-2xs font-mono font-bold uppercase text-neutral-500 block mb-1">
                        {language === 'de' ? 'Quali-Punkte (0-100)' : 'Quali Score (0-100)'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newCandidateForm.qualifierScore}
                        onChange={(e) => setNewCandidateForm((p) => ({ ...p, qualifierScore: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-2xs font-mono font-bold uppercase text-neutral-500 block mb-1">
                        {language === 'de' ? 'Projektthema / Titel' : 'Project Topic / Title'}
                      </label>
                      <input
                        type="text"
                        value={newCandidateForm.projectTitle}
                        onChange={(e) => setNewCandidateForm((p) => ({ ...p, projectTitle: e.target.value }))}
                        placeholder="z.B. Deutsche Redewendungen im Alltag"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-2xs font-mono font-bold uppercase text-neutral-500 block mb-1">
                        {language === 'de' ? 'Schule / Bildungseinrichtung' : 'School'}
                      </label>
                      <input
                        type="text"
                        value={newCandidateForm.school}
                        onChange={(e) => setNewCandidateForm((p) => ({ ...p, school: e.target.value }))}
                        placeholder="z.B. Gipfelstürmer Gymnasium München"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingCandidate(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                    >
                      {language === 'de' ? 'Abbrechen' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'de' ? 'Kandidat anlegen' : 'Create Candidate'}</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="divide-y divide-neutral-100">
                {filteredCandidates.length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <p className="text-xs text-neutral-500 font-medium">
                      {language === 'de' ? 'Keine Kandidaten in dieser Ansicht gefunden.' : 'No candidates found in this view.'}
                    </p>
                    <button
                      type="button"
                      onClick={handleResetAllCandidates}
                      className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'de' ? 'Standard-Kandidaten wiederherstellen' : 'Restore Default Candidates'}</span>
                    </button>
                  </div>
                ) : (
                  filteredCandidates.map((c) => {
                    const isSelected = selectedCandidateIds.includes(c.id);
                    const isTopScore = c.qualifierScore >= 90;
                    const isEditing = editingCandidateId === c.id;
                    const isConfirmingDelete = candidateToDelete === c.id;

                    return (
                      <div
                        key={c.id}
                        className={`p-4 sm:p-5 flex flex-col justify-between gap-4 transition-colors ${
                          isSelected ? 'bg-amber-50/60' : 'hover:bg-neutral-50'
                        }`}
                      >
                        {isEditing ? (
                          /* INLINE EDIT MODE */
                          <div className="space-y-3 w-full bg-neutral-50/70 p-3.5 rounded-xl border border-neutral-300">
                            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Pencil className="w-3.5 h-3.5 text-amber-600" />
                                {language === 'de' ? `Kandidat bearbeiten: ${c.name}` : `Edit Candidate: ${c.name}`}
                              </span>
                              <span className="text-2xs font-mono text-neutral-400">ID: {c.id}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                              <div>
                                <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                                  {language === 'de' ? 'Name' : 'Name'}
                                </label>
                                <input
                                  type="text"
                                  value={candidateEditForm.name ?? ''}
                                  onChange={(e) => setCandidateEditForm((p) => ({ ...p, name: e.target.value }))}
                                  className="w-full px-2.5 py-1 text-xs font-bold bg-white border border-neutral-300 rounded focus:border-neutral-900 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                                  {language === 'de' ? 'Klasse' : 'Class'}
                                </label>
                                <select
                                  value={candidateEditForm.classDivision ?? 'Class 01'}
                                  onChange={(e) => setCandidateEditForm((p) => ({ ...p, classDivision: e.target.value as ClassNumber }))}
                                  className="w-full px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded focus:border-neutral-900 focus:outline-none"
                                >
                                  {['Class 01', 'Class 02', 'Class 03', 'Class 04', 'Class 05'].map((cls) => (
                                    <option key={cls} value={cls}>
                                      {cls}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                                  {language === 'de' ? 'Niveau' : 'Level'}
                                </label>
                                <select
                                  value={candidateEditForm.germanLevel ?? 'A2'}
                                  onChange={(e) => setCandidateEditForm((p) => ({ ...p, germanLevel: e.target.value as GermanLevel }))}
                                  className="w-full px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded focus:border-neutral-900 focus:outline-none"
                                >
                                  {['A1', 'A2', 'B1', 'B2'].map((lvl) => (
                                    <option key={lvl} value={lvl}>
                                      Level {lvl}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                                  {language === 'de' ? 'Quali-Punkte (0-100)' : 'Points (0-100)'}
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={candidateEditForm.qualifierScore ?? 75}
                                  onChange={(e) => setCandidateEditForm((p) => ({ ...p, qualifierScore: parseInt(e.target.value) || 0 }))}
                                  className="w-full px-2.5 py-1 text-xs font-mono font-bold bg-white border border-neutral-300 rounded focus:border-neutral-900 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                                  {language === 'de' ? 'Thema / Titel' : 'Topic / Title'}
                                </label>
                                <input
                                  type="text"
                                  value={candidateEditForm.projectTitle ?? ''}
                                  onChange={(e) => setCandidateEditForm((p) => ({ ...p, projectTitle: e.target.value }))}
                                  className="w-full px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded focus:border-neutral-900 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                                  {language === 'de' ? 'Schule' : 'School'}
                                </label>
                                <input
                                  type="text"
                                  value={candidateEditForm.school ?? ''}
                                  onChange={(e) => setCandidateEditForm((p) => ({ ...p, school: e.target.value }))}
                                  className="w-full px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded focus:border-neutral-900 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                                {language === 'de' ? 'Projektbeschreibung' : 'Description'}
                              </label>
                              <input
                                type="text"
                                value={candidateEditForm.projectDescription ?? ''}
                                onChange={(e) => setCandidateEditForm((p) => ({ ...p, projectDescription: e.target.value }))}
                                className="w-full px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded focus:border-neutral-900 focus:outline-none"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSaveCandidate(c.id)}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{language === 'de' ? 'Speichern' : 'Save'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelEditCandidate}
                                  className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>{language === 'de' ? 'Verwerfen' : 'Discard'}</span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteCandidate(c.id, c.name)}
                                className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{language === 'de' ? 'Kandidat Löschen' : 'Delete Candidate'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* STANDARD CANDIDATE ROW VIEW */
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                                    {d.candidates.level} {c.germanLevel}
                                  </span>
                                  {isTopScore && (
                                    <span className="text-2xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded inline-flex items-center gap-1">
                                      <Award className="w-3 h-3 text-emerald-600" />
                                      {d.candidates.topPerformer}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-neutral-700">
                                  {d.candidates.topic} &ldquo;{c.projectTitle}&rdquo;
                                </p>
                                <p className="text-xs text-neutral-500 line-clamp-1">
                                  {c.projectDescription}
                                </p>
                                <div className="flex items-center gap-3 text-2xs text-neutral-400">
                                  <span>ID: {c.id}</span>
                                  <span>·</span>
                                  <span>{c.school}</span>
                                  <span>·</span>
                                  <span>{d.candidates.registeredOn} {c.registrationDate}</span>
                                </div>
                              </div>
                            </div>

                            {/* Grading, Status & Edit/Delete Actions */}
                            <div className="flex flex-wrap items-center gap-4 shrink-0 pl-7 lg:pl-0">
                              <div>
                                <label className="text-2xs text-neutral-500 uppercase font-mono block">
                                  {d.candidates.qualifierPoints}
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

                              <div className="min-w-[120px] text-right">
                                <span className="text-2xs text-neutral-400 block font-mono">{d.candidates.teamAssignment}</span>
                                <span className="text-xs font-bold text-neutral-900 block mt-0.5">
                                  {c.assignedTeamId ? (
                                    <span className="text-emerald-700 font-semibold flex items-center justify-end gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      {teams.find((t) => t.id === c.assignedTeamId)?.name || c.assignedTeamId}
                                    </span>
                                  ) : (
                                    <span className="text-neutral-400 italic">{d.candidates.noTeamYet}</span>
                                  )}
                                </span>
                              </div>

                              {/* Row Action Buttons: Edit & Delete */}
                              <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200">
                                {isConfirmingDelete ? (
                                  <div className="flex items-center gap-1.5 p-1 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                                    <span className="text-2xs font-bold text-red-700 px-1">
                                      {language === 'de' ? 'Löschen?' : 'Delete?'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCandidate(c.id, c.name)}
                                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-2xs font-bold transition-colors cursor-pointer"
                                    >
                                      {language === 'de' ? 'Ja' : 'Yes'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setCandidateToDelete(null)}
                                      className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded text-2xs font-medium transition-colors cursor-pointer"
                                    >
                                      {language === 'de' ? 'Nein' : 'No'}
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditCandidate(c)}
                                      className="px-2.5 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-900 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                      title={language === 'de' ? 'Diesen Kandidaten bearbeiten' : 'Edit this candidate'}
                                    >
                                      <Pencil className="w-3.5 h-3.5 text-neutral-500" />
                                      <span className="hidden sm:inline">{language === 'de' ? 'Bearbeiten' : 'Edit'}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setCandidateToDelete(c.id)}
                                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                      title={language === 'de' ? 'Diesen Kandidaten löschen' : 'Delete this candidate'}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
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
                {d.submasters.securityKicker}
              </span>
              <h3 className="text-xl font-display font-bold text-neutral-900 mt-0.5">
                {d.submasters.title}
              </h3>
              <p className="text-xs text-neutral-600 mt-1 max-w-3xl">
                {d.submasters.desc}
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
                      {d.submasters.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={newSubMasterName}
                      onChange={(e) => {
                        setNewSubMasterName(e.target.value);
                        if (subMasterStatusMsg) setSubMasterStatusMsg(null);
                      }}
                      placeholder={d.submasters.namePlaceholder}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium"
                      required
                    />
                  </div>

                  {/* Assigned Class / Scope */}
                  <div>
                    <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      {d.submasters.scopeLabel}
                    </label>
                    <select
                      value={newSubMasterClass}
                      onChange={(e) => setNewSubMasterClass(e.target.value as ClassNumber | 'ALL')}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg font-medium text-neutral-800"
                    >
                      <option value="ALL">{d.submasters.scopeAll}</option>
                      <option value="Class 01">{d.candidates.classOption} 01</option>
                      <option value="Class 02">{d.candidates.classOption} 02</option>
                      <option value="Class 03">{d.candidates.classOption} 03</option>
                      <option value="Class 04">{d.candidates.classOption} 04</option>
                      <option value="Class 05">{d.candidates.classOption} 05</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sub-Master ID / Username */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700">
                        {d.submasters.idLabel}
                      </label>
                      <button
                        type="button"
                        onClick={suggestSubMasterId}
                        className="text-2xs text-red-600 hover:text-red-700 font-semibold"
                      >
                        {d.submasters.idSuggestion}
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
                        placeholder={language === 'de' ? 'z.B. sub_fischer_01' : 'e.g. sub_fischer_01'}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Sub-Master Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700">
                        {d.submasters.passwordLabel}
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomSubMasterPassword}
                        className="text-2xs text-amber-700 hover:text-amber-800 font-semibold"
                      >
                        {d.submasters.generatePassword}
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
                        placeholder={language === 'de' ? 'z.B. Fischer@Gipfel26' : 'e.g. Fischer@Gipfel26'}
                        className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                        title={showNewPassword ? d.submasters.hide : d.submasters.show}
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
                    <span>{d.submasters.btnSubmit}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Sub-Masters List */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  {d.submasters.listTitle} ({subMasters.length})
                </h4>
                <span className="text-2xs text-neutral-400">
                  {d.submasters.listPermissions}
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {subMasters.map((sm) => {
                  const isPwRevealed = !!revealedPasswords[sm.id || sm.username];
                  const passwordLabelText = language === 'de' ? 'Passwort' : 'Password';
                  const credsText = `ID: ${sm.username} | ${passwordLabelText}: ${sm.password || 'SubBerlin@2026'}`;

                  return (
                    <div
                      key={sm.id || sm.username}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-neutral-900">{sm.name}</span>
                          <span className="text-2xs font-mono px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded font-semibold">
                            {d.submasters.scopePrefix} {sm.assignedClass || 'ALL'}
                          </span>
                          <span className="text-2xs text-neutral-400">
                            {d.submasters.registeredDate} {sm.createdAt}
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
                            <span className="text-2xs text-neutral-500 font-mono uppercase font-bold">
                              {language === 'de' ? 'Passwort:' : 'Password:'}
                            </span>
                            <span className="font-mono font-semibold text-neutral-900">
                              {isPwRevealed ? sm.password || '••••••••' : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(sm.id || sm.username)}
                              className="text-neutral-400 hover:text-neutral-700 ml-1 p-0.5"
                              title={isPwRevealed ? d.submasters.hide : d.submasters.show}
                            >
                              {isPwRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Copy credentials button */}
                          <button
                            onClick={() => copyToClipboard(credsText)}
                            className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md text-neutral-700 font-mono text-2xs font-semibold inline-flex items-center gap-1 transition-colors"
                            title={language === 'de' ? 'ID und Passwort in die Zwischenablage kopieren' : 'Copy ID and password to clipboard'}
                          >
                            <Copy className="w-3 h-3 text-neutral-500" />
                            <span>{d.submasters.copyCreds}</span>
                          </button>

                          {copiedKey === credsText && (
                            <span className="text-2xs text-emerald-600 font-bold animate-fade-in">
                              {d.submasters.copied}
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
                          <span>{d.submasters.revokeAccess}</span>
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
                {d.settings.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {d.settings.desc}
              </p>
            </div>

            <div className="p-5 bg-neutral-900 text-white rounded-xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {d.settings.visibilityCardTitle}
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    gamesPublic
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {gamesPublic ? d.settings.liveBadge : d.settings.hiddenBadge}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                  {gamesPublic ? d.settings.descVisible : d.settings.descHidden}
                </p>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  toggleGamesPublic();
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  gamesPublic
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                {gamesPublic ? <EyeOff className="w-3.5 h-3.5 text-red-400" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{gamesPublic ? d.settings.btnHideNow : d.settings.btnShowNow}</span>
              </button>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  {d.settings.resetCardTitle}
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  {d.settings.resetCardDesc}
                </p>
              </div>

              <button
                onClick={() => {
                  if (confirm(d.settings.confirmReset)) {
                    resetTournamentData();
                  }
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{d.settings.btnReset}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
