import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Award,
  Trophy,
  Shield,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCompetition } from '../context/CompetitionContext';
import { ClassDivision, Question } from '../types/competition';
import {
  playExamStartSound,
  playCelebrationFanfare,
  playTimerTick,
  playClickSound,
} from '../utils/sound';

interface OfficialExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewLeaderboard: () => void;
}

type ExamStep = 'register' | 'exam' | 'result';

export const OfficialExamModal: React.FC<OfficialExamModalProps> = ({
  isOpen,
  onClose,
  onViewLeaderboard,
}) => {
  const {
    questions,
    countdownConfig,
    isExamUnlocked,
    submitExamAttempt,
  } = useCompetition();

  // Filter official exam questions
  const examPool = useMemo(() => {
    const list = questions.filter((q) => q.isOfficialExam);
    return list.length > 0 ? list : questions;
  }, [questions]);

  // Exam Questions Subset (up to examQuestionCount)
  const examQuestions = useMemo(() => {
    return examPool.slice(0, countdownConfig.examQuestionCount);
  }, [examPool, countdownConfig.examQuestionCount]);

  // Modal Step
  const [step, setStep] = useState<ExamStep>('register');

  // Candidate Details Form
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateClass, setCandidateClass] = useState<ClassDivision>('Klasse 01');
  const [schoolOrCity, setSchoolOrCity] = useState('');
  const [agreedHonorCode, setAgreedHonorCode] = useState(false);
  const [formError, setFormError] = useState('');

  // Exam Runtime State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examSecondsRemaining, setExamSecondsRemaining] = useState<number>(
    countdownConfig.examDurationMinutes * 60
  );
  const [startTime, setStartTime] = useState<number>(0);
  const [isConfirmingSubmit, setIsConfirmingSubmit] = useState(false);

  // Result State
  const [finalScore, setFinalScore] = useState(0);
  const [finalPercentage, setFinalPercentage] = useState(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isQualified, setIsQualified] = useState(false);

  // Reset modal on open
  useEffect(() => {
    if (isOpen) {
      setStep('register');
      setFormError('');
      setSelectedAnswers({});
      setIsConfirmingSubmit(false);
    }
  }, [isOpen]);

  // Timer countdown hook during active exam
  useEffect(() => {
    if (step !== 'exam') return;

    const interval = setInterval(() => {
      setExamSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }

        if (prev <= 10 && prev > 1) {
          playTimerTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // Start Exam Handler
  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!candidateName.trim()) {
      setFormError('Bitte geben Sie Ihren vollständigen Namen ein.');
      return;
    }
    if (!candidateEmail.trim() || !candidateEmail.includes('@')) {
      setFormError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    if (!schoolOrCity.trim()) {
      setFormError('Bitte geben Sie Ihre Schule oder Stadt an.');
      return;
    }
    if (!agreedHonorCode) {
      setFormError('Bitte bestätigen Sie den Fairplay-Ehrenkodex.');
      return;
    }

    playExamStartSound();
    setStartTime(Date.now());
    setExamSecondsRemaining(countdownConfig.examDurationMinutes * 60);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setStep('exam');
  };

  // Select Option
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    playClickSound();
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Submit Exam calculation
  const finalizeSubmission = () => {
    const timeSpent = Math.max(
      1,
      Math.floor((Date.now() - startTime) / 1000)
    );
    setTimeSpentSeconds(timeSpent);

    let score = 0;
    examQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });

    const total = examQuestions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const qualified = percentage >= countdownConfig.qualifyingScorePercentage;

    setFinalScore(score);
    setFinalPercentage(percentage);
    setIsQualified(qualified);

    // Save submission to state and localStorage
    submitExamAttempt({
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim(),
      candidateClass,
      schoolOrCity: schoolOrCity.trim(),
      score,
      totalQuestions: total,
      percentage,
      timeSpentSeconds: timeSpent,
      isQualified: qualified,
      answers: selectedAnswers,
    });

    setStep('result');

    if (qualified) {
      playCelebrationFanfare();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleManualSubmit = () => {
    playClickSound();
    setIsConfirmingSubmit(false);
    finalizeSubmission();
  };

  const handleAutoSubmit = () => {
    finalizeSubmission();
  };

  if (!isOpen) return null;

  const currentQ: Question | undefined = examQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  const examMins = Math.floor(examSecondsRemaining / 60);
  const examSecs = examSecondsRemaining % 60;
  const isTimeUrgent = examSecondsRemaining < 120; // under 2 minutes

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} Min. ${s} Sek.`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
              ▲
            </div>
            <div>
              <h3 className="text-sm font-bold font-display uppercase tracking-wider">
                DER GIPFEL 2026 · Offizielle Qualifikationsprüfung
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                {step === 'register' && 'Schritt 1: Kandidaten-Erfassung'}
                {step === 'exam' &&
                  `Prüfung läuft · Frage ${currentQuestionIndex + 1} von ${examQuestions.length}`}
                {step === 'result' && 'Ergebnis & Qualifikationsstatus'}
              </p>
            </div>
          </div>

          {step !== 'exam' && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              title="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* Locked Notice (if opened before release) */}
          {!isExamUnlocked && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900 font-display">
                Die Prüfung ist noch nicht freigeschaltet
              </h4>
              <p className="text-sm text-neutral-600 max-w-md mx-auto mt-2 leading-relaxed">
                Der Spielleiter schaltet die offizielle Qualifikationsrunde pünktlich zum angekündigten Termin frei. Nutzen Sie in der Zwischenzeit die offene Übungsarena!
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Zurück zur Übungsarena
              </button>
            </div>
          )}

          {/* STEP 1: Registration Form */}
          {isExamUnlocked && step === 'register' && (
            <form onSubmit={handleStartExam} className="space-y-5">
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-700 leading-relaxed">
                  <strong>Offizielle Prüfungsbedingungen:</strong> Sie haben genau{' '}
                  <strong className="text-neutral-950 font-bold">
                    {countdownConfig.examDurationMinutes} Minuten
                  </strong>{' '}
                  Zeit für{' '}
                  <strong className="text-neutral-950 font-bold">
                    {examQuestions.length} Landeskunde-Fragen
                  </strong>
                  . Die Qualifikationsgrenze für den Einzug in die Gruppenphase (Stufe 02) liegt bei{' '}
                  <strong className="text-neutral-950 font-bold">
                    {countdownConfig.qualifyingScorePercentage}%
                  </strong>
                  .
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Vollständiger Name *
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="z.B. Lukas Weidemann"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Schulische E-Mail-Adresse *
                  </label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="lukas.w@schule.de"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Klassenstufe *
                  </label>
                  <select
                    value={candidateClass}
                    onChange={(e) => setCandidateClass(e.target.value as ClassDivision)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-medium text-neutral-900"
                  >
                    <option value="Klasse 01">Klasse 01 (Klassenstufe 8)</option>
                    <option value="Klasse 02">Klasse 02 (Klassenstufe 9)</option>
                    <option value="Klasse 03">Klasse 03 (Klassenstufe 10)</option>
                    <option value="Klasse 04">Klasse 04 (Klassenstufe 11)</option>
                    <option value="Klasse 05">Klasse 05 (Klassenstufe 12/Abitur)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Schule & Stadt *
                  </label>
                  <input
                    type="text"
                    value={schoolOrCity}
                    onChange={(e) => setSchoolOrCity(e.target.value)}
                    placeholder="z.B. Goethe-Gymnasium Berlin"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedHonorCode}
                    onChange={(e) => setAgreedHonorCode(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-neutral-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs text-neutral-600 leading-relaxed">
                    Ich bestätige die Richtigkeit meiner Angaben und versichere, die Prüfung ohne externe Hilfsmittel oder KI-Assistenten eigenständig abzulegen (Fairplay-Kodex).
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Prüfung Jetzt Starten</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Timed Examination */}
          {isExamUnlocked && step === 'exam' && currentQ && (
            <div className="space-y-6">
              {/* Header Strip with Live Timer & Progress */}
              <div className="flex items-center justify-between p-4 bg-neutral-900 text-white rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-mono text-neutral-300">
                    FRAGE {currentQuestionIndex + 1} / {examQuestions.length}
                  </span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-xs font-medium text-amber-400">
                    {currentQ.category}
                  </span>
                </div>

                {/* Exam Clock */}
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
                    isTimeUrgent
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-neutral-800 text-neutral-100'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>
                    {String(examMins).padStart(2, '0')}:
                    {String(examSecs).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <div className="py-2">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 font-display leading-snug">
                  {currentQ.questionText}
                </h3>
              </div>

              {/* 4 Answer Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  const letter = ['A', 'B', 'C', 'D'][idx];

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, idx)}
                      className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-red-600 bg-red-50/60 ring-2 ring-red-600/20 text-neutral-950 font-semibold shadow-xs'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-red-600 text-white'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {letter}
                      </div>
                      <span className="text-sm leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Question Navigation Drawer & Controls */}
              <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => {
                      playClickSound();
                      setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                    }}
                    className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 text-neutral-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Zurück</span>
                  </button>

                  <button
                    disabled={currentQuestionIndex >= examQuestions.length - 1}
                    onClick={() => {
                      playClickSound();
                      setCurrentQuestionIndex((prev) =>
                        Math.min(examQuestions.length - 1, prev + 1)
                      );
                    }}
                    className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 text-neutral-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Weiter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500 font-mono">
                    {answeredCount} von {examQuestions.length} beantwortet
                  </span>

                  <button
                    onClick={() => setIsConfirmingSubmit(true)}
                    className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                  >
                    Prüfung Abgeben
                  </button>
                </div>
              </div>

              {/* Confirm Submit Dialog */}
              {isConfirmingSubmit && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start justify-between gap-4 animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-950">
                      <strong>Prüfung jetzt verbindlich abschließen?</strong>
                      <p className="mt-0.5 text-amber-800">
                        Sie haben {answeredCount} von {examQuestions.length} Fragen beantwortet.
                        Nach der Abgabe kann die Prüfung nicht erneut bearbeitet werden.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsConfirmingSubmit(false)}
                      className="px-3 py-1.5 text-xs bg-white text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                    >
                      Weiterprüfen
                    </button>
                    <button
                      onClick={handleManualSubmit}
                      className="px-4 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs"
                    >
                      Jetzt Abgeben
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Result Summary & Qualification Certificate */}
          {isExamUnlocked && step === 'result' && (
            <div className="text-center py-4 space-y-6">
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                  isQualified
                    ? 'bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50'
                    : 'bg-amber-100 text-amber-600 ring-8 ring-amber-50'
                }`}
              >
                {isQualified ? <Trophy className="w-10 h-10" /> : <FileCheck className="w-10 h-10" />}
              </div>

              <div>
                <span className="text-2xs font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                  Offizielle Prüfungsauswertung
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-neutral-900 tracking-tight">
                  {isQualified
                    ? 'Herzlichen Glückwunsch zur Qualifikation!'
                    : 'Prüfung Abgeschlossen'}
                </h3>
                <p className="text-sm text-neutral-600 mt-2 max-w-md mx-auto leading-relaxed">
                  {isQualified
                    ? `Sie haben ${finalScore} von ${examQuestions.length} Punkten (${finalPercentage}%) erzielt und ziehen offiziell in die Gruppenphase (Stufe 02) ein.`
                    : `Sie haben ${finalScore} von ${examQuestions.length} Punkten (${finalPercentage}%) erzielt. Die Qualifikationsgrenze lag bei ${countdownConfig.qualifyingScorePercentage}%.`}
                </p>
              </div>

              {/* Certificate Snapshot Card */}
              <div className="max-w-md mx-auto p-5 bg-neutral-50 border border-neutral-200 rounded-2xl text-left space-y-3 font-mono text-xs">
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="text-neutral-500">Kandidat/in:</span>
                  <span className="font-bold text-neutral-900">{candidateName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="text-neutral-500">Klassenstufe:</span>
                  <span className="font-bold text-neutral-900">{candidateClass}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="text-neutral-500">Schule / Stadt:</span>
                  <span className="font-bold text-neutral-900">{schoolOrCity}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="text-neutral-500">Bearbeitungszeit:</span>
                  <span className="font-bold text-neutral-900">{formatSeconds(timeSpentSeconds)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-neutral-500">Status:</span>
                  <span
                    className={`font-bold ${
                      isQualified ? 'text-emerald-600' : 'text-neutral-700'
                    }`}
                  >
                    {isQualified ? 'QUALIFIZIERT FÜR STUFE 02' : 'TEILNAHME BESTÄTIGT'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    playClickSound();
                    onClose();
                    onViewLeaderboard();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Offizielle Bestenliste Ansehen</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Schließen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
