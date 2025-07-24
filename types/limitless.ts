export interface User {
  id: string
  name: string
  rank: Rank
  level: number
  xp: number
  xpToNext: number
  attributes: Attributes
  activePaths: string[]
  completedTasks: number
  totalTasks: number
  streak: number
  joinDate: string
  lastActive: string
}

export interface Attributes {
  spiritual: number
  physical: number
  health: number
  intelligence: number
  creativity: number
  resilience: number
}

export type Rank = "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS"

export interface Task {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme"
  xpReward: number
  attributeRewards: Partial<Attributes>
  completed: boolean
  dueDate?: string
  pathId?: string
}

export interface Path {
  id: string
  name: string
  archetype: string
  description: string
  philosophy: string
  stages: PathStage[]
  currentStage: number
  isActive: boolean
  color: string
}

export interface PathStage {
  id: string
  name: string
  description: string
  requirements: string[]
  rewards: string[]
  unlocked: boolean
}

export interface StoryChapter {
  id: string
  title: string
  content: string
  tone: "light" | "dark" | "neutral" | "ascension"
  unlocked: boolean
  dateUnlocked?: string
  characterMoments: string[]
  choices?: StoryChoice[]
}

export interface StoryChoice {
  id: string
  text: string
  consequence: string
  attributeEffect?: Partial<Attributes>
}

export interface AIMessage {
  id: string
  content: string
  type: "user" | "assistant"
  timestamp: string
  category?: "task" | "story" | "guidance" | "analysis" | "challenge" | "philosophy"
}

export interface HunterExam {
  id: string
  name: string
  description: string
  requirements: string[]
  trials: Trial[]
  rewards: string[]
  unlocked: boolean
  completed: boolean
}

export interface Trial {
  id: string
  name: string
  description: string
  type: "endurance" | "mental" | "spiritual" | "creative"
  duration: string
  completed: boolean
}

export interface Chronicle {
  id: string
  title: string
  content: string
  date: string
  mood: string
  tags: string[]
  linkedChapter?: string
}
