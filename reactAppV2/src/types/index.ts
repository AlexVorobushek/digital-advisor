export interface AuthenticRole {
  id: string;
  name: string;
  description: string;
  score: number;
  maxScore: number;
  events: RoleEvent[];
  photos: string[];
  lastActive: string;
}

export interface RoleEvent {
  id: string;
  date: string;
  description: string;
  score: number;
}

export interface SuperResource {
  id: string;
  name: string;
  description: string;
  category: string;
  usageCount: number;
  lastUsed: string;
}

export interface BlockingProcess {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'in_progress' | 'resolved';
  unlockExamples: string[];
}

export interface Victory {
  id: string;
  date: string;
  title: string;
  description: string;
  score: number;
  linkedRole?: string;
  linkedResource?: string;
  photo?: string;
}

export interface Reflection {
  id: string;
  date: string;
  type: 'weekly' | 'monthly';
  whatWorked: string;
  whatDidnt: string;
  insights: string;
  focusAreas: string[];
  overallScore: number;
}

export interface Focus {
  id: string;
  title: string;
  type: 'weekly' | 'monthly';
  progress: number;
  startDate: string;
  endDate: string;
  tasks: FocusTask[];
}

export interface FocusTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface SessionType {
  id: string;
  type: 'strong_decision' | 'strong_position' | 'moral_support';
  title: string;
  description: string;
  icon: string;
}

export interface ChronicleEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'photo' | 'video' | 'text' | 'audio';
  mediaUrl?: string;
  linkedRole?: string;
  tags: string[];
}

export interface MetaTest {
  id: string;
  talentName: string;
  score: number;
  category: string;
  description: string;
}

export interface BusinessModel {
  id: string;
  block: string;
  roles: string[];
  description: string;
  progress: number;
}

export interface DashboardMetrics {
  totalEnergy: number;
  weeklyEnergy: number;
  monthlyVictories: number;
  activeRoles: number;
  totalRoles: number;
  weeklyReflectionDone: boolean;
  monthlyProgress: number;
  activityProgress: number;
  streakDays: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  joinDate: string;
  level: number;
  totalPoints: number;
}
