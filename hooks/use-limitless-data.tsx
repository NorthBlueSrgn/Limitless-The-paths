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
  Chronicle,
} from "@/types/limitless"

// Mock data with more immersive content
const mockUserProfile: UserProfile = {
  id: "hunter_001",
  username: "The Seeker",
  email: "seeker@chapterblack.dev",
  rank: "E",
  level: 1,
  totalXP: 0,
  currentXP: 0,
  nextRankXP: 3000,
  joinDate: "2024-01-01",
  lastActive: new Date().toISOString(),
  streak: 0,
  title: "Unranked Hunter",
  aura: "Dormant",
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
    color: "#8B5CF6",
  },
  {
    name: "Physical",
    value: 0,
    maxValue: 100,
    rank: "E",
    xpGained: 0,
    decayRate: 0.15,
    lastUpdated: new Date().toISOString(),
    color: "#EF4444",
  },
  {
    name: "Health",
    value: 0,
    maxValue: 100,
    rank: "E",
    xpGained: 0,
    decayRate: 0.05,
    lastUpdated: new Date().toISOString(),
    color: "#10B981",
  },
  {
    name: "Intelligence",
    value: 0,
    maxValue: 100,
    rank: "E",
    xpGained: 0,
    decayRate: 0.08,
    lastUpdated: new Date().toISOString(),
    color: "#3B82F6",
  },
  {
    name: "Creativity",
    value: 0,
    maxValue: 100,
    rank: "E",
    xpGained: 0,
    decayRate: 0.12,
    lastUpdated: new Date().toISOString(),
    color: "#F59E0B",
  },
  {
    name: "Resilience",
    value: 0,
    maxValue: 100,
    rank: "E",
    xpGained: 0,
    decayRate: 0.06,
    lastUpdated: new Date().toISOString(),
    color: "#6B7280",
  },
]

const mockSoulTraits: SoulTrait[] = [
  {
    id: "strategist",
    name: "The Strategist",
    description: "Plans ahead and thinks systematically",
    unlocked: false,
    level: 0,
    prerequisites: ["intelligence_25", "consistency_7days"],
    effects: ["+10% XP from mental tasks", "Unlock advanced planning tools"],
    color: "#3B82F6",
    position: { x: 100, y: 50 },
  },
  {
    id: "ghost",
    name: "The Ghost",
    description: "Moves silently and strikes precisely",
    unlocked: false,
    level: 0,
    prerequisites: ["strategist", "predator"],
    effects: ["Stealth mode for habits", "+15% efficiency"],
    color: "#6B7280",
    position: { x: 200, y: 100 },
  },
  {
    id: "predator",
    name: "The Predator",
    description: "Hunts goals with relentless focus",
    unlocked: false,
    level: 0,
    prerequisites: ["physical_30", "resilience_25"],
    effects: ["+20% XP from challenges", "Intimidation aura"],
    color: "#EF4444",
    position: { x: 150, y: 150 },
  },
  {
    id: "oracle",
    name: "The Oracle",
    description: "Sees patterns and predicts outcomes",
    unlocked: false,
    level: 0,
    prerequisites: ["spiritual_40", "intelligence_35"],
    effects: ["Future path predictions", "+25% insight XP"],
    color: "#8B5CF6",
    position: { x: 50, y: 100 },
  },
  {
    id: "obsidian",
    name: "The Obsidian",
    description: "Unbreakable will and diamond focus",
    unlocked: false,
    level: 0,
    prerequisites: ["resilience_50", "streak_30days"],
    effects: ["Immunity to decay", "+30% all XP"],
    color: "#1F2937",
    position: { x: 125, y: 200 },
  },
]

const mockDailyTasks: DailyTask[] = [
  {
    id: "task_001",
    title: "Morning Meditation",
    description: "Begin your day with 10 minutes of focused meditation",
    category: "Spiritual",
    difficulty: "Easy",
    xpReward: 50,
    attributeRewards: { Spiritual: 10, Resilience: 5 },
    completed: false,
    timeEstimate: 10,
    type: "daily",
  },
  {
    id: "task_002",
    title: "Strategic Reading",
    description: "Read 20 pages of a challenging book",
    category: "Intelligence",
    difficulty: "Medium",
    xpReward: 75,
    attributeRewards: { Intelligence: 15, Creativity: 5 },
    completed: false,
    timeEstimate: 30,
    type: "daily",
  },
  {
    id: "task_003",
    title: "Physical Training",
    description: "Complete a 30-minute workout session",
    category: "Physical",
    difficulty: "Medium",
    xpReward: 100,
    attributeRewards: { Physical: 20, Health: 10 },
    completed: false,
    timeEstimate: 30,
    type: "daily",
  },
]

export function useLimitlessData() {
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile)
  const [attributes, setAttributes] = useState<Attribute[]>(mockAttributes)
  const [soulTraits, setSoulTraits] = useState<SoulTrait[]>(mockSoulTraits)
  const [activePaths, setActivePaths] = useState<Path[]>([])
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(mockDailyTasks)
  const [storyChapters, setStoryChapters] = useState<StoryChapter[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [hunterExams, setHunterExams] = useState<HunterExam[]>([])
  const [decayMetrics, setDecayMetrics] = useState<DecayMetric[]>([])
  const [chronicles, setChronicles] = useState<Chronicle[]>([])

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      // Mock loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Set initial story chapter
      setStoryChapters([
        {
          id: "chapter_001",
          title: "The Awakening",
          content: `The room is silent. White walls stretch endlessly, unmarked by time or memory. You stand at the threshold of something greater than yourself.

Hunter designation: ${mockUserProfile.id}. Rank: E. Status: Unproven.

In this place, potential means nothing without action. Every choice you make will be recorded, analyzed, perfected. The system watches. The system learns. The system evolves you.

Your first test begins now. Will you rise to meet it, or will you remain another forgotten soul in the archives of mediocrity?

The choice, as always, is yours.`,
          chapterNumber: 1,
          unlocked: true,
          completed: false,
          themes: ["awakening", "potential", "choice"],
          requiredTaskCompletion: 60,
          rewards: [{ type: "XP", value: 100 }],
          tone: "neutral",
          characterMoments: ["First system interaction", "Rank E designation"],
        },
      ])

      // Set initial hunter exam
      setHunterExams([
        {
          id: "exam_001",
          name: "The First Gate",
          description: "Prove your dedication and unlock the path to Rank D",
          targetRank: "D",
          phases: [
            {
              id: "phase_001",
              name: "Foundation of Will",
              type: "Endurance",
              description: "Complete all daily tasks for 7 consecutive days",
              requirements: ["daily_tasks_completion", "streak_7days", "no_decay"],
              completed: false,
            },
            {
              id: "phase_002",
              name: "Mind Over Matter",
              type: "Challenge",
              description: "Demonstrate mental resilience through focused challenges",
              requirements: ["meditation_streak", "reading_goals", "reflection_depth"],
              completed: false,
            },
            {
              id: "phase_003",
              name: "The Crucible",
              type: "Task",
              description: "Face a personalized trial based on your chosen paths",
              requirements: ["path_mastery", "attribute_threshold", "story_engagement"],
              completed: false,
            },
          ],
          rewards: [
            { type: "XP", value: 500 },
            { type: "Title", value: 1, target: "Proven Hunter" },
            { type: "Trait", value: 1, target: "Iron Will" },
          ],
          unlocked: false,
          completed: false,
          attempts: 0,
          bestScore: 0,
          duration: 7,
          intensity: "Standard",
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

      // Check for rank up
      const completedTasks = dailyTasks.filter((t) => t.completed).length + 1
      const totalTasks = dailyTasks.length
      if (completedTasks === totalTasks) {
        // Unlock next chapter or exam
        console.log("All tasks completed! Story progression unlocked.")
      }
    }
  }

  const addJournalEntry = (entry: Omit<JournalEntry, "id">) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal_${Date.now()}`,
    }
    setJournalEntries((prev) => [newEntry, ...prev])
  }

  const addChronicle = (chronicle: Omit<Chronicle, "id">) => {
    const newChronicle: Chronicle = {
      ...chronicle,
      id: `chronicle_${Date.now()}`,
    }
    setChronicles((prev) => [newChronicle, ...prev])
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
    chronicles,
    completeTask,
    addJournalEntry,
    addChronicle,
    updateSoulTrait,
    setUserProfile,
    setAttributes,
    setActivePaths,
    setDailyTasks,
  }
}
