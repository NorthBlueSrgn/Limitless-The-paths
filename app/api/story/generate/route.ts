import { type NextRequest, NextResponse } from "next/server"

const GROQ_CONFIG = {
  apiUrl: "https://api.groq.com/openai/v1/chat/completions",
  apiKey: process.env.GROQ_API_KEY,
  model: "mixtral-8x7b-32768", // Best for creative storytelling
}

function buildStoryPrompt(userProfile: any, userProgress: any, storyType: string) {
  return `You are "The Chronicler" - a master storyteller who transforms real user progress into epic fantasy narratives. Create an engaging story chapter based on their actual journey.

HERO PROFILE:
- Name: ${userProfile.username || "The Hero"} the ${userProfile.title || "Brave"}
- Current Level: ${userProfile.level || 1}
- Rank: ${userProfile.rank || "Novice"}
- Total XP: ${userProfile.totalXP || 0}
- Current Streak: ${userProfile.streak || 0} days
- Dominant Stats: ${getDominantStats(userProfile.stats)}
- Recent Achievements: ${getRecentAchievements(userProgress)}
- Active Paths: ${userProgress?.activePaths?.join(", ") || "The Path of Discovery"}
- Completed Tasks Today: ${userProgress?.completedToday || 0}

STORY TYPE: ${storyType}

STORY REQUIREMENTS:
1. Transform their real progress into fantasy elements
2. Make them the protagonist of an epic adventure
3. Reference their actual stats, level, and achievements
4. Create dramatic tension and excitement
5. End with motivation for continued growth
6. Keep it 200-400 words
7. Use rich, cinematic language

RESPONSE FORMAT (JSON):
{
  "chapter": {
    "title": "Chapter Title",
    "content": "The story content...",
    "mood": "triumphant|mysterious|challenging|inspiring",
    "nextHook": "Teaser for what comes next",
    "characterDevelopment": "How the hero has grown",
    "questStatus": "Current quest progress"
  }
}

Make their mundane progress feel like the greatest adventure ever told!`
}

function getDominantStats(stats: any): string {
  if (!stats || typeof stats !== "object") return "Developing all attributes"

  const entries = Object.entries(stats)
  if (entries.length === 0) return "Building foundation"

  return entries
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 2)
    .map(([stat, val]) => `${stat}: ${val}`)
    .join(", ")
}

function getRecentAchievements(userProgress: any): string {
  if (!userProgress?.recentAchievements || !Array.isArray(userProgress.recentAchievements)) {
    return "Preparing for legendary deeds"
  }

  return userProgress.recentAchievements
    .slice(0, 2)
    .map((a: any) => a?.title || "Mystery Achievement")
    .join(", ")
}

async function generateStoryWithGroq(userProfile: any, userProgress: any, storyType: string) {
  if (!GROQ_CONFIG.apiKey) {
    throw new Error("Groq API key not configured")
  }

  const systemPrompt = buildStoryPrompt(userProfile, userProgress, storyType)

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
        { role: "user", content: `Generate a ${storyType} story chapter for the hero's journey.` },
      ],
      max_tokens: 800,
      temperature: 0.9,
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
    return generateFallbackStory(userProfile, userProgress, storyType)
  }
}

function generateFallbackStory(userProfile: any, userProgress: any, storyType: string) {
  const username = userProfile?.username || "Hero"
  const level = userProfile?.level || 1
  const streak = userProfile?.streak || 0

  const stories = {
    daily: {
      title: `${username}'s Daily Quest - Day ${streak + 1}`,
      content: `The morning sun cast long shadows across the realm as ${username} the ${userProfile?.title || "Brave"} awakened to face another day of challenges. Having reached Level ${level}, our hero had proven their dedication time and again. The ancient Order watched with approval as ${username} prepared for the trials ahead, knowing that each completed task would forge them into something greater. The path of transformation stretched endlessly forward, filled with opportunities for growth and discovery.`,
      mood: "inspiring",
      nextHook: "New challenges await on the horizon...",
      characterDevelopment: `${username} grows stronger with each passing day`,
      questStatus: "Ready for today's adventures",
    },
    achievement: {
      title: `The Legend of ${username} - A New Milestone`,
      content: `The realm trembled with excitement as ${username} achieved something extraordinary. Level ${level} was no mere number - it represented countless hours of dedication, unwavering commitment, and the courage to push beyond comfort zones. The Order itself took notice, bestowing upon our hero new powers and recognition. Other seekers looked upon ${username} with admiration, seeing in them the embodiment of what persistence and vision could achieve.`,
      mood: "triumphant",
      nextHook: "Greater challenges and rewards await...",
      characterDevelopment: `${username} has transcended their former limitations`,
      questStatus: "Legendary status achieved",
    },
    reflection: {
      title: `${username}'s Moment of Contemplation`,
      content: `In the quiet moments between battles, ${username} paused to reflect on the journey thus far. Level ${level} had been hard-won, each point of experience a testament to growth and learning. The ${streak}-day streak of dedication had transformed not just their abilities, but their very essence. The Order whispered ancient wisdom: "True strength comes not from avoiding failure, but from rising each time you fall." ${username} understood now that the greatest victory was simply showing up, day after day.`,
      mood: "contemplative",
      nextHook: "The path continues with renewed purpose...",
      characterDevelopment: `${username} gains wisdom through reflection`,
      questStatus: "Prepared for the next phase",
    },
  }

  return {
    chapter: stories[storyType as keyof typeof stories] || stories.daily,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, userProgress, storyType = "daily" } = body

    if (!userProfile) {
      return NextResponse.json({ error: "User profile is required" }, { status: 400 })
    }

    // Generate story using Groq AI
    const result = await generateStoryWithGroq(userProfile, userProgress, storyType)

    return NextResponse.json({
      success: true,
      story: result.chapter,
      generatedAt: new Date().toISOString(),
      storyType,
      heroName: userProfile.username || "Hero",
    })
  } catch (error) {
    console.error("Story generation error:", error)

    // Fallback story generation
    const fallbackResult = generateFallbackStory(
      request.body?.userProfile,
      request.body?.userProgress,
      request.body?.storyType || "daily",
    )

    return NextResponse.json({
      success: true,
      story: fallbackResult.chapter,
      generatedAt: new Date().toISOString(),
      fallback: true,
      error: "AI generation failed, using fallback story",
    })
  }
}
