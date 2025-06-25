export interface Attribute {
  name: string
  value: number
  rank: AttributeRank
  icon: string
}

export type AttributeRank = "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS"

export interface Prerequisite {
  id: string
  name: string
  description: string
  type: "daily" | "weekly"
  completed: boolean
  weeklyTarget?: number
  weeklyProgress?: number
  xpReward: number
  attributeRewards: { [key: string]: number }
}

export interface Path {
  id: string
  name: string
  description: string
  currentTitle: string
  nextTitle: string
  prerequisites: Prerequisite[]
  associatedAttributes: string[]
  totalXP: number
  completionRate: number
  isActive: boolean
  domain: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

export interface UserData {
  id: string
  email: string
  username: string
  overallRank: AttributeRank
  totalXP: number
  level: number
  attributes: { [key: string]: Attribute }
  activePaths: Path[]
  lastLogin: string
  lastDailyReset: string
  lastWeeklyReset: string
  joinDate: string
}

export interface AuthUser {
  email: string
  username: string
  password: string
}
