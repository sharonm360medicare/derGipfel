import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Candidate,
  Team,
  RoundMetadata,
  RoundId,
  QuizMasterUser,
  CelebrationData,
  AttendanceStatus,
  ClassNumber,
  GermanLevel,
} from '../types/competition';
import { playCelebrationFanfare } from '../utils/sound';

interface CompetitionContextType {
  candidates: Candidate[];
  teams: Team[];
  rounds: RoundMetadata[];
  activeRoundId: RoundId;
  currentUser: QuizMasterUser | null;
  subMasters: QuizMasterUser[];
  celebrationData: CelebrationData | null;
  isCelebrationOpen: boolean;
  soundEnabled: boolean;
  toggleSound: () => void;
  setActiveRoundId: (id: RoundId) => void;
  openCelebration: (data?: CelebrationData) => void;
  closeCelebration: () => void;
  registerCandidate: (
    data: Omit<Candidate, 'id' | 'registrationDate' | 'qualifierScore' | 'status' | 'attendance'>
  ) => Candidate;
  updateCandidateScore: (id: string, score: number) => void;
  updateCandidateAttendance: (id: string, status: AttendanceStatus) => void;
  groupCandidatesIntoTeam: (teamId: string, candidateIds: string[]) => void;
  updateTeamName: (teamId: string, newName: string) => void;
  updateTeamRoundScore: (teamId: string, roundId: RoundId, newScore: number) => void;
  adjustTeamRoundScore: (teamId: string, roundId: RoundId, delta: number) => void;
  publishRoundMarks: (roundId: RoundId, highlightNote?: string) => void;
  login: (
    username: string,
    password: string
  ) => { success: boolean; role?: 'HEAD_MASTER' | 'SUB_MASTER'; user?: QuizMasterUser; message?: string };
  logout: () => void;
  addSubMaster: (
    name: string,
    username: string,
    password: string,
    assignedClass?: ClassNumber | 'ALL'
  ) => { success: boolean; subMaster?: QuizMasterUser; message?: string };
  removeSubMaster: (idOrUsername: string) => void;
  resetTournamentData: () => void;
}

const DEFAULT_ROUNDS: RoundMetadata[] = [
  {
    id: 1,
    name: 'Play The Scene',
    germanTitle: 'Runde 01 — Play The Scene',
    subtitle: 'Watch. Listen. Think.',
    tagline: 'Video-based questions that test observation, comprehension and German language knowledge.',
    description: 'Teams watch authentic German audio-visual excerpts from literature, cinema, and news broadcasts. Precision in dialogue transcription, nuance capture, and cultural context earns maximum points.',
    format: 'Multi-part Audiovisual Prompt Analysis',
    maxScore: 100,
    status: 'scores_published',
  },
  {
    id: 2,
    name: 'Guard Your Grid',
    germanTitle: 'Runde 02 — Guard Your Grid',
    subtitle: 'Choose your challenge.',
    tagline: 'A topic-based grid where strategy matters as much as knowledge.',
    description: 'A 5x5 strategic grid covering German Grammar (Grammatik), History (Geschichte), Science & Tech (Wissenschaft), Geography (Landeskunde), and Literature (Literatur). Teams gamble points to unlock contiguous grid lanes.',
    format: 'Interactive Strategy Board',
    maxScore: 100,
    status: 'in_progress',
  },
  {
    id: 3,
    name: 'Ace or Base',
    germanTitle: 'Runde 03 — Ace or Base',
    subtitle: 'Take the risk. Make the choice.',
    tagline: 'Choose between different levels of questions and decide how far you want to climb.',
    description: 'High-stakes risk management round. Teams select whether to attempt the "Base" tier (+20 pts, safe) or take the bold leap to "Ace" (+50 pts, with -15 penalty for false response). Every decision shifts the summit standings.',
    format: 'Tiered Risk-Reward Challenge',
    maxScore: 150,
    status: 'upcoming',
  },
  {
    id: 4,
    name: 'The Summit',
    germanTitle: 'Runde 04 — Der Gipfel (The Summit)',
    subtitle: 'The final challenge.',
    tagline: 'Only the strongest teams remain. One final ascent stands between them and German excellence.',
    description: 'Rapid-fire linguistic decathlon and live impromptu debate in German between the top finalists. Time runs out fast; nerves of steel determine the supreme champion of DER GIPFEL.',
    format: 'Live Rapid-Fire Summit Finals',
    maxScore: 200,
    status: 'upcoming',
  },
];

const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'CAN-0101',
    name: 'Lena von Bergmann',
    email: 'lena.bergmann@gymnasium.de',
    school: 'Goethe Gymnasium',
    classDivision: 'Class 01',
    germanLevel: 'B2',
    projectTitle: 'Klimawandel in den Bayerischen Alpen: Eine vergleichende Analyse',
    projectDescription: 'Investigating environmental resilience and alpine tourism transformation through original German research papers and local community interviews.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0101-alpen.pdf',
    registrationDate: '2026-09-18',
    qualifierScore: 94,
    status: 'assigned_to_team',
    assignedTeamId: 'team-alpha',
    attendance: 'present',
  },
  {
    id: 'CAN-0102',
    name: 'Maximilian Richter',
    email: 'max.richter@schule.de',
    school: 'Goethe Gymnasium',
    classDivision: 'Class 01',
    germanLevel: 'B1',
    projectTitle: 'Deutsche Sprachkultur im Zeitalter der Künstlichen Intelligenz',
    projectDescription: 'Linguistic study on the syntactic evolution of conversational German under modern machine translation tools.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0102-ki-sprache.pdf',
    registrationDate: '2026-09-19',
    qualifierScore: 91,
    status: 'assigned_to_team',
    assignedTeamId: 'team-alpha',
    attendance: 'present',
  },
  {
    id: 'CAN-0103',
    name: 'Clara Weiß',
    email: 'clara.weiss@altsprachen.de',
    school: 'Goethe Gymnasium',
    classDivision: 'Class 01',
    germanLevel: 'B2',
    projectTitle: 'Goethes Farbenlehre: Philosophische Implikationen',
    projectDescription: 'Interdisciplinary essay highlighting poetry and optical philosophy in Johann Wolfgang von Goethes landmark treatises.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0103-farbenlehre.pdf',
    registrationDate: '2026-09-20',
    qualifierScore: 88,
    status: 'assigned_to_team',
    assignedTeamId: 'team-alpha',
    attendance: 'present',
  },
  {
    id: 'CAN-0201',
    name: 'Felix Schneider',
    email: 'felix.schneider@schiller.org',
    school: 'Friedrich-Schiller-Schule',
    classDivision: 'Class 02',
    germanLevel: 'B2',
    projectTitle: 'Bauhaus-Architektur: Form folgt Funktion in Dessau',
    projectDescription: 'Digital documentary exploring modernist typography, Walter Gropius industrial design, and contemporary urban spaces.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0201-bauhaus.pdf',
    registrationDate: '2026-09-21',
    qualifierScore: 96,
    status: 'assigned_to_team',
    assignedTeamId: 'team-bravo',
    attendance: 'present',
  },
  {
    id: 'CAN-0202',
    name: 'Sophie Hartmann',
    email: 'sophie.hartmann@schiller.org',
    school: 'Friedrich-Schiller-Schule',
    classDivision: 'Class 02',
    germanLevel: 'B1',
    projectTitle: 'Die Brüder Grimm und das deutsche Volksmärchen',
    projectDescription: 'Analysis of folkloric idioms and moral symbolism preserved across 19th-century German literature.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0202-grimm.pdf',
    registrationDate: '2026-09-22',
    qualifierScore: 89,
    status: 'assigned_to_team',
    assignedTeamId: 'team-bravo',
    attendance: 'present',
  },
  {
    id: 'CAN-0301',
    name: 'Julian Becker',
    email: 'julian.becker@humboldt.edu',
    school: 'Alexander von Humboldt Akademie',
    classDivision: 'Class 03',
    germanLevel: 'B2',
    projectTitle: 'Energiewende 2030: Ingenieurskunst trifft Nachhaltigkeit',
    projectDescription: 'Technical breakdown of German wind turbines, energy storage networks, and renewable engineering terminology.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0301-energiewende.pdf',
    registrationDate: '2026-09-23',
    qualifierScore: 92,
    status: 'assigned_to_team',
    assignedTeamId: 'team-charlie',
    attendance: 'present',
  },
  {
    id: 'CAN-0302',
    name: 'Emma Vogel',
    email: 'emma.vogel@humboldt.edu',
    school: 'Alexander von Humboldt Akademie',
    classDivision: 'Class 03',
    germanLevel: 'A2',
    projectTitle: 'Kafka und die Bürokratie: Eine moderne Perspektive',
    projectDescription: 'Literary commentary interpreting Franz Kafkas The Trial in relationship to modern organizational sociology.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0302-kafka.pdf',
    registrationDate: '2026-09-24',
    qualifierScore: 86,
    status: 'assigned_to_team',
    assignedTeamId: 'team-charlie',
    attendance: 'present',
  },
  {
    id: 'CAN-0401',
    name: 'Niklas Weber',
    email: 'niklas.weber@leibniz-schule.de',
    school: 'Gottfried Wilhelm Leibniz Kolleg',
    classDivision: 'Class 04',
    germanLevel: 'B1',
    projectTitle: 'Deutsche Klassische Musik: Von Bach bis Beethoven',
    projectDescription: 'Musical analysis connecting harmonic structure in German composition with classical enlightenment thought.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0401-klassik.pdf',
    registrationDate: '2026-09-25',
    qualifierScore: 90,
    status: 'assigned_to_team',
    assignedTeamId: 'team-delta',
    attendance: 'present',
  },
  {
    id: 'CAN-0402',
    name: 'Hannah Meyer',
    email: 'hannah.meyer@leibniz-schule.de',
    school: 'Gottfried Wilhelm Leibniz Kolleg',
    classDivision: 'Class 04',
    germanLevel: 'B2',
    projectTitle: 'Philosophie der Aufklärung: Immanuel Kants Vermächtnis',
    projectDescription: 'Expository presentation on the Categorical Imperative and ethical reasoning in German educational traditions.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0402-kant.pdf',
    registrationDate: '2026-09-26',
    qualifierScore: 93,
    status: 'assigned_to_team',
    assignedTeamId: 'team-delta',
    attendance: 'present',
  },
  {
    id: 'CAN-0501',
    name: 'Leon Hoffmann',
    email: 'leon.hoffmann@kant-gymnasium.de',
    school: 'Kant-Gymnasium',
    classDivision: 'Class 05',
    germanLevel: 'B2',
    projectTitle: 'Raumfahrt und Technologie: Das Deutsche Zentrum für Luft- und Raumfahrt',
    projectDescription: 'Aerospace innovation review of DLR satellite missions and aerospace vocabulary in contemporary German.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0501-dlr.pdf',
    registrationDate: '2026-09-27',
    qualifierScore: 95,
    status: 'assigned_to_team',
    assignedTeamId: 'team-echo',
    attendance: 'present',
  },
  {
    id: 'CAN-0502',
    name: 'Mia Wagner',
    email: 'mia.wagner@kant-gymnasium.de',
    school: 'Kant-Gymnasium',
    classDivision: 'Class 05',
    germanLevel: 'A2',
    projectTitle: 'Deutsche Redewendungen und ihre Ursprünge',
    projectDescription: 'Comprehensive glossary investigating historical origins of 50 idiomatic German expressions.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0502-redewendungen.pdf',
    registrationDate: '2026-09-28',
    qualifierScore: 87,
    status: 'assigned_to_team',
    assignedTeamId: 'team-echo',
    attendance: 'present',
  },
  {
    id: 'CAN-0503',
    name: 'Lukas Fischer',
    email: 'lukas.fischer@gymnasium-berlin.de',
    school: 'Kant-Gymnasium',
    classDivision: 'Class 05',
    germanLevel: 'B1',
    projectTitle: 'Die Berliner Mauer: Geschichte, Fall und Wiedervereinigung',
    projectDescription: 'Interactive timeline examining geopolitical separation, primary source letters, and the German reunification process.',
    submissionLink: 'https://gipfel-cloud.internal/submissions/can-0503-mauer.pdf',
    registrationDate: '2026-09-29',
    qualifierScore: 94,
    status: 'qualified_top6',
    attendance: 'unmarked',
  },
];

const SEED_TEAMS: Team[] = [
  {
    id: 'team-alpha',
    name: 'Team Alpha',
    classRepresented: 'Class 01',
    memberIds: ['CAN-0101', 'CAN-0102', 'CAN-0103'],
    members: [
      { id: 'CAN-0101', name: 'Lena von Bergmann', role: 'Team Captain', germanLevel: 'B2' },
      { id: 'CAN-0102', name: 'Maximilian Richter', role: 'Linguistics Lead', germanLevel: 'B1' },
      { id: 'CAN-0103', name: 'Clara Weiß', role: 'Literature Specialist', germanLevel: 'B2' },
    ],
    roundScores: {
      round1: 92,
      round2: 85,
      round3: 0,
      round4: 0,
    },
    totalPoints: 177,
    rank: 1,
    status: 'active',
  },
  {
    id: 'team-bravo',
    name: 'Team Bravo',
    classRepresented: 'Class 02',
    memberIds: ['CAN-0201', 'CAN-0202'],
    members: [
      { id: 'CAN-0201', name: 'Felix Schneider', role: 'Team Captain', germanLevel: 'B2' },
      { id: 'CAN-0202', name: 'Sophie Hartmann', role: 'Folklore Lead', germanLevel: 'B1' },
    ],
    roundScores: {
      round1: 88,
      round2: 82,
      round3: 0,
      round4: 0,
    },
    totalPoints: 170,
    rank: 2,
    status: 'active',
  },
  {
    id: 'team-charlie',
    name: 'Team Charlie',
    classRepresented: 'Class 03',
    memberIds: ['CAN-0301', 'CAN-0302'],
    members: [
      { id: 'CAN-0301', name: 'Julian Becker', role: 'Team Captain', germanLevel: 'B2' },
      { id: 'CAN-0302', name: 'Emma Vogel', role: 'Grammar Strategist', germanLevel: 'A2' },
    ],
    roundScores: {
      round1: 80,
      round2: 78,
      round3: 0,
      round4: 0,
    },
    totalPoints: 158,
    rank: 3,
    status: 'active',
  },
  {
    id: 'team-delta',
    name: 'Team Delta',
    classRepresented: 'Class 04',
    memberIds: ['CAN-0401', 'CAN-0402'],
    members: [
      { id: 'CAN-0401', name: 'Niklas Weber', role: 'Team Captain', germanLevel: 'B1' },
      { id: 'CAN-0402', name: 'Hannah Meyer', role: 'Culture Specialist', germanLevel: 'B2' },
    ],
    roundScores: {
      round1: 76,
      round2: 74,
      round3: 0,
      round4: 0,
    },
    totalPoints: 150,
    rank: 4,
    status: 'active',
  },
  {
    id: 'team-echo',
    name: 'Team Echo',
    classRepresented: 'Class 05',
    memberIds: ['CAN-0501', 'CAN-0502'],
    members: [
      { id: 'CAN-0501', name: 'Leon Hoffmann', role: 'Team Captain', germanLevel: 'B2' },
      { id: 'CAN-0502', name: 'Mia Wagner', role: 'Idioms Strategist', germanLevel: 'A2' },
    ],
    roundScores: {
      round1: 70,
      round2: 72,
      round3: 0,
      round4: 0,
    },
    totalPoints: 142,
    rank: 5,
    status: 'active',
  },
];

const HEAD_MASTER_ID = 'sharon360';
const HEAD_MASTER_PASSWORD = 'Sharon@360Medicare';

const SEED_SUB_MASTERS: QuizMasterUser[] = [
  {
    id: 'sub-01',
    username: 'sub_berlin',
    password: 'SubBerlin@2026',
    name: 'Herr Dr. Tobias Müller',
    role: 'SUB_MASTER',
    assignedClass: 'Class 01',
    createdAt: '2026-09-15',
  },
  {
    id: 'sub-02',
    username: 'sub_munich',
    password: 'SubMunich@2026',
    name: 'Frau Anke Sommer',
    role: 'SUB_MASTER',
    assignedClass: 'Class 02',
    createdAt: '2026-09-16',
  },
];

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

function calculateRanks(teams: Team[]): Team[] {
  const sorted = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);
  return sorted.map((team, index) => ({
    ...team,
    rank: index + 1,
    status: index === 0 ? 'active' : index < 2 ? 'qualified' : 'active',
  }));
}

export const CompetitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('gipfel_candidates');
    return saved ? JSON.parse(saved) : SEED_CANDIDATES;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('gipfel_teams');
    return saved ? JSON.parse(saved) : calculateRanks(SEED_TEAMS);
  });

  const [rounds, setRounds] = useState<RoundMetadata[]>(() => {
    const saved = localStorage.getItem('gipfel_rounds');
    return saved ? JSON.parse(saved) : DEFAULT_ROUNDS;
  });

  const [activeRoundId, setActiveRoundId] = useState<RoundId>(2);
  const [subMasters, setSubMasters] = useState<QuizMasterUser[]>(() => {
    const saved = localStorage.getItem('gipfel_sub_masters');
    return saved ? JSON.parse(saved) : SEED_SUB_MASTERS;
  });

  const [currentUser, setCurrentUser] = useState<QuizMasterUser | null>(() => {
    const saved = localStorage.getItem('gipfel_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [celebrationData, setCelebrationData] = useState<CelebrationData | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('gipfel_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('gipfel_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('gipfel_rounds', JSON.stringify(rounds));
  }, [rounds]);

  useEffect(() => {
    localStorage.setItem('gipfel_sub_masters', JSON.stringify(subMasters));
  }, [subMasters]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gipfel_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gipfel_current_user');
    }
  }, [currentUser]);

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  const openCelebration = (data?: CelebrationData) => {
    if (data) {
      setCelebrationData(data);
    }
    setIsCelebrationOpen(true);
    if (soundEnabled) {
      playCelebrationFanfare();
    }
  };

  const closeCelebration = () => {
    setIsCelebrationOpen(false);
  };

  const registerCandidate = (
    data: Omit<Candidate, 'id' | 'registrationDate' | 'qualifierScore' | 'status' | 'attendance'>
  ): Candidate => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const classNum = data.classDivision.replace(/\D/g, '') || '01';
    const newCandidate: Candidate = {
      ...data,
      id: `CAN-${classNum}${randomSuffix}`,
      registrationDate: new Date().toISOString().split('T')[0],
      qualifierScore: 0,
      status: 'submitted',
      attendance: 'unmarked',
    };

    setCandidates((prev) => [newCandidate, ...prev]);
    return newCandidate;
  };

  const updateCandidateScore = (id: string, score: number) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = score >= 90 ? 'qualified_top6' : 'reviewed';
          return { ...c, qualifierScore: score, status: nextStatus };
        }
        return c;
      })
    );
  };

  const updateCandidateAttendance = (id: string, status: AttendanceStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, attendance: status } : c))
    );
  };

  const groupCandidatesIntoTeam = (teamId: string, candidateIds: string[]) => {
    const selected = candidates.filter((c) => candidateIds.includes(c.id));
    if (selected.length === 0) return;

    setTeams((prev) => {
      const updated = prev.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            memberIds: candidateIds,
            members: selected.map((s, idx) => ({
              id: s.id,
              name: s.name,
              role: idx === 0 ? 'Team Captain' : 'Team Member',
              germanLevel: s.germanLevel,
            })),
          };
        }
        return team;
      });
      return updated;
    });

    // Mark candidate status
    setCandidates((prev) =>
      prev.map((c) => {
        if (candidateIds.includes(c.id)) {
          return { ...c, status: 'assigned_to_team', assignedTeamId: teamId };
        }
        return c;
      })
    );
  };

  const updateTeamName = (teamId: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setTeams((prev) =>
      prev.map((team) => (team.id === teamId ? { ...team, name: trimmed } : team))
    );
  };

  const updateTeamRoundScore = (teamId: string, roundId: RoundId, newScore: number) => {
    setTeams((prev) => {
      const updated = prev.map((team) => {
        if (team.id === teamId) {
          const roundKey = `round${roundId}` as keyof Team['roundScores'];
          const scores = { ...team.roundScores, [roundKey]: Math.max(0, newScore) };
          const totalPoints = scores.round1 + scores.round2 + scores.round3 + scores.round4;
          return {
            ...team,
            roundScores: scores,
            totalPoints,
            lastDelta: newScore - team.roundScores[roundKey],
          };
        }
        return team;
      });
      return calculateRanks(updated);
    });
  };

  const adjustTeamRoundScore = (teamId: string, roundId: RoundId, delta: number) => {
    setTeams((prev) => {
      const updated = prev.map((team) => {
        if (team.id === teamId) {
          const roundKey = `round${roundId}` as keyof Team['roundScores'];
          const current = team.roundScores[roundKey] || 0;
          const newScore = Math.max(0, current + delta);
          const scores = { ...team.roundScores, [roundKey]: newScore };
          const totalPoints = scores.round1 + scores.round2 + scores.round3 + scores.round4;
          return {
            ...team,
            roundScores: scores,
            totalPoints,
            lastDelta: delta,
          };
        }
        return team;
      });
      return calculateRanks(updated);
    });
  };

  const publishRoundMarks = (roundId: RoundId, highlightNote?: string) => {
    // 1. Mark round as scores_published
    setRounds((prev) =>
      prev.map((r) => (r.id === roundId ? { ...r, status: 'scores_published' } : r))
    );

    // 2. Prepare ranked teams
    const rankedTeams = calculateRanks(teams);
    setTeams(rankedTeams);

    const roundMeta = rounds.find((r) => r.id === roundId) || DEFAULT_ROUNDS[0];
    const topTeam = rankedTeams[0];

    const payload: CelebrationData = {
      roundId,
      roundName: roundMeta.name,
      publishedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      teams: rankedTeams,
      topTeam,
      highlightNote:
        highlightNote ||
        `Official scores for ${roundMeta.name} have been ratified by the Head Quiz Master! All teams demonstrated outstanding mastery of the German language.`,
    };

    setCelebrationData(payload);
    setIsCelebrationOpen(true);

    if (soundEnabled) {
      playCelebrationFanfare();
    }
  };

  const login = (
    usernameInput: string,
    passwordInput: string
  ): { success: boolean; role?: 'HEAD_MASTER' | 'SUB_MASTER'; user?: QuizMasterUser; message?: string } => {
    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    // 1. Check Head Quiz Master (sharon360 / Sharon@360Medicare)
    if (
      cleanUser.toLowerCase() === HEAD_MASTER_ID.toLowerCase() &&
      cleanPass === HEAD_MASTER_PASSWORD
    ) {
      const headUser: QuizMasterUser = {
        id: 'head-master',
        username: HEAD_MASTER_ID,
        password: HEAD_MASTER_PASSWORD,
        name: 'Sharon (Oberster Quizmeister)',
        role: 'HEAD_MASTER',
        createdAt: '2026-09-01',
      };
      setCurrentUser(headUser);
      return { success: true, role: 'HEAD_MASTER', user: headUser };
    }

    // Legacy fallback check if user entered GIPFEL-MASTER-2026
    if (cleanUser.toUpperCase() === 'GIPFEL-MASTER-2026') {
      const headUser: QuizMasterUser = {
        id: 'head-master',
        username: HEAD_MASTER_ID,
        password: HEAD_MASTER_PASSWORD,
        name: 'Sharon (Oberster Quizmeister)',
        role: 'HEAD_MASTER',
        createdAt: '2026-09-01',
      };
      setCurrentUser(headUser);
      return { success: true, role: 'HEAD_MASTER', user: headUser };
    }

    // 2. Check Sub-Quiz Masters by ID or Username and Password
    const foundSub = subMasters.find(
      (sm) =>
        (sm.username.toLowerCase() === cleanUser.toLowerCase() || sm.id.toLowerCase() === cleanUser.toLowerCase()) &&
        sm.password === cleanPass
    );

    if (foundSub) {
      setCurrentUser(foundSub);
      return { success: true, role: 'SUB_MASTER', user: foundSub };
    }

    return {
      success: false,
      message: 'Ungültige Quizmeister-ID oder falsches Passwort. Bitte Zugangsdaten überprüfen.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addSubMaster = (
    name: string,
    username: string,
    password: string,
    assignedClass: ClassNumber | 'ALL' = 'ALL'
  ): { success: boolean; subMaster?: QuizMasterUser; message?: string } => {
    const cleanName = name.trim();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanName) {
      return { success: false, message: 'Bitte geben Sie den Namen des Sub-Quizmeisters an.' };
    }
    if (!cleanUser) {
      return { success: false, message: 'Bitte vergeben Sie eine eindeutige Sub-Quizmeister ID.' };
    }
    if (!cleanPass || cleanPass.length < 4) {
      return { success: false, message: 'Das Passwort muss mindestens 4 Zeichen lang sein.' };
    }

    if (cleanUser === HEAD_MASTER_ID.toLowerCase()) {
      return { success: false, message: 'Die ID "sharon360" ist für die Hauptspielleitung reserviert.' };
    }

    if (subMasters.some((sm) => sm.username.toLowerCase() === cleanUser)) {
      return { success: false, message: `Ein Sub-Quizmeister mit der ID "${username}" existiert bereits.` };
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newMaster: QuizMasterUser = {
      id: `sub-${randomSuffix}`,
      username: username.trim(),
      password: cleanPass,
      name: cleanName,
      role: 'SUB_MASTER',
      assignedClass,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSubMasters((prev) => [...prev, newMaster]);
    return { success: true, subMaster: newMaster };
  };

  const removeSubMaster = (idOrUsername: string) => {
    setSubMasters((prev) =>
      prev.filter((sm) => sm.id !== idOrUsername && sm.username !== idOrUsername)
    );
  };

  const resetTournamentData = () => {
    setCandidates(SEED_CANDIDATES);
    setTeams(calculateRanks(SEED_TEAMS));
    setRounds(DEFAULT_ROUNDS);
    setSubMasters(SEED_SUB_MASTERS);
    setActiveRoundId(2);
    localStorage.removeItem('gipfel_candidates');
    localStorage.removeItem('gipfel_teams');
    localStorage.removeItem('gipfel_rounds');
    localStorage.removeItem('gipfel_sub_masters');
  };

  return (
    <CompetitionContext.Provider
      value={{
        candidates,
        teams,
        rounds,
        activeRoundId,
        currentUser,
        subMasters,
        celebrationData,
        isCelebrationOpen,
        soundEnabled,
        toggleSound,
        setActiveRoundId,
        openCelebration,
        closeCelebration,
        registerCandidate,
        updateCandidateScore,
        updateCandidateAttendance,
        groupCandidatesIntoTeam,
        updateTeamName,
        updateTeamRoundScore,
        adjustTeamRoundScore,
        publishRoundMarks,
        login,
        logout,
        addSubMaster,
        removeSubMaster,
        resetTournamentData,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
};
