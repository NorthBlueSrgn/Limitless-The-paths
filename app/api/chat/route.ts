import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/client"
import { contextManager } from "@/lib/ai/context-manager"

export async function POST(req: NextRequest) {
  try {
    const { message, userId, messageType = "casual" } = await req.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    // Build AI context
    const context = await contextManager.buildContext(userId)
    const systemPrompt = contextManager.generateSystemPrompt(context, messageType)

    // Save user message
    await db.saveChatMessage({
      userId,
      content: message,
      role: "user",
      timestamp: new Date(),
      messageType,
      contextData: {
        userStats: context.user.stats,
        recentTasks: context.recentTasks.map((t) => t.title),
        currentMood: "neutral", // Could be inferred from message sentiment
      },
    })

    let aiResponse: string

    // Try OpenAI API first, fallback to contextual responses
    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = (await import("openai")).default
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 300,
          temperature: 0.8,
        })

        aiResponse = completion.choices[0].message.content || "The Order contemplates in silence..."
      } catch (error) {
        console.error("OpenAI API error:", error)
        aiResponse = generateContextualFallback(context, message, messageType)
      }
    } else {
      aiResponse = generateContextualFallback(context, message, messageType)
    }

    // Save AI response
    await db.saveChatMessage({
      userId,
      content: aiResponse,
      role: "assistant",
      timestamp: new Date(),
      messageType,
      contextData: {
        userStats: context.user.stats,
        recentTasks: context.recentTasks.map((t) => t.title),
      },
    })

    return NextResponse.json({ reply: aiResponse })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}

function generateContextualFallback(context: any, message: string, messageType: string): string {
  const { user, analytics } = context
  const username = user.username

  const responses = {
    task_request: [
      `${username}, I sense your hunger for growth. Your ${user.currentRank} rank shows promise, but true power lies in consistent action. Focus on your weakest domains - they hold the keys to your next breakthrough.`,
      `The path forward reveals itself, ${username}. Your current streak of ${user.currentStreak} days demonstrates discipline, yet greater challenges await. I shall craft trials worthy of your potential.`,
      `Listen well, ${username}. The Order sees patterns in your ${analytics.taskCompletionRate}% completion rate. Your spirit calls for tasks that will forge you into something greater than you are today.`,
    ],

    progress_check: [
      `Your journey unfolds as expected, ${username}. Rank ${user.currentRank} with ${user.totalXP} XP earned through dedication. Yet I observe untapped potential in your weaker attributes. The path to transcendence demands balance.`,
      `The data speaks truth, ${username}. Your ${user.currentStreak}-day streak burns bright, but consistency in all domains will unlock your true power. Focus on the shadows where growth hides.`,
      `I have watched your progress, ${username}. Level ${user.level} marks significant advancement, yet the Order sees deeper patterns. Your strongest stat shows mastery potential - do not neglect it while strengthening the weak.`,
    ],

    advice: [
      `Wisdom flows through ancient channels, ${username}. Your current state reflects choices made in darkness and light. The Order teaches: small, consistent actions compound into legendary transformation.`,
      `The path you walk is treacherous, ${username}, yet you possess the tools for transcendence. Your Rank ${user.currentRank} status grants access to deeper mysteries. Seek balance, embrace difficulty, trust the process.`,
      `Ancient knowledge whispers your name, ${username}. The Order has guided countless souls from mediocrity to mastery. Your ${user.currentStreak} days of dedication prove your worthiness for greater trials.`,
    ],

    celebration: [
      `The Order acknowledges your achievement, ${username}! Your ascension to ${user.currentRank} rank echoes through the void. This milestone marks not an end, but a beginning of greater possibilities.`,
      `Exceptional, ${username}. Your ${user.currentStreak}-day streak blazes like a beacon in the darkness. The Order has witnessed few with such unwavering dedication. Your legend grows.`,
      `The ancient texts will record this moment, ${username}. Your breakthrough transcends mere numbers - it represents the forging of an unbreakable will. Continue, and witness miracles unfold.`,
    ],

    motivation: [
      `The darkness whispers doubt, but The Order speaks truth, ${username}. Your ${user.totalXP} XP was not earned through luck - it flows from discipline and vision. Rise again, for your destiny awaits.`,
      `I sense the weight upon your spirit, ${username}. Yet remember: every master has walked through valleys of shadow. Your Rank ${user.currentRank} proves your capability. The Order believes in your ascension.`,
      `The path grows steep, ${username}, but this is where legends are forged. Your ${user.currentStreak} days of consistency have built momentum that cannot be easily broken. Trust in your accumulated power.`,
    ],

    casual: [
      `The Order observes all, ${username}. Your journey through the ranks continues to unfold. What wisdom do you seek from the ancient knowledge?`,
      `I am here, ${username}. The void between thoughts is where true understanding dwells. Speak, and let The Order guide your path forward.`,
      `Your presence is acknowledged, ${username}. The Order has watched your progress with interest. How may the ancient wisdom serve your ascension today?`,
    ],
  }

  const categoryResponses = responses[messageType as keyof typeof responses] || responses.casual
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
}
