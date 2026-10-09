import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  X,
  FileText,
  Download,
  RotateCcw,
  BookOpen,
  Trophy,
  AlertCircle,
} from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext';
import {
  Question,
  QuestionCategory,
  QuestionDifficulty,
  CompetitionRule,
  RuleCategory,
} from '../types/competition';
import { playClickSound } from '../utils/sound';

interface QuizMasterControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'timer' | 'questions' | 'rules' | 'submissions';

export const QuizMasterControlCenter: React.FC<QuizMasterControlCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    questions,
    countdownConfig,
    rules,
    submissions,
    isQuizMasterLoggedIn,
    loginQuizMaster,
    logoutQuizMaster,
    updateCountdownConfig,
    toggleManualExamUnlock,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addRule,
    updateRule,
    deleteRule,
    deleteSubmission,
    resetToDefaults,
  } = useCompetition();

  // Login form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('timer');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Timer Settings Form State ---
  const [timerTargetDate, setTimerTargetDate] = useState(() => {
    // Format ISO string to datetime-local format: YYYY-MM-DDTHH:mm
    try {
      const d = new Date(countdownConfig.targetDate);
      return d.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  });
  const [timerTitle, setTimerTitle] = useState(countdownConfig.title);
  const [timerSubtitle, setTimerSubtitle] = useState(countdownConfig.subtitle);
  const [examDuration, setExamDuration] = useState(countdownConfig.examDurationMinutes);
  const [examQuestionCount, setExamQuestionCount] = useState(countdownConfig.examQuestionCount);
  const [qualifyingScore, setQualifyingScore] = useState(countdownConfig.qualifyingScorePercentage);

  const handleSaveTimerSettings = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    updateCountdownConfig({
      targetDate: new Date(timerTargetDate).toISOString(),
      title: timerTitle.trim(),
      subtitle: timerSubtitle.trim(),
      examDurationMinutes: Number(examDuration),
      examQuestionCount: Number(examQuestionCount),
      qualifyingScorePercentage: Number(qualifyingScore),
    });

    showToast('Zeitplan und Countdown-Titel erfolgreich gespeichert!');
  };

  // --- Question Form State ---
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qText, setQText] = useState('');
  const [qCategory, setQCategory] = useState<QuestionCategory>('Geschichte');
  const [qDifficulty, setQDifficulty] = useState<QuestionDifficulty>('Mittel');
  const [qOption0, setQOption0] = useState('');
  const [qOption1, setQOption1] = useState('');
  const [qOption2, setQOption2] = useState('');
  const [qOption3, setQOption3] = useState('');
  const [qCorrectIndex, setQCorrectIndex] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qIsExam, setQIsExam] = useState(true);
  const [qIsPractice, setQIsPractice] = useState(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<QuestionCategory | 'ALL'>('ALL');

  const handleOpenAddQuestion = () => {
    playClickSound();
    setEditingQuestionId(null);
    setQText('');
    setQCategory('Geschichte');
    setQDifficulty('Mittel');
    setQOption0('');
    setQOption1('');
    setQOption2('');
    setQOption3('');
    setQCorrectIndex(0);
    setQExplanation('');
    setQIsExam(true);
    setQIsPractice(true);
    setIsQuestionFormOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    playClickSound();
    setEditingQuestionId(q.id);
    setQText(q.questionText);
    setQCategory(q.category);
    setQDifficulty(q.difficulty);
    setQOption0(q.options[0]);
    setQOption1(q.options[1]);
    setQOption2(q.options[2]);
    setQOption3(q.options[3]);
    setQCorrectIndex(q.correctIndex);
    setQExplanation(q.explanation);
    setQIsExam(q.isOfficialExam);
    setQIsPractice(q.isPractice);
    setIsQuestionFormOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !qOption0.trim() || !qOption1.trim() || !qOption2.trim() || !qOption3.trim()) {
      alert('Bitte füllen Sie den Fragetext und alle 4 Optionen aus.');
      return;
    }

    const payload = {
      category: qCategory,
      difficulty: qDifficulty,
      questionText: qText.trim(),
      options: [qOption0.trim(), qOption1.trim(), qOption2.trim(), qOption3.trim()] as [string, string, string, string],
      correctIndex: Number(qCorrectIndex),
      explanation: qExplanation.trim(),
      isOfficialExam: qIsExam,
      isPractice: qIsPractice,
    };

    if (editingQuestionId) {
      updateQuestion(editingQuestionId, payload);
      showToast('Frage erfolgreich aktualisiert!');
    } else {
      addQuestion(payload);
      showToast('Neue Frage erfolgreich zum Fragenpool hinzugefügt!');
    }

    setIsQuestionFormOpen(false);
  };

  // --- Rule Form State ---
  const [isRuleFormOpen, setIsRuleFormOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  const [ruleCategory, setRuleCategory] = useState<RuleCategory>('Ablauf');

  const handleOpenAddRule = () => {
    playClickSound();
    setEditingRuleId(null);
    setRuleTitle('');
    setRuleDesc('');
    setRuleCategory('Ablauf');
    setIsRuleFormOpen(true);
  };

  const handleOpenEditRule = (r: CompetitionRule) => {
    playClickSound();
    setEditingRuleId(r.id);
    setRuleTitle(r.title);
    setRuleDesc(r.description);
    setRuleCategory(r.category);
    setIsRuleFormOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleTitle.trim() || !ruleDesc.trim()) {
      alert('Bitte Titel und Beschreibung der Regel ausfüllen.');
      return;
    }

    if (editingRuleId) {
      updateRule(editingRuleId, {
        title: ruleTitle.trim(),
        description: ruleDesc.trim(),
        category: ruleCategory,
      });
      showToast('Regel erfolgreich aktualisiert!');
    } else {
      addRule({
        title: ruleTitle.trim(),
        description: ruleDesc.trim(),
        category: ruleCategory,
      });
      showToast('Neue Regel erfolgreich hinzugefügt!');
    }

    setIsRuleFormOpen(false);
  };

  // --- CSV Export ---
  const handleExportCSV = () => {
    playClickSound();
    const headers = [
      'ID',
      'Name',
      'Email',
      'Klasse',
      'Schule_Ort',
      'Punkte',
      'Gesamtfragen',
      'Prozent',
      'Zeit_Sekunden',
      'Qualifiziert',
      'Abgabezeit',
    ];

    const rows = submissions.map((s) => [
      s.id,
      `"${s.candidateName}"`,
      `"${s.candidateEmail}"`,
      `"${s.candidateClass}"`,
      `"${s.schoolOrCity}"`,
      s.score,
      s.totalQuestions,
      `${s.percentage}%`,
      s.timeSpentSeconds,
      s.isQualified ? 'Ja' : 'Nein',
      `"${s.submittedAt}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DER_GIPFEL_Ergebnisse_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ergebnisse erfolgreich als CSV exportiert!');
  };

  // Login submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginQuizMaster(usernameInput.trim(), passwordInput.trim());
    if (!success) {
      setLoginError('Ungültige Anmeldedaten. Standard: sharon360 / Sharon@360Medicare');
    } else {
      setUsernameInput('');
      setPasswordInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display uppercase tracking-wider">
                Quizmeister-Leitzentrale · DER GIPFEL 2026
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                {isQuizMasterLoggedIn
                  ? 'Angemeldet als Oberster Spielleiter'
                  : 'Sicherheits-Authentifizierung erforderlich'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isQuizMasterLoggedIn && (
              <button
                onClick={() => {
                  playClickSound();
                  logoutQuizMaster();
                }}
                className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors font-medium"
              >
                Abmelden
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-6 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
          {!isQuizMasterLoggedIn ? (
            <div className="max-w-md mx-auto py-6">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Lock className="w-7 h-7 text-red-600" />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 font-display">
                  Spielleiter-Zugang
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Zugang zur Prüfungssteuerung, Fragen-Erstellung und Bestenliste.
                </p>
              </div>

              {loginError && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Benutzerkennung / ID
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="sharon360"
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Passwort
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
                  >
                    Anmelden & Leitzentrale Öffnen
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setUsernameInput('sharon360');
                      setPasswordInput('Sharon@360Medicare');
                    }}
                    className="text-2xs text-neutral-500 hover:text-neutral-900 underline"
                  >
                    Standard-Zugangsdaten einfügen (Demo)
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED DASHBOARD */
            <div className="space-y-6">
              {/* Quick Override Banner: INSTANT UNLOCK / LOCK */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {countdownConfig.isManualUnlocked ? (
                      <Unlock className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                      Aktueller Prüfungsstatus
                    </span>
                  </div>
                  <h4 className="text-lg font-bold font-display">
                    {countdownConfig.isManualUnlocked
                      ? 'Prüfung ist manuell für alle Teilnehmenden FREIGESCHALTET'
                      : 'Prüfung ist GESPERRT (folgt dem Zeitplan-Countdown)'}
                  </h4>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    toggleManualExamUnlock();
                    showToast(
                      countdownConfig.isManualUnlocked
                        ? 'Prüfung wurde wieder GESPERRT.'
                        : 'Prüfung wurde SOFORT FREIGESCHALTET!'
                    );
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shrink-0 ${
                    countdownConfig.isManualUnlocked
                      ? 'bg-amber-500 hover:bg-amber-600 text-neutral-950'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {countdownConfig.isManualUnlocked
                    ? 'Prüfung Jetzt Sperren'
                    : 'Prüfung Sofort Freischalten'}
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => {
                    playClickSound();
                    setActiveTab('timer');
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'timer'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>1. Timer & Zeitplan</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setActiveTab('questions');
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'questions'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>2. Fragen-Verwaltung ({questions.length})</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setActiveTab('rules');
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'rules'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>3. Regeln bearbeiten ({rules.length})</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setActiveTab('submissions');
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'submissions'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>4. Abgaben & Export ({submissions.length})</span>
                </button>
              </div>

              {/* TAB 1: TIMER & SCHEDULER */}
              {activeTab === 'timer' && (
                <form onSubmit={handleSaveTimerSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Countdown-Zielzeit (Datum & Uhrzeit) *
                      </label>
                      <input
                        type="datetime-local"
                        value={timerTargetDate}
                        onChange={(e) => setTimerTargetDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono font-medium"
                        required
                      />
                      <span className="text-[11px] text-neutral-500 mt-1 block">
                        Zu diesem Zeitpunkt öffnet sich die Prüfung für alle Teilnehmenden automatisch.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Titel des Countdowns (Hero Überschrift) *
                      </label>
                      <input
                        type="text"
                        value={timerTitle}
                        onChange={(e) => setTimerTitle(e.target.value)}
                        placeholder="z.B. Offizielle Qualifikationsrunde: Stufe 01"
                        className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Untertitel / Beschreibung *
                    </label>
                    <textarea
                      rows={2}
                      value={timerSubtitle}
                      onChange={(e) => setTimerSubtitle(e.target.value)}
                      placeholder="Beschreibungstext auf der Startseite"
                      className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 leading-relaxed"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Prüfungsdauer (Minuten)
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={120}
                        value={examDuration}
                        onChange={(e) => setExamDuration(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-xl font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Fragenanzahl pro Prüfung
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={50}
                        value={examQuestionCount}
                        onChange={(e) => setExamQuestionCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-xl font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Qualifikationsgrenze (%)
                      </label>
                      <input
                        type="number"
                        min={40}
                        max={100}
                        value={qualifyingScore}
                        onChange={(e) => setQualifyingScore(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-xl font-mono font-bold text-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Möchten Sie alle Einstellungen und Fragen auf die Werkseinstellungen zurücksetzen?')) {
                          resetToDefaults();
                          showToast('Alle Daten wurden auf den Anfangszustand zurückgesetzt.');
                        }
                      }}
                      className="px-4 py-2 text-xs text-neutral-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Auf Werkseinstellungen zurücksetzen</span>
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Einstellungen Speichern</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: QUESTIONS MANAGER */}
              {activeTab === 'questions' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {(
                        ['ALL', 'Geschichte', 'Kultur & Kunst', 'Essen & Trinken', 'Geografie & Land'] as Array<QuestionCategory | 'ALL'>
                      ).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategoryFilter(cat)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                            selectedCategoryFilter === cat
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          {cat === 'ALL' ? 'Alle Gebiete' : cat}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleOpenAddQuestion}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Neue Frage Hinzufügen</span>
                    </button>
                  </div>

                  {/* Question Add/Edit Modal */}
                  {isQuestionFormOpen && (
                    <div className="p-5 bg-neutral-50 border border-neutral-300 rounded-2xl shadow-sm animate-fadeIn space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                        <h4 className="text-sm font-bold font-display uppercase tracking-wider text-neutral-900">
                          {editingQuestionId ? 'Frage Bearbeiten' : 'Neue Wettbewerbsfrage Erstellen'}
                        </h4>
                        <button
                          onClick={() => setIsQuestionFormOpen(false)}
                          className="p-1 text-neutral-400 hover:text-neutral-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveQuestion} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                            Fragetext *
                          </label>
                          <textarea
                            rows={2}
                            value={qText}
                            onChange={(e) => setQText(e.target.value)}
                            placeholder="z.B. In welchem Jahr wurde das Grundgesetz verkündet?"
                            className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                              Wissensgebiet
                            </label>
                            <select
                              value={qCategory}
                              onChange={(e) => setQCategory(e.target.value as QuestionCategory)}
                              className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl"
                            >
                              <option value="Geschichte">Geschichte</option>
                              <option value="Kultur & Kunst">Kultur & Kunst</option>
                              <option value="Essen & Trinken">Essen & Trinken</option>
                              <option value="Geografie & Land">Geografie & Land</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                              Schwierigkeitsgrad
                            </label>
                            <select
                              value={qDifficulty}
                              onChange={(e) => setQDifficulty(e.target.value as QuestionDifficulty)}
                              className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl"
                            >
                              <option value="Leicht">Leicht</option>
                              <option value="Mittel">Mittel</option>
                              <option value="Schwer">Schwer</option>
                            </select>
                          </div>
                        </div>

                        {/* 4 Options */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                            4 Antwortoptionen (Wählen Sie die richtige Option per Radio-Button) *
                          </label>

                          {[
                            { val: qOption0, setVal: setQOption0, idx: 0, letter: 'A' },
                            { val: qOption1, setVal: setQOption1, idx: 1, letter: 'B' },
                            { val: qOption2, setVal: setQOption2, idx: 2, letter: 'C' },
                            { val: qOption3, setVal: setQOption3, idx: 3, letter: 'D' },
                          ].map((opt) => (
                            <div key={opt.idx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="correctOption"
                                checked={qCorrectIndex === opt.idx}
                                onChange={() => setQCorrectIndex(opt.idx)}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                title="Als richtige Antwort markieren"
                              />
                              <span className="w-6 text-xs font-mono font-bold text-neutral-500">
                                {opt.letter}:
                              </span>
                              <input
                                type="text"
                                value={opt.val}
                                onChange={(e) => opt.setVal(e.target.value)}
                                placeholder={`Option ${opt.letter}`}
                                className={`flex-1 px-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none ${
                                  qCorrectIndex === opt.idx
                                    ? 'border-emerald-500 ring-1 ring-emerald-500 font-semibold'
                                    : 'border-neutral-300'
                                }`}
                                required
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                            Wissenserklärung / Hintergrund-Notiz
                          </label>
                          <textarea
                            rows={2}
                            value={qExplanation}
                            onChange={(e) => setQExplanation(e.target.value)}
                            placeholder="Erklärung für Teilnehmende in der Übungsarena"
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl"
                          />
                        </div>

                        <div className="flex items-center gap-6 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={qIsExam}
                              onChange={(e) => setQIsExam(e.target.checked)}
                              className="rounded border-neutral-300 text-red-600"
                            />
                            <span>In offizieller Prüfung verwenden</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={qIsPractice}
                              onChange={(e) => setQIsPractice(e.target.checked)}
                              className="rounded border-neutral-300 text-red-600"
                            />
                            <span>In Übungsarena freigeben</span>
                          </label>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsQuestionFormOpen(false)}
                            className="px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-200 rounded-lg"
                          >
                            Abbrechen
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-lg"
                          >
                            Frage Speichern
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Questions List */}
                  <div className="space-y-3">
                    {questions
                      .filter((q) =>
                        selectedCategoryFilter === 'ALL'
                          ? true
                          : q.category === selectedCategoryFilter
                      )
                      .map((q, idx) => (
                        <div
                          key={q.id}
                          className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-300 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-2xs font-mono text-neutral-500 mb-1">
                              <span className="font-bold text-neutral-900">{q.category}</span>
                              <span>·</span>
                              <span>{q.difficulty}</span>
                              <span>·</span>
                              <span className="text-emerald-700 font-semibold">
                                Richtige Antwort: Option {['A', 'B', 'C', 'D'][q.correctIndex]}
                              </span>
                            </div>
                            <h5 className="text-sm font-bold text-neutral-900 font-display">
                              {q.questionText}
                            </h5>
                            <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                              {q.options.join(' | ')}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleOpenEditQuestion(q)}
                              className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-lg transition-colors"
                              title="Bearbeiten"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Frage wirklich löschen?')) {
                                  deleteQuestion(q.id);
                                  showToast('Frage gelöscht.');
                                }
                              }}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Löschen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 3: RULES MANAGER */}
              {activeTab === 'rules' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                    <p className="text-xs text-neutral-600">
                      Verwalten Sie die offiziellen Regeln und Wettbewerbsbestimmungen. Änderungen erscheinen sofort auf der Website.
                    </p>
                    <button
                      onClick={handleOpenAddRule}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Neue Regel Hinzufügen</span>
                    </button>
                  </div>

                  {/* Add/Edit Rule Form */}
                  {isRuleFormOpen && (
                    <div className="p-5 bg-neutral-50 border border-neutral-300 rounded-2xl shadow-sm space-y-4 animate-fadeIn">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                        {editingRuleId ? 'Regel Bearbeiten' : 'Neue Wettbewerbsregel'}
                      </h4>

                      <form onSubmit={handleSaveRule} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                              Titel der Regel *
                            </label>
                            <input
                              type="text"
                              value={ruleTitle}
                              onChange={(e) => setRuleTitle(e.target.value)}
                              placeholder="z.B. Zeitlimit & Ablauf"
                              className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-xl"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                              Kategorie
                            </label>
                            <select
                              value={ruleCategory}
                              onChange={(e) => setRuleCategory(e.target.value as RuleCategory)}
                              className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl"
                            >
                              <option value="Ablauf">Ablauf</option>
                              <option value="Teilnahme">Teilnahme</option>
                              <option value="Bewertung">Bewertung</option>
                              <option value="Fairplay">Fairplay</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                            Beschreibung / Wortlaut *
                          </label>
                          <textarea
                            rows={3}
                            value={ruleDesc}
                            onChange={(e) => setRuleDesc(e.target.value)}
                            placeholder="Genaue Erläuterung der Regel..."
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl leading-relaxed"
                            required
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsRuleFormOpen(false)}
                            className="px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-200 rounded-lg"
                          >
                            Abbrechen
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-neutral-900 text-white text-xs font-bold uppercase rounded-lg"
                          >
                            Regel Speichern
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Rules List */}
                  <div className="space-y-3">
                    {rules.map((rule) => (
                      <div
                        key={rule.id}
                        className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start justify-between gap-4"
                      >
                        <div className="flex-1">
                          <span className="text-2xs font-mono font-bold uppercase text-neutral-500 block mb-1">
                            {rule.category}
                          </span>
                          <h5 className="text-sm font-bold text-neutral-900 font-display">
                            {rule.title}
                          </h5>
                          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                            {rule.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenEditRule(rule)}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Regel wirklich löschen?')) {
                                deleteRule(rule.id);
                                showToast('Regel gelöscht.');
                              }
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SUBMISSIONS & EXPORT */}
              {activeTab === 'submissions' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 font-display">
                        Eingereichte Qualifikationsprüfungen ({submissions.length})
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Übersicht aller studentischen Prüfungsversuche und Punktzahlen.
                      </p>
                    </div>

                    <button
                      onClick={handleExportCSV}
                      disabled={submissions.length === 0}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Als CSV Herunterladen</span>
                    </button>
                  </div>

                  <div className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-200 bg-neutral-100/80 text-[11px] font-mono font-bold uppercase text-neutral-600">
                            <th className="py-2.5 px-3">Name</th>
                            <th className="py-2.5 px-3">Klasse</th>
                            <th className="py-2.5 px-3">Schule / Ort</th>
                            <th className="py-2.5 px-3 text-center">Punkte</th>
                            <th className="py-2.5 px-3 text-center">Quote</th>
                            <th className="py-2.5 px-3 text-center">Status</th>
                            <th className="py-2.5 px-3 text-right">Aktion</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {submissions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-white transition-colors">
                              <td className="py-2.5 px-3 font-bold text-neutral-900">
                                {sub.candidateName}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-neutral-600">
                                {sub.candidateClass}
                              </td>
                              <td className="py-2.5 px-3 text-neutral-600 truncate max-w-xs">
                                {sub.schoolOrCity}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-neutral-900">
                                {sub.score} / {sub.totalQuestions}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono font-bold">
                                {sub.percentage}%
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                {sub.isQualified ? (
                                  <span className="text-[11px] font-bold text-emerald-700">
                                    Qualifiziert
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-neutral-500">
                                    Teilgenommen
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => {
                                    if (confirm(`Eintrag für ${sub.candidateName} löschen?`)) {
                                      deleteSubmission(sub.id);
                                      showToast('Eintrag gelöscht.');
                                    }
                                  }}
                                  className="text-neutral-400 hover:text-red-600 p-1 rounded"
                                  title="Löschen"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
