import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/client"
import { contextManager } from "@/lib/ai/context-manager"

export async function POST(req: NextRequest) {
  try {
    const { userId, count = 3, category } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    // Generate personalized tasks
    const taskTemplates = await contextManager.generateTasks(userId, count)

    // Create tasks in database
    const createdTasks = []
    for (const template of taskTemplates) {
      const task = await db.createTask({
        userId,
        title: template.title!,
        description: template.description!,
        category: template.category!,
        difficulty: template.difficulty!,
        xpReward: template.xpReward!,
        statRewards: template.statRewards!,
        estimatedMinutes: template.estimatedMinutes!,
        type: "daily",
        status: "pending",
        generatedBy: "ai",
        generationContext: {
          userStats: {},
          recentFailures: [],
          currentPaths: [],
        },
      })
      createdTasks.push(task)
    }

    return NextResponse.json({ tasks: createdTasks })
  } catch (error) {
    console.error("Task generation error:", error)
    return NextResponse.json({ error: "Failed to generate tasks" }, { status: 500 })
  }
}
