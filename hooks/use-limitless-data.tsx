"use client"

import { useState, useEffect } from "react"
import type {
  UserProfile,
  Attribute,
  Path,
  DailyTask,
  StoryChapter,
  JournalEntry,
  HunterExam,
  SoulTrait,
  DecayMetric,
} from "@/types/limitless"

// Mock data - replace with actual API calls
const mockUserProfile: UserProfile = {
  id: "user_001",
  username: "Hunter Seeker",
  email: "hunter@limitless.dev",
  rank: "E",
  level: 1,
  totalXP: 0,
  currentXP: 0,
  nextRankXP: 3000,
  joinDate: "2024-01-01",
  lastActive: new Date().toISOString(),
  streak: 0,
  title: "Novice Hunter",
}

const mockAttributes: Attribute[] = [
  {
    name: "Spiritual",
    value: 0,
    maxValue: 100,
    rank: "E",
    xpGained: 0,
    decayRate: 0.1,
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Physical",
    value: 0,
    maxValue: 100,
    rank: "E",
    xpGained: 0,
    decayRate: 0.15,
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Health",
    value: 0,
    maxValue: 100,
    rank: "E",
    xpGained: 0,
    decayRate: 0.05,
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Intelligence",
    value: 0,
    maxValue: 100,
    rank: "E",
    xpGained: 0,
    decayRate: 0.08,
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Creativity",
    value: 0,
    maxValue: 100,
    rank: "E",
    xpGained: 0,
    decayRate: 0.12,
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Resilience",
    value: 0,
    maxValue: 100,
    rank: "E",
    xpGained: 0,
    decayRate: 0.06,
    lastUpdated: new Date().toISOString(),
  },
]

const mockSoulTraits: SoulTrait[] = [
  {
    id: "strategist",
    name: "Strategist",
    description: "Plans ahead and thinks systematically",
    unlocked: false,
    level: 0,
    prerequisites: ["intelligence_25", "consistency_7days"],
    effects: ["+10% XP from mental tasks", "Unlock advanced planning tools"],
    color: "#3B82F6",
  },
  {
    id: "ghost",
    name: "Ghost",
    description: "Moves silently and strikes precisely",
    unlocked: false,
    level: 0,
    prerequisites: ["strategist", "predator"],
    effects: ["Stealth mode for habits", "+15% efficiency"],
    color: "#6B7280",
  },
  {
    id: "predator",
    name: "Predator",
    description: "Hunts goals with relentless focus",
    unlocked: false,
    level: 0,
    prerequisites: ["physical_30", "resilience_25"],
    effects: ["+20% XP from challenges", "Intimidation aura"],
    color: "#EF4444",
  },
  {
    id: "oracle",
    name: "Oracle",
    description: "Sees patterns and predicts outcomes",
    unlocked: false,
    level: 0,
    prerequisites: ["spiritual_40", "intelligence_35"],
    effects: ["Future path predictions", "+25% insight XP"],
    color: "#8B5CF6",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    description: "Unbreakable will and diamond focus",
    unlocked: false,
    level: 0,
    prerequisites: ["resilience_50", "streak_30days"],
    effects: ["Immunity to decay", "+30% all XP"],
    color: "#1F2937",
  },
]

export function useLimitlessData() {
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile)
  const [attributes, setAttributes] = useState<Attribute[]>(mockAttributes)
  const [soulTraits, setSoulTraits] = useState<SoulTrait[]>(mockSoulTraits)
  const [activePaths, setActivePaths] = useState<Path[]>([])
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [storyChapters, setStoryChapters] = useState<StoryChapter[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [hunterExams, setHunterExams] = useState<HunterExam[]>([])
  const [decayMetrics, setDecayMetrics] = useState<DecayMetric[]>([])

  // Simulate data loading
  useEffect(() => {
    // In a real app, this would be API calls
    const loadData = async () => {
      // Mock loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Set initial data
      setActivePaths([])
      setDailyTasks([])
      setStoryChapters([
        {
          id: "chapter_001",
          title: "The First Steps",
          content:
            "Hunter 44251628, your journey continues to unfold. The path ahead shimmers with possibility. Each step forward is a choice to become more than you were yesterday.",
          chapterNumber: 1,
          unlocked: true,
          completed: false,
          themes: ["beginning", "awakening", "potential"],
          requiredTaskCompletion: 60,
          rewards: [{ type: "XP", value: 100 }],
          imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-06-25%20at%2017.55.39-mioWE5tRidLjnrHR703tjyHmBDotlZ.png",
        },
      ])
      setJournalEntries([])
      setHunterExams([
        {
          id: "exam_001",
          name: "The First Gate",
          description: "Prove your dedication and unlock Rank D",
          targetRank: "D",
          phases: [
            {
              id: "phase_001",
              name: "Foundation Building",
              type: "Task",
              description: "Complete 10 consecutive daily tasks",
              requirements: ["daily_tasks_10", "streak_7days"],
              completed: false,
            },
          ],
          rewards: [
            { type: "XP", value: 500 },
            { type: "Title", value: 1, target: "Dedicated Hunter" },
          ],
          unlocked: false,
          completed: false,
          attempts: 0,
          bestScore: 0,
        },
      ])
    }

    loadData()
  }, [])

  const completeTask = (taskId: string) => {
    setDailyTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))

    // Update XP and attributes
    const task = dailyTasks.find((t) => t.id === taskId)
    if (task) {
      setUserProfile((prev) => ({
        ...prev,
        currentXP: prev.currentXP + task.xpReward,
        totalXP: prev.totalXP + task.xpReward,
      }))

      // Update attributes
      Object.entries(task.attributeRewards).forEach(([attrName, xp]) => {
        setAttributes((prev) =>
          prev.map((attr) =>
            attr.name === attrName
              ? { ...attr, value: Math.min(attr.value + xp, attr.maxValue), xpGained: attr.xpGained + xp }
              : attr,
          ),
        )
      })
    }
  }

  const addJournalEntry = (entry: Omit<JournalEntry, "id">) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal_${Date.now()}`,
    }
    setJournalEntries((prev) => [newEntry, ...prev])
  }

  const updateSoulTrait = (traitId: string, updates: Partial<SoulTrait>) => {
    setSoulTraits((prev) => prev.map((trait) => (trait.id === traitId ? { ...trait, ...updates } : trait)))
  }

  return {
    userProfile,
    attributes,
    soulTraits,
    activePaths,
    dailyTasks,
    storyChapters,
    journalEntries,
    hunterExams,
    decayMetrics,
    completeTask,
    addJournalEntry,
    updateSoulTrait,
    setUserProfile,
    setAttributes,
    setActivePaths,
    setDailyTasks,
  }
}
