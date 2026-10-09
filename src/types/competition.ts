/**
 * DER GIPFEL - Competition Types and Domain Models
 */

export type GermanLevel = 'A1' | 'A2' | 'B1' | 'B2';
export type ClassNumber = 'Class 01' | 'Class 02' | 'Class 03' | 'Class 04' | 'Class 05';

export type CandidateStatus = 'submitted' | 'reviewed' | 'qualified_top6' | 'assigned_to_team';
export type AttendanceStatus = 'present' | 'absent' | 'unmarked';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  school: string;
  classDivision: ClassNumber;
  germanLevel: GermanLevel;
  projectTitle: string;
  projectDescription: string;
  submissionLink: string;
  registrationDate: string;
  qualifierScore: number;
  status: CandidateStatus;
  assignedTeamId?: string;
  attendance: AttendanceStatus;
}

export type RoundId = 1 | 2 | 3 | 4;

export interface RoundScores {
  round1: number; // Play The Scene (Max 100)
  round2: number; // Guard Your Grid (Max 100)
  round3: number; // Ace or Base (Max 150)
  round4: number; // The Summit (Max 200)
}

export interface Team {
  id: string;
  name: string; // Team Alpha, Team Bravo, Team Charlie, Team Delta, Team Echo
  classRepresented: ClassNumber;
  memberIds: string[];
  members: Array<{
    id: string;
    name: string;
    role?: string;
    germanLevel: GermanLevel;
  }>;
  roundScores: RoundScores;
  totalPoints: number;
  rank: number;
  status: 'active' | 'qualified' | 'champion' | 'finalist';
  lastDelta?: number;
}

export interface RoundMetadata {
  id: RoundId;
  name: string;
  germanTitle: string;
  subtitle: string;
  tagline: string;
  description: string;
  format: string;
  maxScore: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'scores_published';
}

export type MasterRole = 'HEAD_MASTER' | 'SUB_MASTER';

export interface QuizMasterUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: MasterRole;
  assignedClass?: ClassNumber | 'ALL';
  createdAt: string;
}

export interface CelebrationData {
  roundId: RoundId;
  roundName: string;
  publishedAt: string;
  teams: Team[];
  topTeam: Team;
  highlightNote: string;
}
