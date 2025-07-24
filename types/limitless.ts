export type Rank = "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS"

export interface UserProfile {
  id: string
  username: string
  email: string
  rank: Rank
  level: number
  totalXP: number
  currentXP: number
  nextRankXP: number
  joinDate: string
  lastActive: string
  streak: number
  title?: string
}

export interface Attribute {
  name: string
  value: number
  maxValue: number
  rank: Rank
  xpGained: number
  decayRate: number
  lastUpdated: string
}

export interface SoulTrait {
  id: string
  name: string
  description: string
  unlocked: boolean
  level: number
  prerequisites: string[]
  effects: string[]
  color: string
}

export interface Path {
  id: string
  name: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Master"
  isActive: boolean
  progress: number
  maxProgress: number
  currentStage: string
  nextStage: string
  associatedAttributes: string[]
  rewards: PathReward[]
  decayRate: number
  lastActivity: string
}

export interface PathReward {
  type: "XP" | "Attribute" | "Title" | "Trait"
  value: number
  target?: string
}

export interface DailyTask {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  xpReward: number
  attributeRewards: { [key: string]: number }
  pathId?: string
  completed: boolean
  timeEstimate: number
  deadline?: string
}

export interface StoryChapter {
  id: string
  title: string
  content: string
  chapterNumber: number
  unlocked: boolean
  completed: boolean
  themes: string[]
  requiredTaskCompletion: number
  rewards: PathReward[]
  imageUrl?: string
}

export interface JournalEntry {
  id: string
  title: string
  content: string
  date: string
  mood: string[]
  tags: string[]
  season: string
  type: "Reflection" | "Breakthrough" | "Setback" | "Philosophy" | "Goal"
  linkedPaths: string[]
  xpGained: number
}

export interface HunterExam {
  id: string
  name: string
  description: string
  targetRank: Rank
  phases: ExamPhase[]
  rewards: PathReward[]
  unlocked: boolean
  completed: boolean
  attempts: number
  bestScore: number
}

export interface ExamPhase {
  id: string
  name: string
  type: "Task" | "Reflection" | "Challenge" | "Quiz"
  description: string
  requirements: string[]
  timeLimit?: number
  completed: boolean
  score?: number
}

export interface DecayMetric {
  pathId: string
  pathName: string
  currentDecay: number
  maxDecay: number
  lastActivity: string
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  recommendations: string[]
}
