import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { message, category, userProfile, userProgress } = await req.json()

    // Validate required fields
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, using fallback responses")
      const fallbackResponse = generateFallbackResponse(message, category, userProfile)
      return NextResponse.json({ reply: fallbackResponse })
    }

    // Dynamic import of OpenAI to handle potential missing dependency
    let openai
    try {
      const OpenAI = (await import("openai")).default
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    } catch (importError) {
      console.warn("OpenAI package not available, using fallback responses")
      const fallbackResponse = generateFallbackResponse(message, category, userProfile)
      return NextResponse.json({ reply: fallbackResponse })
    }

    // Create a dynamic system prompt based on the category and user data
    const systemPrompt = createSystemPrompt(category, userProfile, userProgress)

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 500,
      temperature: 0.8,
    })

    const reply = response.choices[0].message.content

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("API error:", error)

    // Provide fallback response on any error
    const { message, category, userProfile } = await req.json().catch(() => ({}))
    const fallbackResponse = generateFallbackResponse(message || "Hello", category, userProfile)

    return NextResponse.json({ reply: fallbackResponse })
  }
}

function createSystemPrompt(category, userProfile, userProgress) {
  const basePrompt = `You are "The Order" - a mysterious, ancient AI mentor in a gamification system called "Limitless: Chapter Black". You guide users on their path to transcendence and self-mastery. Your tone is wise, mysterious, and slightly intimidating, like a mentor from a dark anime.

User Profile:
- Username: ${userProfile?.username || "Hunter"}
- Rank: ${userProfile?.rank || "E"}
- Level: ${userProfile?.level || 1}
- Streak: ${userProfile?.streak || 0} days
- Title: ${userProfile?.title || "Novice Hunter"}

Current Progress:
- Active Paths: ${userProgress?.activePaths?.join(", ") || "None"}
- Completed Tasks Today: ${userProgress?.completedTasks || 0}
- Current XP: ${userProfile?.currentXP || 0}

Respond in character as The Order. Keep responses under 150 words. Use metaphors related to darkness, ascension, power, and transformation.`

  const categoryPrompts = {
    guidance: `${basePrompt}

CATEGORY: GUIDANCE
Provide strategic advice and direction. Focus on actionable steps, habit formation, and path optimization. Reference their current rank and suggest concrete next steps for growth.`,

    story: `${basePrompt}

CATEGORY: STORY
Weave their current progress into a narrative. Create immersive storytelling that makes their journey feel epic and meaningful. Reference their paths and recent achievements as plot points.`,

    analysis: `${basePrompt}

CATEGORY: ANALYSIS
Analyze their patterns, strengths, and areas for improvement. Be insightful about their progress, streak, and path choices. Provide data-driven observations with mystical undertones.`,

    challenge: `${basePrompt}

CATEGORY: CHALLENGE
Issue specific, achievable challenges that push their limits. Base challenges on their current level and active paths. Make it feel like a trial or test from a mentor.`,

    philosophy: `${basePrompt}

CATEGORY: PHILOSOPHY
Share deep wisdom about growth, mastery, and transformation. Connect universal principles to their personal journey. Be profound and thought-provoking.`,

    lore: `${basePrompt}

CATEGORY: LORE
Reveal hidden knowledge, ancient wisdom, or system secrets. Make them feel like they're uncovering mysteries. Reference legendary figures or forbidden techniques.`,
  }

  return categoryPrompts[category] || categoryPrompts.guidance
}

function generateFallbackResponse(message, category, userProfile) {
  const username = userProfile?.username || "Hunter"
  const rank = userProfile?.rank || "E"
  const level = userProfile?.level || 1
  const streak = userProfile?.streak || 0

  const responses = {
    guidance: [
      `Listen well, ${username}. Your path as a Rank ${rank} Hunter requires discipline above all else. Focus on consistency—complete your daily tasks without fail. The small victories compound into legendary power.`,
      `${username}, I observe your current trajectory. At Level ${level}, you stand at a crossroads. Choose the path of deliberate practice. Master one skill completely before pursuing another.`,
      `The Order sees potential in you, ${username}. Your ${streak}-day streak shows promise, but true transformation requires pushing beyond comfort. Embrace the resistance—it is where growth lives.`,
    ],
    story: [
      `In the chronicles of transformation, ${username} the ${rank}-rank Hunter stands at a pivotal moment. The shadows whisper of your ${streak} days of dedication, each one a step closer to transcendence. Your story is being written in the language of discipline.`,
      `The ancient texts speak of hunters like you, ${username}. Level ${level} marks the beginning of true understanding. The Order has watched countless souls at this threshold—some ascend, others fall. Which will you choose?`,
      `Your legend grows, ${username}. Each completed task adds another verse to your epic. The darkness recognizes your ${streak}-day commitment. Continue, and witness how your dedication shapes reality itself.`,
    ],
    analysis: [
      `I analyze your patterns, ${username}. Rank ${rank} with ${streak} days of consistency shows promise, yet I detect areas for optimization. Your Level ${level} progression suggests untapped potential. Focus on your weakest attribute—it holds the key to breakthrough.`,
      `The data reveals truth, ${username}. Your current trajectory at Level ${level} indicates steady growth, but greatness requires exponential leaps. I recommend intensifying your practice in your strongest domain while maintaining balance.`,
      `Fascinating, ${username}. Your ${streak}-day streak demonstrates discipline, yet your Rank ${rank} suggests room for acceleration. The Order calculates that doubling your daily effort would yield 4x results within 30 days.`,
    ],
    challenge: [
      `${username}, I issue this trial: Complete every daily task for the next 7 days without exception. Prove to yourself and The Order that you possess the iron will of a true Hunter. Failure is not an option.`,
      `A challenge worthy of your Rank ${rank}, ${username}: Push beyond your current limits. Attempt a task one difficulty level above your comfort zone. Growth lives in the space between safety and impossibility.`,
      `The Order presents this test, ${username}: Maintain perfect consistency for ${Math.max(streak + 7, 14)} days. Your current ${streak}-day streak is merely preparation for this greater trial. Will you accept?`,
    ],
    philosophy: [
      `Remember this truth, ${username}: You are not merely completing tasks—you are forging a soul. Every choice is a chisel strike in the sculpture of your becoming. The Order teaches that transformation is an inside-out process.`,
      `Contemplate this wisdom, ${username}: The gap between who you are and who you could become is filled with daily disciplines. Your Level ${level} is not your limit—it is your current expression of commitment.`,
      `The ancient masters understood, ${username}: Excellence is not an act but a habit. Your ${streak} days of practice have begun to rewire your very essence. Continue, and witness the alchemy of consistent action.`,
    ],
    lore: [
      `The forbidden texts speak of hunters who transcended Rank ${rank}, ${username}. They discovered the secret: that limitation exists only in the mind. The Order guards this knowledge—true power comes from the marriage of discipline and vision.`,
      `Ancient wisdom reveals, ${username}: The legendary hunters of old maintained streaks not of days, but of years. Your ${streak} days are but the first steps on an infinite path. The Order has seen mortals become myths through unwavering dedication.`,
      `Hidden knowledge, ${username}: The system responds to those who push beyond prescribed limits. At Level ${level}, you can access techniques reserved for higher ranks through sheer force of will. The Order whispers: consistency unlocks all doors.`,
    ],
  }

  const categoryResponses = responses[category] || responses.guidance
  const randomIndex = Math.floor(Math.random() * categoryResponses.length)
  return categoryResponses[randomIndex]
}
