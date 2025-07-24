// The Order's Immutable Laws - Core System Constants
// These principles govern all system behavior and cannot be violated

export const IMMUTABLE_LAWS = {
  // Law 1: XP-to-Difficulty Proportionality
  XP_SCALING: {
    BASE_XP_PER_DIFFICULTY: {
      1: 25, // Easy tasks
      2: 50, // Medium tasks
      3: 100, // Hard tasks
      4: 200, // Very hard tasks
      5: 400, // Extreme tasks
    },
    EFFORT_MULTIPLIERS: {
      // Time-based multipliers
      QUICK_TASK: 0.8, // < 15 minutes
      STANDARD_TASK: 1.0, // 15-60 minutes
      EXTENDED_TASK: 1.3, // 1-3 hours
      MARATHON_TASK: 1.6, // 3+ hours
    },
    QUALITY_MULTIPLIERS: {
      MINIMAL_EFFORT: 0.7,
      GOOD_EFFORT: 1.0,
      EXCEPTIONAL_EFFORT: 1.4,
      TRANSCENDENT_EFFORT: 2.0,
    },
  },

  // Law 2: The Six Sacred Stats (Immutable)
  CORE_STATS: {
    SPIRITUAL: {
      name: "spiritual",
      description: "Connection to purpose, meaning, and transcendence",
      maxValue: 100,
      decayRate: 0.1, // per day without activity
    },
    HEALTH: {
      name: "health",
      description: "Physical wellness, energy, and vitality",
      maxValue: 100,
      decayRate: 0.2,
    },
    INTELLIGENCE: {
      name: "intelligence",
      description: "Learning, reasoning, and knowledge acquisition",
      maxValue: 100,
      decayRate: 0.05,
    },
    PHYSICAL: {
      name: "physical",
      description: "Strength, endurance, and bodily mastery",
      maxValue: 100,
      decayRate: 0.3,
    },
    CREATIVITY: {
      name: "creativity",
      description: "Innovation, expression, and artistic vision",
      maxValue: 100,
      decayRate: 0.15,
    },
    RESILIENCE: {
      name: "resilience",
      description: "Mental fortitude, adaptability, and recovery",
      maxValue: 100,
      decayRate: 0.08,
    },
  },

  // Law 3: Challenge-Growth Relationship
  CHALLENGE_REQUIREMENTS: {
    MINIMUM_DIFFICULTY_FOR_GROWTH: 2,
    COMFORT_ZONE_XP_PENALTY: 0.5, // 50% XP for tasks below user's level
    GROWTH_ZONE_XP_BONUS: 1.2, // 20% bonus for appropriate challenge
    STRETCH_ZONE_XP_BONUS: 1.5, // 50% bonus for pushing limits
  },

  // Law 4: Consistency Compounds
  STREAK_SYSTEM: {
    DAILY_STREAK_BONUS: {
      7: 1.1, // 10% bonus at 1 week
      14: 1.2, // 20% bonus at 2 weeks
      30: 1.3, // 30% bonus at 1 month
      60: 1.4, // 40% bonus at 2 months
      100: 1.5, // 50% bonus at 100 days
      365: 2.0, // 100% bonus at 1 year
    },
    STREAK_PROTECTION: {
      GRACE_PERIOD_HOURS: 6, // Can complete "yesterday's" task within 6 hours
      WEEKLY_SKIP_ALLOWANCE: 1, // One skip per week without breaking streak
    },
  },

  // Law 5: Effort Transparency
  XP_EXPLANATION: {
    ALWAYS_SHOW_BREAKDOWN: true,
    REQUIRED_COMPONENTS: [
      "base_xp",
      "difficulty_multiplier",
      "time_multiplier",
      "quality_bonus",
      "streak_bonus",
      "total_xp",
    ],
  },

  // Law 6: No Punishment Economy
  PROTECTION_RULES: {
    NO_XP_REMOVAL: true,
    NO_STAT_REMOVAL: true,
    NO_RANK_DEMOTION: true,
    FAILURE_EFFECTS: {
      PAUSE_PROGRESS: true, // Can pause advancement
      INCREASE_DIFFICULTY: false, // Cannot make tasks harder as punishment
      REDUCE_REWARDS: false, // Cannot reduce future rewards
    },
  },

  // Law 7: Path Interconnection
  PATH_REQUIREMENTS: {
    MINIMUM_STAT_CONTRIBUTION: 1, // Every path must contribute to at least 1 core stat
    MAXIMUM_PRIMARY_STATS: 3, // No path can be primary for more than 3 stats
    CROSS_POLLINATION_BONUS: 0.1, // 10% bonus XP when paths complement each other
  },

  // Law 8: User Agency
  AGENCY_PRINCIPLES: {
    SUGGESTION_NOT_COMMAND: true,
    USER_VETO_POWER: true, // Users can reject any suggested task
    CUSTOMIZATION_ALLOWED: true, // Users can modify suggested tasks
    EXPLANATION_REQUIRED: true, // AI must explain reasoning behind suggestions
  },

  // Law 9: Positive Sum Growth
  SYNERGY_SYSTEM: {
    COMPLEMENTARY_BONUSES: {
      "physical-health": 1.15, // Physical training boosts health
      "spiritual-resilience": 1.15, // Spiritual practice boosts resilience
      "intelligence-creativity": 1.15, // Learning boosts creativity
      "creativity-intelligence": 1.1, // Creativity boosts learning
      "resilience-physical": 1.1, // Mental toughness helps physical training
      "health-physical": 1.2, // Good health amplifies physical gains
    },
    NO_NEGATIVE_INTERACTIONS: true, // No stat can ever reduce another
  },
} as const

// Validation functions to ensure laws are never violated
export class LawEnforcer {
  static validateXPAward(
    baseXP: number,
    difficulty: number,
    timeSpent: number,
  ): {
    isValid: boolean
    adjustedXP: number
    explanation: string[]
  } {
    const explanation: string[] = []
    let adjustedXP = baseXP

    // Law 1: Ensure XP scales with difficulty
    const expectedMinXP =
      IMMUTABLE_LAWS.XP_SCALING.BASE_XP_PER_DIFFICULTY[
        difficulty as keyof typeof IMMUTABLE_LAWS.XP_SCALING.BASE_XP_PER_DIFFICULTY
      ]
    if (baseXP < expectedMinXP * 0.8) {
      adjustedXP = expectedMinXP
      explanation.push(`XP adjusted to maintain difficulty proportionality (${baseXP} → ${adjustedXP})`)
    }

    // Apply time multiplier
    const timeMultiplier = timeSpent < 15 ? 0.8 : timeSpent > 180 ? 1.6 : 1.0
    adjustedXP *= timeMultiplier
    explanation.push(`Time multiplier: ${timeMultiplier}x (${timeSpent} minutes)`)

    return {
      isValid: adjustedXP >= expectedMinXP * 0.8,
      adjustedXP: Math.round(adjustedXP),
      explanation,
    }
  }

  static validateStatChange(
    currentStats: Record<string, number>,
    statChanges: Record<string, number>,
  ): {
    isValid: boolean
    adjustedChanges: Record<string, number>
    violations: string[]
  } {
    const violations: string[] = []
    const adjustedChanges = { ...statChanges }

    // Law 6: No stat removal
    Object.entries(statChanges).forEach(([stat, change]) => {
      if (change < 0) {
        adjustedChanges[stat] = 0
        violations.push(`Prevented negative stat change for ${stat} (${change} → 0)`)
      }
    })

    // Law 2: Respect stat maximums
    Object.entries(adjustedChanges).forEach(([stat, change]) => {
      const currentValue = currentStats[stat] || 0
      const maxValue =
        IMMUTABLE_LAWS.CORE_STATS[stat.toUpperCase() as keyof typeof IMMUTABLE_LAWS.CORE_STATS]?.maxValue || 100

      if (currentValue + change > maxValue) {
        adjustedChanges[stat] = maxValue - currentValue
        violations.push(`Capped ${stat} at maximum value (${maxValue})`)
      }
    })

    return {
      isValid: violations.length === 0,
      adjustedChanges,
      violations,
    }
  }

  static calculateSynergyBonus(statChanges: Record<string, number>): number {
    let totalBonus = 1.0
    const changedStats = Object.keys(statChanges).filter((stat) => statChanges[stat] > 0)

    // Apply synergy bonuses for complementary stats
    changedStats.forEach((stat1) => {
      changedStats.forEach((stat2) => {
        if (stat1 !== stat2) {
          const synergyKey = `${stat1}-${stat2}`
          const bonus =
            IMMUTABLE_LAWS.SYNERGY_SYSTEM.COMPLEMENTARY_BONUSES[
              synergyKey as keyof typeof IMMUTABLE_LAWS.SYNERGY_SYSTEM.COMPLEMENTARY_BONUSES
            ]
          if (bonus) {
            totalBonus *= bonus
          }
        }
      })
    })

    return Math.min(totalBonus, 2.0) // Cap total synergy bonus at 2x
  }
}
