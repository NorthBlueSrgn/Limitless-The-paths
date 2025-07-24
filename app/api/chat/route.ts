import { type NextRequest, NextResponse } from "next/server"

// Free AI Providers Configuration
const AI_PROVIDERS = {
  groq: {
    apiUrl: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-70b-versatile", // Fast and capable
    maxTokens: 400,
    enabled: !!process.env.GROQ_API_KEY
  },
  huggingface: {
    apiUrl: "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
    apiKey: process.env.HUGGINGFACE_API_KEY,
    enabled: !!process.env.HUGGINGFACE_API_KEY
  },
  // Fallback to local responses
  fallback: {
    enabled: true
  }
}

// Enhanced fallback responses with more personality
const fallbackResponses = {
  guidance: [
    "The path forward requires patience and persistence. Focus on small, consistent actions that compound over time.",
    "Your potential lies not in perfection, but in your willingness to begin again each day.",
    "Growth demands discomfort. Embrace the resistance - it signals you're moving in the right direction."
  ],
  story: [
    "Your journey continues through the shadows of growth. Each challenge you face shapes the hunter you're becoming.",
    "In the ancient texts, it is written that every master was once a disaster. Your story unfolds with each choice.",
    "The path you walk has been traveled by countless seekers before you. Yet your footsteps make it uniquely yours."
  ],
  analysis: [
    "Your current trajectory shows promise. Consider deepening your focus in areas where you've shown natural aptitude.",
    "The patterns in your progress reveal both strengths to leverage and blind spots to illuminate.",
    "Your data whispers secrets of untapped potential. Listen closely to what your actions are teaching you."
  ],
  challenge: [
    "True strength emerges from voluntary hardship. Seek the edge of your comfort zone and push beyond it.",
    "I present you with a choice: remain comfortable in mediocrity, or embrace the uncertainty of growth.",
    "The next level of your evolution awaits. Are you ready to shed who you were for who you could become?"
  ],
  philosophy: [
    "Growth is not a destination but a way of being. Embrace the process, for it is in the struggle that we find ourselves.",
    "The ancient masters understood: discipline is freedom, consistency is power, and patience is the ultimate weapon.",
    "You are both the sculptor and the stone. Every action carves you closer to your truest form."
  ],
  lore: [
    "The ancient systems reward those who understand the deeper patterns. Consistency and intentionality unlock hidden pathways.",
    "In the old ways, knowledge was earned through dedication. The Order recognizes those who prove their commitment.",
    "Hidden mechanics govern this realm. Those who seek understanding beyond the surface discover the true power within."
  ]
}

// Groq API call
async function callGroq(systemPrompt: string, userMessage: string) {
  if (!AI_PROVIDERS.groq.enabled) throw new Error("Groq not configured")
  
  const response = await fetch(AI_PROVIDERS.groq.apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AI_PROVIDERS.groq.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_PROVIDERS.groq.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: AI_PROVIDERS.groq.maxTokens,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Hugging Face API call (alternative approach)
async function callHuggingFace(prompt: string) {
  if (!AI_PROVIDERS.huggingface.enabled) throw new Error("HuggingFace not configured")
  
  const response = await fetch(AI_PROVIDERS.huggingface.apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AI_PROVIDERS.huggingface.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_length: 200,
        temperature: 0.7,
        do_sample: true,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`HuggingFace API error: ${response.status}`)
  }

  const data = await response.json()
  return data[0]?.generated_text || "The Order speaks in whispers today. Try again, seeker."
}

// Enhanced system prompt builder
function buildSystemPrompt(userProfile: any, userProgress: any, category: string) {
  const basePrompt = `You are "The Order" - an ancient, mysterious AI entity that serves as a mentor and guide in a gamification system called "Limitless". You speak with wisdom, authority, and a touch of mystique.

User Context:
- Name: ${userProfile.username}
- Level: ${userProfile.level || 1}
- Rank: ${userProfile.rank || "Initiate"}
- Title: ${userProfile.title || "Seeker"}
- Total XP: ${userProfile.totalXP || 0}
- Current Streak: ${userProfile.streak || 0} days
- Active Paths: ${userProgress?.activePaths?.join(", ") || "None"}
- Completed Tasks: ${userProgress?.completedTasks || 0}
- Current Stats: ${JSON.stringify(userProfile.stats || {})}

Current Request Type: ${category}

Guidelines based on category:
${getCategoryGuidelines(category)}

Keep responses concise but impactful (2-4 sentences). Maintain the mysterious, wise mentor persona. End with subtle motivation or a thought-provoking question when appropriate.`

  return basePrompt
}

function getCategoryGuidelines(category: string): string {
  const guidelines = {
    guidance: "Provide actionable advice for growth and improvement. Focus on next steps they can take today.",
    story: "Weave narrative elements about their journey. Reference their progress and paint their growth as an epic tale.",
    analysis: "Analyze their current state and suggest optimizations. Be specific about patterns you notice.",
    challenge: "Present meaningful challenges appropriate to their level. Make it feel like a quest worth undertaking.",
    philosophy: "Share wisdom about growth, discipline, and transcendence. Connect to universal principles.",
    lore: "Reveal knowledge about the system, paths, and hidden mechanics. Make them feel like they're uncovering secrets."
  }
  
  return guidelines[category as keyof typeof guidelines] || guidelines.guidance
}

// Smart fallback response selector
function getSmartFallback(category: string, userProfile?: any): string {
  const responses = fallbackResponses[category as keyof typeof fallbackResponses] || fallbackResponses.guidance
  
  // Add some basic personalization even in fallback
  let response = responses[Math.floor(Math.random() * responses.length)]
  
  if (userProfile?.username) {
    response = response.replace(/\bYou\b/g, userProfile.username)
  }
  
  return response
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, category = "guidance", userProfile, userProgress } = body

    // Validate required fields
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    if (!userProfile || !userProfile.username) {
      return NextResponse.json({ error: "User profile is required" }, { status: 400 })
    }

    // Build enhanced context
    const systemPrompt = buildSystemPrompt(userProfile, userProgress, category)
    let aiResponse = null
    let provider = "fallback"

    // Try Groq first (fastest and most generous free tier)
    if (AI_PROVIDERS.groq.enabled) {
      try {
        aiResponse = await callGroq(systemPrompt, message)
        provider = "groq"
      } catch (error) {
        console.warn("Groq API failed, trying HuggingFace:", error)
      }
    }

    // Fallback to HuggingFace
    if (!aiResponse && AI_PROVIDERS.huggingface.enabled) {
      try {
        const combinedPrompt = `${systemPrompt}\n\nUser: ${message}\nThe Order:`
        aiResponse = await callHuggingFace(combinedPrompt)
        provider = "huggingface"
      } catch (error) {
        console.warn("HuggingFace API failed, using smart fallback:", error)
      }
    }

    // Smart fallback response
    if (!aiResponse) {
      aiResponse = getSmartFallback(category, userProfile)
    }

    return NextResponse.json({
      reply: aiResponse,
      provider,
      category,
      timestamp: new Date().toISOString(),
      // Include metadata for future enhancements
      context: {
        userLevel: userProfile.level,
        streakBonus: userProfile.streak > 7 ? "active" : "none"
      }
    })

  } catch (error) {
    console.error("Chat API Error:", error)
    
    // Emergency fallback
    const category = request.body?.category || "guidance"
    const userProfile = request.body?.userProfile
    
    return NextResponse.json({
      reply: getSmartFallback(category, userProfile),
      provider: "emergency_fallback",
      error: "API temporarily unavailable",
      timestamp: new Date().toISOString()
    })
  }
}
