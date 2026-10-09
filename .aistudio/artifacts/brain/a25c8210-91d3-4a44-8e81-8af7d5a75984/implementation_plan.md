# DER GIPFEL 2026 — Competition Entry & Qualification Portal

A specialized competition entry and practice platform for **DER GIPFEL 2026** (Nationaler Deutsch-Wettbewerb). The application serves as the primary gateway for students across Germany to practice with four-option German trivia (history, culture, food, geography) and sit for the official individual entry exam when released by the Quiz Master on a scheduled date and time.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following specifications were confirmed during the interactive interview:
> - **Entry Exam Format**: Timed quiz with individual score submission, candidate details (name, class, school/city), and an official entry leaderboard.
> - **Practice Space**: Unlimited interactive practice drills with instant feedback, explanations, and randomized four-option questions covering German culture, history, cuisine, and geography.
> - **Quiz Master Tools**: Visual question creator with category filters, a preloaded bank of authentic German trivia questions, real-time timer/title scheduler, and a live rules editor.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Public Practice Arena**: Open to all students anytime to practice 4-option German culture, history, food, and geography questions with immediate answer validation and cultural explanations.
  2. **Official Entry Countdown & Locked Exam Portal**: Features an editorial countdown timer controlled by the Quiz Master. The official individual qualification exam unlocks automatically at the scheduled date/time or when manually released by the Quiz Master.
  3. **Official Qualification Exam (Stufe 01)**: Timed individual exam with question randomized order, progress tracking, auto-submit on timer expiry, and verifiable score submission.
  4. **Live Qualification Leaderboard**: Displays top qualifying candidates, completion times, and status (Qualifiziert für Stufe 02 / Ausstehend).
  5. **Dynamic Competition Rules & Guidelines**: Clearly outlines stages, scoring rubrics, anti-cheating policies, and timeline—fully editable by the Quiz Master.
  6. **Secure Quiz Master Command Deck**: Password-protected workspace (`sharon360` / `Sharon@360Medicare`) allowing the Quiz Master to:
     - Set the countdown timer date/time, status, and custom banner title.
     - Add, edit, or delete official competition questions and practice questions.
     - Select from a rich pre-seeded bank of authentic German trivia questions.
     - Edit rules, stages, and eligibility criteria on the fly.
     - Review all student submissions and export results.

- **Target Audience**: Students preparing to qualify for the national German competition, teachers, and competition administrators.
- **Key Value**: Provides fair, scheduled access to competition entry while giving students a rich training ground to study German trivia beforehand.

---

## 2. User Experience & Visual Design

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TOP NAVIGATION BAR                              │
│ [DER GIPFEL 2026] ── [Übungsarena · Qualifikation · Regeln · Rangliste] ── [Quizmeister] │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
      ┌────────────────────────────┴───────────────────────────┐
      │                                                        │
┌─────▼──────────────────────────────┐   ┌─────────────────────▼──────────────────────┐
│       HERO & LIVE COUNTDOWN        │   │          OFFICIAL COMPETITION RULES        │
│ • Custom Title ("Qualifikation")   │   │ • 4 Stufen des Wettbewerbs                 │
│ • Live Days : Hours : Mins : Secs  │   │ • Prüfungsregeln & Punkteverteilung        │
│ • "Jetzt Üben" vs "Prüfung Starten"│   │ • Bearbeitbar durch Quizmeister            │
└─────┬──────────────────────────────┘   └────────────────────────────────────────────┘
      │
      ├────────────────────────────────────────────────────────┐
      │                                                        │
┌─────▼──────────────────────────────┐   ┌─────────────────────▼──────────────────────┐
│     INTERACTIVE PRACTICE ARENA     │   │      OFFICIAL QUALIFICATION EXAM           │
│ • Kategorie: Geschichte, Kultur... │   │ (Gesperrt bis Freigabe / Timer-Ablauf)     │
│ • 4 Optionen mit Sofort-Feedback   │   │ • 20 Min. Zeitlimit & Fortschrittsanzeige  │
│ • Kultur-Erklärungen & Lernnotizen │   │ • Name, Klasse & Schule Erfassung          │
│ • Endlose Sessions & Punktezähler  │   │ • Automatische Abgabe & Urkunde            │
└────────────────────────────────────┘   └─────────────────────┬──────────────────────┘
                                                               │
                                         ┌─────────────────────▼──────────────────────┐
                                         │       QUALIFICATION LEADERBOARD            │
                                         │ • Top-Kandidaten nach Punkten & Zeit       │
                                         │ • Qualifikationsstatus (Stufe 02 Einzug)   │
                                         └────────────────────────────────────────────┘
```

- **Visual Identity & Theme**:
  - **Aesthetic**: Modern German Swiss/editorial typography with warm parchment stone canvas (`#FBFBFA`), deep obsidian contrast (`#121214`), and warm Bavarian/Federal red & gold accents (`#DC2626` / `#D97706`).
  - **Typography**: `Plus Jakarta Sans` for clean, modern titles and body text; `Syne` for bold editorial display accents; tabular numerals (`tabular-nums`) for timers and scoreboards.
  - **Anti-Slop Discipline**: No arbitrary pill badges, no pulsing fake telemetry dots, clean editorial typography, and full 1440px desktop layout integrity with mobile responsive scaling.
  - **Single Elevation Depth**: Hairline borders (`border-neutral-200`) and soft ambient shadows (`shadow-xs`).

---

## 3. Key Product Decisions & Trade-Offs

- **Client-Side Persistence via `localStorage`**:
  - *Decision*: Maintain all exam questions, schedules, competition rules, practice scores, and candidate submissions in `localStorage` with initial JSON seeding.
  - *Why*: Eliminates backend server requirements, making the app 100% compatible with GitHub Pages static hosting (`https://sharonm360medicare.github.io/derGipfel/`) and zero-latency offline execution.
- **Two Distinct Modes for Questions (Practice vs. Official Exam)**:
  - *Decision*: Practice mode provides instant answer reveals, cultural context notes, and unlimited retries. Official Exam mode records candidate identity, runs a single countdown clock, and calculates final qualifying rank.
  - *Why*: Ensures students can genuinely learn from practice sessions without compromising the integrity of the official qualification round.
- **Dynamic Quiz Master Override**:
  - *Decision*: The Quiz Master can change the countdown target date/time, alter the countdown title, or click "Sofort freigeben" (Instant Unlock) to open the exam ahead of schedule if needed for live testing or synchronized events.

---

## 4. Technical Architecture & State Model

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPETITION STORE (Context)                     │
│  • countdownConfig: { targetDate, title, isManualUnlocked }            │
│  • officialQuestions: Question[] (editable in Quiz Master Space)       │
│  • practiceQuestions: Question[] (preloaded + custom)                  │
│  • competitionRules: RuleItem[] (editable in Quiz Master Space)        │
│  • examSubmissions: Submission[] (candidate score, timestamp, class)   │
│  • quizMasterAuth: { isAuthenticated: boolean }                        │
└──────────────────┬─────────────────────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
┌────────▼─────────┐ ┌───────▼────────────────┐
│   PUBLIC VIEWS   │ │  QUIZ MASTER SPACE     │
│ • CountdownHero  │ │ • Timer & Status Admin │
│ • PracticeArena  │ │ • Question Manager     │
│ • LiveExamModal  │ │ • Rules Editor         │
│ • RulesSection   │ │ • Submissions Table    │
│ • Leaderboard    │ │ • Export & Reset Tools │
└──────────────────┘ └────────────────────────┘
```

### Core Entities:

```typescript
export interface Question {
  id: string;
  category: 'Geschichte' | 'Kultur & Kunst' | 'Essen & Trinken' | 'Geografie & Land';
  questionText: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  difficulty: 'Leicht' | 'Mittel' | 'Schwer';
}

export interface CountdownConfig {
  targetDate: string; // ISO string
  title: string;      // e.g., "Offizielle Qualifikationsrunde 01"
  subtitle: string;   // e.g., "Bundesweiter Wettbewerbseintritt öffnet am..."
  isManualUnlocked: boolean;
  examDurationMinutes: number; // e.g., 20
}

export interface CompetitionRule {
  id: string;
  title: string;
  description: string;
  category: 'Teilnahme' | 'Ablauf' | 'Bewertung' | 'Fairplay';
}

export interface ExamSubmission {
  id: string;
  candidateName: string;
  candidateClass: string;
  schoolOrCity: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  submittedAt: string;
  isQualified: boolean;
}
```

---

## 5. Execution Steps

1. **State Store (`src/context/CompetitionContext.tsx`)**:
   - Initialize preloaded trivia bank with 30+ authentic German questions across all 4 categories.
   - Configure editable timer settings, rules list, and submissions store with `localStorage` sync.
2. **Public Views**:
   - `HeroCountdownSection.tsx`: Editorial hero with live countdown timer, dynamic title, and status badges (Locked / Live Open).
   - `PracticeArenaSection.tsx`: Interactive practice test with category filtering, instant feedback, explanation popouts, and score stats.
   - `OfficialExamModal.tsx`: Timed qualification test with candidate registration form, randomized exam questions, progress bar, and instant certificate/submission summary.
   - `RulesSection.tsx`: Render editable competition guidelines and game format.
   - `LeaderboardSection.tsx`: Display top qualifying candidates with filter by class and score.
3. **Quiz Master Control Center (`src/components/QuizMasterControlCenter.tsx`)**:
   - Secure PIN/password login (`sharon360` / `Sharon@360Medicare`).
   - Tab 1: **Timer & Freigabe** (Set target date/time, edit title, instant manual unlock/lock toggle).
   - Tab 2: **Fragen-Verwaltung** (Add, edit, remove questions, toggle between Practice/Official pools).
   - Tab 3: **Regeln & Ablauf** (Add/edit official competition rules).
   - Tab 4: **Kandidaten-Ergebnisse** (View all exam attempts, scores, and CSV export).
4. **Build & GitHub Compatibility Check**:
   - Verify `compile_applet` and `lint_applet`.
   - Ensure `base: './'` or dynamic GitHub base handles all assets cleanly.
