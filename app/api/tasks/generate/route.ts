import { type NextRequest, NextResponse } from "next/server"

const GROQ_CONFIG = {
  apiUrl: "https://api.groq.com/openai/v1/chat/completions",
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-70b-versatile",
}

// Task generation system prompt
function buildTaskGenerationPrompt(userProfile: any, preferences: any) {
  return `You are an AI task generator for a gamification system. Create personalized daily tasks based on the user's profile and preferences.

USER PROFILE:
- Name: ${userProfile.username || "User"}
- Level: ${userProfile.level || 1}
- Rank: ${userProfile.rank || "Novice"}
- Current Stats: ${JSON.stringify(userProfile.stats || {})}
- Weakest Areas: ${getWeakestStats(userProfile.stats)}
- Streak: ${userProfile.streak || 0} days
- Preferred Categories: ${preferences.categories?.join(", ") || "All"}
- Difficulty Preference: ${preferences.difficulty || "medium"}
- Time Available: ${preferences.timeAvailable || "30"} minutes
- Focus Areas: ${preferences.focusAreas?.join(", ") || "General growth"}

TASK REQUIREMENTS:
1. Generate exactly 3 tasks
2. Each task should target their weakest stats
3. Tasks should be achievable in the specified time
4. Include variety across different life areas
5. Make tasks specific and actionable
6. Consider their current level and experience

RESPONSE FORMAT (JSON):
{
  "tasks": [
    {
      "id": "unique_id",
      "title": "Task Title",
      "description": "Detailed description of what to do",
      "category": "category_name",
      "difficulty": "easy|medium|hard",
      "estimatedTime": "15 minutes",
      "xpReward": 50,
      "targetStats": ["stat1", "stat2"],
      "instructions": ["Step 1", "Step 2", "Step 3"]
    }
  ]
}

Generate tasks that feel like meaningful quests, not chores. Make them engaging and personally relevant.`
}

function getWeakestStats(stats: any): string {
  if (!stats || typeof stats !== "object") return "All areas"

  const entries = Object.entries(stats)
  if (entries.length === 0) return "All areas"

  return entries
    .sort(([, a], [, b]) => (a as number) - (b as number))
    .slice(0, 2)
    .map(([stat]) => stat)
    .join(", ")
}

async function generateTasksWithGroq(userProfile: any, preferences: any) {
  if (!GROQ_CONFIG.apiKey) {
    throw new Error("Groq API key not configured")
  }

  const systemPrompt = buildTaskGenerationPrompt(userProfile, preferences)

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
        { role: "user", content: "Generate 3 personalized tasks for today." },
      ],
      max_tokens: 1000,
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  try {
    return JSON.parse(content)
  } catch {
    // Fallback if JSON parsing fails
    return generateFallbackTasks(userProfile, preferences)
  }
}

function generateFallbackTasks(userProfile: any, preferences: any) {
  const level = userProfile?.level || 1
  const baseXP = Math.max(25, level * 10)

  return {
    tasks: [
      {
        id: `task_${Date.now()}_1`,
        title: "Morning Reflection",
        description: "Take 10 minutes to reflect on your goals and set intentions for the day",
        category: "mindfulness",
        difficulty: "easy",
        estimatedTime: "10 minutes",
        xpReward: baseXP,
        targetStats: ["wisdom", "focus"],
        instructions: ["Find a quiet space", "Write down 3 goals for today", "Visualize achieving them"],
      },
      {
        id: `task_${Date.now()}_2`,
        title: "Skill Building Session",
        description: "Spend 20 minutes learning something new in your chosen field",
        category: "learning",
        difficulty: "medium",
        estimatedTime: "20 minutes",
        xpReward: baseXP * 1.5,
        targetStats: ["intelligence", "creativity"],
        instructions: [
          "Choose a specific skill to practice",
          "Set a timer for 20 minutes",
          "Focus deeply without distractions",
        ],
      },
      {
        id: `task_${Date.now()}_3`,
        title: "Physical Movement",
        description: "Get your body moving with 15 minutes of physical activity",
        category: "fitness",
        difficulty: "medium",
        estimatedTime: "15 minutes",
        xpReward: baseXP * 1.2,
        targetStats: ["strength", "endurance"],
        instructions: ["Choose an activity you enjoy", "Start with light warm-up", "Gradually increase intensity"],
      },
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, preferences = {} } = body

    if (!userProfile) {
      return NextResponse.json({ error: "User profile is required" }, { status: 400 })
    }

    // Generate tasks using Groq AI
    const result = await generateTasksWithGroq(userProfile, preferences)

    return NextResponse.json({
      success: true,
      tasks: result.tasks,
      generatedAt: new Date().toISOString(),
      personalizedFor: userProfile.username || "User",
    })
  } catch (error) {
    console.error("Task generation error:", error)

    // Fallback task generation
    const fallbackResult = generateFallbackTasks(request.body?.userProfile, request.body?.preferences || {})

    return NextResponse.json({
      success: true,
      tasks: fallbackResult.tasks,
      generatedAt: new Date().toISOString(),
      fallback: true,
      error: "AI generation failed, using fallback tasks",
    })
  }
}
