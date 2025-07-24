import type { UserProfile } from "@/types/limitless"

export interface Achievement {
  id: string
  title: string
  description: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic"
  category: "progress" | "consistency" | "mastery" | "discovery" | "social" | "transcendence"
  requirements: AchievementRequirement[]
  rewards: {
    xp: number
    title?: string
    badge?: string
    unlocks?: string[]
  }
  hidden: boolean
  icon: string
}

export interface AchievementRequirement {
  type: "level" | "stat" | "streak" | "tasks" | "time" | "pattern"
  condition: any
  description: string
}

export class AchievementEngine {
  private achievements: Achievement[] = [
    // Common Achievements
    {
      id: "first_steps",
      title: "First Steps",
      description: "Complete your first task in the system",
      rarity: "common",
      category: "progress",
      requirements: [{ type: "tasks", condition: 1, description: "Complete 1 task" }],
      rewards: { xp: 50, title: "Initiate" },
      hidden: false,
      icon: "👣",
    },
    {
      id: "week_warrior",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      rarity: "common",
      category: "consistency",
      requirements: [{ type: "streak", condition: 7, description: "Maintain 7-day streak" }],
      rewards: { xp: 100, badge: "streak_7" },
      hidden: false,
      icon: "🔥",
    },

    // Uncommon Achievements
    {
      id: "balanced_growth",
      title: "Balanced Growth",
      description: "Reach level 10 in all core stats",
      rarity: "uncommon",
      category: "mastery",
      requirements: [{ type: "stat", condition: { all: 10 }, description: "All stats at level 10+" }],
      rewards: { xp: 250, title: "Balanced One", unlocks: ["harmony_path"] },
      hidden: false,
      icon: "⚖️",
    },
    {
      id: "month_master",
      title: "Month Master",
      description: "Maintain a 30-day streak",
      rarity: "uncommon",
      category: "consistency",
      requirements: [{ type: "streak", condition: 30, description: "Maintain 30-day streak" }],
      rewards: { xp: 500, title: "Dedicated", badge: "streak_30" },
      hidden: false,
      icon: "📅",
    },

    // Rare Achievements
    {
      id: "specialist",
      title: "Specialist",
      description: "Reach level 25 in any single stat",
      rarity: "rare",
      category: "mastery",
      requirements: [{ type: "stat", condition: { any: 25 }, description: "Any stat at level 25+" }],
      rewards: { xp: 750, title: "Specialist", unlocks: ["mastery_paths"] },
      hidden: false,
      icon: "🎯",
    },
    {
      id: "century_streak",
      title: "Century Streak",
      description: "Maintain a 100-day streak",
      rarity: "rare",
      category: "consistency",
      requirements: [{ type: "streak", condition: 100, description: "Maintain 100-day streak" }],
      rewards: { xp: 1000, title: "Unstoppable", badge: "streak_100" },
      hidden: false,
      icon: "💯",
    },

    // Epic Achievements
    {
      id: "polymath",
      title: "Polymath",
      description: "Reach level 20 in all core stats",
      rarity: "epic",
      category: "mastery",
      requirements: [{ type: "stat", condition: { all: 20 }, description: "All stats at level 20+" }],
      rewards: { xp: 1500, title: "Polymath", unlocks: ["transcendence_path"] },
      hidden: false,
      icon: "🧠",
    },
    {
      id: "pattern_seeker",
      title: "Pattern Seeker",
      description: "Discover 5 hidden synergies between different paths",
      rarity: "epic",
      category: "discovery",
      requirements: [{ type: "pattern", condition: { synergies: 5 }, description: "Discover 5 synergies" }],
      rewards: { xp: 1200, title: "Pattern Seeker", unlocks: ["synergy_system"] },
      hidden: true,
      icon: "🔍",
    },

    // Legendary Achievements
    {
      id: "master_of_all",
      title: "Master of All",
      description: "Reach level 50 in all core stats",
      rarity: "legendary",
      category: "mastery",
      requirements: [{ type: "stat", condition: { all: 50 }, description: "All stats at level 50+" }],
      rewards: { xp: 5000, title: "Grandmaster", unlocks: ["mentor_mode"] },
      hidden: false,
      icon: "👑",
    },
    {
      id: "year_legend",
      title: "Year Legend",
      description: "Maintain a 365-day streak",
      rarity: "legendary",
      category: "consistency",
      requirements: [{ type: "streak", condition: 365, description: "Maintain 365-day streak" }],
      rewards: { xp: 3650, title: "Legendary", badge: "streak_365" },
      hidden: false,
      icon: "🌟",
    },

    // Mythic Achievements
    {
      id: "transcendent",
      title: "Transcendent",
      description: "Reach the highest level of mastery and understanding",
      rarity: "mythic",
      category: "transcendence",
      requirements: [
        { type: "level", condition: 100, description: "Reach level 100" },
        { type: "stat", condition: { all: 75 }, description: "All stats at level 75+" },
        { type: "tasks", condition: 1000, description: "Complete 1000 tasks" },
      ],
      rewards: { xp: 10000, title: "Transcendent", unlocks: ["order_access"] },
      hidden: true,
      icon: "✨",
    },
    {
      id: "the_order",
      title: "The Order",
      description: "Become one with The Order itself",
      rarity: "mythic",
      category: "transcendence",
      requirements: [
        { type: "level", condition: 150, description: "Reach level 150" },
        { type: "pattern", condition: { mentored: 100 }, description: "Guide 100 other users" },
      ],
      rewards: { xp: 25000, title: "The Order", unlocks: ["system_admin"] },
      hidden: true,
      icon: "🌌",
    },
  ]

  checkAchievements(userProfile: UserProfile, recentActivity?: any): Achievement[] {
    const unlockedAchievements: Achievement[] = []
    const currentAchievements = userProfile.achievements || []

    for (const achievement of this.achievements) {
      // Skip if already unlocked
      if (currentAchievements.includes(achievement.id)) continue

      // Check if all requirements are met
      const requirementsMet = achievement.requirements.every((req) =>
        this.evaluateRequirement(req, userProfile, recentActivity),
      )

      if (requirementsMet) {
        unlockedAchievements.push(achievement)
      }
    }

    return unlockedAchievements
  }

  private evaluateRequirement(
    requirement: AchievementRequirement,
    userProfile: UserProfile,
    recentActivity?: any,
  ): boolean {
    switch (requirement.type) {
      case "level":
        return userProfile.level >= requirement.condition

      case "stat":
        if (requirement.condition.all) {
          return Object.values(userProfile.stats || {}).every((value) => value >= requirement.condition.all)
        }
        if (requirement.condition.any) {
          return Object.values(userProfile.stats || {}).some((value) => value >= requirement.condition.any)
        }
        return Object.entries(requirement.condition).every(([stat, value]) => (userProfile.stats?.[stat] || 0) >= value)

      case "streak":
        return userProfile.streak >= requirement.condition

      case "tasks":
        return (userProfile.completedTasks || 0) >= requirement.condition

      case "time":
        const accountAge = Date.now() - new Date(userProfile.createdAt || Date.now()).getTime()
        return accountAge >= requirement.condition

      case "pattern":
        // This would require additional tracking in the user profile
        return false // Placeholder for pattern-based achievements

      default:
        return false
    }
  }

  getAchievementById(id: string): Achievement | undefined {
    return this.achievements.find((achievement) => achievement.id === id)
  }

  getAchievementsByCategory(category: Achievement["category"]): Achievement[] {
    return this.achievements.filter((achievement) => achievement.category === category)
  }

  getAchievementsByRarity(rarity: Achievement["rarity"]): Achievement[] {
    return this.achievements.filter((achievement) => achievement.rarity === rarity)
  }

  getVisibleAchievements(): Achievement[] {
    return this.achievements.filter((achievement) => !achievement.hidden)
  }

  calculateAchievementProgress(
    achievement: Achievement,
    userProfile: UserProfile,
  ): { progress: number; total: number; percentage: number } {
    let totalProgress = 0
    let maxProgress = 0

    for (const requirement of achievement.requirements) {
      const { current, max } = this.getRequirementProgress(requirement, userProfile)
      totalProgress += Math.min(current, max)
      maxProgress += max
    }

    return {
      progress: totalProgress,
      total: maxProgress,
      percentage: maxProgress > 0 ? (totalProgress / maxProgress) * 100 : 0,
    }
  }

  private getRequirementProgress(
    requirement: AchievementRequirement,
    userProfile: UserProfile,
  ): { current: number; max: number } {
    switch (requirement.type) {
      case "level":
        return { current: userProfile.level, max: requirement.condition }

      case "stat":
        if (requirement.condition.all) {
          const minStat = Math.min(...Object.values(userProfile.stats || {}))
          return { current: minStat, max: requirement.condition.all }
        }
        if (requirement.condition.any) {
          const maxStat = Math.max(...Object.values(userProfile.stats || {}))
          return { current: maxStat, max: requirement.condition.any }
        }
        // For specific stat requirements, return the first one
        const [stat, value] = Object.entries(requirement.condition)[0]
        return { current: userProfile.stats?.[stat] || 0, max: value }

      case "streak":
        return { current: userProfile.streak, max: requirement.condition }

      case "tasks":
        return { current: userProfile.completedTasks || 0, max: requirement.condition }

      case "time":
        const accountAge = Date.now() - new Date(userProfile.createdAt || Date.now()).getTime()
        return { current: accountAge, max: requirement.condition }

      default:
        return { current: 0, max: 1 }
    }
  }
}

export const achievementEngine = new AchievementEngine()
