import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Question,
  CountdownConfig,
  CompetitionRule,
  ExamSubmission,
} from '../types/competition';
import {
  INITIAL_QUESTIONS,
  INITIAL_RULES,
  INITIAL_COUNTDOWN,
  INITIAL_SUBMISSIONS,
} from '../data/initialData';

interface CompetitionContextType {
  questions: Question[];
  countdownConfig: CountdownConfig;
  rules: CompetitionRule[];
  submissions: ExamSubmission[];
  isQuizMasterLoggedIn: boolean;
  isExamUnlocked: boolean;
  timeRemainingSeconds: number;

  // Actions
  loginQuizMaster: (user: string, pass: string) => boolean;
  logoutQuizMaster: () => void;
  updateCountdownConfig: (partial: Partial<CountdownConfig>) => void;
  toggleManualExamUnlock: () => void;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, partial: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  addRule: (rule: Omit<CompetitionRule, 'id'>) => void;
  updateRule: (id: string, partial: Partial<CompetitionRule>) => void;
  deleteRule: (id: string) => void;
  submitExamAttempt: (
    data: Omit<ExamSubmission, 'id' | 'submittedAt'>
  ) => ExamSubmission;
  deleteSubmission: (id: string) => void;
  resetToDefaults: () => void;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

export const CompetitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Questions
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('gipfel_entry_questions_v2');
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  // 2. Countdown Config
  const [countdownConfig, setCountdownConfig] = useState<CountdownConfig>(() => {
    try {
      const saved = localStorage.getItem('gipfel_entry_countdown_v2');
      return saved ? JSON.parse(saved) : INITIAL_COUNTDOWN;
    } catch {
      return INITIAL_COUNTDOWN;
    }
  });

  // 3. Rules
  const [rules, setRules] = useState<CompetitionRule[]>(() => {
    try {
      const saved = localStorage.getItem('gipfel_entry_rules_v2');
      return saved ? JSON.parse(saved) : INITIAL_RULES;
    } catch {
      return INITIAL_RULES;
    }
  });

  // 4. Submissions
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('gipfel_entry_submissions_v2');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  // 5. Auth
  const [isQuizMasterLoggedIn, setIsQuizMasterLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('gipfel_qm_session') === 'true';
    } catch {
      return false;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gipfel_entry_questions_v2', JSON.stringify(questions));
    } catch (e) {
      console.warn('Failed to save questions', e);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem('gipfel_entry_countdown_v2', JSON.stringify(countdownConfig));
    } catch (e) {
      console.warn('Failed to save countdown', e);
    }
  }, [countdownConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('gipfel_entry_rules_v2', JSON.stringify(rules));
    } catch (e) {
      console.warn('Failed to save rules', e);
    }
  }, [rules]);

  useEffect(() => {
    try {
      localStorage.setItem('gipfel_entry_submissions_v2', JSON.stringify(submissions));
    } catch (e) {
      console.warn('Failed to save submissions', e);
    }
  }, [submissions]);

  // Live Timer countdown calculation
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);

  useEffect(() => {
    const calcRemaining = () => {
      const target = new Date(countdownConfig.targetDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((target - now) / 1000));
      setTimeRemainingSeconds(diff);
    };

    calcRemaining();
    const interval = setInterval(calcRemaining, 1000);
    return () => clearInterval(interval);
  }, [countdownConfig.targetDate]);

  const isExamUnlocked =
    countdownConfig.isManualUnlocked || timeRemainingSeconds <= 0;

  // Actions
  const loginQuizMaster = (user: string, pass: string): boolean => {
    // Official credentials
    if (
      (user === 'sharon360' && pass === 'Sharon@360Medicare') ||
      (user === 'quizmaster' && pass === 'Gipfel2026!')
    ) {
      setIsQuizMasterLoggedIn(true);
      sessionStorage.setItem('gipfel_qm_session', 'true');
      return true;
    }
    return false;
  };

  const logoutQuizMaster = () => {
    setIsQuizMasterLoggedIn(false);
    sessionStorage.removeItem('gipfel_qm_session');
  };

  const updateCountdownConfig = (partial: Partial<CountdownConfig>) => {
    setCountdownConfig((prev) => ({ ...prev, ...partial }));
  };

  const toggleManualExamUnlock = () => {
    setCountdownConfig((prev) => ({
      ...prev,
      isManualUnlocked: !prev.isManualUnlocked,
    }));
  };

  const addQuestion = (newQ: Omit<Question, 'id'>) => {
    const id = `q-custom-${Date.now()}`;
    setQuestions((prev) => [
      {
        ...newQ,
        id,
      },
      ...prev,
    ]);
  };

  const updateQuestion = (id: string, partial: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...partial } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const addRule = (newRule: Omit<CompetitionRule, 'id'>) => {
    const id = `rule-${Date.now()}`;
    setRules((prev) => [...prev, { ...newRule, id }]);
  };

  const updateRule = (id: string, partial: Partial<CompetitionRule>) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...partial } : r))
    );
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const submitExamAttempt = (
    data: Omit<ExamSubmission, 'id' | 'submittedAt'>
  ): ExamSubmission => {
    const newSubmission: ExamSubmission = {
      ...data,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setSubmissions((prev) => [newSubmission, ...prev]);
    return newSubmission;
  };

  const deleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const resetToDefaults = () => {
    setQuestions(INITIAL_QUESTIONS);
    setRules(INITIAL_RULES);
    setCountdownConfig(INITIAL_COUNTDOWN);
    setSubmissions(INITIAL_SUBMISSIONS);
  };

  return (
    <CompetitionContext.Provider
      value={{
        questions,
        countdownConfig,
        rules,
        submissions,
        isQuizMasterLoggedIn,
        isExamUnlocked,
        timeRemainingSeconds,
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
        submitExamAttempt,
        deleteSubmission,
        resetToDefaults,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};

export function useCompetition() {
  const ctx = useContext(CompetitionContext);
  if (!ctx) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return ctx;
}
