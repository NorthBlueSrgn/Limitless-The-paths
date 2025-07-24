// Database Schema Definitions for The Order System

export interface UserProfile {
  id: string
  email: string
  username: string
  createdAt: Date
  lastActive: Date

  // Core Stats (0-100 scale)
  stats: {
    spiritual: number
    health: number
    intelligence: number
    physical: number
    creativity: number
    resilience: number
  }

  // Progression System
  totalXP: number
  currentRank: Rank
  rankProgress: number // Progress toward next rank (0-100)
  level: number

  // Streaks and Patterns
  currentStreak: number
  longestStreak: number
  lastTaskCompletion: Date

  // Behavioral Patterns
  preferredTaskTypes: string[]
  averageSessionLength: number
  mostActiveTimeOfDay: string
  weeklyActivityPattern: number[] // 7 days

  // Narrative State
  currentStoryArc: string
  completedArcs: string[]
  narrativeChoices: Record<string, any>

  // Metadata
  timezone: string
  preferences: UserPreferences
}

export interface UserPreferences {
  difficultyPreference: "adaptive" | "challenging" | "moderate" | "gentle"
  notificationSettings: {
    dailyReminders: boolean
    achievementAlerts: boolean
    streakWarnings: boolean
    weeklyReports: boolean
  }
  themePreference: "dark" | "light" | "auto"
  aiPersonality: "mentor" | "friend" | "coach" | "mysterious"
}

export type Rank = "Initiate" | "Seeker" | "Adept" | "Expert" | "Master" | "Sage" | "Transcendent"

export interface Path {
  id: string
  name: string
  description: string
  category: "spiritual" | "health" | "intelligence" | "physical" | "creativity" | "resilience"

  // Progression
  currentLevel: number
  totalXP: number
  isActive: boolean
  unlockedAt: Date

  // Requirements
  prerequisites: PathPrerequisite[]

  // Metadata
  difficulty: "beginner" | "intermediate" | "advanced" | "master"
  estimatedDuration: number // days
  tags: string[]
}

export interface PathPrerequisite {
  type: "stat" | "rank" | "path" | "task_completion"
  target: string
  value: number
}

export interface Task {
  id: string
  userId: string

  // Core Properties
  title: string
  description: string
  category: string
  difficulty: 1 | 2 | 3 | 4 | 5

  // Rewards
  xpReward: number
  statRewards: Partial<Record<keyof UserProfile["stats"], number>>

  // Scheduling
  type: "daily" | "weekly" | "milestone" | "challenge"
  dueDate?: Date
  estimatedMinutes: number

  // State
  status: "pending" | "in_progress" | "completed" | "failed" | "skipped"
  completedAt?: Date

  // AI Generation Context
  generatedBy: "ai" | "system" | "user"
  generationContext: {
    userStats: Partial<UserProfile["stats"]>
    recentFailures: string[]
    currentPaths: string[]
    mood?: string
  }

  // Adaptive Learning
  actualDifficulty?: number // User-reported or inferred
  completionTime?: number // Actual minutes taken
  userRating?: number // 1-5 satisfaction
}

export interface ChatMessage {
  id: string
  userId: string

  // Message Content
  content: string
  role: "user" | "assistant"
  timestamp: Date

  // Context
  messageType: "casual" | "task_request" | "progress_check" | "story" | "advice" | "celebration"
  contextData: {
    userStats: Partial<UserProfile["stats"]>
    recentTasks: string[]
    currentMood?: string
    triggerEvent?: string
  }

  // AI Metadata
  tokensUsed?: number
  responseTime?: number
  confidence?: number
}

export interface Achievement {
  id: string
  userId: string

  // Achievement Details
  title: string
  description: string
  category: string
  rarity: "common" | "rare" | "epic" | "legendary"

  // Unlock Conditions
  unlockedAt: Date
  triggerCondition: string

  // Rewards
  xpReward: number
  titleUnlocked?: string
  pathUnlocked?: string
}

export interface SystemEvent {
  id: string
  userId: string

  // Event Details
  eventType: "rank_up" | "streak_milestone" | "path_completion" | "stat_threshold" | "failure_pattern"
  timestamp: Date

  // Data
  eventData: Record<string, any>

  // AI Response
  aiResponse?: string
  userReaction?: "positive" | "neutral" | "negative"
}

// Database Indexes for Performance
export const DatabaseIndexes = {
  users: ["email", "username", "currentRank", "lastActive"],
  tasks: ["userId", "status", "dueDate", "type", "category"],
  chatMessages: ["userId", "timestamp", "messageType"],
  achievements: ["userId", "unlockedAt", "category"],
  systemEvents: ["userId", "eventType", "timestamp"],
}
