import type { UserData, AuthUser } from "../types"

const STORAGE_KEY = "limitless-user-data"
const AUTH_KEY = "limitless-auth-users"
const CURRENT_USER_KEY = "limitless-current-user"

export function saveUserData(userData: UserData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
}

export function loadUserData(): UserData | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function saveAuthUser(authUser: AuthUser): void {
  const users = getAuthUsers()
  const existingIndex = users.findIndex((u) => u.email === authUser.email)

  if (existingIndex >= 0) {
    users[existingIndex] = authUser
  } else {
    users.push(authUser)
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(users))
}

export function getAuthUsers(): AuthUser[] {
  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function authenticateUser(email: string, password: string): AuthUser | null {
  const users = getAuthUsers()
  return users.find((u) => u.email === email && u.password === password) || null
}

export function setCurrentUser(email: string): void {
  localStorage.setItem(CURRENT_USER_KEY, email)
}

export function getCurrentUser(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY)
}

export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
  localStorage.removeItem(STORAGE_KEY)
}

export function createInitialUserData(email: string, username: string): UserData {
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
    lastLogin: now,
    lastDailyReset: now,
    lastWeeklyReset: now,
    joinDate: now,
  }
}

export function shouldResetDaily(lastReset: string): boolean {
  const last = new Date(lastReset)
  const now = new Date()
  const lastMidnight = new Date(now)
  lastMidnight.setHours(0, 0, 0, 0)
  return last < lastMidnight
}

export function shouldResetWeekly(lastReset: string): boolean {
  const last = new Date(lastReset)
  const now = new Date()
  const lastMonday = new Date(now)
  const daysSinceMonday = (now.getDay() + 6) % 7
  lastMonday.setDate(now.getDate() - daysSinceMonday)
  lastMonday.setHours(0, 0, 0, 0)
  return last < lastMonday
}
