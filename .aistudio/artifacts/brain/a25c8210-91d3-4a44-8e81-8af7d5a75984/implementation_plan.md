# DER GIPFEL — The Journey to German Excellence

A dedicated, high-aesthetic web platform for the premier German language quiz competition **DER GIPFEL**. The application enables individual candidates to register and submit their qualifying project entries, tracks real-time leaderboards across all competition stages, and provides a password-secured command center for the Head Quiz Master and Sub-Quiz Masters with live scoring, team formation announcements, attendance checks, and ceremonial celebration score reveals.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and workflow decisions synthesize your prompt specifications and interview responses:

- **Individual-to-Team Progression**: Level 1 begins as an individual candidate written qualifier and project entry. In the private dashboard, the Quiz Master reviews qualifying scores and forms the official representative teams (Team Alpha, Bravo, Charlie, Delta, Echo across Classes 01–05), which are then officially announced on the public site.
- **Role-Based Access (Head vs. Sub-Quiz Master)**:
  - **Head Quiz Master**: Full authority via primary access key. Manages all scores across Rounds 01–04, groups candidates into teams, invites/adds Sub-Quiz Masters with unique access keys, and triggers the public release of round marks.
  - **Sub-Quiz Master**: Dedicated secondary access key. Has **view-only score monitoring and live attendance verification** permissions, protecting tournament integrity from unauthorized edits.
- **Celebration Score Release Flow**: When the Quiz Master officially finalizes and approves marks after each round, a high-impact, aesthetic modal popup appears with celebratory animations, sound toggles, confetti particles, and rank movements.
- **DER GIPFEL Authentic Identity**: Faithful adaptation of the official competition brochure typography, minimalist German brutalist aesthetic, monochrome contrast with crimson accent, and 4 official rounds (*01 Play The Scene*, *02 Guard Your Grid*, *03 Ace or Base*, *04 The Summit*).

---

### 1. Overview & Core Concept

- **What It Does**: 
  - **Public Experience**: Editorial landing page with competition roadmap (01 Lernen to 04 The Summit), interactive registration and project entry portal, live leaderboard (*Die Rangliste*), round rules breakdown, and live countdown timer.
  - **Individual Entry & Group Announcement**: Candidates register individually with their name, school, class (01–05), German proficiency level, and qualifying submission link/text. Once evaluated, the Quiz Master announces the official Top 6 student rosters and class teams.
  - **Quiz Master Private Headquarters**: Access-key protected console with round switcher, real-time score calculators, attendance rosters, and sub-master credential provisioning.
  - **Sub-Quiz Master View**: Streamlined interface focused strictly on verifying attendee check-ins and monitoring live tournament scores without editing permissions.
  - **Celebration Score Release**: Ceremonial broadcast of round results that students and audience see in real time.
- **Target Audience / Persona**: Students competing in German language quiz challenges, educators/evaluators, event audiences, Head Quiz Master, and appointed Sub-Quiz Masters.
- **Key Value**: Replaces chaotic manual spreadsheets and paper scoring with an automated, synchronized tournament engine wrapped in a publication-grade German design.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Public Discovery & Schedule**: Visitors explore the 4 competition stages (*Lernen*, *Qualifikation*, *Selection Challenge*, *Championship*), review the rules (*Teamwork, Time, Strategy, Fair Play, Language*), and check the live event countdown.
2. **Candidate Registration & Project Entry**:
   - Single-candidate onboarding form: Student Name, Email, Class Division (01 to 05), German Level (A1–B2), Project Title, Entry Description, and File/Media Link.
   - Instant confirmation with unique Candidate ID and entry status tracking.
3. **Master Authentication & Role Gateway**:
   - Discrete, secure entrance button in the top navigation.
   - Key verification dialog routing to either the **Head Quiz Master Console** (Score Editor, Group Maker, Master Manager) or **Sub-Quiz Master Dashboard** (Attendance Check-in & Read-Only Score Monitor).
4. **Scoring, Grouping & Celebration Release**:
   - Head Quiz Master groups top-performing students into Class Teams.
   - Master inputs or adjusts scores for active round (e.g., Round 02 *Guard Your Grid*).
   - Master clicks **"Publish Round Marks"** $\rightarrow$ public and audience view triggers a dramatic celebratory announcement popup with rank deltas and confetti celebration.

#### Visual Identity & Theme
- **Aesthetic Direction**: High-end German editorial brutalism meets modern Swiss typography. Restrained, authoritative, and sharp.
- **Color Palette**:
  - Dominant Canvas (60%): Crisp Pure Paper (`#FBFBFA` / `#FFFFFF`) and Deep Onyx (`#0D0D0E` for dark mode/consoles).
  - Structural Surfaces (30%): Architectural Chalk (`#F4F4F1`), Slate Hairlines (`#E2E2DF`), and Charcoal Muted (`#27272A`).
  - Accent Budget (10%): Der Gipfel Crimson (`#DC2626` / `#E11D48`) and Summit Gold (`#D97706`).
- **Typography & Scale**:
  - Display / Hero: Heavy Condensed Grotesk (`Cabinet Grotesk` / `Oswald` / `Syne`) in tight tracking with German capitalization.
  - Body Prose: Crisp Modern Sans (`Plus Jakarta Sans` / `Satoshi`) with balanced line height.
  - Scores & Timers: Monospace Tabular Figures (`font-mono tabular-nums`).
- **Top Bar Contract**:
  - `[Brand Wordmark: DER GIPFEL]` — `[Nav Links: Wettbewerb, Die Runden, Rangliste, Zeitplan, Regeln]` — `[Actions: Jetzt Anmelden, Master Login]`.

---

### 3. Key Product Decisions & Trade-Offs

- **Client-Persistent Reactive State Store**:
  - *Chosen Approach*: Reactive local state engine with `localStorage` synchronization and pre-seeded realistic candidates, teams, and quiz master credentials.
  - *Why*: Instant zero-latency responses, zero server downtime risk during competition events, and complete testability across browser sessions without requiring paid backend subscriptions.
  - *Alternative Considered*: External database sync. Deferred for now as the prompt specifies *"as for now only the entry to the competition will be done in the website all other level will be conducted online and automated score tracking functionality"*.
- **Role Hierarchy & Separation of Powers**:
  - *Chosen Approach*: Cryptographic-style access key routing (`GIPFEL-MASTER-2026` for Head Quiz Master, `SUB-QM-XXXX` for Sub-Quiz Masters).
  - *Why*: Sub-Quiz Masters get a dedicated attendance and monitor view without being able to modify scores or generate other keys, fulfilling the security requirement.
- **Celebration Modal Architecture**:
  - *Chosen Approach*: Accessible celebration overlay powered by canvas-confetti, sound feedback (with mute toggle), and visual rank climb animations.
  - *Why*: Directly delivers the user's explicit preference for an *"aesthetic popup in a celebration theme"* whenever round marks are released.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DER GIPFEL CLIENT APP                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Wordmark · Nav Links · Action Buttons · Portal Gate)  │
├──────────────────────────────────────┬──────────────────────────────────────┤
│           PUBLIC SURFACES            │         RESTRICTED CONSOLES          │
│  ┌────────────────────────────────┐  │  ┌────────────────────────────────┐  │
│  │ 01. Hero & Mountain Motif      │  │  │ Head Quiz Master Workspace     │  │
│  │ 02. Über den Wettbewerb        │  │  │  - Candidate Review & Grouping │  │
│  │ 03. Die 4 Runden (Play Scene..)│  │  │  - Live Round Score Control    │  │
│  │ 04. Candidate Registration     │  │  │  - "Publish Marks" Trigger     │  │
│  │ 05. Group Team Announcements   │  │  │  - Sub-Master Key Generator    │  │
│  │ 06. Live Leaderboard (Rangliste│  │  └────────────────────────────────┘  │
│  │ 07. Zeitplan & Rules Modal     │  │  ┌────────────────────────────────┐  │
│  └────────────────────────────────┘  │  │ Sub-Quiz Master Workspace      │  │
│  ┌────────────────────────────────┐  │  │  - Candidate Attendance List   │  │
│  │ Celebration Score Reveal Popup │  │  │  - Read-Only Live Score Feed   │  │
│  └────────────────────────────────┘  │  └────────────────────────────────┘  │
└──────────────────────────────────────┴──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 CENTRAL COMPETITION STATE & PERSISTENCE                     │
│  - Candidates List (name, class, level, project title, status, group)        │
│  - Formed Teams (Alpha, Bravo, Charlie, Delta, Echo + round scores 01 to 04)│
│  - Active Tournament Round (01 Play Scene -> 04 Summit)                     │
│  - Celebration Announcement Queue & Published Marks Event                   │
│  - Quiz Master & Sub-Quiz Master Access Keys Registry                       │
│  - Attendance Roster Logs                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Key Entities & State Mapping
- `Candidate`: ID, name, email, classNumber (`01` to `05`), germanLevel, projectTitle, projectSummary, mediaUrl, scoreQualifier, status (`pending`, `qualified`, `grouped`), assignedTeamId, attendanceStatus.
- `Team`: ID, name (`Team Alpha`, `Team Bravo`, etc.), classRepresented, memberIds, roundScores (`round1`, `round2`, `round3`, `round4`), totalPoints, rank, status (`active`, `qualified`, `eliminated`).
- `CompetitionState`: activeStage, currentRound, isRoundScoresPublished, lastCelebrationData.
- `QuizMasterAccount`: key, role (`HEAD_MASTER` | `SUB_MASTER`), name, assignedClass, createdAt.
