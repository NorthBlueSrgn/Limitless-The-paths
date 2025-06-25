"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Crown,
  Zap,
  Target,
  LogOut,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Flame,
  AlertTriangle,
  Clock,
  Swords,
} from "lucide-react"

// Updated Ranking System with new thresholds
const RANK_THRESHOLDS = {
  E: 0,
  D: 15000, // 2 months (60 days × 250 XP)
  C: 37500, // 3 months more (90 days × 250 XP)
  B: 60000, // 3 months more (90 days × 250 XP)
  A: 90000, // 4 months more (120 days × 250 XP)
  S: 127500, // 5 months more (150 days × 250 XP)
  SS: 165000, // 5 months more (150 days × 250 XP)
  SSS: 202500, // 5 months more (150 days × 250 XP)
}

const RANK_ORDER = ["E", "D", "C", "B", "A", "S", "SS", "SSS"]

// Hunter Exam System - NEW INNOVATIVE FEATURE
const HUNTER_EXAMS = {
  D: {
    name: "The First Gate",
    description: "Prove your dedication through consistency",
    requirements: [
      "Complete 7 consecutive days of daily tasks",
      "Achieve 80% completion rate on all active paths",
      "Demonstrate basic discipline across 3 different domains",
    ],
    rewards: {
      title: "Dedicated Hunter",
      ability: "Focus Boost",
      abilityDescription: "10% bonus XP on daily tasks for 1 week after completion",
      xpBonus: 1000,
    },
    storyUnlock: "Chapter 2: The First Trial",
  },
  C: {
    name: "Trial of Persistence",
    description: "Show mastery over your chosen paths",
    requirements: [
      "Maintain a 14-day streak on at least 2 paths",
      "Complete 5 weekly challenges",
      "Reach 500+ points in any single attribute",
    ],
    rewards: {
      title: "Persistent Warrior",
      ability: "Streak Shield",
      abilityDescription: "Protect your streaks from being broken once per week",
      xpBonus: 2000,
    },
    storyUnlock: "Chapter 3: The Awakening Power",
  },
  B: {
    name: "The Crucible",
    description: "Face your weaknesses and overcome them",
    requirements: [
      "Complete a 30-day challenge in your weakest attribute",
      "Achieve rank C in at least 3 different attributes",
      "Complete 10 weekly objectives without missing any",
    ],
    rewards: {
      title: "Crucible Survivor",
      ability: "Weakness Converter",
      abilityDescription: "Convert failed tasks into 50% XP instead of 0%",
      xpBonus: 3000,
    },
    storyUnlock: "Chapter 4: Breaking Limits",
  },
  A: {
    name: "Hunter's Resolve",
    description: "Demonstrate true hunter spirit",
    requirements: [
      "Complete 3 different path types simultaneously",
      "Achieve a 21-day perfect streak across all paths",
      "Help another hunter (complete social challenges)",
    ],
    rewards: {
      title: "True Hunter",
      ability: "Hunter's Instinct",
      abilityDescription: "Automatically detect optimal task combinations for maximum growth",
      xpBonus: 5000,
    },
    storyUnlock: "Chapter 5: The Hunter's Code",
  },
  S: {
    name: "Ascension Trial",
    description: "Transcend human limitations",
    requirements: [
      "Reach rank A in 4 different attributes",
      "Complete 50 consecutive days without missing any daily task",
      "Create and complete a custom legendary challenge",
    ],
    rewards: {
      title: "Ascended Being",
      ability: "Transcendence",
      abilityDescription: "Double XP gains for 1 month after major breakthroughs",
      xpBonus: 7500,
    },
    storyUnlock: "Chapter 6: Beyond Human",
  },
  SS: {
    name: "The Sovereign's Test",
    description: "Prove your mastery over reality itself",
    requirements: [
      "Achieve rank S in 3 different attributes",
      "Complete 100 days of perfect execution",
      "Master 5 different path domains",
    ],
    rewards: {
      title: "Sovereign Hunter",
      ability: "Reality Shaper",
      abilityDescription: "Create custom challenges that adapt to your growth in real-time",
      xpBonus: 10000,
    },
    storyUnlock: "Chapter 7: The Sovereign's Domain",
  },
  SSS: {
    name: "Limitless Awakening",
    description: "Become one with the infinite",
    requirements: [
      "Achieve rank SS in all attributes",
      "Complete 365 days of continuous growth",
      "Transcend the system itself",
    ],
    rewards: {
      title: "Limitless One",
      ability: "System Mastery",
      abilityDescription: "Rewrite the rules of your own progression",
      xpBonus: 15000,
    },
    storyUnlock: "Chapter 8: Limitless",
  },
}

function calculateAttributeRank(value) {
  const ranks = Object.entries(RANK_THRESHOLDS).reverse()
  for (const [rank, threshold] of ranks) {
    if (value >= threshold) {
      return rank
    }
  }
  return "E"
}

function calculateOverallRank(attributes) {
  const ranks = Object.values(attributes).map((attr) => attr.rank)
  const rankValues = ranks.map((rank) => RANK_ORDER.indexOf(rank))
  const averageRankValue = Math.round(rankValues.reduce((sum, val) => sum + val, 0) / rankValues.length)
  return RANK_ORDER[averageRankValue] || "E"
}

function getNextRankThreshold(currentValue) {
  const currentRank = calculateAttributeRank(currentValue)
  const currentRankIndex = RANK_ORDER.indexOf(currentRank)
  const nextRankIndex = Math.min(currentRankIndex + 1, RANK_ORDER.length - 1)
  const nextRank = RANK_ORDER[nextRankIndex]
  const threshold = RANK_THRESHOLDS[nextRank]
  const currentThreshold = RANK_THRESHOLDS[currentRank]
  const progress =
    currentThreshold === threshold ? 100 : ((currentValue - currentThreshold) / (threshold - currentThreshold)) * 100

  return { nextRank, threshold, progress: Math.min(Math.max(progress, 0), 100) }
}

function getRankColor(rank) {
  const colors = {
    E: "text-gray-400",
    D: "text-gray-300",
    C: "text-green-400",
    B: "text-blue-400",
    A: "text-purple-400",
    S: "text-yellow-400",
    SS: "text-orange-400",
    SSS: "text-red-400",
  }
  return colors[rank] || "text-gray-400"
}

function getRankGlow(rank) {
  const glows = {
    E: "shadow-lg shadow-gray-400/20",
    D: "shadow-lg shadow-gray-300/20",
    C: "shadow-lg shadow-green-400/30",
    B: "shadow-lg shadow-blue-400/30",
    A: "shadow-lg shadow-purple-400/40",
    S: "shadow-xl shadow-yellow-400/50",
    SS: "shadow-xl shadow-orange-400/60",
    SSS: "shadow-2xl shadow-red-400/70",
  }
  return glows[rank] || "shadow-lg shadow-gray-400/20"
}

// Storage Functions
const STORAGE_KEY = "limitless-user-data"
const AUTH_KEY = "limitless-auth-users"
const CURRENT_USER_KEY = "limitless-current-user"

function saveUserData(userData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
}

function loadUserData() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

function saveAuthUser(authUser) {
  const users = getAuthUsers()
  const existingIndex = users.findIndex((u) => u.email === authUser.email)

  if (existingIndex >= 0) {
    users[existingIndex] = authUser
  } else {
    users.push(authUser)
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(users))
}

function getAuthUsers() {
  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function authenticateUser(email, password) {
  const users = getAuthUsers()
  return users.find((u) => u.email === email && u.password === password) || null
}

function setCurrentUser(email) {
  localStorage.setItem(CURRENT_USER_KEY, email)
}

function getCurrentUser() {
  return localStorage.getItem(CURRENT_USER_KEY)
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY)
  localStorage.removeItem(STORAGE_KEY)
}

function createInitialUserData(email, username) {
  const now = new Date().toISOString()

  return {
    id: `user-${Date.now()}`,
    email,
    username,
    overallRank: "E",
    totalXP: 0,
    level: 1,
    attributes: {
      intelligence: { name: "Intelligence", value: 0, rank: "E", icon: "🧠" },
      resilience: { name: "Resilience", value: 0, rank: "E", icon: "🔥" },
      physical: { name: "Physical", value: 0, rank: "E", icon: "💪" },
      creativity: { name: "Creativity", value: 0, rank: "E", icon: "🌀" },
      health: { name: "Health", value: 0, rank: "E", icon: "💖" },
      spiritual: { name: "Spiritual", value: 0, rank: "E", icon: "✨" },
    },
    activePaths: [],
    completedPaths: [],
    lastLogin: now,
    lastDailyReset: now,
    lastWeeklyReset: now,
    joinDate: now,
    storyProgress: 0,
    achievements: [],
    hunterTitle: "Novice Hunter",
    activeAbilities: [],
    completedExams: [],
    availableExams: ["D"], // Start with D rank exam available
    streakData: {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletionDate: null,
    },
  }
}

function shouldResetDaily(lastReset) {
  const last = new Date(lastReset)
  const now = new Date()
  const lastMidnight = new Date(now)
  lastMidnight.setHours(0, 0, 0, 0)
  return last < lastMidnight
}

function shouldResetWeekly(lastReset) {
  const last = new Date(lastReset)
  const now = new Date()
  const lastMonday = new Date(now)
  const daysSinceMonday = (now.getDay() + 6) % 7
  lastMonday.setDate(now.getDate() - daysSinceMonday)
  lastMonday.setHours(0, 0, 0, 0)
  return last < lastMonday
}

// Enhanced Path Templates with specific, realistic tasks
const SAMPLE_PATHS = [
  // Mental Mastery
  {
    name: "🧩 Hunter's Mind",
    description: "Master the art of strategic thinking through chess mastery",
    domain: "Mental Mastery",
    difficulty: "intermediate",
    currentTitle: "Chess Novice",
    nextTitle: "Tactical Apprentice",
    associatedAttributes: ["intelligence", "resilience"],
    totalXP: 0,
    completionRate: 0,
    pathType: "daily-focused",
    keywords: ["chess", "strategy", "tactics"],
    prerequisites: [
      {
        id: "chess-daily-1",
        name: "Educational Chess Study",
        description: "Watch 30 minutes of chess educational content (openings, tactics, endgames)",
        type: "daily",
        completed: false,
        xpReward: 35,
        attributeRewards: { intelligence: 15, resilience: 5 },
      },
      {
        id: "chess-daily-2",
        name: "Tactical Puzzles",
        description: "Solve 30 chess puzzles on Chess.com or Lichess",
        type: "daily",
        completed: false,
        xpReward: 40,
        attributeRewards: { intelligence: 18, resilience: 7 },
      },
      {
        id: "chess-daily-3",
        name: "Competitive Games",
        description: "Play 4 rated chess games (10+0 or longer time control)",
        type: "daily",
        completed: false,
        xpReward: 50,
        attributeRewards: { intelligence: 12, resilience: 18 },
      },
      {
        id: "chess-weekly-1",
        name: "Tournament Participation",
        description: "Participate in 2 online tournaments this week",
        type: "weekly",
        completed: false,
        weeklyTarget: 2,
        weeklyProgress: 0,
        xpReward: 100,
        attributeRewards: { intelligence: 25, resilience: 25 },
      },
    ],
  },
  {
    name: "🧠 The Maze Architect",
    description: "Develop problem-solving and logical thinking through complex challenges",
    domain: "Mental Mastery",
    difficulty: "advanced",
    currentTitle: "Logic Seeker",
    nextTitle: "Pattern Weaver",
    associatedAttributes: ["intelligence", "creativity"],
    totalXP: 0,
    completionRate: 0,
    pathType: "daily-focused",
    keywords: ["logic", "problem", "solving", "puzzles", "algorithms"],
    prerequisites: [
      {
        id: "logic-daily-1",
        name: "Algorithm Practice",
        description: "Solve 3 LeetCode problems (Easy/Medium difficulty)",
        type: "daily",
        completed: false,
        xpReward: 60,
        attributeRewards: { intelligence: 25, creativity: 10 },
      },
      {
        id: "logic-daily-2",
        name: "Logic Puzzles",
        description: "Complete 20 minutes of logic puzzles (Sudoku, KenKen, etc.)",
        type: "daily",
        completed: false,
        xpReward: 35,
        attributeRewards: { intelligence: 15, creativity: 8 },
      },
      {
        id: "logic-weekly-1",
        name: "Complex Project",
        description: "Complete 1 complex algorithmic project or coding challenge",
        type: "weekly",
        completed: false,
        weeklyTarget: 1,
        weeklyProgress: 0,
        xpReward: 150,
        attributeRewards: { intelligence: 40, creativity: 30 },
      },
    ],
  },
  {
    name: "📚 Ink of the Ancients",
    description: "Expand knowledge and wisdom through dedicated reading",
    domain: "Mental Mastery",
    difficulty: "beginner",
    currentTitle: "Page Turner",
    nextTitle: "Knowledge Seeker",
    associatedAttributes: ["intelligence", "spiritual"],
    totalXP: 0,
    completionRate: 0,
    pathType: "daily-focused",
    keywords: ["reading", "books", "literature", "knowledge"],
    prerequisites: [
      {
        id: "reading-daily-1",
        name: "Deep Reading Session",
        description: "Read for 60 minutes with full focus (no distractions)",
        type: "daily",
        completed: false,
        xpReward: 45,
        attributeRewards: { intelligence: 20, spiritual: 10 },
      },
      {
        id: "reading-daily-2",
        name: "Reading Notes",
        description: "Take detailed notes on key insights from today's reading",
        type: "daily",
        completed: false,
        xpReward: 25,
        attributeRewards: { intelligence: 12, spiritual: 5 },
      },
      {
        id: "reading-weekly-1",
        name: "Book Completion",
        description: "Finish 1 complete book and write a comprehensive summary",
        type: "weekly",
        completed: false,
        weeklyTarget: 1,
        weeklyProgress: 0,
        xpReward: 120,
        attributeRewards: { intelligence: 35, spiritual: 25 },
      },
    ],
  },
  // Physical Discipline
  {
    name: "🛡 Temple of Iron",
    description: "Forge an unbreakable body through disciplined strength training",
    domain: "Physical Discipline",
    difficulty: "advanced",
    currentTitle: "Iron Novice",
    nextTitle: "Steel Forger",
    associatedAttributes: ["physical", "resilience"],
    totalXP: 0,
    completionRate: 0,
    pathType: "flexible",
    keywords: ["gym", "strength", "workout", "lifting", "muscle"],
    prerequisites: [
      {
        id: "gym-daily-1",
        name: "Daily Steps",
        description: "Walk 10,000 steps (universal daily movement)",
        type: "daily",
        completed: false,
        xpReward: 30,
        attributeRewards: { physical: 10, health: 8 },
      },
      {
        id: "gym-flexible-1",
        name: "Strength Training Session",
        description: "Complete a full strength workout (4-6 times per week based on your schedule)",
        type: "flexible",
        completed: false,
        weeklyTarget: 5, // User can adjust this
        weeklyProgress: 0,
        xpReward: 80,
        attributeRewards: { physical: 30, resilience: 20 },
      },
      {
        id: "gym-weekly-1",
        name: "Progressive Overload",
        description: "Increase weight, reps, or sets on 3 major compound movements",
        type: "weekly",
        completed: false,
        weeklyTarget: 3,
        weeklyProgress: 0,
        xpReward: 100,
        attributeRewards: { physical: 35, resilience: 25 },
      },
    ],
  },
  {
    name: "⚡️ The Pulse Runner",
    description: "Master cardiovascular endurance and become one with speed",
    domain: "Physical Discipline",
    difficulty: "intermediate",
    currentTitle: "Steady Jogger",
    nextTitle: "Wind Walker",
    associatedAttributes: ["physical", "health"],
    totalXP: 0,
    completionRate: 0,
    pathType: "daily-focused",
    keywords: ["running", "cardio", "endurance", "marathon"],
    prerequisites: [
      {
        id: "running-daily-1",
        name: "Daily Steps",
        description: "Walk/run 10,000 steps minimum",
        type: "daily",
        completed: false,
        xpReward: 30,
        attributeRewards: { physical: 12, health: 10 },
      },
      {
        id: "running-daily-2",
        name: "Cardio Session",
        description: "Complete 30-45 minute run or cardio workout",
        type: "daily",
        completed: false,
        xpReward: 55,
        attributeRewards: { physical: 20, health: 18 },
      },
      {
        id: "running-weekly-1",
        name: "Long Distance Challenge",
        description: "Complete 1 long-distance run (60+ minutes)",
        type: "weekly",
        completed: false,
        weeklyTarget: 1,
        weeklyProgress: 0,
        xpReward: 90,
        attributeRewards: { physical: 25, health: 25 },
      },
    ],
  },
  // Work & Career
  {
    name: "💻 The Codebound",
    description: "Bend digital reality through the mastery of code",
    domain: "Work & Career",
    difficulty: "advanced",
    currentTitle: "Script Apprentice",
    nextTitle: "Code Warrior",
    associatedAttributes: ["intelligence", "creativity"],
    totalXP: 0,
    completionRate: 0,
    pathType: "daily-focused",
    keywords: ["coding", "programming", "development", "software"],
    prerequisites: [
      {
        id: "coding-daily-1",
        name: "Active Coding",
        description: "Code for 2+ hours on personal or professional projects",
        type: "daily",
        completed: false,
        xpReward: 70,
        attributeRewards: { intelligence: 25, creativity: 15 },
      },
      {
        id: "coding-daily-2",
        name: "Technical Learning",
        description: "Study new technologies, frameworks, or CS concepts for 30 minutes",
        type: "daily",
        completed: false,
        xpReward: 40,
        attributeRewards: { intelligence: 18, creativity: 8 },
      },
      {
        id: "coding-weekly-1",
        name: "Project Deployment",
        description: "Complete and deploy 1 functional project or feature",
        type: "weekly",
        completed: false,
        weeklyTarget: 1,
        weeklyProgress: 0,
        xpReward: 150,
        attributeRewards: { intelligence: 40, creativity: 30 },
      },
    ],
  },
  // Creative Arts
  {
    name: "🎞 Chrono Crafter",
    description: "Master the art of visual storytelling through time manipulation",
    domain: "Creative Arts",
    difficulty: "intermediate",
    currentTitle: "Clip Collector",
    nextTitle: "Scene Sculptor",
    associatedAttributes: ["creativity", "intelligence"],
    totalXP: 0,
    completionRate: 0,
    pathType: "project-focused",
    keywords: ["video", "editing", "film", "content"],
    prerequisites: [
      {
        id: "video-daily-1",
        name: "Edit Session",
        description: "Practice video editing techniques for 45+ minutes",
        type: "daily",
        completed: false,
        xpReward: 50,
        attributeRewards: { creativity: 20, intelligence: 12 },
      },
      {
        id: "video-weekly-1",
        name: "Complete Video Project",
        description: "Finish and publish 1 complete video project",
        type: "weekly",
        completed: false,
        weeklyTarget: 1,
        weeklyProgress: 0,
        xpReward: 120,
        attributeRewards: { creativity: 35, intelligence: 25 },
      },
      {
        id: "video-weekly-2",
        name: "Skill Development",
        description: "Learn 2 new editing techniques or effects this week",
        type: "weekly",
        completed: false,
        weeklyTarget: 2,
        weeklyProgress: 0,
        xpReward: 80,
        attributeRewards: { creativity: 25, intelligence: 15 },
      },
    ],
  },
  // Spiritual Growth
  {
    name: "🕊 Soul of Serenity",
    description: "Find inner peace and spiritual strength through meditation",
    domain: "Spiritual Growth",
    difficulty: "beginner",
    currentTitle: "Peaceful Seeker",
    nextTitle: "Mindful Guardian",
    associatedAttributes: ["spiritual", "health"],
    totalXP: 0,
    completionRate: 0,
    pathType: "daily-focused",
    keywords: ["meditation", "mindfulness", "peace", "spiritual"],
    prerequisites: [
      {
        id: "meditation-daily-1",
        name: "Morning Meditation",
        description: "Meditate for 20-30 minutes in complete silence",
        type: "daily",
        completed: false,
        xpReward: 45,
        attributeRewards: { spiritual: 20, health: 15 },
      },
      {
        id: "meditation-daily-2",
        name: "Mindful Breathing",
        description: "Practice 10 minutes of focused breathing exercises",
        type: "daily",
        completed: false,
        xpReward: 25,
        attributeRewards: { spiritual: 12, health: 8 },
      },
      {
        id: "meditation-weekly-1",
        name: "Extended Practice",
        description: "Complete 2 extended meditation sessions (45+ minutes each)",
        type: "weekly",
        completed: false,
        weeklyTarget: 2,
        weeklyProgress: 0,
        xpReward: 100,
        attributeRewards: { spiritual: 30, health: 25 },
      },
    ],
  },
  {
    name: "🔥 Stoneheart Protocol",
    description: "Forge unbreakable mental fortitude through stoic discipline",
    domain: "Spiritual Growth",
    difficulty: "advanced",
    currentTitle: "Stoic Apprentice",
    nextTitle: "Iron Will",
    associatedAttributes: ["resilience", "spiritual"],
    totalXP: 0,
    completionRate: 0,
    pathType: "balanced",
    keywords: ["stoic", "discipline", "mental", "fortitude"],
    prerequisites: [
      {
        id: "stoic-daily-1",
        name: "Stoic Reflection",
        description: "Practice daily stoic exercises and philosophical reflection for 30 minutes",
        type: "daily",
        completed: false,
        xpReward: 55,
        attributeRewards: { resilience: 22, spiritual: 18 },
      },
      {
        id: "stoic-daily-2",
        name: "Discomfort Training",
        description: "Deliberately practice discomfort (cold shower, difficult task, etc.)",
        type: "daily",
        completed: false,
        xpReward: 40,
        attributeRewards: { resilience: 25, spiritual: 8 },
      },
      {
        id: "stoic-weekly-1",
        name: "Adversity Challenge",
        description: "Complete 3 challenging tasks outside your comfort zone",
        type: "weekly",
        completed: false,
        weeklyTarget: 3,
        weeklyProgress: 0,
        xpReward: 120,
        attributeRewards: { resilience: 35, spiritual: 25 },
      },
    ],
  },
]

// Enhanced path matching system
function findPathByKeywords(input) {
  const lowerInput = input.toLowerCase()

  // Direct name matching first
  const directMatch = SAMPLE_PATHS.find(
    (path) => path.name.toLowerCase().includes(lowerInput) || path.description.toLowerCase().includes(lowerInput),
  )

  if (directMatch) return directMatch

  // Keyword matching
  const keywordMatch = SAMPLE_PATHS.find((path) => path.keywords.some((keyword) => lowerInput.includes(keyword)))

  return keywordMatch
}

function generateAIPath(goal) {
  // Check if it matches any existing path first
  const existingPath = findPathByKeywords(goal)
  if (existingPath) {
    return existingPath
  }

  // If no match, create a basic custom path
  return {
    name: `🌟 Path of ${goal}`,
    description: `Master the art of ${goal} through dedicated practice`,
    domain: "Custom Path",
    difficulty: "intermediate",
    currentTitle: "Novice",
    nextTitle: "Apprentice",
    associatedAttributes: ["intelligence", "creativity"],
    totalXP: 0,
    completionRate: 0,
    pathType: "balanced",
    keywords: [goal.toLowerCase()],
    prerequisites: [
      {
        id: `${goal.toLowerCase().replace(/\s+/g, "-")}-daily-1`,
        name: `Daily ${goal} Practice`,
        description: `Practice ${goal} for 45 minutes with focused attention`,
        type: "daily",
        completed: false,
        xpReward: 50,
        attributeRewards: { intelligence: 15, creativity: 10 },
      },
      {
        id: `${goal.toLowerCase().replace(/\s+/g, "-")}-weekly-1`,
        name: `${goal} Weekly Challenge`,
        description: `Complete 2 challenging ${goal} projects this week`,
        type: "weekly",
        completed: false,
        weeklyTarget: 2,
        weeklyProgress: 0,
        xpReward: 80,
        attributeRewards: { intelligence: 20, creativity: 15 },
      },
    ],
  }
}

// Enhanced Radar Chart Component
function RadarChart({ attributes, size = 240 }) {
  const attributeArray = Object.values(attributes)
  const center = size / 2
  const radius = size / 2 - 30
  const angleStep = (2 * Math.PI) / attributeArray.length

  const getPoint = (value, index) => {
    const angle = index * angleStep - Math.PI / 2
    const normalizedValue = Math.min(value / 500, 1)
    const x = center + Math.cos(angle) * radius * normalizedValue
    const y = center + Math.sin(angle) * radius * normalizedValue
    return { x, y }
  }

  const getLabelPoint = (index) => {
    const angle = index * angleStep - Math.PI / 2
    const x = center + Math.cos(angle) * (radius + 20)
    const y = center + Math.sin(angle) * (radius + 20)
    return { x, y }
  }

  const pathData = attributeArray.map((attr, index) => getPoint(attr.value, index))
  const pathString = pathData.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z"

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} className="drop-shadow-2xl">
        {/* Glowing background */}
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(147, 51, 234, 0.3)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.05)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={center} cy={center} r={radius} fill="url(#radarGlow)" />

        {/* Background circles with glow */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="rgba(147, 51, 234, 0.3)"
            strokeWidth="1"
            filter="url(#glow)"
          />
        ))}

        {/* Axis lines */}
        {attributeArray.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2
          const endX = center + Math.cos(angle) * radius
          const endY = center + Math.sin(angle) * radius
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="rgba(147, 51, 234, 0.4)"
              strokeWidth="2"
              filter="url(#glow)"
            />
          )
        })}

        {/* Data area with enhanced glow */}
        <path
          d={pathString}
          fill="rgba(147, 51, 234, 0.4)"
          stroke="rgb(147, 51, 234)"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* Data points with enhanced styling */}
        {pathData.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="rgb(147, 51, 234)"
            stroke="white"
            strokeWidth="3"
            filter="url(#glow)"
          />
        ))}

        {/* Labels with better styling */}
        {attributeArray.map((attr, index) => {
          const labelPoint = getLabelPoint(index)
          return (
            <g key={index}>
              <text
                x={labelPoint.x}
                y={labelPoint.y - 8}
                textAnchor="middle"
                className="text-sm font-bold fill-purple-300"
                filter="url(#glow)"
              >
                {attr.icon}
              </text>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 8}
                textAnchor="middle"
                className="text-xs font-semibold fill-purple-200"
              >
                {attr.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// NEW: Hunter Exam Component
function HunterExamCard({ exam, examRank, userData, onTakeExam }) {
  const canTakeExam = userData.availableExams.includes(examRank)
  const examCompleted = userData.completedExams.includes(examRank)

  return (
    <Card
      className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-2 ${
        examCompleted
          ? "border-green-500/50 shadow-green-500/20"
          : canTakeExam
            ? "border-yellow-500/50 shadow-yellow-500/20 animate-pulse"
            : "border-gray-500/30"
      } shadow-2xl`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle
              className={`text-xl font-bold flex items-center ${
                examCompleted ? "text-green-400" : canTakeExam ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              <Swords className="h-6 w-6 mr-3" />
              {exam.name}
            </CardTitle>
            <p className="text-gray-400 font-medium mt-1">{exam.description}</p>
          </div>
          <Badge
            className={`text-2xl px-4 py-2 font-bold ${getRankColor(examRank)} border-current ${getRankGlow(examRank)}`}
          >
            {examRank}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-purple-300 mb-2">Requirements:</h4>
          <ul className="space-y-1">
            {exam.requirements.map((req, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-xl">
          <h4 className="font-semibold text-yellow-400 mb-2">Rewards:</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Title:</span>
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                {exam.rewards.title}
              </Badge>
            </div>
            <div className="text-sm text-gray-300">
              <span className="font-medium text-purple-400">Ability:</span> {exam.rewards.ability}
            </div>
            <div className="text-xs text-gray-400">{exam.rewards.abilityDescription}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">XP Bonus:</span>
              <span className="text-yellow-400 font-bold">+{exam.rewards.xpBonus} XP</span>
            </div>
          </div>
        </div>

        {examCompleted ? (
          <div className="text-center p-3 bg-green-500/20 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-1" />
            <span className="text-green-400 font-semibold">Exam Completed!</span>
          </div>
        ) : canTakeExam ? (
          <Button
            onClick={() => onTakeExam(examRank)}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 font-semibold shadow-lg"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Take Hunter Exam
          </Button>
        ) : (
          <div className="text-center p-3 bg-gray-500/20 rounded-lg">
            <Clock className="h-6 w-6 text-gray-400 mx-auto mb-1" />
            <span className="text-gray-400 font-medium">Requirements not met</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// AuthForm Component with enhanced styling
function AuthForm({ onLogin, onSignup }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ email: "", username: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")

    if (!loginForm.email || !loginForm.password) {
      setError("Please fill in all fields")
      return
    }

    const success = onLogin(loginForm.email, loginForm.password)
    if (!success) {
      setError("Invalid email or password")
    }
  }

  const handleSignup = (e) => {
    e.preventDefault()
    setError("")

    if (!signupForm.email || !signupForm.username || !signupForm.password || !signupForm.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    const success = onSignup(signupForm.email, signupForm.username, signupForm.password)
    if (!success) {
      setError("Email already exists")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full"></div>
      </div>

      <Card className="w-full max-w-md bg-black/90 backdrop-blur-xl border-purple-500/40 shadow-2xl shadow-purple-500/25 relative z-10">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              LIMITLESS
            </CardTitle>
            <p className="text-purple-300 mt-3 text-lg font-medium">Enter the Hunter System</p>
          </div>
        </CardHeader>

        <CardContent className="pb-8">
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/70 border border-purple-500/40">
              <TabsTrigger value="login" className="data-[state=active]:bg-purple-600 data-[state=active]:shadow-lg">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-purple-600 data-[state=active]:shadow-lg">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-purple-300 font-medium">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="bg-gray-900/70 border-purple-500/40 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                    placeholder="hunter@system.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-purple-300 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="bg-gray-900/70 border-purple-500/40 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 pr-12"
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 font-semibold py-3"
                >
                  Enter the System
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-purple-300 font-medium">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="bg-gray-900/70 border-purple-500/40 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                    placeholder="hunter@system.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="text-purple-300 font-medium">
                    Hunter Name
                  </Label>
                  <Input
                    id="signup-username"
                    type="text"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                    className="bg-gray-900/70 border-purple-500/40 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                    placeholder="Your Hunter Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-purple-300 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className="bg-gray-900/70 border-purple-500/40 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 pr-12"
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-purple-300 font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    className="bg-gray-900/70 border-purple-500/40 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                    placeholder="••••••••"
                  />
                </div>

                {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 font-semibold py-3"
                >
                  Begin Your Ascension
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Enhanced Main Dashboard Component
function LimitlessDashboard({ userData, onTogglePrerequisite, onAddPath, onRemovePath, onLogout, onTakeExam }) {
  const [newPathGoal, setNewPathGoal] = useState("")
  const [isCreatePathOpen, setIsCreatePathOpen] = useState(false)

  const totalActivePaths = userData.activePaths.length
  const completedTasksToday = userData.activePaths.reduce(
    (sum, path) => sum + path.prerequisites.filter((p) => p.type === "daily" && p.completed).length,
    0,
  )

  const totalDailyTasks = userData.activePaths.reduce(
    (sum, path) => sum + path.prerequisites.filter((p) => p.type === "daily").length,
    0,
  )

  const completedTasksThisWeek = userData.activePaths.reduce(
    (sum, path) => sum + path.prerequisites.filter((p) => p.type === "weekly" && p.completed).length,
    0,
  )

  const totalWeeklyTasks = userData.activePaths.reduce(
    (sum, path) => sum + path.prerequisites.filter((p) => p.type === "weekly").length,
    0,
  )

  const createNewPath = () => {
    if (!newPathGoal.trim()) return

    const pathTemplate = generateAIPath(newPathGoal.trim())
    onAddPath(pathTemplate)
    setNewPathGoal("")
    setIsCreatePathOpen(false)
  }

  const getPathTypeIcon = (pathType) => {
    switch (pathType) {
      case "daily-focused":
        return "🌅"
      case "weekly-focused":
      case "project-focused":
        return "📅"
      case "balanced":
        return "⚖️"
      case "flexible":
        return "🔄"
      default:
        return "🎯"
    }
  }

  const getPathTypeDescription = (pathType) => {
    switch (pathType) {
      case "daily-focused":
        return "Daily mastery"
      case "weekly-focused":
      case "project-focused":
        return "Project-based"
      case "balanced":
        return "Balanced approach"
      case "flexible":
        return "Flexible schedule"
      default:
        return "Custom progression"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/80 via-black/80 to-blue-900/80 backdrop-blur-xl border-b border-purple-500/30 shadow-2xl">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div
                className={`p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-2xl ${getRankGlow(userData.overallRank)} animate-pulse`}
              >
                <Crown className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  LIMITLESS
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-purple-300 text-lg font-medium">Hunter System • {userData.username}</p>
                  <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-400 font-bold">
                    {userData.hunterTitle}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-right">
                <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {userData.totalXP.toLocaleString()}
                </div>
                <div className="text-purple-300 font-medium">Experience Points</div>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-purple-500/40 text-purple-300 hover:bg-purple-600/20 hover:border-purple-400 font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Exit System
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 shadow-xl">
            <CardContent className="p-6 text-center">
              <Crown
                className={`h-10 w-10 mx-auto mb-3 ${getRankColor(userData.overallRank)} ${getRankGlow(userData.overallRank)}`}
              />
              <div className={`text-3xl font-bold ${getRankColor(userData.overallRank)}`}>{userData.overallRank}</div>
              <div className="text-purple-300 text-sm font-medium">Overall Rank</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 shadow-xl">
            <CardContent className="p-6 text-center">
              <Zap className="h-10 w-10 text-yellow-400 mx-auto mb-3 shadow-lg shadow-yellow-400/30" />
              <div className="text-3xl font-bold text-yellow-400">{userData.level}</div>
              <div className="text-purple-300 text-sm font-medium">Hunter Level</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 shadow-xl">
            <CardContent className="p-6 text-center">
              <Target className="h-10 w-10 text-green-400 mx-auto mb-3 shadow-lg shadow-green-400/30" />
              <div className="text-3xl font-bold text-green-400">{totalActivePaths}</div>
              <div className="text-purple-300 text-sm font-medium">Active Paths</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 shadow-xl">
            <CardContent className="p-6 text-center">
              <Flame className="h-10 w-10 text-orange-400 mx-auto mb-3 shadow-lg shadow-orange-400/30" />
              <div className="text-3xl font-bold text-orange-400">{userData.streakData.currentStreak}</div>
              <div className="text-purple-300 text-sm font-medium">Current Streak</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900/80 backdrop-blur-xl border border-purple-500/40 shadow-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-purple-600 data-[state=active]:shadow-lg font-medium"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="attributes"
              className="data-[state=active]:bg-purple-600 data-[state=active]:shadow-lg font-medium"
            >
              Attributes
            </TabsTrigger>
            <TabsTrigger
              value="paths"
              className="data-[state=active]:bg-purple-600 data-[state=active]:shadow-lg font-medium"
            >
              Paths
            </TabsTrigger>
            <TabsTrigger
              value="exams"
              className="data-[state=active]:bg-purple-600 data-[state=active]:shadow-lg font-medium"
            >
              Hunter Exams
            </TabsTrigger>
            <TabsTrigger
              value="story"
              className="data-[state=active]:bg-purple-600 data-[state=active]:shadow-lg font-medium"
            >
              Story
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-purple-300">Daily Progress</CardTitle>
                  <p className="text-gray-400 font-medium">Tasks completed today</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl font-extrabold text-blue-400">
                    {completedTasksToday} / {totalDailyTasks}
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/50"
                    >
                      View All Tasks
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-purple-300">Weekly Progress</CardTitle>
                  <p className="text-gray-400 font-medium">Tasks completed this week</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl font-extrabold text-green-400">
                    {completedTasksThisWeek} / {totalWeeklyTasks}
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/50"
                    >
                      Review Weekly Goals
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-300">Active Paths Overview</CardTitle>
                <p className="text-gray-400 font-medium">Your current journeys</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.activePaths.length === 0 ? (
                  <div className="text-center text-gray-400">No active paths. Start a new journey!</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userData.activePaths.map((path) => (
                      <Card
                        key={path.id}
                        className="bg-gray-800/80 border-purple-500/20 hover:border-purple-400/40 transition-colors duration-300"
                      >
                        <CardHeader className="space-y-1">
                          <CardTitle className="text-lg font-semibold text-purple-300 flex items-center">
                            {getPathTypeIcon(path.pathType)} {path.name}
                          </CardTitle>
                          <p className="text-gray-400 text-sm">{path.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-gray-300">
                            <span>{getPathTypeDescription(path.pathType)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemovePath(path.id)}
                              className="text-red-400 hover:bg-red-500/10"
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                onClick={() => setIsCreatePathOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg"
              >
                Create New Path
              </Button>
            </div>

            {isCreatePathOpen && (
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-purple-300">Create New Path</CardTitle>
                  <p className="text-gray-400 font-medium">Enter your goal</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="text"
                    placeholder="e.g., Learn Guitar, Write a Novel, Master Chess"
                    value={newPathGoal}
                    onChange={(e) => setNewPathGoal(e.target.value)}
                    className="bg-gray-900/70 border-purple-500/40 text-white placeholder:text-gray-400"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsCreatePathOpen(false)}
                      className="text-gray-400 hover:bg-gray-700/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={createNewPath}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg"
                    >
                      Generate Path
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="attributes">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-300">Hunter Attributes</CardTitle>
                <p className="text-gray-400 font-medium">Your core strengths</p>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(userData.attributes).map(([key, attribute]) => (
                  <Card
                    key={key}
                    className="bg-gray-800/80 border-purple-500/20 hover:border-purple-400/40 transition-colors duration-300"
                  >
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-lg font-semibold text-purple-300 flex items-center">
                        {attribute.icon} {attribute.name}
                      </CardTitle>
                      <p className="text-gray-400 text-sm">
                        Current Rank: <span className={getRankColor(attribute.rank)}>{attribute.rank}</span>
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-400">{attribute.value}</div>
                      <div className="mt-2 text-sm text-gray-300">
                        {/* Progress Bar */}
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200/20">
                            <div
                              style={{ width: `${getNextRankThreshold(attribute.value).progress}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-pink-500"
                            />
                          </div>
                        </div>
                        Next Rank:{" "}
                        <span className="text-purple-400">{getNextRankThreshold(attribute.value).nextRank}</span> (
                        {getNextRankThreshold(attribute.value).threshold} XP)
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-300">Attribute Distribution</CardTitle>
                <p className="text-gray-400 font-medium">Visual representation of your strengths</p>
              </CardHeader>
              <CardContent>
                <RadarChart attributes={userData.attributes} size={400} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paths">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-300">Active Paths</CardTitle>
                <p className="text-gray-400 font-medium">Your current journeys</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.activePaths.length === 0 ? (
                  <div className="text-center text-gray-400">No active paths. Start a new journey!</div>
                ) : (
                  <div className="space-y-6">
                    {userData.activePaths.map((path) => (
                      <Card
                        key={path.id}
                        className="bg-gray-800/80 border-purple-500/20 hover:border-purple-400/40 transition-colors duration-300"
                      >
                        <CardHeader className="space-y-1">
                          <CardTitle className="text-lg font-semibold text-purple-300 flex items-center">
                            {getPathTypeIcon(path.pathType)} {path.name}
                          </CardTitle>
                          <p className="text-gray-400 text-sm">{path.description}</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <h4 className="font-semibold text-purple-300">Prerequisites:</h4>
                          <ul className="space-y-2">
                            {path.prerequisites.map((prereq) => (
                              <li key={prereq.id} className="flex items-center justify-between">
                                <Label htmlFor={prereq.id} className="flex items-center space-x-2 text-gray-300">
                                  <Input
                                    type="checkbox"
                                    id={prereq.id}
                                    checked={prereq.completed}
                                    onChange={() => onTogglePrerequisite(path.id, prereq.id)}
                                    className="text-purple-500 focus:ring-purple-500"
                                  />
                                  <span>{prereq.name}</span>
                                </Label>
                                <Badge
                                  variant="secondary"
                                  className="text-xs font-bold text-blue-300 border-blue-500/30"
                                >
                                  +{prereq.xpReward} XP
                                </Badge>
                              </li>
                            ))}
                          </ul>
                          <div className="flex items-center justify-between">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemovePath(path.id)}
                              className="text-red-400 hover:bg-red-500/10"
                            >
                              Remove Path
                            </Button>
                            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                              {path.currentTitle}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                onClick={() => setIsCreatePathOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg"
              >
                Create New Path
              </Button>
            </div>

            {isCreatePathOpen && (
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-purple-300">Create New Path</CardTitle>
                  <p className="text-gray-400 font-medium">Enter your goal</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="text"
                    placeholder="e.g., Learn Guitar, Write a Novel, Master Chess"
                    value={newPathGoal}
                    onChange={(e) => setNewPathGoal(e.target.value)}
                    className="bg-gray-900/70 border-purple-500/40 text-white placeholder:text-gray-400"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsCreatePathOpen(false)}
                      className="text-gray-400 hover:bg-gray-700/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={createNewPath}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg"
                    >
                      Generate Path
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="exams">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-300">Hunter Exams</CardTitle>
                <p className="text-gray-400 font-medium">Prove your worth and unlock new abilities</p>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RANK_ORDER.slice(0, RANK_ORDER.indexOf("SSS") + 1).map((rank) => {
                  const exam = HUNTER_EXAMS[rank]
                  if (!exam) return null

                  return (
                    <HunterExamCard
                      key={rank}
                      exam={exam}
                      examRank={rank}
                      userData={userData}
                      onTakeExam={onTakeExam}
                    />
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="story">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-purple-500/40 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-300">Hunter's Journey</CardTitle>
                <p className="text-gray-400 font-medium">Unfold the story of Limitless</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Chapter {userData.storyProgress + 1}: Coming Soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Main App Component
function LimitlessApp() {
  const [userData, setUserData] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const currentUserEmail = getCurrentUser()
    if (currentUserEmail) {
      const data = loadUserData()
      if (data && data.email === currentUserEmail) {
        handleUserDataLoad(data)
        setIsAuthenticated(true)
      } else {
        logout()
      }
    }
    setIsLoading(false)
  }, [])

  const handleUserDataLoad = (data) => {
    const now = new Date().toISOString()
    let needsSave = false

    if (shouldResetDaily(data.lastDailyReset)) {
      data.activePaths = data.activePaths.map((path) => ({
        ...path,
        prerequisites: path.prerequisites.map((prereq) =>
          prereq.type === "daily" ? { ...prereq, completed: false } : prereq,
        ),
      }))
      data.lastDailyReset = now
      needsSave = true
    }

    if (shouldResetWeekly(data.lastWeeklyReset)) {
      data.activePaths = data.activePaths.map((path) => ({
        ...path,
        prerequisites: path.prerequisites.map((prereq) =>
          prereq.type === "weekly" ? { ...prereq, completed: false, weeklyProgress: 0 } : prereq,
        ),
      }))
      data.lastWeeklyReset = now
      needsSave = true
    }

    if (needsSave) {
      saveUserData(data)
    }

    setUserData(data)
  }

  const handleLogin = (email, password) => {
    const user = authenticateUser(email, password)
    if (user) {
      setCurrentUser(email)
      const data = loadUserData()
      if (data && data.email === email) {
        handleUserDataLoad(data)
      } else {
        const newData = createInitialUserData(email, user.username)
        setUserData(newData)
        saveUserData(newData)
      }
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const handleSignup = (email, username, password) => {
    const existingUsers = getAuthUsers()
    if (existingUsers.some((u) => u.email === email)) {
      return false
    }

    const newAuthUser = { email, username, password }
    saveAuthUser(newAuthUser)
    setCurrentUser(email)

    const newUserData = createInitialUserData(email, username)
    setUserData(newUserData)
    saveUserData(newUserData)
    setIsAuthenticated(true)
    return true
  }

  const handleLogout = () => {
    logout()
    setIsAuthenticated(false)
    setUserData(null)
  }

  const addPath = (pathTemplate) => {
    if (!userData) return

    const newPath = {
      ...pathTemplate,
      id: `path-${Date.now()}`,
      isActive: true,
    }

    setUserData((prev) =>
      prev
        ? {
            ...prev,
            activePaths: [...prev.activePaths, newPath],
          }
        : null,
    )
  }

  const removePath = (pathId) => {
    if (!userData) return

    setUserData((prev) =>
      prev
        ? {
            ...prev,
            activePaths: prev.activePaths.filter((path) => path.id !== pathId),
          }
        : null,
    )
  }

  const togglePrerequisite = (pathId, prereqId) => {
    if (!userData) return

    setUserData((prev) => {
      if (!prev) return null

      const updatedPaths = prev.activePaths.map((path) => {
        if (path.id !== pathId) return path

        const updatedPrereqs = path.prerequisites.map((prereq) => {
          if (prereq.id !== prereqId) return prereq

          const newCompleted = !prereq.completed
          let newWeeklyProgress = prereq.weeklyProgress || 0

          if (prereq.type === "weekly" && newCompleted && prereq.weeklyProgress !== undefined) {
            newWeeklyProgress = Math.min((prereq.weeklyProgress || 0) + 1, prereq.weeklyTarget || 1)
          }

          return {
            ...prereq,
            completed: prereq.type === "daily" ? newCompleted : newWeeklyProgress >= (prereq.weeklyTarget || 1),
            weeklyProgress: prereq.type === "weekly" ? newWeeklyProgress : undefined,
          }
        })

        return { ...path, prerequisites: updatedPrereqs }
      })

      // Calculate attribute and XP gains
      const completedPrereq = prev.activePaths
        .find((p) => p.id === pathId)
        ?.prerequisites.find((p) => p.id === prereqId)

      if (completedPrereq && !completedPrereq.completed) {
        const updatedAttributes = { ...prev.attributes }
        const xpGain = completedPrereq.xpReward

        // Apply attribute rewards
        Object.entries(completedPrereq.attributeRewards).forEach(([attrName, reward]) => {
          if (updatedAttributes[attrName]) {
            const newValue = updatedAttributes[attrName].value + reward
            updatedAttributes[attrName] = {
              ...updatedAttributes[attrName],
              value: newValue,
              rank: calculateAttributeRank(newValue),
            }
          }
        })

        const newTotalXP = prev.totalXP + xpGain
        const newOverallRank = calculateOverallRank(updatedAttributes)

        return {
          ...prev,
          activePaths: updatedPaths,
          attributes: updatedAttributes,
          totalXP: newTotalXP,
          overallRank: newOverallRank,
          level: Math.floor(newTotalXP / 1000) + 1,
        }
      }

      return { ...prev, activePaths: updatedPaths }
    })
  }

  const handleTakeExam = (examRank) => {
    // Simulate exam completion for demo
    setUserData((prev) => {
      if (!prev) return null

      const exam = HUNTER_EXAMS[examRank]
      const updatedCompletedExams = [...prev.completedExams, examRank]
      const updatedAvailableExams = prev.availableExams.filter((rank) => rank !== examRank)

      // Add next exam if available
      const nextRankIndex = RANK_ORDER.indexOf(examRank) + 1
      if (nextRankIndex < RANK_ORDER.length) {
        const nextRank = RANK_ORDER[nextRankIndex]
        if (HUNTER_EXAMS[nextRank] && !updatedAvailableExams.includes(nextRank)) {
          updatedAvailableExams.push(nextRank)
        }
      }

      return {
        ...prev,
        completedExams: updatedCompletedExams,
        availableExams: updatedAvailableExams,
        hunterTitle: exam.rewards.title,
        activeAbilities: [...(prev.activeAbilities || []), exam.rewards.ability],
        totalXP: prev.totalXP + exam.rewards.xpBonus,
      }
    })
  }

  // Save data whenever userData changes
  useEffect(() => {
    if (userData && isAuthenticated) {
      saveUserData(userData)
    }
  }, [userData, isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400 text-xl font-medium">Loading Hunter System...</div>
      </div>
    )
  }

  if (!isAuthenticated || !userData) {
    return <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
  }

  return (
    <LimitlessDashboard
      userData={userData}
      onTogglePrerequisite={togglePrerequisite}
      onAddPath={addPath}
      onRemovePath={removePath}
      onLogout={handleLogout}
      onTakeExam={handleTakeExam}
    />
  )
}

// Add the missing export default
export default LimitlessApp
