import { type NextRequest, NextResponse } from "next/server"

const GROQ_CONFIG = {
  apiUrl: "https://api.groq.com/openai/v1/chat/completions",
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-70b-versatile",
}

// Advanced task generation system
async function generatePersonalizedTasks(userProfile: any, userProgress: any, preferences: any) {
  const context = analyzeUserForTasks(userProfile, userProgress, preferences)
  const systemPrompt = buildTaskGenerationPrompt(context)

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
          { role: "user", content: `Generate ${preferences.count || 3} personalized tasks for today.` },
        ],
        max_tokens: 1000,
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const tasksData = JSON.parse(data.choices[0].message.content)

    return enhanceGeneratedTasks(tasksData.tasks, context)
  } catch (error) {
    console.error("Task generation error:", error)
    return generateFallbackTasks(context)
  }
}

function analyzeUserForTasks(userProfile: any, userProgress: any, preferences: any) {
  const stats = userProfile.stats || {}
  const weakestStats = Object.entries(stats)
    .sort(([, a], [, b]) => (a as number) - (b as number))
    .slice(0, 3)
    .map(([stat]) => stat)

  const strongestStats = Object.entries(stats)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 2)
    .map(([stat]) => stat)

  const recentCategories = userProgress?.recentTasks?.map((t: any) => t.category) || []
  const categoryFrequency = recentCategories.reduce((acc: any, cat: string) => {
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  return {
    ...userProfile,
    weakestStats,
    strongestStats,
    categoryFrequency,
    completionRate: calculateCompletionRate(userProgress),
    preferredDifficulty: calculatePreferredDifficulty(userProgress),
    timeOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
    streak: userProfile.streak || 0,
    preferences: preferences || {},
  }
}

function buildTaskGenerationPrompt(context: any): string {
  return `You are an AI task generation system for "Limitless" - a sophisticated gamification platform. Generate personalized tasks that will optimally challenge and grow the user.

USER PROFILE:
- Name: ${context.username}
- Level: ${context.level} | Rank: ${context.rank}
- Current Streak: ${context.streak} days
- Completion Rate: ${context.completionRate}%
- Weakest Stats: ${context.weakestStats.join(", ")}
- Strongest Stats: ${context.strongestStats.join(", ")}
- Preferred Difficulty: ${context.preferredDifficulty}/5
- Time Context: ${getTimeContext(context.timeOfDay, context.dayOfWeek)}

TASK GENERATION RULES:
1. Focus 60% on weakest stats, 30% on balanced growth, 10% on strengths
2. Vary difficulty: ${Math.max(1, context.preferredDifficulty - 1)} to ${Math.min(5, context.preferredDifficulty + 1)}
3. Consider time of day and energy levels
4. Make tasks specific, measurable, and achievable
5. Include estimated time (15-90 minutes)
6. Assign appropriate XP rewards (20-200 XP based on difficulty)
7. Include stat rewards that align with task category

CATEGORIES TO FOCUS ON:
- Physical: Exercise, movement, health habits
- Mental: Learning, problem-solving, skill development  
- Emotional: Relationships, self-care, emotional intelligence
- Spiritual: Meditation, reflection, purpose work
- Creative: Art, writing, innovation, expression
- Social: Community, networking, helping others
- Professional: Career development, productivity, leadership

RESPONSE FORMAT (JSON):
{
  "tasks": [
    {
      "title": "Specific, actionable task title",
      "description": "Clear description with success criteria",
      "category": "primary category",
      "difficulty": 1-5,
      "estimatedMinutes": 15-90,
      "xpReward": 20-200,
      "statRewards": {"stat1": 1-5, "stat2": 1-3},
      "tags": ["relevant", "tags"],
      "timeRecommendation": "morning/afternoon/evening",
      "prerequisites": ["optional prerequisites"],
      "bonusObjectives": ["optional bonus challenges"]
    }
  ],
  "dailyTheme": "Overarching theme connecting the tasks",
  "motivationalMessage": "Personalized encouragement"
}

Generate tasks that feel like meaningful quests, not chores. Make them excited to grow!`
}

function getTimeContext(hour: number, dayOfWeek: number): string {
  const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening"
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dayName = dayNames[dayOfWeek]

  let context = `${timeOfDay} on ${dayName}`

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    context += " (weekend)"
  }

  if (hour < 9) {
    context += " - early start energy"
  } else if (hour > 20) {
    context += " - evening wind-down"
  }

  return context
}

function calculateCompletionRate(userProgress: any): number {
  if (!userProgress?.recentTasks) return 50
  const completed = userProgress.recentTasks.filter((t: any) => t.status === "completed").length
  return Math.round((completed / userProgress.recentTasks.length) * 100)
}

function calculatePreferredDifficulty(userProgress: any): number {
  const completionRate = calculateCompletionRate(userProgress)

  if (completionRate > 85) return 4 // They're crushing it, level up
  if (completionRate > 70) return 3 // Solid performance
  if (completionRate > 50) return 2 // Building momentum
  return 1 // Need easier wins to build confidence
}

function enhanceGeneratedTasks(tasks: any[], context: any): any[] {
  return tasks.map((task, index) => ({
    ...task,
    id: `task_${Date.now()}_${index}`,
    createdAt: new Date().toISOString(),
    userId: context.id,
    status: "pending",
    aiGenerated: true,
    personalizedFor: {
      level: context.level,
      weakestStats: context.weakestStats,
      streak: context.streak,
    },
    // Add dynamic XP scaling based on user level
    xpReward: Math.round(task.xpReward * (1 + context.level * 0.1)),
    // Add streak bonuses
    streakBonus: context.streak > 7 ? Math.round(task.xpReward * 0.2) : 0,
  }))
}

function generateFallbackTasks(context: any): any[] {
  const fallbackTasks = [
    {
      title: "Morning Reflection Practice",
      description: "Spend 10 minutes journaling about your intentions for the day",
      category: "spiritual",
      difficulty: 2,
      estimatedMinutes: 10,
      xpReward: 40,
      statRewards: { wisdom: 2, emotional: 1 },
      tags: ["reflection", "mindfulness"],
      timeRecommendation: "morning",
    },
    {
      title: "Physical Energy Boost",
      description: "Complete a 15-minute movement session - stretching, walking, or light exercise",
      category: "physical",
      difficulty: 2,
      estimatedMinutes: 15,
      xpReward: 50,
      statRewards: { physical: 3, health: 2 },
      tags: ["movement", "energy"],
      timeRecommendation: "any",
    },
    {
      title: "Skill Development Session",
      description: "Dedicate 20 minutes to learning something new in your field of interest",
      category: "mental",
      difficulty: 3,
      estimatedMinutes: 20,
      xpReward: 60,
      statRewards: { intelligence: 3, focus: 1 },
      tags: ["learning", "growth"],
      timeRecommendation: "afternoon",
    },
  ]

  return enhanceGeneratedTasks(fallbackTasks, context)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, userProgress, preferences = {} } = body

    if (!userProfile) {
      return NextResponse.json({ error: "User profile required" }, { status: 400 })
    }

    const tasks = await generatePersonalizedTasks(userProfile, userProgress, preferences)

    return NextResponse.json({
      tasks,
      generatedAt: new Date().toISOString(),
      personalizedFor: userProfile.username,
      aiProvider: "groq",
      success: true,
    })
  } catch (error) {
    console.error("Task generation API error:", error)
    return NextResponse.json(
      {
        error: "Task generation failed",
        fallbackTasks: generateFallbackTasks({ level: 1, streak: 0 }),
      },
      { status: 500 },
    )
  }
}
