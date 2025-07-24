// Database Client Configuration
import { createClient } from "@supabase/supabase-js"
import type { UserProfile, Rank, Task, ChatMessage, SystemEvent } from "./types" // Assuming types are declared in a separate file

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Type-safe database operations
export class DatabaseClient {
  // User Operations
  async createUser(userData: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          ...userData,
          stats: userData.stats || {
            spiritual: 0,
            health: 0,
            intelligence: 0,
            physical: 0,
            creativity: 0,
            resilience: 0,
          },
          totalXP: 0,
          currentRank: "Initiate",
          rankProgress: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          createdAt: new Date(),
          lastActive: new Date(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserById(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  }

  async updateUserStats(userId: string, statUpdates: Partial<UserProfile["stats"]>): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) throw new Error("User not found")

    const newStats = { ...user.stats, ...statUpdates }

    const { error } = await supabase
      .from("users")
      .update({
        stats: newStats,
        lastActive: new Date(),
      })
      .eq("id", userId)

    if (error) throw error

    // Check for rank progression
    await this.checkRankProgression(userId, newStats)
  }

  private async checkRankProgression(userId: string, stats: UserProfile["stats"]): Promise<void> {
    const totalStatPoints = Object.values(stats).reduce((sum, stat) => sum + stat, 0)
    const averageStat = totalStatPoints / 6

    let newRank: Rank = "Initiate"
    if (averageStat >= 80) newRank = "Transcendent"
    else if (averageStat >= 70) newRank = "Sage"
    else if (averageStat >= 60) newRank = "Master"
    else if (averageStat >= 45) newRank = "Expert"
    else if (averageStat >= 30) newRank = "Adept"
    else if (averageStat >= 15) newRank = "Seeker"

    const user = await this.getUserById(userId)
    if (user && user.currentRank !== newRank) {
      await supabase.from("users").update({ currentRank: newRank }).eq("id", userId)

      // Create rank-up event
      await this.createSystemEvent(userId, "rank_up", {
        oldRank: user.currentRank,
        newRank,
        averageStat,
      })
    }
  }

  // Task Operations
  async createTask(taskData: Omit<Task, "id">): Promise<Task> {
    const { data, error } = await supabase.from("tasks").insert([taskData]).select().single()

    if (error) throw error
    return data
  }

  async getUserTasks(userId: string, status?: Task["status"]): Promise<Task[]> {
    let query = supabase.from("tasks").select("*").eq("userId", userId).order("dueDate", { ascending: true })

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  async completeTask(taskId: string): Promise<void> {
    const { data: task, error: fetchError } = await supabase.from("tasks").select("*").eq("id", taskId).single()

    if (fetchError) throw fetchError

    // Update task status
    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        status: "completed",
        completedAt: new Date(),
      })
      .eq("id", taskId)

    if (updateError) throw updateError

    // Award XP and stat points
    if (task.xpReward > 0) {
      await this.awardXP(task.userId, task.xpReward)
    }

    if (task.statRewards) {
      await this.updateUserStats(task.userId, task.statRewards)
    }

    // Update streak
    await this.updateStreak(task.userId)
  }

  private async awardXP(userId: string, xp: number): Promise<void> {
    const { error } = await supabase
      .from("users")
      .update({
        totalXP: supabase.sql`total_xp + ${xp}`,
      })
      .eq("id", userId)

    if (error) throw error
  }

  private async updateStreak(userId: string): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) return

    const today = new Date()
    const lastCompletion = user.lastTaskCompletion ? new Date(user.lastTaskCompletion) : null

    let newStreak = user.currentStreak

    if (!lastCompletion || this.isConsecutiveDay(lastCompletion, today)) {
      newStreak += 1
    } else if (!this.isSameDay(lastCompletion, today)) {
      newStreak = 1 // Reset streak but count today
    }

    const longestStreak = Math.max(user.longestStreak, newStreak)

    await supabase
      .from("users")
      .update({
        currentStreak: newStreak,
        longestStreak,
        lastTaskCompletion: today,
      })
      .eq("id", userId)
  }

  private isConsecutiveDay(date1: Date, date2: Date): boolean {
    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString()
  }

  // Chat Operations
  async saveChatMessage(messageData: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    const { data, error } = await supabase.from("chat_messages").insert([messageData]).select().single()

    if (error) throw error
    return data
  }

  async getChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("userId", userId)
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data || []).reverse()
  }

  // System Events
  async createSystemEvent(
    userId: string,
    eventType: SystemEvent["eventType"],
    eventData: Record<string, any>,
  ): Promise<void> {
    const { error } = await supabase.from("system_events").insert([
      {
        userId,
        eventType,
        eventData,
        timestamp: new Date(),
      },
    ])

    if (error) throw error
  }

  // Analytics and Pattern Recognition
  async getUserAnalytics(userId: string, days = 30): Promise<any> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [tasks, events, messages] = await Promise.all([
      supabase.from("tasks").select("*").eq("userId", userId).gte("completedAt", startDate.toISOString()),

      supabase.from("system_events").select("*").eq("userId", userId).gte("timestamp", startDate.toISOString()),

      supabase.from("chat_messages").select("*").eq("userId", userId).gte("timestamp", startDate.toISOString()),
    ])

    return {
      taskCompletionRate: this.calculateCompletionRate(tasks.data || []),
      mostActiveCategories: this.getMostActiveCategories(tasks.data || []),
      streakPatterns: this.analyzeStreakPatterns(events.data || []),
      engagementLevel: this.calculateEngagementLevel(messages.data || []),
    }
  }

  private calculateCompletionRate(tasks: Task[]): number {
    if (tasks.length === 0) return 0
    const completed = tasks.filter((t) => t.status === "completed").length
    return (completed / tasks.length) * 100
  }

  private getMostActiveCategories(tasks: Task[]): string[] {
    const categoryCount: Record<string, number> = {}
    tasks.forEach((task) => {
      categoryCount[task.category] = (categoryCount[task.category] || 0) + 1
    })

    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)
  }

  private analyzeStreakPatterns(events: SystemEvent[]): any {
    // Analyze streak-related events for patterns
    return {
      averageStreakLength: 0, // Implement calculation
      streakBreakReasons: [], // Analyze failure patterns
      bestStreakPeriods: [], // Time periods with best streaks
    }
  }

  private calculateEngagementLevel(messages: ChatMessage[]): "low" | "medium" | "high" {
    const messagesPerDay = messages.length / 30
    if (messagesPerDay >= 5) return "high"
    if (messagesPerDay >= 2) return "medium"
    return "low"
  }
}

export const db = new DatabaseClient()
