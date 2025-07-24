/**
 * The Immutable Laws of The Order
 * These fundamental constants govern all system interactions and cannot be violated
 */

export interface ImmutableLaws {
  // Core Stats - Universal human growth dimensions
  CORE_STATS: readonly string[]

  // XP and Difficulty Ratios
  XP_RATIOS: {
    readonly EASY_TASK_MULTIPLIER: number
    readonly MEDIUM_TASK_MULTIPLIER: number
    readonly HARD_TASK_MULTIPLIER: number
    readonly EXTREME_TASK_MULTIPLIER: number
    readonly MIN_XP_REWARD: number
    readonly MAX_XP_REWARD: number
  }

  // Streak and Consistency
  STREAK_BONUSES: {
    readonly DAILY_MULTIPLIER: number
    readonly WEEKLY_MULTIPLIER: number
    readonly MONTHLY_MULTIPLIER: number
    readonly MAX_STREAK_BONUS: number
  }

  // Growth Principles
  GROWTH_PRINCIPLES: {
    readonly NO_XP_REMOVAL: boolean
    readonly EFFORT_TRANSPARENCY: boolean
    readonly PATH_INTERCONNECTION: boolean
    readonly USER_AGENCY: boolean
    readonly POSITIVE_SUM_GROWTH: boolean
  }
}

export const IMMUTABLE_LAWS: ImmutableLaws = {
  CORE_STATS: ["Physical", "Mental", "Emotional", "Social", "Creative", "Spiritual"] as const,

  XP_RATIOS: {
    EASY_TASK_MULTIPLIER: 1.0,
    MEDIUM_TASK_MULTIPLIER: 2.5,
    HARD_TASK_MULTIPLIER: 5.0,
    EXTREME_TASK_MULTIPLIER: 10.0,
    MIN_XP_REWARD: 10,
    MAX_XP_REWARD: 1000,
  } as const,

  STREAK_BONUSES: {
    DAILY_MULTIPLIER: 1.1,
    WEEKLY_MULTIPLIER: 1.25,
    MONTHLY_MULTIPLIER: 1.5,
    MAX_STREAK_BONUS: 3.0,
  } as const,

  GROWTH_PRINCIPLES: {
    NO_XP_REMOVAL: true,
    EFFORT_TRANSPARENCY: true,
    PATH_INTERCONNECTION: true,
    USER_AGENCY: true,
    POSITIVE_SUM_GROWTH: true,
  } as const,
} as const

/**
 * Validates XP award against immutable laws
 */
export function validateXPAward(
  baseXP: number,
  difficulty: "easy" | "medium" | "hard" | "extreme",
  streakDays = 0,
): { isValid: boolean; adjustedXP: number; explanation: string } {
  const { XP_RATIOS, STREAK_BONUSES } = IMMUTABLE_LAWS

  // Apply difficulty multiplier
  let adjustedXP = baseXP
  switch (difficulty) {
    case "easy":
      adjustedXP *= XP_RATIOS.EASY_TASK_MULTIPLIER
      break
    case "medium":
      adjustedXP *= XP_RATIOS.MEDIUM_TASK_MULTIPLIER
      break
    case "hard":
      adjustedXP *= XP_RATIOS.HARD_TASK_MULTIPLIER
      break
    case "extreme":
      adjustedXP *= XP_RATIOS.EXTREME_TASK_MULTIPLIER
      break
  }

  // Apply streak bonus
  let streakMultiplier = 1.0
  if (streakDays >= 30) {
    streakMultiplier = Math.min(STREAK_BONUSES.MONTHLY_MULTIPLIER, STREAK_BONUSES.MAX_STREAK_BONUS)
  } else if (streakDays >= 7) {
    streakMultiplier = STREAK_BONUSES.WEEKLY_MULTIPLIER
  } else if (streakDays >= 1) {
    streakMultiplier = STREAK_BONUSES.DAILY_MULTIPLIER
  }

  adjustedXP *= streakMultiplier

  // Enforce min/max bounds
  adjustedXP = Math.max(XP_RATIOS.MIN_XP_REWARD, Math.min(adjustedXP, XP_RATIOS.MAX_XP_REWARD))

  const explanation = `Base: ${baseXP} × ${difficulty} (${
    difficulty === "easy"
      ? XP_RATIOS.EASY_TASK_MULTIPLIER
      : difficulty === "medium"
        ? XP_RATIOS.MEDIUM_TASK_MULTIPLIER
        : difficulty === "hard"
          ? XP_RATIOS.HARD_TASK_MULTIPLIER
          : XP_RATIOS.EXTREME_TASK_MULTIPLIER
  }) × Streak (${streakMultiplier.toFixed(1)}) = ${Math.round(adjustedXP)} XP`

  return {
    isValid: true,
    adjustedXP: Math.round(adjustedXP),
    explanation,
  }
}

/**
 * Validates stat growth against interconnection law
 */
export function validateStatGrowth(
  primaryStat: string,
  secondaryStats: string[] = [],
): { isValid: boolean; synergyBonus: number; explanation: string } {
  const { CORE_STATS } = IMMUTABLE_LAWS

  // Ensure primary stat is valid
  if (!CORE_STATS.includes(primaryStat)) {
    return {
      isValid: false,
      synergyBonus: 0,
      explanation: `Invalid stat: ${primaryStat}. Must be one of: ${CORE_STATS.join(", ")}`,
    }
  }

  // Calculate synergy bonus for interconnected growth
  const validSecondaryStats = secondaryStats.filter((stat) => CORE_STATS.includes(stat))
  const synergyBonus = Math.min(validSecondaryStats.length * 0.1, 0.5) // Max 50% bonus

  const explanation =
    validSecondaryStats.length > 0
      ? `Primary: ${primaryStat} + Synergy with ${validSecondaryStats.join(", ")} (+${Math.round(synergyBonus * 100)}%)`
      : `Primary: ${primaryStat} (no synergy bonus)`

  return {
    isValid: true,
    synergyBonus,
    explanation,
  }
}

/**
 * Enforces the No Punishment Economy law
 */
export function enforceNoPunishment(
  currentXP: number,
  proposedChange: number,
): { isValid: boolean; adjustedChange: number; explanation: string } {
  if (proposedChange < 0) {
    return {
      isValid: false,
      adjustedChange: 0,
      explanation: "The Order protects your earned progress. XP cannot be removed, only paused.",
    }
  }

  return {
    isValid: true,
    adjustedChange: proposedChange,
    explanation: "Growth validated - progress preserved.",
  }
}

/**
 * Validates user agency in system interactions
 */
export function validateUserAgency(
  action: "suggest" | "require" | "force",
  context: string,
): { isValid: boolean; recommendation: string } {
  if (action === "force") {
    return {
      isValid: false,
      recommendation: `The Order suggests, never commands. Change "${context}" to a suggestion.`,
    }
  }

  if (action === "require" && !context.includes("safety") && !context.includes("system integrity")) {
    return {
      isValid: false,
      recommendation: `Requirements should be reserved for safety and system integrity. Consider making "${context}" a strong suggestion instead.`,
    }
  }

  return {
    isValid: true,
    recommendation: "User agency preserved.",
  }
}
