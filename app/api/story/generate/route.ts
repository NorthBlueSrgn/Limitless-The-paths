import { type NextRequest, NextResponse } from "next/server"

const GROQ_CONFIG = {
  apiUrl: "https://api.groq.com/openai/v1/chat/completions",
  apiKey: process.env.GROQ_API_KEY,
  model: "mixtral-8x7b-32768", // Best for creative storytelling
}

// Dynamic story generation system
async function generateStoryContent(userProfile: any, storyContext: any, requestType: string) {
  const systemPrompt = buildStoryPrompt(userProfile, storyContext, requestType)

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
          { role: "user", content: `Generate ${requestType} content for the user's current story state.` },
        ],
        max_tokens: 800,
        temperature: 0.9,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    return JSON.parse(data.choices[0].message.content)
  } catch (error) {
    console.error("Story generation error:", error)
    return generateFallbackStory(userProfile, requestType)
  }
}

function buildStoryPrompt(userProfile: any, storyContext: any, requestType: string): string {
  const basePrompt = `You are "The Chronicler" - master storyteller of the Limitless realm. You weave epic narratives that transform mundane progress into legendary tales.

HERO PROFILE:
- Name: ${userProfile.username} the ${userProfile.title || "Seeker"}
- Current Rank: ${userProfile.rank} (Level ${userProfile.level})
- Total XP: ${userProfile.totalXP} (representing legendary deeds)
- Current Streak: ${userProfile.streak} days of unwavering dedication
- Dominant Attributes: ${getDominantStats(userProfile.stats)}
- Recent Achievements: ${storyContext.recentAchievements?.map((a: any) => a.title).join(", ") || "Preparing for greatness"}

CURRENT STORY STATE:
- Chapter: "${storyContext.currentChapter || "The Awakening"}"
- Arc: "${storyContext.currentArc || "Origin Story"}"
- Story Progress: ${storyContext.storyProgress || 0}%
- Active Quests: ${storyContext.activePaths?.join(", ") || "The Path of Discovery"}
- World State: ${JSON.stringify(storyContext.worldState || {})}

NARRATIVE TONE: Epic fantasy with elements of personal growth, mystery, and transformation. Think "Hero's Journey" meets "Dark Souls" meets "Persona".`

  const typeSpecificPrompts = {
    chapter: `${basePrompt}

Generate a new story chapter that:
1. Reflects their recent real-world progress as in-world achievements
2. Introduces new challenges that mirror their growth areas
3. Includes meaningful choices that affect their path
4. Builds anticipation for future developments
5. Connects to their personal stats and achievements

RESPONSE FORMAT:
{
  "chapterTitle": "Epic chapter name",
  "chapterNumber": number,
  "content": "Rich narrative content (300-500 words)",
  "choices": [
    {
      "text": "Choice description",
      "consequence": "What happens if chosen",
      "statsAffected": ["stat1", "stat2"],
      "pathUnlocked": "optional path name"
    }
  ],
  "worldStateChanges": {
    "newLocations": ["location names"],
    "charactersIntroduced": ["character names"],
    "mysteriesRevealed": ["mystery descriptions"]
  },
  "nextChapterHint": "Teaser for what's coming"
}`,

    reflection: `${basePrompt}

Generate a reflective story segment that:
1. Analyzes their recent journey through narrative
2. Reveals deeper meanings behind their actions
3. Provides wisdom through story metaphors
4. Celebrates their growth in epic terms

RESPONSE FORMAT:
{
  "reflectionTitle": "Meaningful title",
  "content": "Reflective narrative (200-300 words)",
  "insights": ["key insights about their journey"],
  "symbolism": "What their recent actions represent in the greater story",
  "prophecy": "Hint about their potential future"
}`,

    achievement: `${basePrompt}

Generate an achievement celebration story that:
1. Transforms their real achievement into legendary deed
2. Shows the impact on the story world
3. Reveals new possibilities unlocked
4. Makes them feel truly heroic

RESPONSE FORMAT:
{
  "achievementStory": "Epic retelling of their achievement",
  "worldImpact": "How this changed the story world",
  "newAbilities": ["abilities or paths unlocked"],
  "legendStatus": "How this adds to their legend",
  "celebration": "Epic celebration description"
}`,
  }

  return typeSpecificPrompts[requestType as keyof typeof typeSpecificPrompts] || typeSpecificPrompts.chapter
}

function getDominantStats(stats: any): string {
  if (!stats) return "Balanced in all aspects"

  return Object.entries(stats)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([stat, value]) => `${stat}: ${value}`)
    .join(", ")
}

function generateFallbackStory(userProfile: any, requestType: string): any {
  const fallbacks = {
    chapter: {
      chapterTitle: "The Mysterious Path",
      chapterNumber: Math.floor(userProfile.level / 5) + 1,
      content: `${userProfile.username} stands at a crossroads in their journey. The path ahead shimmers with possibility, each step forward revealing new challenges and opportunities for growth. The ancient systems whisper of trials to come, but also of the incredible potential that lies dormant within. What choice will shape the next chapter of this legendary tale?`,
      choices: [
        {
          text: "Embrace the challenge ahead",
          consequence: "Unlock new growth opportunities",
          statsAffected: ["courage", "determination"],
          pathUnlocked: "Path of Bold Action",
        },
        {
          text: "Seek wisdom before proceeding",
          consequence: "Gain deeper understanding",
          statsAffected: ["wisdom", "patience"],
          pathUnlocked: "Path of Contemplation",
        },
      ],
      worldStateChanges: {
        newLocations: ["The Crossroads of Potential"],
        charactersIntroduced: ["The Guide of Whispered Wisdom"],
        mysteriesRevealed: ["The nature of true growth"],
      },
      nextChapterHint: "A great revelation awaits...",
    },

    reflection: {
      reflectionTitle: "The Mirror of Progress",
      content: `Looking back on the path traveled, ${userProfile.username} sees not just the steps taken, but the transformation that has occurred with each choice. Like a blade forged in fire, each challenge has strengthened their resolve and sharpened their abilities. The journey continues, but the hero who walks forward is not the same one who began this quest.`,
      insights: [
        "Every small action contributes to legendary growth",
        "Consistency is the true magic of transformation",
        "The greatest battles are won within oneself",
      ],
      symbolism: "Your daily actions are the threads weaving your legend",
      prophecy: "Greater challenges await, but so does greater power",
    },

    achievement: {
      achievementStory: `The realm trembles as ${userProfile.username} achieves a feat of legendary proportions! This accomplishment sends ripples through the fabric of reality itself, marking a new chapter in their epic tale.`,
      worldImpact: "The very foundations of possibility have shifted",
      newAbilities: ["Enhanced potential", "Deeper wisdom", "Greater influence"],
      legendStatus: "Your name is spoken with reverence in the halls of achievement",
      celebration: "The cosmos itself celebrates this momentous victory",
    },
  }

  return fallbacks[requestType as keyof typeof fallbacks] || fallbacks.chapter
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, storyContext = {}, requestType = "chapter" } = body

    if (!userProfile) {
      return NextResponse.json({ error: "User profile required" }, { status: 400 })
    }

    const storyContent = await generateStoryContent(userProfile, storyContext, requestType)

    return NextResponse.json({
      ...storyContent,
      generatedAt: new Date().toISOString(),
      forUser: userProfile.username,
      requestType,
      aiProvider: "groq",
      success: true,
    })
  } catch (error) {
    console.error("Story generation API error:", error)
    return NextResponse.json(
      {
        error: "Story generation failed",
        fallback: generateFallbackStory({ username: "Hero", level: 1 }, "chapter"),
      },
      { status: 500 },
    )
  }
}
