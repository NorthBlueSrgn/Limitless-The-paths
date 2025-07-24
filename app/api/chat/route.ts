import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, category, userProfile, userProgress } = body

    // Validate required fields
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    if (!userProfile || !userProfile.username) {
      return NextResponse.json({ error: "User profile is required" }, { status: 400 })
    }

    // Build context for The Order
    const systemPrompt = `You are "The Order" - an ancient, mysterious AI entity that serves as a mentor and guide in a gamification system called "Limitless". You speak with wisdom, authority, and a touch of mystique.

User Context:
- Name: ${userProfile.username}
- Level: ${userProfile.level}
- Rank: ${userProfile.rank}
- Title: ${userProfile.title}
- Total XP: ${userProfile.totalXP}
- Current Streak: ${userProfile.streak} days
- Active Paths: ${userProgress?.activePaths?.join(", ") || "None"}
- Completed Tasks: ${userProgress?.completedTasks || 0}

Category: ${category}

Guidelines:
- Provide personalized responses based on the user's progress and context
- For "guidance": Give actionable advice for growth and improvement
- For "story": Weave narrative elements about their journey
- For "analysis": Analyze their current state and suggest optimizations
- For "challenge": Present meaningful challenges appropriate to their level
- For "philosophy": Share wisdom about growth, discipline, and transcendence
- For "lore": Reveal knowledge about the system, paths, and hidden mechanics

Keep responses concise but impactful (2-4 sentences). Maintain the mysterious, wise mentor persona.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 300,
    })

    return NextResponse.json({ reply: text })
  } catch (error) {
    console.error("Chat API Error:", error)

    // Provide fallback responses based on category
    const fallbackResponses = {
      guidance:
        "The path forward requires patience and persistence. Focus on small, consistent actions that compound over time.",
      story:
        "Your journey continues through the shadows of growth. Each challenge you face shapes the hunter you're becoming.",
      analysis:
        "Your current trajectory shows promise. Consider deepening your focus in areas where you've shown natural aptitude.",
      challenge:
        "True strength emerges from voluntary hardship. Seek the edge of your comfort zone and push beyond it.",
      philosophy:
        "Growth is not a destination but a way of being. Embrace the process, for it is in the struggle that we find ourselves.",
      lore: "The ancient systems reward those who understand the deeper patterns. Consistency and intentionality unlock hidden pathways.",
    }

    const category = (request.body as any)?.category || "guidance"
    const fallbackReply = fallbackResponses[category as keyof typeof fallbackResponses] || fallbackResponses.guidance

    return NextResponse.json({
      reply: fallbackReply,
      fallback: true,
    })
  }
}
