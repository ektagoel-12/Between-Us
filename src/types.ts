export type WeatherMood =
  | "Sunny & Radiant ☀️"
  | "Gentle Rain 🌧️"
  | "Stormy ⚡"
  | "Foggy 🌫️"
  | "Golden Hour ✨"
  | "Midnight Starlight 🌙";

export interface PartnerProfile {
  name: string;
  city: string;
  timezone: string;
  avatar: string;
  weather: {
    mood: WeatherMood | string;
    note: string;
    updatedAt: string;
  };
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  category: "Firsts" | "Trips" | "Silly Moments" | "Milestones" | string;
  description: string;
  imageUrl?: string;
  author: string;
  insideJoke?: string;
}

export interface UnsentLetter {
  id: string;
  title: string;
  recipientCondition: string;
  content: string;
  isOpened: boolean;
  openedAt?: string;
  createdAt: string;
  author: string;
  hasAudio?: boolean;
  audioData?: string;
}

export interface TimeCapsule {
  id: string;
  title: string;
  unlockDate: string;
  content: string;
  author: string;
  isUnlocked: boolean;
  category: string;
}

export interface BucketItem {
  id: string;
  title: string;
  category: "travel" | "home" | "dates" | "life";
  completed: boolean;
  targetYear?: string;
  notes?: string;
  votedBy: string[];
  author?: string;
}

export interface ParallelSession {
  type: "coffee" | "meal" | "study" | null;
  status: "idle" | "active" | "completed";
  startTime: number | null;
  durationMinutes: number;
  activityDetails: string;
}

export interface CoupleState {
  coupleCode: string;
  partnerA: PartnerProfile;
  partnerB: PartnerProfile;
  universeLevel: number;
  starlightPoints: number;
  parallelSession: ParallelSession;
  pulseCount: number;
  lastPulse: {
    from: string;
    message: string;
    timestamp: number;
  } | null;
  memories: Memory[];
  unsentLetters: UnsentLetter[];
  timeCapsules: TimeCapsule[];
  bucketList: BucketItem[];
  gameSessions: Record<string, any>;
}
