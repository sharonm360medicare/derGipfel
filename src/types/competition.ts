/**
 * DER GIPFEL 2026 - Competition Entry & Qualification Types
 */

export type QuestionCategory =
  | 'Geschichte'
  | 'Kultur & Kunst'
  | 'Essen & Trinken'
  | 'Geografie & Land';

export type QuestionDifficulty = 'Leicht' | 'Mittel' | 'Schwer';

export interface Question {
  id: string;
  category: QuestionCategory;
  questionText: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  difficulty: QuestionDifficulty;
  isOfficialExam: boolean; // True if eligible for official timed exam
  isPractice: boolean;     // True if eligible for practice arena
}

export interface CountdownConfig {
  targetDate: string; // ISO string e.g. 2026-11-15T10:00:00
  title: string;      // e.g., "Offizielle Qualifikationsrunde: Stufe 01"
  subtitle: string;   // e.g., "Bundesweiter Wettbewerbseintritt — Individuelle Online-Prüfung"
  isManualUnlocked: boolean; // Quiz Master instant unlock override
  examDurationMinutes: number; // e.g., 20
  examQuestionCount: number;   // e.g., 15
  qualifyingScorePercentage: number; // e.g., 70
}

export type RuleCategory = 'Ablauf' | 'Teilnahme' | 'Bewertung' | 'Fairplay';

export interface CompetitionRule {
  id: string;
  title: string;
  description: string;
  category: RuleCategory;
}

export type ClassDivision =
  | 'Klasse 01'
  | 'Klasse 02'
  | 'Klasse 03'
  | 'Klasse 04'
  | 'Klasse 05';

export interface ExamSubmission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidateClass: ClassDivision;
  schoolOrCity: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  submittedAt: string;
  isQualified: boolean;
  answers: Record<string, number>; // questionId -> selectedIndex
}

export interface QuizMasterUser {
  id: string;
  username: string;
  name: string;
  role: 'HEAD_MASTER';
}
