import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/client"
import { contextManager } from "@/lib/contextManager" // Declare the contextManager variable

export async function POST(req: NextRequest) {
  try {
    const { taskId, userId, completionTime, userRating } = await req.json()

    if (!taskId || !userId) {
      return NextResponse.json({ error: "taskId and userId are required" }, { status: 400 })
    }

    // Complete the task
    await db.completeTask(taskId)

    // Update additional metrics if provided
    if (completionTime || userRating) {
      // Update task with completion metrics
      // This would be implemented in the database client
    }

    // Check for achievements
    await checkForAchievements(userId)

    // Generate celebratory message
    const context = await contextManager.buildContext(userId)
    const celebrationMessage = generateCelebrationMessage(context)

    return NextResponse.json({
      success: true,
      celebration: celebrationMessage,
    })
  } catch (error) {
    console.error("Task completion error:", error)
    return NextResponse.json({ error: "Failed to complete task" }, { status: 500 })
  }
}

async function checkForAchievements(userId: string): Promise<void> {
  // Implementation for checking and awarding achievements
  // This would analyze user progress and award appropriate achievements
}

function generateCelebrationMessage(context: any): string {
  const { user } = context
  const celebrations = [
    `Excellent work, ${user.username}! Your dedication strengthens with each completed task. The Order observes your growing power.`,
    `Another step toward mastery, ${user.username}. Your ${user.currentStreak + 1}-day streak burns brighter than ever.`,
    `The task is complete, ${user.username}. Your accumulated XP of ${user.totalXP} reflects true commitment to the path.`,
  ]

  return celebrations[Math.floor(Math.random() * celebrations.length)]
}
