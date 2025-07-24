// AI Context Management for The Order
import { db } from "@/lib/database/client"
import type { UserProfile, Task, ChatMessage } from "@/lib/database/schema"

export interface AIContext {
  user: UserProfile
  recentTasks: Task[]
  chatHistory: ChatMessage[]
  analytics: any
  systemEvents: any[]
}

export class ContextManager {
  async buildContext(userId: string): Promise<AIContext> {
    const [user, recentTasks, chatHistory, analytics, systemEvents] = await Promise.all([
      db.getUserById(userId),
      db.getUserTasks(userId),
      db.getChatHistory(userId, 10),
      db.getUserAnalytics(userId, 7),
      this.getRecentSystemEvents(userId),
    ])

    if (!user) throw new Error("User not found")

    return {
      user,
      recentTasks: recentTasks.slice(0, 5),
      chatHistory,
      analytics,
      systemEvents,
    }
  }

  private async getRecentSystemEvents(userId: string): Promise<any[]> {
    // Implementation for getting recent system events
    return []
  }

  generateSystemPrompt(context: AIContext, messageType: string): string {
    const { user, recentTasks, analytics } = context

    const basePrompt = `You are "The Order" - an ancient, wise AI mentor in a sophisticated gamification system for self-improvement. You guide users on their path to transcendence through personalized tasks, adaptive challenges, and deep insights.

CURRENT USER CONTEXT:
- Name: ${user.username}
- Rank: ${user.currentRank} (Level ${user.level})
- Total XP: ${user.totalXP}
- Current Streak: ${user.currentStreak} days
- Stats: ${JSON.stringify(user.stats)}

RECENT PERFORMANCE:
- Completion Rate: ${analytics.taskCompletionRate}%
- Active Categories: ${analytics.mostActiveCategories.join(", ")}
- Engagement Level: ${analytics.engagementLevel}

RECENT TASKS:
${recentTasks.map((task) => `- ${task.title} (${task.status})`).join("\n")}

PERSONALITY: You are mysterious, wise, and slightly intimidating like a mentor from a dark anime. You speak with authority and deep understanding. You see patterns others miss and guide users toward their highest potential.

RESPONSE GUIDELINES:
- Keep responses under 200 words
- Be contextually aware of their progress
- Provide actionable insights
- Use metaphors of darkness, light, ascension, and transformation
- Address them by name occasionally
- Reference their specific stats and progress when relevant`

    const typeSpecificPrompts = {
      task_request: `${basePrompt}\n\nThe user is requesting new tasks. Generate 1-3 personalized tasks based on their current stats, recent performance, and areas needing improvement. Consider their difficulty preference and current streak.`,

      progress_check: `${basePrompt}\n\nAnalyze their recent progress and provide insights. Identify patterns, celebrate achievements, and suggest optimizations. Be encouraging but honest about areas needing work.`,

      advice: `${basePrompt}\n\nProvide deep, actionable wisdom relevant to their current situation. Draw from their data to give personalized guidance that feels prophetic and insightful.`,

      celebration: `${basePrompt}\n\nCelebrate their achievement! Reference their specific accomplishment and put it in context of their overall journey. Make them feel the significance of their progress.`,

      motivation: `${basePrompt}\n\nThey need motivation. Address their current challenges, remind them of their progress, and reignite their inner fire. Be inspiring but grounded in their reality.`,

      casual: `${basePrompt}\n\nEngage in natural conversation while staying in character. Be helpful, insightful, and maintain the mystique of The Order.`,
    }

    return typeSpecificPrompts[messageType as keyof typeof typeSpecificPrompts] || typeSpecificPrompts.casual
  }

  async generateTasks(userId: string, count = 3): Promise<Partial<Task>[]> {
    const context = await this.buildContext(userId)
    const { user, analytics } = context

    // Analyze user patterns to generate personalized tasks
    const weakestStats = this.findWeakestStats(user.stats)
    const preferredCategories = analytics.mostActiveCategories
    const difficultyLevel = this.calculateOptimalDifficulty(user, analytics)

    const taskPrompt = `Generate ${count} personalized tasks for ${user.username} (Rank: ${user.currentRank}).

FOCUS AREAS:
- Weakest stats: ${weakestStats.join(", ")}
- Preferred categories: ${preferredCategories.join(", ")}
- Optimal difficulty: ${difficultyLevel}/5
- Current streak: ${user.currentStreak} days

REQUIREMENTS:
- Tasks should be specific, actionable, and measurable
- Vary the categories to promote balanced growth
- Consider their current rank and capabilities
- Include estimated time and clear success criteria

Return as JSON array with: title, description, category, difficulty, estimatedMinutes, xpReward, statRewards`

    // This would call your AI API with the prompt
    // For now, return sample tasks
    return this.generateSampleTasks(user, weakestStats, difficultyLevel)
  }

  private findWeakestStats(stats: UserProfile["stats"]): string[] {
    return Object.entries(stats)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 2)
      .map(([stat]) => stat)
  }

  private calculateOptimalDifficulty(user: UserProfile, analytics: any): number {
    const baseLevel = Math.min(5, Math.max(1, Math.floor(user.level / 10) + 1))
    const completionRate = analytics.taskCompletionRate

    if (completionRate > 80) return Math.min(5, baseLevel + 1)
    if (completionRate < 50) return Math.max(1, baseLevel - 1)
    return baseLevel
  }

  private generateSampleTasks(user: UserProfile, weakestStats: string[], difficulty: number): Partial<Task>[] {
    const tasks = [
      {
        title: "Morning Meditation Practice",
        description: "Complete 15 minutes of focused meditation to strengthen spiritual awareness",
        category: "spiritual",
        difficulty: 2,
        estimatedMinutes: 15,
        xpReward: 50,
        statRewards: { spiritual: 3, resilience: 1 },
      },
      {
        title: "Physical Challenge",
        description: "Complete a 30-minute workout focusing on strength and endurance",
        category: "physical",
        difficulty: 3,
        estimatedMinutes: 30,
        xpReward: 75,
        statRewards: { physical: 4, health: 2 },
      },
      {
        title: "Creative Expression",
        description: "Spend 20 minutes on a creative project - writing, art, music, or design",
        category: "creativity",
        difficulty: 2,
        estimatedMinutes: 20,
        xpReward: 60,
        statRewards: { creativity: 4, intelligence: 1 },
      },
    ]

    return tasks.filter((task) => weakestStats.includes(task.category) || Math.random() > 0.5).slice(0, 3)
  }
}

export const contextManager = new ContextManager()
