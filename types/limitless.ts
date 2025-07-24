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
  aura?: string
}

export interface Attribute {
  name: string
  value: number
  maxValue: number
  rank: Rank
  xpGained: number
  decayRate: number
  lastUpdated: string
  color: string
  description: string
  perks: string[]
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
  position: { x: number; y: number }
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
  archetype: string
  philosophy: string
  lore: string
  color: string
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
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme"
  xpReward: number
  attributeRewards: { [key: string]: number }
  pathId?: string
  completed: boolean
  timeEstimate: number
  deadline?: string
  type: "daily" | "weekly" | "challenge"
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
  tone: "light" | "neutral" | "dark" | "ascension"
  characterMoments: string[]
  choices?: StoryChoice[]
}

export interface StoryChoice {
  id: string
  text: string
  consequence: string
  attributeEffect?: { [key: string]: number }
}

export interface JournalEntry {
  id: string
  title: string
  content: string
  date: string
  mood: string[]
  tags: string[]
  season: string
  type: "Reflection" | "Breakthrough" | "Setback" | "Philosophy" | "Goal" | "Rival Event"
  linkedPaths: string[]
  xpGained: number
  storyImpact?: string
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
  duration: number
  intensity: "Standard" | "Intense" | "Extreme"
}

export interface ExamPhase {
  id: string
  name: string
  type: "Task" | "Reflection" | "Challenge" | "Quiz" | "Endurance"
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

export interface Chronicle {
  id: string
  title: string
  content: string
  date: string
  type: "Journal" | "Story Response" | "Mindset Shift" | "Arc Reflection"
  linkedChapter?: string
  mood: string
  insights: string[]
  orderAnalysis?: string
}

export interface CodexEntry {
  id: string
  title: string
  category: "Philosophy" | "Tactic" | "Ritual" | "Legend" | "Secret" | "Mental Model"
  content: string
  unlocked: boolean
  requiredRank?: Rank
  requiredPath?: string
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic"
  imageUrl?: string
  powerLevel: number
  source?: string
  applications: string[]
  unlockRequirements: string[]
}

export interface AIMessage {
  id: string
  content: string
  type: "user" | "assistant"
  timestamp: string
  category?: "guidance" | "story" | "analysis" | "challenge" | "philosophy" | "lore"
}
