import type { Path } from "../types"

export const SAMPLE_PATHS: Omit<Path, "id" | "isActive">[] = [
  {
    name: "🧩 Hunter's Mind",
    description: "Master the art of strategic thinking through chess",
    domain: "Mental Mastery",
    difficulty: "intermediate",
    currentTitle: "Novice",
    nextTitle: "Amateur",
    associatedAttributes: ["intelligence", "resilience"],
    totalXP: 0,
    completionRate: 0,
    prerequisites: [
      {
        id: "chess-daily-1",
        name: "Daily Chess Study",
        description: "Study chess tactics for 30 minutes",
        type: "daily",
        completed: false,
        xpReward: 45,
        attributeRewards: { intelligence: 12, resilience: 8 },
      },
      {
        id: "chess-weekly-1",
        name: "Chess Games",
        description: "Play 5 chess games this week",
        type: "weekly",
        completed: false,
        weeklyTarget: 5,
        weeklyProgress: 0,
        xpReward: 90,
        attributeRewards: { intelligence: 25, resilience: 15 },
      },
    ],
  },
  {
    name: "🛡 Freak of Nature",
    description: "Transform your body into an unstoppable force",
    domain: "Physical Discipline",
    difficulty: "advanced",
    currentTitle: "Rookie",
    nextTitle: "Beast Mode",
    associatedAttributes: ["physical", "resilience"],
    totalXP: 0,
    completionRate: 0,
    prerequisites: [
      {
        id: "gym-daily-1",
        name: "Strength Training",
        description: "Complete a 60-minute strength workout",
        type: "daily",
        completed: false,
        xpReward: 60,
        attributeRewards: { physical: 20, resilience: 15 },
      },
      {
        id: "gym-weekly-1",
        name: "Progressive Overload",
        description: "Increase weight/reps on 3 exercises this week",
        type: "weekly",
        completed: false,
        weeklyTarget: 3,
        weeklyProgress: 0,
        xpReward: 100,
        attributeRewards: { physical: 30, resilience: 20 },
      },
    ],
  },
  {
    name: "💻 The Codebound",
    description: "Bend reality through the power of code",
    domain: "Work & Career",
    difficulty: "advanced",
    currentTitle: "Script Kiddie",
    nextTitle: "Code Warrior",
    associatedAttributes: ["intelligence", "creativity"],
    totalXP: 0,
    completionRate: 0,
    prerequisites: [
      {
        id: "coding-daily-1",
        name: "Daily Coding",
        description: "Code for 2 hours on personal projects",
        type: "daily",
        completed: false,
        xpReward: 70,
        attributeRewards: { intelligence: 18, creativity: 12 },
      },
      {
        id: "coding-weekly-1",
        name: "Code Review",
        description: "Review and refactor code 3 times this week",
        type: "weekly",
        completed: false,
        weeklyTarget: 3,
        weeklyProgress: 0,
        xpReward: 85,
        attributeRewards: { intelligence: 20, creativity: 15 },
      },
    ],
  },
]

export function createCustomPath(goal: string): Omit<Path, "id" | "isActive"> {
  return {
    name: `🌟 Path of ${goal}`,
    description: `Master the art of ${goal} through dedicated practice`,
    domain: "Custom Path",
    difficulty: "beginner",
    currentTitle: "Novice",
    nextTitle: "Apprentice",
    associatedAttributes: ["intelligence", "creativity"],
    totalXP: 0,
    completionRate: 0,
    prerequisites: [
      {
        id: `${goal.toLowerCase().replace(/\s+/g, "-")}-daily-1`,
        name: `Daily ${goal} Practice`,
        description: `Practice ${goal} for 30 minutes`,
        type: "daily",
        completed: false,
        xpReward: 30,
        attributeRewards: { intelligence: 10, creativity: 5 },
      },
      {
        id: `${goal.toLowerCase().replace(/\s+/g, "-")}-weekly-1`,
        name: `${goal} Weekly Challenge`,
        description: `Complete 2 challenging ${goal} tasks this week`,
        type: "weekly",
        completed: false,
        weeklyTarget: 2,
        weeklyProgress: 0,
        xpReward: 60,
        attributeRewards: { intelligence: 15, creativity: 10 },
      },
    ],
  }
}

export function getPathByKeyword(keyword: string): Omit<Path, "id" | "isActive"> | undefined {
  const lowerKeyword = keyword.toLowerCase()
  return SAMPLE_PATHS.find(
    (path) => path.name.toLowerCase().includes(lowerKeyword) || path.description.toLowerCase().includes(lowerKeyword),
  )
}

export function generateAIPath(goal: string): Omit<Path, "id" | "isActive"> {
  // Placeholder for AI path generation logic
  // In a real application, this function would use an AI model to generate a path
  // based on the provided goal.
  return {
    name: `🤖 AI Path: ${goal}`,
    description: `AI-generated path for mastering ${goal}`,
    domain: "AI Generated",
    difficulty: "intermediate",
    currentTitle: "Initiate",
    nextTitle: "Adept",
    associatedAttributes: ["intelligence", "creativity"],
    totalXP: 0,
    completionRate: 0,
    prerequisites: [
      {
        id: `ai-${goal.toLowerCase().replace(/\s+/g, "-")}-daily-1`,
        name: `AI Daily ${goal} Task`,
        description: `Complete a daily AI-suggested task for ${goal}`,
        type: "daily",
        completed: false,
        xpReward: 40,
        attributeRewards: { intelligence: 15, creativity: 10 },
      },
      {
        id: `ai-${goal.toLowerCase().replace(/\s+/g, "-")}-weekly-1`,
        name: `AI Weekly ${goal} Challenge`,
        description: `Complete a weekly AI-generated challenge for ${goal}`,
        type: "weekly",
        completed: false,
        weeklyTarget: 1,
        weeklyProgress: 0,
        xpReward: 70,
        attributeRewards: { intelligence: 20, creativity: 15 },
      },
    ],
  }
}
