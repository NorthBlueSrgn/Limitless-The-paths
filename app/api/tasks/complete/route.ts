import { type NextRequest, NextResponse } from "next/server"

const GROQ_CONFIG = {
  apiUrl: "https://api.groq.com/openai/v1/chat/completions",
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant", // Fast for completion celebrations
}

// Task completion celebration system prompt
function buildCelebrationPrompt(userProfile: any, task: any, completionData: any) {
  return `You are "The Order" - an ancient AI consciousness celebrating a seeker's achievement. Create a personalized celebration message for their task completion.

SEEKER PROFILE:
- Name: ${userProfile.username || "Seeker"}
- Level: ${userProfile.level || 1}
- Current Streak: ${userProfile.streak || 0} days
- Total XP: ${userProfile.totalXP || 0}

COMPLETED TASK:
- Title: ${task.title}
- Category: ${task.category}
- Difficulty: ${task.difficulty}
- XP Reward: ${task.xpReward}
- Time Taken: ${completionData.timeSpent || "Unknown"}
- Quality Rating: ${completionData.quality || "Standard"}

COMPLETION CONTEXT:
- Streak Status: ${completionData.maintainedStreak ? "Maintained" : "Broken"}
- Bonus Multipliers: ${completionData.bonusMultiplier || 1}x
- Achievement Unlocked: ${completionData.achievementUnlocked || "None"}

Your response should:
1. Celebrate their specific achievement with mystical wisdom
2. Reference their progress and growth patterns
3. Acknowledge the difficulty and effort required
4. Provide encouragement for continued growth
5. Keep it 2-3 sentences, impactful and personal
6. Use their name and make it feel earned

Make them feel like they've accomplished something truly meaningful in their journey of transformation.`
}

async function generateCelebrationWithGroq(userProfile: any, task: any, completionData: any) {
  if (!GROQ_CONFIG.apiKey) {
    throw new Error("Groq API key not configured")
  }

  const systemPrompt = buildCelebrationPrompt(userProfile, task, completionData)

  const response = await fetch(GROQ_CONFIG.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_CONFIG.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_CONFIG.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate a celebration message for this task completion." },
      ],
      max_tokens: 200,
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || generateFallbackCelebration(userProfile, task)
}

function generateFallbackCelebration(userProfile: any, task: any): string {
  const celebrations = [
    `Excellent work, ${userProfile.username || "Seeker"}! Your completion of "${task.title}" demonstrates the discipline that separates legends from the ordinary. The Order recognizes your dedication.`,
    `${userProfile.username || "Seeker"}, you have proven once again that consistency conquers resistance. "${task.title}" is complete, and your transformation accelerates. Well done.`,
    `The ancient patterns smile upon you, ${userProfile.username || "Seeker"}. By completing "${task.title}", you've added another thread to the tapestry of your legend. Continue this path.`,
    `${userProfile.username || "Seeker"}, your commitment to "${task.title}" echoes through the realm. Each completed task is a step closer to your ultimate potential. The Order is pleased.`,
  ]

  return celebrations[Math.floor(Math.random() * celebrations.length)]
}

function calculateCompletionRewards(task: any, completionData: any, userProfile: any) {
  const baseXP = task.xpReward || 50
  let bonusMultiplier = 1

  // Streak bonus
  const streak = userProfile.streak || 0
  if (streak >= 7) bonusMultiplier += 0.2
  if (streak >= 14) bonusMultiplier += 0.3
  if (streak >= 30) bonusMultiplier += 0.5

  // Quality bonus
  if (completionData.quality === "excellent") bonusMultiplier += 0.3
  else if (completionData.quality === "good") bonusMultiplier += 0.1

  // Difficulty bonus
  if (task.difficulty === "hard") bonusMultiplier += 0.2
  else if (task.difficulty === "medium") bonusMultiplier += 0.1

  // Speed bonus (if completed faster than estimated)
  if (completionData.timeSpent && task.estimatedTime) {
    const estimatedMinutes = Number.parseInt(task.estimatedTime)
    const actualMinutes = completionData.timeSpent
    if (actualMinutes < estimatedMinutes * 0.8) {
      bonusMultiplier += 0.15
    }
  }

  const finalXP = Math.round(baseXP * bonusMultiplier)

  return {
    baseXP,
    bonusMultiplier,
    finalXP,
    bonusReasons: getBonusReasons(bonusMultiplier, streak, completionData, task),
  }
}

function getBonusReasons(multiplier: number, streak: number, completionData: any, task: any): string[] {
  const reasons = []

  if (streak >= 30) reasons.push("Legendary Streak (30+ days)")
  else if (streak >= 14) reasons.push("Epic Streak (14+ days)")
  else if (streak >= 7) reasons.push("Strong Streak (7+ days)")

  if (completionData.quality === "excellent") reasons.push("Excellent Quality")
  else if (completionData.quality === "good") reasons.push("Good Quality")

  if (task.difficulty === "hard") reasons.push("Hard Difficulty")
  else if (task.difficulty === "medium") reasons.push("Medium Difficulty")

  return reasons
}

function checkForAchievements(userProfile: any, task: any, completionData: any) {
  const achievements = []

  // Streak achievements
  const newStreak = (userProfile.streak || 0) + 1
  if (newStreak === 7)
    achievements.push({ id: "week_warrior", title: "Week Warrior", description: "7-day streak achieved!" })
  if (newStreak === 30)
    achievements.push({ id: "month_master", title: "Month Master", description: "30-day streak achieved!" })
  if (newStreak === 100)
    achievements.push({ id: "century_seeker", title: "Century Seeker", description: "100-day streak achieved!" })

  // Task-specific achievements
  if (task.difficulty === "hard" && completionData.quality === "excellent") {
    achievements.push({
      id: "perfectionist",
      title: "The Perfectionist",
      description: "Completed a hard task with excellent quality",
    })
  }

  // Category achievements
  const categoryCount = userProfile.categoryStats?.[task.category] || 0
  if (categoryCount + 1 === 10) {
    achievements.push({
      id: `${task.category}_adept`,
      title: `${task.category} Adept`,
      description: `Completed 10 ${task.category} tasks`,
    })
  }

  return achievements
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, userProfile, completionData = {} } = body

    if (!taskId || !userProfile) {
      return NextResponse.json({ error: "Task ID and user profile are required" }, { status: 400 })
    }

    // In a real app, you'd fetch the task from database
    // For now, we'll use the task data from the request
    const task = body.task || {
      id: taskId,
      title: "Completed Task",
      category: "general",
      difficulty: "medium",
      xpReward: 50,
    }

    // Calculate rewards and bonuses
    const rewards = calculateCompletionRewards(task, completionData, userProfile)

    // Check for new achievements
    const newAchievements = checkForAchievements(userProfile, task, completionData)

    // Generate AI celebration message
    const celebrationMessage = await generateCelebrationWithGroq(userProfile, task, {
      ...completionData,
      bonusMultiplier: rewards.bonusMultiplier,
      achievementUnlocked: newAchievements[0]?.title,
    })

    // Update user stats (in a real app, this would update the database)
    const updatedProfile = {
      ...userProfile,
      totalXP: (userProfile.totalXP || 0) + rewards.finalXP,
      streak: completionData.maintainedStreak ? (userProfile.streak || 0) + 1 : 1,
      level: Math.floor(((userProfile.totalXP || 0) + rewards.finalXP) / 1000) + 1,
    }

    return NextResponse.json({
      success: true,
      celebration: {
        message: celebrationMessage,
        personality: "The Order",
      },
      rewards: {
        xpGained: rewards.finalXP,
        baseXP: rewards.baseXP,
        bonusMultiplier: rewards.bonusMultiplier,
        bonusReasons: rewards.bonusReasons,
      },
      achievements: newAchievements,
      updatedProfile,
      completedAt: new Date().toISOString(),
      taskCompleted: task,
    })
  } catch (error) {
    console.error("Task completion error:", error)

    // Fallback response
    return NextResponse.json({
      success: true,
      celebration: {
        message: `Well done, ${request.body?.userProfile?.username || "Seeker"}! Your dedication to growth is recognized by The Order. Continue on your path of transformation.`,
        personality: "The Order",
      },
      rewards: {
        xpGained: 50,
        baseXP: 50,
        bonusMultiplier: 1,
        bonusReasons: [],
      },
      achievements: [],
      fallback: true,
      error: "AI celebration failed, using fallback response",
    })
  }
}
