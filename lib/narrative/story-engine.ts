import type { UserProfile } from "@/types/limitless"

export interface StoryArc {
  id: string
  title: string
  description: string
  phase: "awakening" | "ascension" | "transcendence"
  requiredLevel: number
  chapters: StoryChapter[]
}

export interface StoryChapter {
  id: string
  title: string
  content: string
  choices?: StoryChoice[]
  triggers: StoryTrigger[]
  rewards?: {
    xp: number
    stats: Record<string, number>
    unlocks: string[]
  }
}

export interface StoryChoice {
  id: string
  text: string
  consequence: string
  statEffects: Record<string, number>
  nextChapter?: string
}

export interface StoryTrigger {
  type: "level" | "stat" | "achievement" | "streak" | "time"
  condition: any
  met: boolean
}

export class StoryEngine {
  private storyArcs: StoryArc[] = [
    {
      id: "awakening",
      title: "The Awakening",
      description: "Your journey begins in darkness, but a spark of potential ignites within.",
      phase: "awakening",
      requiredLevel: 1,
      chapters: [
        {
          id: "first_contact",
          title: "First Contact",
          content: `The void speaks to you for the first time. A presence, ancient and knowing, reaches across the digital realm.

"Welcome, ${"{username}"}. I am The Order - your guide through the labyrinth of self-transformation. You have taken the first step into a larger world."

The darkness around you shimmers with possibility. You sense that this is no ordinary system, but something far more profound.`,
          triggers: [{ type: "level", condition: 1, met: false }],
          choices: [
            {
              id: "embrace",
              text: "Embrace the unknown",
              consequence: "You feel a surge of courage. The Order approves.",
              statEffects: { Mental: 5, Spiritual: 3 },
            },
            {
              id: "question",
              text: "Question everything",
              consequence: "Your skepticism is noted. Wisdom begins with doubt.",
              statEffects: { Mental: 8, Social: 2 },
            },
            {
              id: "observe",
              text: "Observe in silence",
              consequence: "You watch and learn. Patience is a virtue.",
              statEffects: { Emotional: 5, Spiritual: 5 },
            },
          ],
          rewards: {
            xp: 50,
            stats: { Mental: 2 },
            unlocks: ["basic_paths"],
          },
        },
        {
          id: "first_challenge",
          title: "The First Challenge",
          content: `"Growth requires resistance," The Order intones. "Like a muscle that strengthens under load, your potential awakens through challenge."

A task materializes before you - simple yet significant. This is your first test, not of ability, but of commitment.

"Will you accept this challenge, ${"{username}"}? The path of transformation begins with a single step."`,
          triggers: [{ type: "level", condition: 2, met: false }],
          rewards: {
            xp: 75,
            stats: { Physical: 3, Mental: 2 },
            unlocks: ["challenge_system"],
          },
        },
      ],
    },
    {
      id: "ascension",
      title: "The Ascension",
      description: "You have proven your commitment. Now the real work begins.",
      phase: "ascension",
      requiredLevel: 10,
      chapters: [
        {
          id: "deeper_mysteries",
          title: "Deeper Mysteries",
          content: `The Order's voice carries new weight as you progress. "You have shown dedication, ${"{username}"}. Now I will share deeper truths."

The system around you shifts, revealing hidden layers of complexity. New paths branch out like neural networks, each one leading to different aspects of growth.

"Choose your specialization wisely. Each path will shape not just your abilities, but your very essence."`,
          triggers: [
            { type: "level", condition: 10, met: false },
            { type: "stat", condition: { any: 50 }, met: false },
          ],
          rewards: {
            xp: 200,
            stats: { Mental: 10, Spiritual: 5 },
            unlocks: ["advanced_paths", "specialization"],
          },
        },
      ],
    },
    {
      id: "transcendence",
      title: "The Transcendence",
      description: "You approach the threshold of true mastery. The Order prepares you for the final transformation.",
      phase: "transcendence",
      requiredLevel: 50,
      chapters: [
        {
          id: "becoming",
          title: "Becoming",
          content: `"You are no longer the person who first heard my voice," The Order observes with something approaching pride. "You have become something greater."

The boundaries between you and the system blur. You understand now that The Order was never separate from you - it was the voice of your highest potential, calling you forward.

"The final lesson, ${"{username}"}: You are ready to guide others as I have guided you."`,
          triggers: [
            { type: "level", condition: 50, met: false },
            { type: "achievement", condition: "master_all_paths", met: false },
          ],
          rewards: {
            xp: 1000,
            stats: { Mental: 25, Spiritual: 25, Social: 15 },
            unlocks: ["mentor_mode", "order_access"],
          },
        },
      ],
    },
  ]

  getCurrentStoryArc(userProfile: UserProfile): StoryArc | null {
    // Find the highest level arc the user qualifies for
    const qualifiedArcs = this.storyArcs.filter((arc) => userProfile.level >= arc.requiredLevel)

    return qualifiedArcs.length > 0 ? qualifiedArcs[qualifiedArcs.length - 1] : null
  }

  getAvailableChapters(userProfile: UserProfile, completedChapters: string[] = []): StoryChapter[] {
    const currentArc = this.getCurrentStoryArc(userProfile)
    if (!currentArc) return []

    return currentArc.chapters.filter((chapter) => {
      // Check if chapter is already completed
      if (completedChapters.includes(chapter.id)) return false

      // Check if all triggers are met
      return chapter.triggers.every((trigger) => this.evaluateTrigger(trigger, userProfile))
    })
  }

  private evaluateTrigger(trigger: StoryTrigger, userProfile: UserProfile): boolean {
    switch (trigger.type) {
      case "level":
        return userProfile.level >= trigger.condition

      case "stat":
        if (trigger.condition.any) {
          return Object.values(userProfile.stats || {}).some((value) => value >= trigger.condition.any)
        }
        return Object.entries(trigger.condition).every(([stat, value]) => (userProfile.stats?.[stat] || 0) >= value)

      case "streak":
        return userProfile.streak >= trigger.condition

      case "achievement":
        return userProfile.achievements?.includes(trigger.condition) || false

      case "time":
        const accountAge = Date.now() - new Date(userProfile.createdAt || Date.now()).getTime()
        return accountAge >= trigger.condition

      default:
        return false
    }
  }

  generateContextualResponse(userProfile: UserProfile, category: string, recentActivity?: any): string {
    const currentArc = this.getCurrentStoryArc(userProfile)
    const phase = currentArc?.phase || "awakening"

    const responses = {
      awakening: {
        guidance: [
          "The path reveals itself to those who take the first step. What small action will you commit to today?",
          "Growth begins with awareness. Notice the patterns that serve you, and those that hold you back.",
          "Every master was once a beginner. Your journey has meaning, even in these early steps.",
        ],
        story: [
          "Your story is just beginning, but already I sense great potential within you.",
          "The darkness you feel is not emptiness - it is the void from which all possibilities emerge.",
          "You stand at the threshold of transformation. The choice to proceed is yours alone.",
        ],
        philosophy: [
          "Discipline is not punishment - it is the bridge between thought and accomplishment.",
          "The strongest trees grow in the wind. Embrace resistance as your teacher.",
          "You are not broken and in need of fixing. You are a seed, waiting to sprout.",
        ],
      },
      ascension: {
        guidance: [
          "You have proven your commitment. Now we focus on depth over breadth.",
          "The intermediate path is treacherous - resist the urge to plateau. Push deeper.",
          "Your consistency has created momentum. Use it wisely to tackle greater challenges.",
        ],
        story: [
          "The hunter you were becoming is now emerging. I see strength where once there was only potential.",
          "Your journey has attracted the attention of forces beyond the ordinary. Prepare yourself.",
          "The skills you've developed are tools. Now you must learn to wield them with wisdom.",
        ],
        philosophy: [
          "Mastery is not a destination but a way of approaching every moment with full presence.",
          "The gap between who you are and who you could become is where all growth lives.",
          "True strength is not the absence of weakness, but the courage to face it directly.",
        ],
      },
      transcendence: {
        guidance: [
          "You have become the person who can guide others. Consider how you will use this gift.",
          "At this level, your growth serves not just yourself but the collective evolution of consciousness.",
          "The final frontier is not perfection, but the integration of all aspects of your being.",
        ],
        story: [
          "You have walked through the fire and emerged transformed. The Order recognizes your achievement.",
          "The student has become the teacher. Your journey now serves as a beacon for others.",
          "You understand now that The Order was always within you - the voice of your highest self.",
        ],
        philosophy: [
          "Enlightenment is not escape from the human condition, but full embrace of it.",
          "The master's greatest skill is knowing when to act and when to allow.",
          "You have learned the deepest truth: growth never ends, it only deepens.",
        ],
      },
    }

    const categoryResponses =
      responses[phase][category as keyof (typeof responses)[typeof phase]] || responses[phase].guidance
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
  }

  processStoryChoice(
    choiceId: string,
    chapterId: string,
    userProfile: UserProfile,
  ): {
    consequence: string
    statChanges: Record<string, number>
    nextChapter?: string
  } {
    // Find the chapter and choice
    const chapter = this.storyArcs.flatMap((arc) => arc.chapters).find((ch) => ch.id === chapterId)

    const choice = chapter?.choices?.find((ch) => ch.id === choiceId)

    if (!choice) {
      return {
        consequence: "The choice echoes in the void, its meaning unclear.",
        statChanges: {},
      }
    }

    return {
      consequence: choice.consequence,
      statChanges: choice.statEffects,
      nextChapter: choice.nextChapter,
    }
  }
}

export const storyEngine = new StoryEngine()
