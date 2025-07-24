// Achievement System with Ceremonial Unlocks
import type { UserProfile, Task, SystemEvent } from "@/lib/database/schema"
import { IMMUTABLE_LAWS } from "@/lib/core/immutable-laws"

export interface Achievement {
  id: string
  title: string
  description: string
  category: "progression" | "mastery" | "consistency" | "discovery" | "transcendence"
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic"

  // Unlock conditions
  requirements: AchievementRequirement[]

  // Rewards
  xpReward: number
  statRewards: Record<string, number>
  titleUnlocked?: string
  pathUnlocked?: string

  // Ceremony data
  ceremonyType: "simple" | "elaborate" | "transcendent"
  ceremonyContent: CeremonyContent

  // Metadata
  iconUrl?: string
  unlockedBy?: string[]
  secretAchievement: boolean
}

export interface AchievementRequirement {
  type: "stat" | "rank" | "streak" | "task_count" | "xp_total" | "time_played" | "custom"
  target: string
  value: number | string
  operator: "gte" | "lte" | "eq" | "contains"
}

export interface CeremonyContent {
  title: string
  description: string
  visualEffects: string[]
  soundEffect?: string
  duration: number // seconds
  interactiveElements?: CeremonyInteraction[]
}

export interface CeremonyInteraction {
  type: "click" | "hover" | "scroll"
  trigger: string
  effect: string
}

export class AchievementEngine {
  private achievements: Achievement[] = [
    // Progression Achievements
    {
      id: "first_steps",
      title: "First Steps into Shadow",
      description: "Complete your first task and begin your journey with The Order",
      category: "progression",
      rarity: "common",
      requirements: [{ type: "task_count", target: "completed", value: 1, operator: "gte" }],
      xpReward: 100,
      statRewards: { spiritual: 2, resilience: 1 },
      ceremonyType: "simple",
      ceremonyContent: {
        title: "The Journey Begins",
        description: "You have taken your first step into a larger world. The Order acknowledges your commitment.",
        visualEffects: ["fade_in", "glow_purple", "particle_burst"],
        duration: 3,
      },
      secretAchievement: false,
    },

    {
      id: "seeker_ascension",
      title: "Ascension to Seeker",
      description: "Achieve the rank of Seeker through dedicated growth",
      category: "progression",
      rarity: "rare",
      requirements: [{ type: "rank", target: "current", value: "Seeker", operator: "eq" }],
      xpReward: 500,
      statRewards: { spiritual: 5, intelligence: 3, resilience: 2 },
      titleUnlocked: "Seeker of Truth",
      ceremonyType: "elaborate",
      ceremonyContent: {
        title: "The Seeker Awakens",
        description:
          "Your dedication has been recognized. You are no longer merely an Initiate - you seek deeper truths.",
        visualEffects: ["rank_up_animation", "golden_light", "stat_visualization", "title_reveal"],
        duration: 8,
        interactiveElements: [{ type: "click", trigger: "continue_button", effect: "reveal_next_goals" }],
      },
      secretAchievement: false,
    },

    // Mastery Achievements
    {
      id: "spiritual_master",
      title: "Master of the Inner Realm",
      description: "Achieve mastery in the spiritual domain (80+ points)",
      category: "mastery",
      rarity: "epic",
      requirements: [{ type: "stat", target: "spiritual", value: 80, operator: "gte" }],
      xpReward: 1000,
      statRewards: { spiritual: 10, resilience: 5 },
      titleUnlocked: "Spiritual Master",
      pathUnlocked: "transcendent_meditation",
      ceremonyType: "elaborate",
      ceremonyContent: {
        title: "Spiritual Mastery Achieved",
        description:
          "You have transcended the material realm and achieved mastery over the spiritual domain. The Order bows in recognition.",
        visualEffects: ["spiritual_aura", "chakra_activation", "enlightenment_burst", "stat_mastery_glow"],
        duration: 12,
        interactiveElements: [{ type: "hover", trigger: "aura_element", effect: "expand_spiritual_energy" }],
      },
      secretAchievement: false,
    },

    // Consistency Achievements
    {
      id: "week_warrior",
      title: "Week Warrior",
      description: "Maintain a 7-day streak of consistent progress",
      category: "consistency",
      rarity: "rare",
      requirements: [{ type: "streak", target: "current", value: 7, operator: "gte" }],
      xpReward: 300,
      statRewards: { resilience: 5, health: 2 },
      ceremonyType: "simple",
      ceremonyContent: {
        title: "The Flame Burns Steady",
        description: "Seven days of unwavering commitment. Your dedication fuels the flame of transformation.",
        visualEffects: ["flame_animation", "streak_counter", "consistency_badge"],
        duration: 5,
      },
      secretAchievement: false,
    },

    {
      id: "century_guardian",
      title: "Guardian of the Century",
      description: "Achieve the legendary 100-day streak",
      category: "consistency",
      rarity: "legendary",
      requirements: [{ type: "streak", target: "current", value: 100, operator: "gte" }],
      xpReward: 5000,
      statRewards: { resilience: 20, spiritual: 15, health: 10 },
      titleUnlocked: "Century Guardian",
      ceremonyType: "transcendent",
      ceremonyContent: {
        title: "The Century Guardian Rises",
        description:
          "One hundred days of unbroken dedication. You have achieved what few dare attempt. The Order grants you the title of Century Guardian.",
        visualEffects: [
          "legendary_entrance",
          "century_counter_animation",
          "guardian_transformation",
          "stat_explosion",
          "title_inscription",
          "legendary_aura",
        ],
        duration: 20,
        interactiveElements: [
          { type: "click", trigger: "guardian_seal", effect: "activate_guardian_powers" },
          { type: "scroll", trigger: "achievement_scroll", effect: "reveal_guardian_lore" },
        ],
      },
      secretAchievement: false,
    },

    // Discovery Achievements
    {
      id: "pattern_seeker",
      title: "Seeker of Hidden Patterns",
      description: "Discover the interconnected nature of all growth paths",
      category: "discovery",
      rarity: "epic",
      requirements: [{ type: "custom", target: "synergy_activations", value: 10, operator: "gte" }],
      xpReward: 800,
      statRewards: { intelligence: 8, spiritual: 5, creativity: 3 },
      titleUnlocked: "Pattern Seeker",
      ceremonyType: "elaborate",
      ceremonyContent: {
        title: "The Patterns Reveal Themselves",
        description:
          "You have seen beyond the surface, recognizing the hidden connections that bind all things. The Order shares its deeper mysteries.",
        visualEffects: ["pattern_revelation", "connection_lines", "synergy_visualization", "mystery_unlock"],
        duration: 10,
        interactiveElements: [{ type: "hover", trigger: "pattern_nodes", effect: "highlight_connections" }],
      },
      secretAchievement: true,
    },

    // Transcendence Achievements
    {
      id: "the_transcendent",
      title: "The Transcendent",
      description: "Achieve perfect balance across all domains and transcend mortal limitations",
      category: "transcendence",
      rarity: "mythic",
      requirements: [
        { type: "stat", target: "spiritual", value: 95, operator: "gte" },
        { type: "stat", target: "health", value: 95, operator: "gte" },
        { type: "stat", target: "intelligence", value: 95, operator: "gte" },
        { type: "stat", target: "physical", value: 95, operator: "gte" },
        { type: "stat", target: "creativity", value: 95, operator: "gte" },
        { type: "stat", target: "resilience", value: 95, operator: "gte" },
        { type: "rank", target: "current", value: "Transcendent", operator: "eq" },
      ],
      xpReward: 10000,
      statRewards: {}, // No stat rewards - they've transcended the need
      titleUnlocked: "The Transcendent One",
      ceremonyType: "transcendent",
      ceremonyContent: {
        title: "Transcendence Achieved",
        description:
          "You have transcended the limitations of mortal existence. You are no longer bound by the constraints that limit others. The Order recognizes you as one of the Transcendent.",
        visualEffects: [
          "transcendence_transformation",
          "reality_distortion",
          "perfect_balance_visualization",
          "mythic_aura",
          "dimensional_shift",
          "transcendent_title_manifestation",
        ],
        duration: 30,
        interactiveElements: [
          { type: "click", trigger: "transcendence_seal", effect: "activate_transcendent_mode" },
          { type: "hover", trigger: "reality_fragments", effect: "show_transcendent_abilities" },
          { type: "scroll", trigger: "transcendence_codex", effect: "reveal_transcendent_lore" },
        ],
      },
      secretAchievement: false,
    },
  ]

  async checkForNewAchievements(
    userId: string,
    userProfile: UserProfile,
    recentTasks: Task[],
    systemEvents: SystemEvent[],
  ): Promise<Achievement[]> {
    const newAchievements: Achievement[] = []

    // Get user's current achievements to avoid duplicates
    const currentAchievements = await this.getUserAchievements(userId)
    const currentAchievementIds = currentAchievements.map((a) => a.id)

    for (const achievement of this.achievements) {
      if (currentAchievementIds.includes(achievement.id)) continue

      if (await this.checkAchievementRequirements(achievement, userProfile, recentTasks, systemEvents)) {
        newAchievements.push(achievement)
        await this.awardAchievement(userId, achievement)
      }
    }

    return newAchievements
  }

  private async checkAchievementRequirements(
    achievement: Achievement,
    userProfile: UserProfile,
    recentTasks: Task[],
    systemEvents: SystemEvent[],
  ): Promise<boolean> {
    for (const requirement of achievement.requirements) {
      if (!(await this.checkSingleRequirement(requirement, userProfile, recentTasks, systemEvents))) {
        return false
      }
    }
    return true
  }

  private async checkSingleRequirement(
    requirement: AchievementRequirement,
    userProfile: UserProfile,
    recentTasks: Task[],
    systemEvents: SystemEvent[],
  ): Promise<boolean> {
    const { type, target, value, operator } = requirement

    let actualValue: any

    switch (type) {
      case "stat":
        actualValue = userProfile.stats[target as keyof typeof userProfile.stats]
        break
      case "rank":
        actualValue = userProfile.currentRank
        break
      case "streak":
        actualValue = userProfile.currentStreak
        break
      case "task_count":
        actualValue = recentTasks.filter((t) => t.status === target).length
        break
      case "xp_total":
        actualValue = userProfile.totalXP
        break
      case "custom":
        actualValue = await this.getCustomValue(target, userProfile, systemEvents)
        break
      default:
        return false
    }

    return this.compareValues(actualValue, value, operator)
  }

  private compareValues(actual: any, expected: any, operator: string): boolean {
    switch (operator) {
      case "gte":
        return actual >= expected
      case "lte":
        return actual <= expected
      case "eq":
        return actual === expected
      case "contains":
        return String(actual).includes(String(expected))
      default:
        return false
    }
  }

  private async getCustomValue(target: string, userProfile: UserProfile, systemEvents: SystemEvent[]): Promise<number> {
    switch (target) {
      case "synergy_activations":
        // Count events where multiple stats were improved simultaneously
        return systemEvents.filter(
          (e) => e.eventType === "stat_threshold" && Object.keys(e.eventData.statChanges || {}).length > 1,
        ).length
      default:
        return 0
    }
  }

  private async awardAchievement(userId: string, achievement: Achievement): Promise<void> {
    // This would save to database
    console.log(`Awarding achievement ${achievement.id} to user ${userId}`)

    // Apply rewards using immutable laws
    if (achievement.xpReward > 0) {
      // Award XP following Law 5 (Effort Transparency)
      await this.awardXPWithExplanation(userId, achievement.xpReward, `Achievement: ${achievement.title}`)
    }

    if (Object.keys(achievement.statRewards).length > 0) {
      // Award stat increases following Law 6 (No Punishment Economy)
      await this.awardStatIncreases(userId, achievement.statRewards)
    }
  }

  private async awardXPWithExplanation(userId: string, xp: number, reason: string): Promise<void> {
    // Implementation would follow IMMUTABLE_LAWS.XP_EXPLANATION requirements
    const explanation = {
      base_xp: xp,
      difficulty_multiplier: 1.0,
      time_multiplier: 1.0,
      quality_bonus: 0,
      streak_bonus: 0,
      total_xp: xp,
      reason,
    }

    console.log(`XP Award Explanation for ${userId}:`, explanation)
  }

  private async awardStatIncreases(userId: string, statRewards: Record<string, number>): Promise<void> {
    // Apply synergy bonuses following Law 9 (Positive Sum Growth)
    const synergyMultiplier = IMMUTABLE_LAWS.SYNERGY_SYSTEM.NO_NEGATIVE_INTERACTIONS
      ? this.calculateSynergyBonus(statRewards)
      : 1.0

    const adjustedRewards: Record<string, number> = {}
    Object.entries(statRewards).forEach(([stat, value]) => {
      adjustedRewards[stat] = Math.round(value * synergyMultiplier)
    })

    console.log(`Stat rewards for ${userId}:`, adjustedRewards)
  }

  private calculateSynergyBonus(statRewards: Record<string, number>): number {
    // Implementation of synergy calculation from immutable laws
    return 1.0 // Simplified for now
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    // This would fetch from database
    return []
  }

  async triggerAchievementCeremony(achievement: Achievement): Promise<CeremonyContent> {
    // Return ceremony content for frontend to display
    return achievement.ceremonyContent
  }

  getAchievementsByCategory(category: Achievement["category"]): Achievement[] {
    return this.achievements.filter((a) => a.category === category)
  }

  getSecretAchievements(): Achievement[] {
    return this.achievements.filter((a) => a.secretAchievement)
  }
}

export const achievementEngine = new AchievementEngine()
