import type { AttributeRank, Attribute } from "../types"

// Adjusted thresholds for the new progression timeline
export const RANK_THRESHOLDS = {
  E: 0,
  D: 400, // 2 months
  C: 1000, // 3 months from D
  B: 1900, // 3 months from C
  A: 3400, // 5 months from B
  S: 5800, // 6 months from A
  SS: 8600, // 6 months from S
  SSS: 12000, // 6 months from SS
}

export const RANK_ORDER: AttributeRank[] = ["E", "D", "C", "B", "A", "S", "SS", "SSS"]

export function calculateAttributeRank(value: number): AttributeRank {
  const ranks = Object.entries(RANK_THRESHOLDS).reverse()
  for (const [rank, threshold] of ranks) {
    if (value >= threshold) {
      return rank as AttributeRank
    }
  }
  return "E"
}

export function calculateOverallRank(attributes: { [key: string]: Attribute }): AttributeRank {
  const ranks = Object.values(attributes).map((attr) => attr.rank)
  const rankValues = ranks.map((rank) => RANK_ORDER.indexOf(rank))
  const averageRankValue = Math.round(rankValues.reduce((sum, val) => sum + val, 0) / rankValues.length)
  return RANK_ORDER[averageRankValue] || "E"
}

export function getNextRankThreshold(currentValue: number): {
  nextRank: AttributeRank
  threshold: number
  progress: number
} {
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

export function getRankColor(rank: AttributeRank): string {
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

export function getRankGlow(rank: AttributeRank): string {
  const glows = {
    E: "shadow-gray-400/20",
    D: "shadow-gray-300/20",
    C: "shadow-green-400/20",
    B: "shadow-blue-400/20",
    A: "shadow-purple-400/20",
    S: "shadow-yellow-400/30",
    SS: "shadow-orange-400/30",
    SSS: "shadow-red-400/40",
  }
  return glows[rank] || "shadow-gray-400/20"
}
