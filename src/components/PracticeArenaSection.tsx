import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Check,
  X,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
} from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext';
import { QuestionCategory } from '../types/competition';
import {
  playCorrectSound,
  playIncorrectSound,
  playClickSound,
} from '../utils/sound';

export const PracticeArenaSection: React.FC = () => {
  const { questions } = useCompetition();

  // Filter practice questions only
  const practicePool = useMemo(() => {
    const list = questions.filter((q) => q.isPractice);
    return list.length > 0 ? list : questions;
  }, [questions]);

  // Selected Category filter
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'ALL'>('ALL');

  const filteredPool = useMemo(() => {
    if (selectedCategory === 'ALL') return practicePool;
    return practicePool.filter((q) => q.category === selectedCategory);
  }, [practicePool, selectedCategory]);

  // Current Question Index
  const [currentIndex, setCurrentIndex] = useState(0);

  // User State
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Session Stats
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Safe question retrieval
  const currentQuestion = filteredPool[currentIndex % filteredPool.length] || practicePool[0];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered || !currentQuestion) return;

    setSelectedOptionIndex(idx);
    setHasAnswered(true);
    setTotalAnswered((prev) => prev + 1);

    const isCorrect = idx === currentQuestion.correctIndex;
    if (isCorrect) {
      playCorrectSound();
      setTotalCorrect((prev) => prev + 1);
      setCurrentStreak((prev) => prev + 1);
    } else {
      playIncorrectSound();
      setCurrentStreak(0);
    }
  };

  const handleNextQuestion = () => {
    playClickSound();
    setSelectedOptionIndex(null);
    setHasAnswered(false);
    setCurrentIndex((prev) => (prev + 1) % filteredPool.length);
  };

  const handleShuffle = () => {
    playClickSound();
    setSelectedOptionIndex(null);
    setHasAnswered(false);
    const randomIndex = Math.floor(Math.random() * filteredPool.length);
    setCurrentIndex(randomIndex);
  };

  const handleCategoryChange = (cat: QuestionCategory | 'ALL') => {
    playClickSound();
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setHasAnswered(false);
  };

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <section id="practice-arena" className="py-16 lg:py-24 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              <span>VORBEREITUNG & TRAINING</span>
              <span aria-hidden="true">·</span>
              <span>4 OPTIONEN</span>
              <span aria-hidden="true">·</span>
              <span>SOFORTIGE ERKLÄRUNGEN</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-neutral-900 tracking-tight">
              Die Offene Übungsarena
            </h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-2xl leading-relaxed">
              Trainieren Sie vor dem offiziellen Prüfungstermin mit originalgetreuen Fragen zur deutschen Geschichte, Kultur, Kulinarik und Geografie. Jede Frage enthält ausführliche Hintergrundnotizen.
            </p>
          </div>

          {/* Session Progress Stats Strip */}
          <div className="flex items-center gap-4 bg-white border border-neutral-200 rounded-xl p-3 px-5 shadow-xs shrink-0">
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                Beantwortet
              </span>
              <span className="font-mono tabular-nums text-lg font-bold text-neutral-900">
                {totalAnswered}
              </span>
            </div>
            <div className="w-px h-8 bg-neutral-200" />
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                Trefferquote
              </span>
              <span className="font-mono tabular-nums text-lg font-bold text-emerald-600">
                {accuracy}%
              </span>
            </div>
            <div className="w-px h-8 bg-neutral-200" />
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Serie</span>
              </span>
              <span className="font-mono tabular-nums text-lg font-bold text-amber-600">
                {currentStreak}
              </span>
            </div>
          </div>
        </div>

        {/* Category Filters (Clean functional buttons, non-pill style) */}
        <div className="flex items-center gap-2 py-6 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'ALL', label: 'Alle Gebiete' },
              { id: 'Geschichte', label: 'Geschichte' },
              { id: 'Kultur & Kunst', label: 'Kultur & Kunst' },
              { id: 'Essen & Trinken', label: 'Essen & Kulinarik' },
              { id: 'Geografie & Land', label: 'Geografie & Land' },
            ] as Array<{ id: QuestionCategory | 'ALL'; label: string }>
          ).map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Practice Question Stage */}
        {currentQuestion ? (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden max-w-4xl">
            {/* Question Card Top Bar */}
            <div className="px-6 py-4 bg-neutral-50/70 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-neutral-600 font-medium">
                <span className="font-bold text-neutral-900">
                  {currentQuestion.category}
                </span>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="text-neutral-500">
                  Schwierigkeit: <strong className="text-neutral-800">{currentQuestion.difficulty}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                <span>
                  Frage {(currentIndex % filteredPool.length) + 1} von {filteredPool.length}
                </span>
                <button
                  onClick={handleShuffle}
                  className="p-1.5 hover:bg-neutral-200/60 rounded-md transition-colors"
                  title="Zufällige Frage wählen"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Question Prompt */}
            <div className="p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug font-display">
                {currentQuestion.questionText}
              </h3>

              {/* 4 Interactive Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {currentQuestion.options.map((option, idx) => {
                  const letter = optionLetters[idx];
                  const isSelected = selectedOptionIndex === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let optionClasses =
                    'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/80 hover:border-neutral-300 text-neutral-800';

                  if (hasAnswered) {
                    if (isCorrect) {
                      optionClasses =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-500/20';
                    } else if (isSelected && !isCorrect) {
                      optionClasses =
                        'border-red-500 bg-red-50 text-red-950 ring-2 ring-red-500/20';
                    } else {
                      optionClasses =
                        'border-neutral-200 bg-neutral-50/40 text-neutral-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3 group relative ${optionClasses}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                          hasAnswered && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : hasAnswered && isSelected && !isCorrect
                            ? 'bg-red-600 text-white'
                            : 'bg-white border border-neutral-300 text-neutral-700 group-hover:border-neutral-400'
                        }`}
                      >
                        {hasAnswered && isCorrect ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : hasAnswered && isSelected && !isCorrect ? (
                          <X className="w-3.5 h-3.5" />
                        ) : (
                          letter
                        )}
                      </div>

                      <span className="text-sm leading-relaxed flex-1">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card (Reveals instantly on answer) */}
              {hasAnswered && (
                <div
                  className={`mt-6 p-5 rounded-xl border transition-all animate-fadeIn ${
                    selectedOptionIndex === currentQuestion.correctIndex
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 font-bold text-xs">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>
                      {selectedOptionIndex === currentQuestion.correctIndex
                        ? 'Hervorragend gelöst!'
                        : 'Wissens-Notiz zum Nachlesen:'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Next Question Control */}
              {hasAnswered && (
                <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <span>Nächste Übungsfrage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl border border-neutral-200 text-center">
            <p className="text-sm text-neutral-500">
              Keine Fragen für diese Kategorie gefunden.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
