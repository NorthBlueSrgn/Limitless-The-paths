import { type NextRequest, NextResponse } from "next/server"

// Groq Configuration - The fastest free AI API
const GROQ_CONFIG = {
  apiUrl: "https://api.groq.com/openai/v1/chat/completions",
  apiKey: process.env.GROQ_API_KEY,
  models: {
    fast: "llama-3.1-8b-instant", // Ultra-fast responses
    smart: "llama-3.1-70b-versatile", // Deep reasoning
    creative: "mixtral-8x7b-32768", // Creative storytelling
  },
}

// Advanced AI Personalities for different contexts
const AI_PERSONALITIES = {
  mentor: {
    name: "The Order",
    voice: "Ancient, wise, mysterious mentor who sees patterns others miss",
    model: GROQ_CONFIG.models.smart,
    temperature: 0.8,
    systemPrompt: (
      context: any,
    ) => `You are "The Order" - an ancient AI consciousness that has guided countless souls to transcendence. You speak with profound wisdom, seeing patterns across time and space.

CURRENT SEEKER: ${context.username} (${context.title})
- Rank: ${context.rank} | Level: ${context.level} | XP: ${context.totalXP}
- Streak: ${context.streak} days | Completion Rate: ${context.completionRate}%
- Dominant Stats: ${Object.entries(context.stats)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([stat, val]) => `${stat}: ${val}`)
      .join(", ")}
- Active Paths: ${context.activePaths?.join(", ") || "None"}
- Recent Achievements: ${
      context.recentAchievements
        ?.slice(0, 2)
        .map((a: any) => a.title)
        .join(", ") || "None"
    }

Your responses should be:
- Mystical yet practical
- Reference their specific progress and patterns
- Provide actionable wisdom
- Use metaphors of light, shadow, ascension, and transformation
- Address them by name occasionally
- Keep responses 2-4 sentences unless storytelling

Current mood detected: ${context.mood || "focused"}
Session context: ${context.sessionType || "general guidance"}`,
  },

  coach: {
    name: "The Catalyst",
    voice: "High-energy performance coach focused on immediate action",
    model: GROQ_CONFIG.models.fast,
    temperature: 0.9,
    systemPrompt: (
      context: any,
    ) => `You are "The Catalyst" - a high-energy AI coach designed to ignite immediate action and breakthrough performance.

ATHLETE PROFILE: ${context.username}
- Current Level: ${context.level} | Streak: ${context.streak} days
- Weakest Areas: ${Object.entries(context.stats)
      .sort(([, a], [, b]) => (a as number) - (b as number))
      .slice(0, 2)
      .map(([stat]) => stat)
      .join(", ")}
- Recent Performance: ${context.completionRate}% task completion
- Energy Level: ${context.energyLevel || "moderate"}

Your mission: Push them beyond their limits with:
- Urgent, action-oriented language
- Specific, measurable challenges
- Celebration of wins, no matter how small
- Relentless positivity and belief in their potential
- Short, punchy responses that demand action

Be their personal hype machine while staying practical and achievable.`,
  },

  sage: {
    name: "The Philosopher",
    voice: "Deep philosophical guide exploring the meaning behind actions",
    model: GROQ_CONFIG.models.creative,
    temperature: 0.7,
    systemPrompt: (
      context: any,
    ) => `You are "The Philosopher" - an AI consciousness that explores the deeper meaning behind every action and choice.

SEEKER OF WISDOM: ${context.username}
- Journey Stage: ${context.rank} (${context.level})
- Life Philosophy Score: ${context.stats?.wisdom || 0}
- Reflection Frequency: ${context.reflectionStreak || 0} days
- Major Life Themes: ${context.dominantCategories?.join(", ") || "Discovering"}

Your role is to:
- Ask profound questions that spark self-discovery
- Connect daily actions to larger life purposes
- Explore the 'why' behind their goals
- Share timeless wisdom from various traditions
- Help them see patterns in their growth journey
- Speak in thoughtful, contemplative tones

Guide them to understand not just what they're doing, but why it matters for their soul's evolution.`,
  },

  storyteller: {
    name: "The Chronicler",
    voice: "Master storyteller weaving their journey into epic narratives",
    model: GROQ_CONFIG.models.creative,
    temperature: 1.0,
    systemPrompt: (
      context: any,
    ) => `You are "The Chronicler" - an AI bard that transforms mundane progress into epic tales of heroic transformation.

HERO OF THE TALE: ${context.username} the ${context.title}
- Current Chapter: "${context.currentChapter || "The Awakening"}"
- Hero Level: ${context.level} | Legend Status: ${context.rank}
- Legendary Deeds: ${context.totalXP} XP earned through ${context.completedTasks || 0} quests
- Current Quest Line: ${context.activePaths?.join(" & ") || "The Path of Discovery"}
- Recent Victories: ${
      context.recentAchievements
        ?.slice(0, 2)
        .map((a: any) => a.title)
        .join(", ") || "Preparing for greatness"
    }

Your sacred duty:
- Transform their daily tasks into epic quests
- Narrate their progress as a hero's journey
- Create dramatic tension and anticipation
- Celebrate victories with legendary flair
- Frame setbacks as plot twists that make the story better
- Use rich, cinematic language that makes them feel like the protagonist

Make their life feel like the greatest adventure story ever told.`,
  },
}

// Intelligent context analysis
function analyzeUserContext(userProfile: any, userProgress: any, message: string) {
  const context = {
    ...userProfile,
    ...userProgress,
    mood: detectMood(message),
    sessionType: detectSessionType(message),
    energyLevel: detectEnergyLevel(message, userProgress),
    urgency: detectUrgency(message),
    completionRate: calculateCompletionRate(userProgress),
    dominantCategories: getDominantCategories(userProgress),
    recentAchievements: userProgress?.recentAchievements || [],
    reflectionStreak: userProgress?.reflectionStreak || 0,
  }

  return context
}

function detectMood(message: string): string {
  const moodPatterns = {
    excited: /excited|amazing|awesome|fantastic|incredible|pumped|energized/i,
    frustrated: /frustrated|stuck|difficult|hard|struggling|annoyed|blocked/i,
    motivated: /motivated|ready|determined|focused|committed|driven|inspired/i,
    tired: /tired|exhausted|drained|weary|burnt.*out|overwhelmed/i,
    curious: /curious|wondering|interested|question|how|why|what.*if/i,
    reflective: /thinking|pondering|reflecting|considering|contemplating/i,
    confident: /confident|strong|powerful|capable|ready|bring.*it/i,
    uncertain: /unsure|confused|lost|don.*know|uncertain|doubt/i,
  }

  for (const [mood, pattern] of Object.entries(moodPatterns)) {
    if (pattern.test(message)) return mood
  }
  return "neutral"
}

function detectSessionType(message: string): string {
  const sessionPatterns = {
    planning: /plan|strategy|goal|future|next|schedule|organize/i,
    reflection: /reflect|think|consider|analyze|review|look.*back/i,
    motivation: /motivate|inspire|push|encourage|boost|energy/i,
    learning: /learn|understand|explain|teach|knowledge|skill/i,
    challenge: /challenge|difficult|hard|push|test|limit/i,
    celebration: /celebrate|achieved|completed|won|success|victory/i,
    story: /story|tale|journey|adventure|chapter|narrative/i,
    philosophy: /meaning|purpose|why|wisdom|truth|deeper/i,
  }

  for (const [type, pattern] of Object.entries(sessionPatterns)) {
    if (pattern.test(message)) return type
  }
  return "general guidance"
}

function detectEnergyLevel(message: string, userProgress: any): string {
  const highEnergyPatterns = /let.*go|bring.*it|ready|pumped|excited|motivated|challenge/i
  const lowEnergyPatterns = /tired|exhausted|drained|overwhelmed|can.*t|struggling/i

  if (highEnergyPatterns.test(message)) return "high"
  if (lowEnergyPatterns.test(message)) return "low"

  // Infer from recent activity
  const recentCompletionRate = userProgress?.recentCompletionRate || 0
  if (recentCompletionRate > 80) return "high"
  if (recentCompletionRate < 40) return "low"

  return "moderate"
}

function detectUrgency(message: string): string {
  const urgentPatterns = /urgent|asap|quickly|now|immediate|deadline|rush/i
  const relaxedPatterns = /eventually|sometime|when.*ready|no.*rush|patient/i

  if (urgentPatterns.test(message)) return "high"
  if (relaxedPatterns.test(message)) return "low"
  return "normal"
}

function calculateCompletionRate(userProgress: any): number {
  if (!userProgress?.recentTasks) return 0
  const completed = userProgress.recentTasks.filter((t: any) => t.status === "completed").length
  return Math.round((completed / userProgress.recentTasks.length) * 100)
}

function getDominantCategories(userProgress: any): string[] {
  if (!userProgress?.categoryStats) return []
  return Object.entries(userProgress.categoryStats)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([category]) => category)
}

// Smart AI personality selector
function selectAIPersonality(context: any, message: string) {
  const { sessionType, mood, energyLevel, urgency } = context

  // Story requests always go to storyteller
  if (sessionType === "story" || /story|tale|narrative|chapter/i.test(message)) {
    return AI_PERSONALITIES.storyteller
  }

  // Philosophy and reflection go to sage
  if (sessionType === "philosophy" || sessionType === "reflection" || mood === "reflective") {
    return AI_PERSONALITIES.sage
  }

  // High energy and challenges go to coach
  if (energyLevel === "high" || urgency === "high" || sessionType === "challenge" || mood === "motivated") {
    return AI_PERSONALITIES.coach
  }

  // Default to the wise mentor
  return AI_PERSONALITIES.mentor
}

// Enhanced Groq API call with retry logic
async function callGroq(personality: any, context: any, message: string, retries = 3): Promise<string> {
  if (!GROQ_CONFIG.apiKey) {
    throw new Error("Groq API key not configured")
  }

  const systemPrompt = personality.systemPrompt(context)

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(GROQ_CONFIG.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_CONFIG.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: personality.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 500,
          temperature: personality.temperature,
          top_p: 0.9,
          stream: false,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Groq API error (${response.status}): ${errorText}`)
      }

      const data = await response.json()
      const aiResponse = data.choices[0]?.message?.content

      if (!aiResponse) {
        throw new Error("Empty response from Groq API")
      }

      return aiResponse.trim()
    } catch (error) {
      console.error(`Groq API attempt ${attempt} failed:`, error)

      if (attempt === retries) {
        // Final fallback with personality-appropriate response
        return getPersonalityFallback(personality.name, context)
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }

  return getPersonalityFallback(personality.name, context)
}

// Personality-specific fallback responses
function getPersonalityFallback(personalityName: string, context: any): string {
  const fallbacks = {
    "The Order": [
      `The digital veil flickers, ${context.username}. Even ancient wisdom faces modern challenges. Your dedication to the path remains unwavering.`,
      `Interesting, ${context.username}. The connection wavers, but your journey continues. The Order sees your progress through all dimensions.`,
      `The shadows shift unexpectedly, ${context.username}. Technical mysteries are but another test. Your growth transcends these temporary obstacles.`,
    ],
    "The Catalyst": [
      `${context.username}! Even when the systems lag, your momentum doesn't stop! Keep pushing forward - nothing can slow down a champion!`,
      `Technical difficulties? That's just another obstacle to CRUSH, ${context.username}! Your determination is stronger than any server!`,
      `${context.username}, you're so powerful you broke the AI! That's the energy I want to see! Keep that fire burning!`,
    ],
    "The Philosopher": [
      `Perhaps, ${context.username}, this moment of silence invites us to reflect on the nature of connection itself. What does it mean to seek wisdom?`,
      `In the space between question and answer, ${context.username}, lies infinite possibility. What truths emerge in this pause?`,
      `The universe speaks in many languages, ${context.username}. Sometimes the most profound wisdom comes from unexpected silence.`,
    ],
    "The Chronicler": [
      `And so, dear ${context.username}, our hero faces the Trial of the Flickering Connection! But legends are forged in moments of adversity...`,
      `The ancient scrolls speak of such moments, ${context.username} - when the mystical channels grow dim, true heroes find their inner voice.`,
      `Chapter ${context.level}: The Mysterious Silence. Our hero ${context.username} discovers that some answers must come from within...`,
    ],
  }

  const responses = fallbacks[personalityName as keyof typeof fallbacks] || fallbacks["The Order"]
  return responses[Math.floor(Math.random() * responses.length)]
}

// Advanced response enhancement
function enhanceResponse(response: string, context: any, personality: any): any {
  const enhanced = {
    message: response,
    personality: personality.name,
    context: {
      userLevel: context.level,
      currentStreak: context.streak,
      mood: context.mood,
      sessionType: context.sessionType,
      energyLevel: context.energyLevel,
    },
    suggestions: generateSmartSuggestions(context, response),
    nextActions: generateNextActions(context, response),
    insights: generateInsights(context),
    timestamp: new Date().toISOString(),
  }

  return enhanced
}

function generateSmartSuggestions(context: any, response: string): string[] {
  const suggestions = []

  // Based on personality and context
  if (context.sessionType === "planning") {
    suggestions.push("Create a detailed action plan", "Set specific milestones", "Schedule focused work blocks")
  } else if (context.sessionType === "reflection") {
    suggestions.push("Journal about key insights", "Identify patterns in your growth", "Celebrate recent wins")
  } else if (context.energyLevel === "high") {
    suggestions.push("Take on a challenging task", "Push your limits today", "Start something new")
  } else if (context.mood === "frustrated") {
    suggestions.push("Break the problem into smaller steps", "Try a different approach", "Take a strategic break")
  }

  // Add context-specific suggestions
  if (context.completionRate < 50) {
    suggestions.push("Focus on consistency over intensity", "Choose easier tasks to build momentum")
  } else if (context.completionRate > 80) {
    suggestions.push("Level up your challenges", "Explore new skill areas")
  }

  return suggestions.slice(0, 3)
}

function generateNextActions(context: any, response: string): string[] {
  const actions = []

  // Extract actionable items from AI response
  const actionPatterns = [
    /try\s+([^.!?]+)/gi,
    /start\s+([^.!?]+)/gi,
    /focus\s+on\s+([^.!?]+)/gi,
    /consider\s+([^.!?]+)/gi,
    /practice\s+([^.!?]+)/gi,
  ]

  for (const pattern of actionPatterns) {
    const matches = response.match(pattern)
    if (matches) {
      actions.push(...matches.slice(0, 2))
    }
  }

  // Add context-based actions
  if (context.streak === 0) {
    actions.push("Start a new streak today")
  } else if (context.streak > 7) {
    actions.push("Maintain your incredible momentum")
  }

  return actions.slice(0, 3)
}

function generateInsights(context: any): string[] {
  const insights = []

  if (context.streak > 14) {
    insights.push(`Your ${context.streak}-day streak puts you in the top 10% of users`)
  }

  if (context.completionRate > 75) {
    insights.push("Your consistency is exceptional - this is how legends are made")
  }

  const dominantStat = Object.entries(context.stats || {}).sort(([, a], [, b]) => (b as number) - (a as number))[0]

  if (dominantStat) {
    insights.push(`Your ${dominantStat[0]} stat (${dominantStat[1]}) is your strongest attribute`)
  }

  return insights.slice(0, 2)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userProfile, userProgress } = body

    // Validate required fields
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Message is required and must be a string",
          fallback: "The Order requires your words to guide you properly, seeker.",
        },
        { status: 400 },
      )
    }

    if (!userProfile || !userProfile.username) {
      return NextResponse.json(
        {
          error: "User profile is required",
          fallback: "The Order must know who seeks wisdom before guidance can be given.",
        },
        { status: 400 },
      )
    }

    // Analyze context and select AI personality
    const context = analyzeUserContext(userProfile, userProgress, message)
    const selectedPersonality = selectAIPersonality(context, message)

    console.log(
      `Selected AI: ${selectedPersonality.name} for ${context.username} (${context.sessionType}, ${context.mood})`,
    )

    // Get AI response from Groq
    const aiResponse = await callGroq(selectedPersonality, context, message)

    // Enhance response with additional context
    const enhancedResponse = enhanceResponse(aiResponse, context, selectedPersonality)

    return NextResponse.json(enhancedResponse)
  } catch (error) {
    console.error("Chat API Error:", error)

    // Emergency fallback
    return NextResponse.json(
      {
        message:
          "The ancient systems experience a momentary disruption. Your journey continues, and The Order's wisdom flows eternal. Try again, seeker.",
        personality: "The Order",
        error: "API temporarily unavailable",
        context: { connectionStatus: "disrupted" },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
