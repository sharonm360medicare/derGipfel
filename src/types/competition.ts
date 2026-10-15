/**
 * DER GIPFEL 2026 - Comprehensive Competition Domain Types
 */

export type Language = 'de' | 'en';

export type ClassNumber = 'Class 01' | 'Class 02' | 'Class 03' | 'Class 04' | 'Class 05';

export type GermanLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'unmarked';

export type RoundId = 1 | 2 | 3 | 4;

export type CandidateStatus = 'assigned_to_team' | 'submitted' | 'qualified_top6' | 'reviewed';

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

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  germanLevel: GermanLevel;
}

export interface Team {
  id: string;
  name: string;
  classRepresented: ClassNumber;
  memberIds: string[];
  members: TeamMember[];
  roundScores: {
    round1: number;
    round2: number;
    round3: number;
    round4: number;
  };
  totalPoints: number;
  rank: number;
  status: 'active' | 'qualified' | 'disqualified';
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
  status: 'upcoming' | 'in_progress' | 'scores_published';
}

export interface CelebrationData {
  roundId: RoundId;
  roundName: string;
  publishedAt: string;
  highlightNote: string;
  topTeam?: Team;
  teams?: Team[];
}

export interface QuizMasterUser {
  id: string;
  username: string;
  name: string;
  role: 'HEAD_MASTER' | 'SUB_MASTER';
  password?: string;
  assignedClass?: ClassNumber | 'ALL';
  createdAt?: string;
}
