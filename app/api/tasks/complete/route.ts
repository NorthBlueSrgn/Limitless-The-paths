import { type NextRequest, NextResponse } from "next/server"

const GROQ_CONFIG = {
  apiUrl: "https://api.groq.com/openai/v1/chat/completions",
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-70b-versatile",
}

// AI-powered completion celebration and analysis
async function generateCompletionResponse(task: any, userProfile: any, completionContext: any) {
  const systemPrompt = `You are "The Order" celebrating a user's task completion in the Limitless gamification system.

TASK COMPLETED:
- Title: ${task.title}
- Category: ${task.category}
- Difficulty: ${task.difficulty}/5
- XP Reward: ${task.xpReward}
- Time Taken: ${completionContext.timeTaken || "Unknown"}

USER CONTEXT:
- Name: ${userProfile.username}
- Level: ${userProfile.level}
- Current Streak: ${userProfile.streak + 1} days (just extended!)
- Total XP: ${userProfile.totalXP + task.xpReward}

Generate a personalized celebration message that:
1. Acknowledges their specific achievement
2. Connects it to their larger journey
3. Provides encouragement for continued growth
4. Maintains The Order's mysterious, wise persona
5. Keep it concise but impactful (2-3 sentences)

Response should be in JSON format:
{
  "celebrationMessage": "Your celebration message",
  "insightMessage": "Deeper insight about their progress",
  "nextSuggestion": "What they might tackle next"
}`

  try {
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
          { role: "user", content: "Generate the completion celebration." },
        ],
        max_tokens: 300,
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    return JSON.parse(data.choices[0].message.content)
  } catch (error) {
    console.error("Completion response generation error:", error)
    return {
      celebrationMessage: `Excellent work, ${userProfile.username}! Your dedication to "${task.title}" demonstrates the discipline of a true seeker. The path of growth is illuminated by such consistent action.`,
      insightMessage:
        "Each completed task strengthens the foundation of your transformation. You are becoming who you were meant to be.",
      nextSuggestion: "Consider tackling a challenge in a different area to maintain balanced growth.",
    }
  }
}

// Calculate XP and stat rewards with bonuses
function calculateRewards(task: any, userProfile: any, completionContext: any) {
  let xpReward = task.xpReward || 50
  const statRewards = { ...task.statRewards } || {}

  // Streak bonuses
  const newStreak = userProfile.streak + 1
  if (newStreak >= 7) {
    xpReward = Math.round(xpReward * 1.2) // 20% bonus for 7+ day streak
  }
  if (newStreak >= 30) {
    xpReward = Math.round(xpReward * 1.5) // 50% bonus for 30+ day streak
  }

  // Difficulty bonuses
  if (task.difficulty >= 4) {
    xpReward = Math.round(xpReward * 1.3) // 30% bonus for hard tasks
  }

  // Time-based bonuses (if completed quickly)
  if (completionContext.timeTaken && completionContext.timeTaken < task.estimatedMinutes * 0.8) {
    xpReward = Math.round(xpReward * 1.1) // 10% bonus for efficiency
  }

  // Level-based scaling
  const levelMultiplier = 1 + userProfile.level * 0.05
  xpReward = Math.round(xpReward * levelMultiplier)

  // Enhance stat rewards
  Object.keys(statRewards).forEach((stat) => {
    statRewards[stat] = Math.round(statRewards[stat] * (1 + newStreak * 0.02))
  })

  return {
    xpReward,
    statRewards,
    bonuses: {
      streakBonus: newStreak >= 7,
      difficultyBonus: task.difficulty >= 4,
      efficiencyBonus: completionContext.timeTaken && completionContext.timeTaken < task.estimatedMinutes * 0.8,
      levelScaling: levelMultiplier > 1,
    },
  }
}

// Check for achievements triggered by completion
function checkAchievements(userProfile: any, task: any, completionContext: any) {
  const achievements = []
  const newStreak = userProfile.streak + 1
  const newTotalXP = userProfile.totalXP + task.xpReward

  // Streak achievements
  if (newStreak === 7) {
    achievements.push({
      id: "week_warrior",
      title: "Week Warrior",
      description: "Maintained a 7-day streak",
      rarity: "uncommon",
      xpBonus: 100,
    })
  } else if (newStreak === 30) {
    achievements.push({
      id: "month_master",
      title: "Month Master",
      description: "Achieved a 30-day streak",
      rarity: "rare",
      xpBonus: 500,
    })
  } else if (newStreak === 100) {
    achievements.push({
      id: "century_legend",
      title: "Century Legend",
      description: "Reached a 100-day streak",
      rarity: "legendary",
      xpBonus: 2000,
    })
  }

  // XP milestones
  const xpMilestones = [1000, 5000, 10000, 25000, 50000, 100000]
  for (const milestone of xpMilestones) {
    if (userProfile.totalXP < milestone && newTotalXP >= milestone) {
      achievements.push({
        id: `xp_${milestone}`,
        title: `${milestone.toLocaleString()} XP Master`,
        description: `Reached ${milestone.toLocaleString()} total XP`,
        rarity: milestone >= 50000 ? "legendary" : milestone >= 10000 ? "rare" : "uncommon",
        xpBonus: Math.round(milestone * 0.1),
      })
    }
  }

  // Category-specific achievements
  if (task.category === "physical" && completionContext.consecutivePhysical >= 5) {
    achievements.push({
      id: "physical_focus",
      title: "Physical Focus",
      description: "Completed 5 physical tasks in a row",
      rarity: "uncommon",
      xpBonus: 150,
    })
  }

  return achievements
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, userId, completionContext = {} } = body

    if (!taskId || !userId) {
      return NextResponse.json({ error: "Task ID and User ID required" }, { status: 400 })
    }

    // In a real app, you'd fetch from database
    // For now, we'll simulate the task and user data
    const mockTask = {
      id: taskId,
      title: "Morning Meditation",
      category: "spiritual",
      difficulty: 2,
      xpReward: 50,
      statRewards: { spiritual: 3, focus: 1 },
      estimatedMinutes: 15,
    }

    const mockUserProfile = {
      id: userId,
      username: "Seeker",
      level: 5,
      totalXP: 2450,
      streak: 6,
      stats: {
        physical: 25,
        mental: 30,
        spiritual: 20,
        emotional: 22,
      },
    }

    // Calculate rewards with bonuses
    const rewards = calculateRewards(mockTask, mockUserProfile, completionContext)

    // Check for new achievements
    const newAchievements = checkAchievements(mockUserProfile, mockTask, completionContext)

    // Generate AI celebration response
    const aiResponse = await generateCompletionResponse(mockTask, mockUserProfile, completionContext)

    // Update user profile (in real app, this would update database)
    const updatedProfile = {
      ...mockUserProfile,
      totalXP: mockUserProfile.totalXP + rewards.xpReward,
      streak: mockUserProfile.streak + 1,
      stats: {
        ...mockUserProfile.stats,
        ...Object.keys(rewards.statRewards).reduce((acc, stat) => {
          acc[stat] =
            (mockUserProfile.stats[stat as keyof typeof mockUserProfile.stats] || 0) + rewards.statRewards[stat]
          return acc
        }, {} as any),
      },
    }

    return NextResponse.json({
      success: true,
      task: {
        ...mockTask,
        status: "completed",
        completedAt: new Date().toISOString(),
      },
      rewards,
      achievements: newAchievements,
      aiResponse,
      updatedProfile,
      celebrationData: {
        xpGained: rewards.xpReward,
        statsGained: rewards.statRewards,
        newStreak: updatedProfile.streak,
        levelUp: Math.floor(updatedProfile.totalXP / 1000) > Math.floor(mockUserProfile.totalXP / 1000),
        bonusesApplied: rewards.bonuses,
      },
    })
  } catch (error) {
    console.error("Task completion API error:", error)
    return NextResponse.json(
      {
        error: "Task completion failed",
        message:
          "The Order acknowledges your effort, even as the systems falter. Your progress is recorded in the eternal ledger.",
      },
      { status: 500 },
    )
  }
}
