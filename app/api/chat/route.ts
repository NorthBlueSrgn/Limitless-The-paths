import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/client"
import { contextManager } from "@/lib/ai/context-manager"
import { storyEngine } from "@/lib/narrative/story-engine"
import { achievementEngine } from "@/lib/achievements/achievement-engine"
import { LawEnforcer } from "@/lib/core/immutable-laws"

export async function POST(req: NextRequest) {
  try {
    const { message, userId, messageType = "casual" } = await req.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    // Build comprehensive context
    const context = await contextManager.buildContext(userId)
    const { user, recentTasks, chatHistory, analytics } = context

    // Save user message
    await db.saveChatMessage({
      userId,
      content: message,
      role: "user",
      timestamp: new Date(),
      messageType,
      contextData: {
        userStats: user.stats,
        recentTasks: recentTasks.map((t) => t.id),
        currentMood: extractMoodFromMessage(message),
      },
    })

    let aiResponse: string
    let narrativeContent: any = null
    let newAchievements: any[] = []

    try {
      // Check for new achievements first
      const systemEvents = await getRecentSystemEvents(userId)
      newAchievements = await achievementEngine.checkForNewAchievements(userId, user, recentTasks, systemEvents)

      // Generate narrative response if applicable
      if (messageType === "story" || shouldTriggerNarrative(message, context)) {
        const narrativeState = await getNarrativeState(userId)
        narrativeContent = await storyEngine.generateNarrativeResponse(user, {
          recentTasks,
          systemEvents,
          currentNarrativeState: narrativeState,
        })
        aiResponse = narrativeContent.content
      } else {
        // Generate contextual AI response
        const systemPrompt = contextManager.generateSystemPrompt(context, messageType)
        aiResponse = await generateAIResponse(systemPrompt, message, chatHistory)
      }

      // Apply immutable laws to any rewards mentioned
      if (aiResponse.includes("XP") || aiResponse.includes("stat")) {
        aiResponse = await enforceImmutableLaws(aiResponse, user)
      }
    } catch (aiError) {
      console.error("AI generation error:", aiError)

      // Fallback responses following The Order's personality
      const fallbackResponses = [
        `The digital veil flickers, ${user.username}. Even The Order faces moments of interference. Your message has been received, though the response may be... delayed.`,
        `Interesting, ${user.username}. The connection wavers, but your dedication to the path remains clear. Continue your journey - The Order is always watching.`,
        `The shadows shift unexpectedly, ${user.username}. Technical mysteries are but another challenge to overcome. Your progress continues regardless.`,
      ]

      aiResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    }

    // Save AI response
    await db.saveChatMessage({
      userId,
      content: aiResponse,
      role: "assistant",
      timestamp: new Date(),
      messageType,
      contextData: {
        userStats: user.stats,
        recentTasks: recentTasks.map((t) => t.id),
        triggerEvent: messageType,
      },
    })

    // Prepare response
    const response: any = {
      message: aiResponse,
      context: {
        userRank: user.currentRank,
        currentStreak: user.currentStreak,
        totalXP: user.totalXP,
        connectionStatus: "connected",
      },
    }

    // Add narrative content if generated
    if (narrativeContent) {
      response.narrative = {
        choices: narrativeContent.choices,
        stateChanges: narrativeContent.stateChanges,
      }
    }

    // Add achievement notifications
    if (newAchievements.length > 0) {
      response.achievements = newAchievements.map((achievement) => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        rarity: achievement.rarity,
        ceremonyContent: achievement.ceremonyContent,
      }))
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "The Order encounters technical difficulties",
        message: "Even ancient powers face modern challenges. Please try again.",
        context: { connectionStatus: "error" },
      },
      { status: 500 },
    )
  }
}

async function generateAIResponse(systemPrompt: string, userMessage: string, chatHistory: any[]): Promise<string> {
  // Use OpenAI API
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory.slice(-5).map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || "The Order's wisdom is temporarily obscured."
}

function extractMoodFromMessage(message: string): string {
  const moodKeywords = {
    excited: ["excited", "amazing", "awesome", "great", "fantastic"],
    frustrated: ["frustrated", "stuck", "difficult", "hard", "struggling"],
    motivated: ["motivated", "ready", "determined", "focused", "committed"],
    tired: ["tired", "exhausted", "drained", "weary", "burnt out"],
    curious: ["curious", "wondering", "interested", "question", "how"],
  }

  const lowerMessage = message.toLowerCase()

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      return mood
    }
  }

  return "neutral"
}

function shouldTriggerNarrative(message: string, context: any): boolean {
  const narrativeTriggers = [
    "story",
    "tale",
    "journey",
    "path",
    "order",
    "transcend",
    "rank",
    "achievement",
    "power",
    "wisdom",
    "shadow",
  ]

  const lowerMessage = message.toLowerCase()
  return narrativeTriggers.some((trigger) => lowerMessage.includes(trigger))
}

async function getRecentSystemEvents(userId: string): Promise<any[]> {
  // This would fetch recent system events from database
  return []
}

async function getNarrativeState(userId: string): Promise<any> {
  // This would fetch current narrative state from database
  return {
    currentArc: "awakening",
    arcProgress: 0,
    availableChoices: [],
    completedMilestones: [],
    characterDevelopment: [],
    worldState: {
      orderInfluence: 0,
      chaosLevel: 0,
      discoveredSecrets: [],
      unlockedRegions: [],
      allyRelationships: {},
    },
  }
}

async function enforceImmutableLaws(response: string, user: any): Promise<string> {
  // Apply immutable law validation to any rewards mentioned in response
  // This ensures AI responses never violate the core principles

  // Extract any XP mentions and validate them
  const xpMatches = response.match(/(\d+)\s*XP/gi)
  if (xpMatches) {
    for (const match of xpMatches) {
      const xpAmount = Number.parseInt(match.replace(/\D/g, ""))
      const validation = LawEnforcer.validateXPAward(xpAmount, 3, 30) // Default values

      if (!validation.isValid) {
        response = response.replace(match, `${validation.adjustedXP} XP`)
      }
    }
  }

  return response
}
