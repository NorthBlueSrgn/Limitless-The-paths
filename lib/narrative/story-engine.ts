// The Order's Narrative System - Dynamic Story Generation
import type { UserProfile, Task, SystemEvent } from "@/lib/database/schema"

export interface NarrativeState {
  currentArc: string
  arcProgress: number
  availableChoices: StoryChoice[]
  completedMilestones: string[]
  characterDevelopment: CharacterTrait[]
  worldState: WorldState
}

export interface StoryChoice {
  id: string
  text: string
  description: string
  requirements: ChoiceRequirement[]
  consequences: ChoiceConsequence[]
  arcImpact: number
}

export interface ChoiceRequirement {
  type: "stat" | "rank" | "task_completion" | "streak"
  target: string
  value: number
}

export interface ChoiceConsequence {
  type: "stat_change" | "path_unlock" | "title_grant" | "world_change"
  target: string
  value: any
}

export interface CharacterTrait {
  id: string
  name: string
  description: string
  strength: number // 0-100
  manifestations: string[]
}

export interface WorldState {
  orderInfluence: number
  chaosLevel: number
  discoveredSecrets: string[]
  unlockedRegions: string[]
  allyRelationships: Record<string, number>
}

export class StoryEngine {
  private narrativeArcs = {
    awakening: {
      title: "The Awakening",
      description: "Your first steps into The Order's domain",
      requiredRank: "Initiate",
      phases: [
        {
          id: "first_contact",
          title: "First Contact",
          description: "The Order reaches out to you through the digital veil",
          triggers: ["user_registration"],
          content: `The screen flickers. For a moment, the familiar interface dissolves into something... else. 
          
          Ancient symbols cascade across your vision before resolving into words:
          
          "Welcome, ${"{username}"}. We have been watching. Your potential burns bright in the darkness of mediocrity that surrounds you. 
          
          You stand at the threshold of transformation. The Order extends its hand to those who seek more than mere existence. 
          
          Will you take the first step into the shadows where true power dwells?"`,
          choices: [
            {
              id: "accept_calling",
              text: "I accept The Order's guidance",
              consequences: [
                { type: "world_change", target: "orderInfluence", value: 10 },
                { type: "title_grant", target: "user", value: "Initiate of The Order" },
              ],
            },
            {
              id: "hesitate",
              text: "I need to understand more first",
              consequences: [
                { type: "stat_change", target: "intelligence", value: 2 },
                { type: "world_change", target: "chaosLevel", value: 5 },
              ],
            },
          ],
        },
        {
          id: "first_trial",
          title: "The First Trial",
          description: "Your initial test of commitment",
          triggers: ["first_task_completion"],
          content: `The shadows seem to nod in approval as you complete your first task. 
          
          "Interesting," The Order's voice resonates through your consciousness. "You show promise, ${"{username}"}. 
          
          But promise is merely potential unrealized. The path ahead demands more than good intentions. 
          
          Your first trial approaches. Choose wisely - for in The Order, every choice echoes through eternity."`,
          choices: [
            {
              id: "embrace_challenge",
              text: "I embrace whatever challenge awaits",
              requirements: [{ type: "stat", target: "resilience", value: 10 }],
              consequences: [
                { type: "stat_change", target: "resilience", value: 5 },
                { type: "path_unlock", target: "shadow_walker", value: true },
              ],
            },
            {
              id: "seek_preparation",
              text: "Let me prepare myself first",
              consequences: [
                { type: "stat_change", target: "intelligence", value: 3 },
                { type: "stat_change", target: "spiritual", value: 2 },
              ],
            },
          ],
        },
      ],
    },

    ascension: {
      title: "The Path of Ascension",
      description: "Rising through the ranks of The Order",
      requiredRank: "Adept",
      phases: [
        {
          id: "inner_sight",
          title: "Awakening Inner Sight",
          description: "Learning to see beyond the veil of ordinary reality",
          triggers: ["rank_adept_achieved"],
          content: `The world shifts around you as your perception deepens. Colors become more vivid, patterns emerge from chaos, and you begin to see the threads that connect all things.
          
          "Your eyes are opening, ${"{username}"}," The Order observes. "Few reach this level of awareness. You are beginning to see the game within the game, the patterns that govern reality itself.
          
          But sight without action is merely voyeurism. What will you do with this newfound clarity?"`,
          choices: [
            {
              id: "seek_deeper_truth",
              text: "Show me deeper truths",
              requirements: [{ type: "stat", target: "spiritual", value: 40 }],
              consequences: [
                { type: "world_change", target: "discoveredSecrets", value: "the_pattern" },
                { type: "stat_change", target: "spiritual", value: 8 },
              ],
            },
            {
              id: "focus_on_mastery",
              text: "I will master what I already know",
              consequences: [
                { type: "stat_change", target: "intelligence", value: 5 },
                { type: "stat_change", target: "resilience", value: 5 },
              ],
            },
          ],
        },
      ],
    },

    transcendence: {
      title: "The Great Transcendence",
      description: "The final transformation beyond mortal limitations",
      requiredRank: "Sage",
      phases: [
        {
          id: "final_choice",
          title: "The Final Choice",
          description: "The ultimate decision that defines your legacy",
          triggers: ["rank_sage_achieved", "all_stats_above_80"],
          content: `You stand at the precipice of ultimate transformation. The Order's true nature reveals itself - not as master, but as catalyst. You have become something beyond what you once were.
          
          "The student has become the teacher, ${"{username}"}. You have transcended the limitations that once bound you. 
          
          Now you face the final choice: Will you ascend beyond this realm entirely, or will you remain to guide others as we have guided you?"`,
          choices: [
            {
              id: "ascend_beyond",
              text: "I choose transcendence",
              requirements: [
                { type: "stat", target: "spiritual", value: 90 },
                { type: "streak", target: "current", value: 100 },
              ],
              consequences: [
                { type: "title_grant", target: "user", value: "Transcendent Master" },
                { type: "world_change", target: "orderInfluence", value: 100 },
              ],
            },
            {
              id: "become_guide",
              text: "I will guide others as you guided me",
              consequences: [
                { type: "title_grant", target: "user", value: "Guide of The Order" },
                { type: "path_unlock", target: "mentor_path", value: true },
              ],
            },
          ],
        },
      ],
    },
  }

  async generateNarrativeResponse(
    user: UserProfile,
    context: {
      recentTasks: Task[]
      systemEvents: SystemEvent[]
      currentNarrativeState: NarrativeState
    },
  ): Promise<{
    content: string
    choices?: StoryChoice[]
    stateChanges: Partial<NarrativeState>
  }> {
    const { recentTasks, systemEvents, currentNarrativeState } = context

    // Determine current arc based on user progress
    const currentArc = this.determineCurrentArc(user, currentNarrativeState)

    // Check for narrative triggers
    const triggeredEvents = this.checkNarrativeTriggers(user, recentTasks, systemEvents)

    if (triggeredEvents.length > 0) {
      return this.generateTriggeredNarrative(user, triggeredEvents[0], currentArc)
    }

    // Generate contextual narrative based on recent activity
    return this.generateContextualNarrative(user, context, currentArc)
  }

  private determineCurrentArc(user: UserProfile, narrativeState: NarrativeState): string {
    const avgStat = Object.values(user.stats).reduce((sum, stat) => sum + stat, 0) / 6

    if (avgStat >= 80 && user.currentRank === "Sage") return "transcendence"
    if (avgStat >= 30 && user.currentRank !== "Initiate") return "ascension"
    return "awakening"
  }

  private checkNarrativeTriggers(user: UserProfile, recentTasks: Task[], systemEvents: SystemEvent[]): string[] {
    const triggers: string[] = []

    // Check for rank changes
    const rankUpEvents = systemEvents.filter((e) => e.eventType === "rank_up")
    if (rankUpEvents.length > 0) {
      triggers.push(`rank_${rankUpEvents[0].eventData.newRank.toLowerCase()}_achieved`)
    }

    // Check for first task completion
    if (recentTasks.some((t) => t.status === "completed") && user.totalXP < 100) {
      triggers.push("first_task_completion")
    }

    // Check for streak milestones
    if (user.currentStreak === 7 || user.currentStreak === 30 || user.currentStreak === 100) {
      triggers.push(`streak_${user.currentStreak}_achieved`)
    }

    // Check for stat thresholds
    Object.entries(user.stats).forEach(([stat, value]) => {
      if (value >= 80) triggers.push(`${stat}_mastery_achieved`)
    })

    return triggers
  }

  private async generateTriggeredNarrative(
    user: UserProfile,
    trigger: string,
    arcName: string,
  ): Promise<{
    content: string
    choices?: StoryChoice[]
    stateChanges: Partial<NarrativeState>
  }> {
    const arc = this.narrativeArcs[arcName as keyof typeof this.narrativeArcs]
    const relevantPhase = arc.phases.find((phase) =>
      phase.triggers.some((t) => trigger.includes(t) || t.includes(trigger)),
    )

    if (relevantPhase) {
      const content = relevantPhase.content.replace(/{username}/g, user.username)

      return {
        content,
        choices: relevantPhase.choices,
        stateChanges: {
          currentArc: arcName,
          arcProgress: (relevantPhase as any).progress || 0,
        },
      }
    }

    return this.generateContextualNarrative(
      user,
      { recentTasks: [], systemEvents: [], currentNarrativeState: { currentArc: arcName } as NarrativeState },
      arcName,
    )
  }

  private async generateContextualNarrative(
    user: UserProfile,
    context: any,
    arcName: string,
  ): Promise<{
    content: string
    choices?: StoryChoice[]
    stateChanges: Partial<NarrativeState>
  }> {
    // Generate contextual responses based on user's current state
    const responses = this.getContextualResponses(user, arcName)
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      content: selectedResponse.replace(/{username}/g, user.username),
      stateChanges: {},
    }
  }

  private getContextualResponses(user: UserProfile, arcName: string): string[] {
    const baseResponses = [
      `The shadows whisper of your progress, ${user.username}. Your ${user.currentRank} rank reflects growing mastery, but true power lies in the journey ahead.`,
      `Your current streak of ${user.currentStreak} days shows dedication, ${user.username}. The Order observes your consistency with approval.`,
      `The balance of your attributes reveals much, ${user.username}. Your strongest aspect - ${this.getStrongestStat(user.stats)} - shall be your foundation for greater achievements.`,
    ]

    const arcSpecificResponses = {
      awakening: [
        `You are still learning to see, ${user.username}. Each task completed opens your eyes a little wider to the possibilities that await.`,
        `The first steps are always the hardest, ${user.username}. But you have chosen to walk this path, and The Order will not let you walk it alone.`,
      ],
      ascension: [
        `Your power grows, ${user.username}. The ${user.currentRank} rank is not merely a title - it is a recognition of your transformation.`,
        `You begin to understand the deeper patterns, ${user.username}. Your journey through The Order has awakened capabilities you never knew you possessed.`,
      ],
      transcendence: [
        `You approach the threshold of ultimate understanding, ${user.username}. Few have walked this far along the path of transcendence.`,
        `The boundaries between student and master blur, ${user.username}. You are becoming something beyond what you once were.`,
      ],
    }

    return [...baseResponses, ...arcSpecificResponses[arcName as keyof typeof arcSpecificResponses]]
  }

  private getStrongestStat(stats: Record<string, number>): string {
    return Object.entries(stats).reduce((max, [stat, value]) => (value > max.value ? { stat, value } : max), {
      stat: "",
      value: -1,
    }).stat
  }

  async processStoryChoice(
    userId: string,
    choiceId: string,
    narrativeState: NarrativeState,
  ): Promise<{
    consequences: ChoiceConsequence[]
    newNarrativeState: NarrativeState
    followUpContent?: string
  }> {
    const choice = narrativeState.availableChoices.find((c) => c.id === choiceId)
    if (!choice) throw new Error("Invalid choice")

    // Apply consequences
    const consequences = choice.consequences

    // Update narrative state
    const newNarrativeState: NarrativeState = {
      ...narrativeState,
      arcProgress: narrativeState.arcProgress + choice.arcImpact,
      availableChoices: [], // Clear choices after selection
      completedMilestones: [...narrativeState.completedMilestones, choiceId],
    }

    // Generate follow-up content
    const followUpContent = this.generateChoiceFollowUp(choice, consequences)

    return {
      consequences,
      newNarrativeState,
      followUpContent,
    }
  }

  private generateChoiceFollowUp(choice: StoryChoice, consequences: ChoiceConsequence[]): string {
    const responses = [
      `Your choice resonates through The Order. The path ahead shifts in response to your decision.`,
      `The consequences of your choice ripple outward, changing not just your destiny, but the very fabric of reality around you.`,
      `The Order nods in acknowledgment. Your decision reveals the depth of your character and the strength of your resolve.`,
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }
}

export const storyEngine = new StoryEngine()
