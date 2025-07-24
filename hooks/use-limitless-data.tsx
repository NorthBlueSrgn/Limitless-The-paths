"use client"

import { useState } from "react"
import type {
  UserProfile,
  Attribute,
  Path,
  DailyTask,
  StoryChapter,
  JournalEntry,
  HunterExam,
  Chronicle,
  CodexEntry,
  AIMessage,
  SoulTrait,
} from "@/types/limitless"

export function useLimitlessData() {
  // User Profile
  const [userProfile] = useState<UserProfile>({
    id: "hunter_001",
    username: "Shadow Walker",
    email: "hunter@limitless.com",
    rank: "B",
    level: 15,
    totalXP: 12500,
    currentXP: 2500,
    nextRankXP: 5000,
    joinDate: "2024-01-01",
    lastActive: new Date().toISOString(),
    streak: 23,
    title: "Ascending Hunter",
    aura: "Obsidian Flame",
  })

  // Attributes
  const [attributes] = useState<Attribute[]>([
    {
      name: "Spiritual",
      value: 75,
      maxValue: 100,
      rank: "B",
      xpGained: 150,
      decayRate: 0.05,
      lastUpdated: new Date().toISOString(),
      color: "#8b5cf6",
      description: "Inner awareness and transcendent understanding",
      perks: ["Meditation Mastery", "Intuitive Insights", "Emotional Balance"],
    },
    {
      name: "Physical",
      value: 68,
      maxValue: 100,
      rank: "C",
      xpGained: 120,
      decayRate: 0.08,
      lastUpdated: new Date().toISOString(),
      color: "#ef4444",
      description: "Bodily strength, endurance, and vitality",
      perks: ["Enhanced Stamina", "Quick Recovery", "Physical Resilience"],
    },
    {
      name: "Health",
      value: 82,
      maxValue: 100,
      rank: "A",
      xpGained: 200,
      decayRate: 0.03,
      lastUpdated: new Date().toISOString(),
      color: "#10b981",
      description: "Overall wellness and life force energy",
      perks: ["Immune Boost", "Vitality Surge", "Healing Factor"],
    },
    {
      name: "Creativity",
      value: 71,
      maxValue: 100,
      rank: "B",
      xpGained: 180,
      decayRate: 0.06,
      lastUpdated: new Date().toISOString(),
      color: "#f59e0b",
      description: "Innovative thinking and artistic expression",
      perks: ["Creative Flow", "Artistic Vision", "Innovation Spark"],
    },
    {
      name: "Intelligence",
      value: 85,
      maxValue: 100,
      rank: "A",
      xpGained: 250,
      decayRate: 0.04,
      lastUpdated: new Date().toISOString(),
      color: "#3b82f6",
      description: "Cognitive ability and analytical thinking",
      perks: ["Strategic Mind", "Pattern Recognition", "Memory Palace"],
    },
    {
      name: "Resilience",
      value: 79,
      maxValue: 100,
      rank: "B",
      xpGained: 190,
      decayRate: 0.02,
      lastUpdated: new Date().toISOString(),
      color: "#6366f1",
      description: "Mental fortitude and stress resistance",
      perks: ["Unbreakable Will", "Stress Immunity", "Comeback Power"],
    },
  ])

  // Soul Traits
  const [soulTraits] = useState<SoulTrait[]>([
    {
      id: "obsidian_focus",
      name: "Obsidian Focus",
      description: "Unbreakable concentration in chaos",
      unlocked: true,
      level: 3,
      prerequisites: ["intelligence_50"],
      effects: ["+25% task completion speed", "Immunity to distractions"],
      color: "#8b5cf6",
      position: { x: 0, y: -80 },
    },
    {
      id: "phoenix_resilience",
      name: "Phoenix Resilience",
      description: "Rise stronger from every setback",
      unlocked: true,
      level: 2,
      prerequisites: ["resilience_60"],
      effects: ["+50% recovery from failures", "Setback immunity"],
      color: "#ef4444",
      position: { x: 69, y: -40 },
    },
    {
      id: "sage_wisdom",
      name: "Sage Wisdom",
      description: "Deep understanding of life's patterns",
      unlocked: false,
      level: 0,
      prerequisites: ["spiritual_80", "intelligence_70"],
      effects: ["Unlock hidden story paths", "Enhanced decision making"],
      color: "#10b981",
      position: { x: 69, y: 40 },
    },
    {
      id: "creative_storm",
      name: "Creative Storm",
      description: "Unleash torrents of innovative ideas",
      unlocked: true,
      level: 1,
      prerequisites: ["creativity_65"],
      effects: ["2x creative task rewards", "Inspiration bursts"],
      color: "#f59e0b",
      position: { x: 0, y: 80 },
    },
    {
      id: "iron_discipline",
      name: "Iron Discipline",
      description: "Unwavering commitment to growth",
      unlocked: false,
      level: 0,
      prerequisites: ["physical_70", "resilience_75"],
      effects: ["Streak protection", "Discipline multiplier"],
      color: "#6366f1",
      position: { x: -69, y: 40 },
    },
    {
      id: "vital_essence",
      name: "Vital Essence",
      description: "Radiant life force energy",
      unlocked: true,
      level: 2,
      prerequisites: ["health_75"],
      effects: ["Health regeneration", "Energy overflow"],
      color: "#10b981",
      position: { x: -69, y: -40 },
    },
  ])

  // Paths
  const [paths] = useState<Path[]>([
    {
      id: "path_of_mastery",
      name: "Path of Mastery",
      description: "The relentless pursuit of excellence in chosen domains",
      category: "Mental Mastery",
      difficulty: "Advanced",
      isActive: true,
      progress: 65,
      maxProgress: 100,
      currentStage: "Deliberate Practice",
      nextStage: "Performance Optimization",
      associatedAttributes: ["Intelligence", "Resilience", "Creativity"],
      rewards: [
        { type: "Title", value: 1, target: "Master of Craft" },
        { type: "XP", value: 3500 },
      ],
      decayRate: 0.05,
      lastActivity: new Date().toISOString(),
      archetype: "The Perfectionist",
      philosophy:
        "Excellence is not a skill, it's an attitude. Every repetition is a choice between mediocrity and greatness.",
      lore: "In the ancient halls of mastery, only those who embrace the pain of discipline can transcend the ordinary.",
      color: "#8b5cf6",
    },
    {
      id: "path_of_will",
      name: "Path of Will",
      description: "Forge unbreakable mental fortitude and discipline",
      category: "Self Mastery",
      difficulty: "Master",
      isActive: true,
      progress: 45,
      maxProgress: 100,
      currentStage: "Mental Resistance",
      nextStage: "Emotional Regulation",
      associatedAttributes: ["Resilience", "Spiritual", "Physical"],
      rewards: [
        { type: "Title", value: 1, target: "Iron Will" },
        { type: "XP", value: 5000 },
      ],
      decayRate: 0.03,
      lastActivity: new Date().toISOString(),
      archetype: "The Unbreakable",
      philosophy:
        "The mind is everything. What you think you become. Discipline is the bridge between thought and accomplishment.",
      lore: "Forged in the crucible of adversity, the will becomes an unbreakable blade that cuts through any obstacle.",
      color: "#ef4444",
    },
    {
      id: "creative_forge",
      name: "Creative Forge",
      description: "Unleash boundless creative potential and artistic vision",
      category: "Creative Expression",
      difficulty: "Intermediate",
      isActive: false,
      progress: 30,
      maxProgress: 100,
      currentStage: "Inspiration Gathering",
      nextStage: "Creative Flow",
      associatedAttributes: ["Creativity", "Intelligence", "Spiritual"],
      rewards: [
        { type: "Title", value: 1, target: "Visionary Artist" },
        { type: "XP", value: 2800 },
      ],
      decayRate: 0.07,
      lastActivity: "2024-01-15",
      archetype: "The Visionary",
      philosophy: "Creativity is intelligence having fun. True art emerges when technique meets inspiration.",
      lore: "In the Creative Forge, raw imagination is hammered into works that transcend the mundane world.",
      color: "#f59e0b",
    },
  ])

  // Daily Tasks
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    {
      id: "task_1",
      title: "Morning Meditation",
      description: "20 minutes of focused mindfulness practice",
      category: "Spiritual",
      difficulty: "Easy",
      xpReward: 50,
      attributeRewards: { Spiritual: 5, Resilience: 2 },
      pathId: "path_of_will",
      completed: false,
      timeEstimate: 20,
      type: "daily",
    },
    {
      id: "task_2",
      title: "Strategic Chess Study",
      description: "Analyze 3 grandmaster games and practice tactics",
      category: "Intelligence",
      difficulty: "Medium",
      xpReward: 75,
      attributeRewards: { Intelligence: 8, Creativity: 3 },
      pathId: "path_of_mastery",
      completed: true,
      timeEstimate: 45,
      type: "daily",
    },
    {
      id: "task_3",
      title: "Physical Training",
      description: "Full body workout with progressive overload",
      category: "Physical",
      difficulty: "Hard",
      xpReward: 100,
      attributeRewards: { Physical: 10, Health: 5, Resilience: 3 },
      completed: false,
      timeEstimate: 60,
      type: "daily",
    },
    {
      id: "task_4",
      title: "Creative Writing",
      description: "Write 500 words of original fiction",
      category: "Creativity",
      difficulty: "Medium",
      xpReward: 80,
      attributeRewards: { Creativity: 8, Intelligence: 2 },
      pathId: "creative_forge",
      completed: false,
      timeEstimate: 30,
      type: "daily",
    },
  ])

  // Story Chapters
  const [storyChapters] = useState<StoryChapter[]>([
    {
      id: "chapter_1",
      title: "The Awakening",
      content: `The system pulses with dark energy as you stand at the threshold of transformation.

Your reflection stares back from the obsidian mirror—but something has changed. The eyes that once held doubt now burn with purpose. The Order has been watching, waiting for this moment when potential crystallizes into power.

"Welcome, Hunter," a voice echoes from the void. "Your journey into Chapter Black begins now. Every choice you make, every task you complete, every moment of weakness or strength—all of it feeds the narrative of your evolution."

The air crackles with possibility. Your soul map flickers to life, six attributes pulsing like stars in the darkness. This is no ordinary path. This is the forging of legend.

The first trial awaits. Will you rise to meet it, or will you remain forever trapped in the prison of mediocrity?`,
      chapterNumber: 1,
      unlocked: true,
      completed: true,
      themes: ["Awakening", "Potential", "Choice"],
      requiredTaskCompletion: 0,
      rewards: [{ type: "XP", value: 200 }],
      tone: "ascension",
      characterMoments: ["First glimpse of The Order", "Soul map activation", "Recognition of inner power"],
    },
    {
      id: "chapter_2",
      title: "The First Trial",
      content: `Three days have passed since your awakening. The Order observes your every move, cataloging your choices, measuring your resolve.

"Consistency," the voice whispers, "is the blade that cuts through the veil of impossibility."

Your meditation practice has begun to bear fruit. In the stillness, you sense something stirring—a presence that has always been there, waiting. Your chess studies reveal patterns within patterns, strategies that extend far beyond the board.

But the path is treacherous. Each completed task strengthens the light within, while every failure feeds the shadows that seek to drag you back to the ordinary world.

The Hunter Exam looms on the horizon. Your current rank of B is merely a stepping stone. The Order has seen potential in you that even you don't yet recognize.

"Power," it says, "is not given. It is taken by those brave enough to seize it."`,
      chapterNumber: 2,
      unlocked: true,
      completed: false,
      themes: ["Discipline", "Growth", "Recognition"],
      requiredTaskCompletion: 60,
      rewards: [{ type: "XP", value: 300 }],
      tone: "neutral",
      characterMoments: ["Meditation breakthrough", "Strategic insight gained", "The Order's first test"],
    },
  ])

  // Journal Entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: "entry_1",
      title: "The Moment Everything Changed",
      content:
        "Today I realized that I've been living in the shadows of my own potential. The system activated something in me—a hunger for growth that I've never felt before. Every task completed feels like a step toward becoming who I'm meant to be.",
      date: "2024-01-20",
      mood: ["Determined", "Inspired"],
      tags: ["breakthrough", "awakening", "potential"],
      season: "Winter of Preparation",
      type: "Breakthrough",
      linkedPaths: ["path_of_mastery"],
      xpGained: 50,
      storyImpact: "Influenced the tone of Chapter 2 toward ascension",
    },
    {
      id: "entry_2",
      title: "Struggling with Consistency",
      content:
        "Missed my meditation practice yesterday. The Order's voice seems quieter today, disappointed perhaps. I can feel the decay creeping in, the old patterns trying to reassert themselves. But I won't let them win. Tomorrow is a new chance to prove my dedication.",
      date: "2024-01-18",
      mood: ["Frustrated", "Reflective"],
      tags: ["setback", "consistency", "determination"],
      season: "Winter of Preparation",
      type: "Setback",
      linkedPaths: ["path_of_will"],
      xpGained: 25,
      storyImpact: "Added struggle elements to current chapter",
    },
  ])

  // Hunter Exams
  const [hunterExams] = useState<HunterExam[]>([
    {
      id: "exam_a_rank",
      name: "The Fourth Gate",
      description: "Ascension to Rank A requires mastery of mind, body, and spirit",
      targetRank: "A",
      phases: [
        {
          id: "phase_1",
          name: "Endurance Trial",
          type: "Endurance",
          description: "Complete all daily tasks for 7 consecutive days",
          requirements: ["100% task completion", "No streak breaks", "Maintain all attributes above 70"],
          timeLimit: 10080, // 7 days in minutes
          completed: false,
        },
        {
          id: "phase_2",
          name: "Mental Fortress",
          type: "Challenge",
          description: "Demonstrate unbreakable focus under pressure",
          requirements: ["Complete 3 high-difficulty tasks", "Maintain meditation streak", "Strategic thinking test"],
          timeLimit: 180,
          completed: false,
        },
        {
          id: "phase_3",
          name: "Soul Integration",
          type: "Reflection",
          description: "Write a comprehensive reflection on your transformation",
          requirements: ["1000+ word reflection", "Identify 3 major breakthroughs", "Set future goals"],
          completed: false,
        },
      ],
      rewards: [
        { type: "Title", value: 1, target: "Elite Hunter" },
        { type: "XP", value: 5000 },
      ],
      unlocked: true,
      completed: false,
      attempts: 0,
      bestScore: 0,
      duration: 7,
      intensity: "Intense",
    },
  ])

  // Chronicles
  const [chronicles, setChronicles] = useState<Chronicle[]>([
    {
      id: "chronicle_1",
      title: "The Order's First Message",
      content:
        "I am The Order. I have observed countless souls traverse the path from mediocrity to transcendence. You stand at the beginning, Hunter. Your potential is vast, but potential without action is merely a beautiful lie.",
      date: "2024-01-15",
      type: "Story Response",
      mood: "Mysterious",
      insights: ["Potential requires action", "The Order is always watching", "Transformation is possible"],
    },
    {
      id: "chronicle_2",
      title: "Meditation Breakthrough",
      content:
        "In the silence between thoughts, I found something extraordinary. A presence, ancient and knowing, that has been waiting for me to quiet the noise of the world. This is what they call the inner voice—not imagination, but recognition.",
      date: "2024-01-19",
      type: "Mindset Shift",
      linkedChapter: "chapter_2",
      mood: "Transcendent",
      insights: ["Inner wisdom exists", "Silence reveals truth", "Recognition vs imagination"],
    },
  ])

  // Codex Entries
  const [codexEntries] = useState<CodexEntry[]>([
    {
      id: "codex_1",
      title: "The Law of Compound Growth",
      category: "Philosophy",
      content:
        "Small, consistent actions compound exponentially over time. A 1% improvement daily results in 37x growth over a year. The Order teaches that transformation is not about dramatic gestures, but about the relentless accumulation of marginal gains.\n\nThis principle applies to all aspects of development - physical training, skill acquisition, habit formation, and spiritual growth. The key is consistency over intensity, patience over urgency.\n\nMaster this law, and you master the art of inevitable progress.",
      unlocked: true,
      rarity: "Common",
      powerLevel: 3,
      source: "The Order's Teachings",
      applications: [
        "Daily habit formation",
        "Skill development planning",
        "Long-term goal achievement",
        "Attribute progression strategy",
      ],
      unlockRequirements: ["rank_E"],
    },
    {
      id: "codex_2",
      title: "The Obsidian Mirror Technique",
      category: "Ritual",
      content:
        "Stand before a mirror in complete darkness. Light a single candle. Stare into your own eyes for 10 minutes without breaking contact.\n\nIn the depths of your gaze, you will see not who you are, but who you could become. This ritual reveals the gap between current self and potential self.\n\nThe mirror shows truth without mercy. It strips away illusions and reveals the raw material of transformation. Many cannot bear what they see. Those who can, emerge forever changed.\n\nPerform this ritual at moments of doubt, when the path seems unclear, or when you need to reconnect with your deepest motivations.",
      unlocked: true,
      requiredRank: "C",
      rarity: "Rare",
      powerLevel: 6,
      source: "Ancient Hunter Traditions",
      applications: [
        "Self-awareness enhancement",
        "Motivation renewal",
        "Identity clarification",
        "Breaking through plateaus",
      ],
      unlockRequirements: ["rank_C", "spiritual_30"],
    },
    {
      id: "codex_3",
      title: "Miyamoto Musashi: The Way of Strategy",
      category: "Legend",
      content:
        "The legendary swordsman who never lost a duel. Musashi understood that true mastery comes from the integration of technique, strategy, and spirit.\n\nHis Book of Five Rings teaches that the way of the warrior extends far beyond combat—it is a philosophy of life itself. The five rings represent different aspects of mastery: Ground (foundation), Water (adaptability), Fire (aggression), Wind (tradition), and Void (the formless).\n\nMusashi's greatest insight: 'You must understand that there is more than one path to the top of the mountain.' He mastered not just swordsmanship, but painting, sculpture, and poetry. True strength comes from the harmony of all aspects of being.\n\nHis final teaching: 'Today is victory over yourself of yesterday; tomorrow is your victory over lesser men.'",
      unlocked: false,
      requiredRank: "B",
      requiredPath: "path_of_mastery",
      rarity: "Epic",
      powerLevel: 9,
      source: "Legendary Figures Archive",
      applications: [
        "Strategic thinking development",
        "Multi-disciplinary mastery",
        "Combat mindset cultivation",
        "Philosophical integration",
      ],
      unlockRequirements: ["rank_B", "path_of_mastery_50", "intelligence_70"],
    },
    {
      id: "codex_4",
      title: "The Phoenix Protocol",
      category: "Secret",
      content:
        "When all seems lost, when failure threatens to consume you, activate the Phoenix Protocol.\n\nEmbrace the destruction completely. Let the old self burn away entirely. Do not resist the flames—feed them. Every weakness, every limitation, every false belief about yourself must be consumed.\n\nThis is not recovery—this is rebirth. From the ashes, a stronger version will emerge. The Phoenix Protocol transforms catastrophic failure into evolutionary breakthrough.\n\nWarning: This technique is dangerous. It requires complete ego death and reconstruction. Many who attempt it are lost in the flames. Only those with unshakeable core identity should attempt this transformation.\n\nThe protocol has three phases: Ignition (accepting total failure), Combustion (systematic destruction of limiting patterns), and Resurrection (emergence of the new self).",
      unlocked: false,
      requiredRank: "A",
      rarity: "Legendary",
      powerLevel: 15,
      source: "Forbidden Techniques",
      applications: [
        "Catastrophic failure recovery",
        "Identity reconstruction",
        "Breakthrough after plateau",
        "Trauma integration",
      ],
      unlockRequirements: ["rank_A", "resilience_90", "major_failure_experience"],
    },
    {
      id: "codex_5",
      title: "The Void State",
      category: "Mental Model",
      content:
        "Beyond thought, beyond emotion, beyond the constant chatter of the mind lies the Void State—a place of infinite potential and perfect clarity.\n\nIn this state, you become the observer of your own consciousness. Thoughts arise and pass like clouds in an empty sky. You are not your thoughts, not your emotions, not your circumstances. You are the awareness that witnesses all of these.\n\nFrom the Void State, all action becomes effortless. There is no resistance, no internal conflict, no doubt. You simply act from a place of perfect knowing.\n\nThis is the state that masters access during peak performance. Athletes call it 'the zone,' artists call it 'flow,' warriors call it 'mushin' (no-mind).\n\nTo access the Void State: First, master meditation. Then, learn to maintain awareness during activity. Finally, dissolve the boundary between observer and observed.",
      unlocked: true,
      rarity: "Epic",
      powerLevel: 12,
      source: "Advanced Consciousness Studies",
      applications: ["Peak performance states", "Emotional regulation", "Decision making clarity", "Stress immunity"],
      unlockRequirements: ["spiritual_80", "meditation_mastery"],
    },
    {
      id: "codex_6",
      title: "The 40% Rule",
      category: "Tactic",
      content:
        "When your mind tells you that you're done, you're only 40% done. This is the fundamental truth discovered by Navy SEALs and elite performers worldwide.\n\nThe brain has built-in safety mechanisms that trigger the sensation of exhaustion long before actual physical limits are reached. This is an evolutionary survival mechanism, but it becomes a limitation when pursuing excellence.\n\nThe 40% Rule applies to physical endurance, mental focus, emotional resilience, and spiritual discipline. When you think you can't continue, you have 60% more capacity available.\n\nTo access this reserve: Acknowledge the discomfort without judgment. Breathe through the resistance. Focus on the next small step, not the entire remaining distance. Remember your deeper purpose.\n\nWarning: This technique should be used wisely. Pushing beyond 80% regularly can lead to burnout or injury. The 40% Rule is for breakthrough moments, not daily operation.",
      unlocked: true,
      rarity: "Rare",
      powerLevel: 7,
      source: "Elite Performance Research",
      applications: [
        "Physical endurance training",
        "Mental toughness development",
        "Breakthrough performance",
        "Comfort zone expansion",
      ],
      unlockRequirements: ["physical_50", "resilience_40"],
    },
  ])

  // AI Messages
  const [aiMessages, setAIMessages] = useState<AIMessage[]>([
    {
      id: "msg_1",
      content:
        "I am The Order. I have observed countless souls traverse the path from mediocrity to transcendence. You stand at the beginning, Hunter. Your potential is vast, but potential without action is merely a beautiful lie.",
      type: "assistant",
      timestamp: new Date().toISOString(),
      category: "philosophy",
    },
  ])

  // Functions
  const completeTask = (taskId: string) => {
    setDailyTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))
  }

  const addJournalEntry = (entry: Omit<JournalEntry, "id">) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `entry_${Date.now()}`,
    }
    setJournalEntries((prev) => [newEntry, ...prev])
  }

  const addChronicle = (chronicle: Omit<Chronicle, "id">) => {
    const newChronicle: Chronicle = {
      ...chronicle,
      id: `chronicle_${Date.now()}`,
    }
    setChronicles((prev) => [newChronicle, ...prev])
  }

  const addAIMessage = (content: string, category?: AIMessage["category"]) => {
    const userMessage: AIMessage = {
      id: `msg_${Date.now()}_user`,
      content,
      type: "user",
      timestamp: new Date().toISOString(),
      category,
    }

    setAIMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: `msg_${Date.now()}_ai`,
        content: generateAIResponse(content, category),
        type: "assistant",
        timestamp: new Date().toISOString(),
        category,
      }
      setAIMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  const generateAIResponse = (userMessage: string, category?: string): string => {
    const responses = {
      guidance:
        "Your path is clear, Hunter. Focus on consistency over intensity. The small actions you take daily are the building blocks of your transformation.",
      story:
        "Your recent actions have influenced the narrative. The story adapts to your choices—continue on this path and witness how your dedication shapes your legend.",
      analysis:
        "I observe patterns in your behavior. Your strengths lie in strategic thinking, but your consistency needs improvement. Focus on building unbreakable habits.",
      challenge:
        "I challenge you to complete every task for the next 3 days without exception. Prove to yourself that you have the discipline to transcend your current limitations.",
      philosophy:
        "Remember this truth: You are not managing tasks—you are forging a soul. Every choice is a chisel strike in the sculpture of your becoming.",
      lore: "In the ancient texts, it is written that those who master themselves master the world. Your journey follows the same path walked by legends.",
    }

    return responses[category as keyof typeof responses] || responses.guidance
  }

  return {
    userProfile,
    attributes,
    soulTraits,
    paths,
    dailyTasks,
    storyChapters,
    journalEntries,
    hunterExams,
    chronicles,
    codexEntries,
    aiMessages,
    completeTask,
    addJournalEntry,
    addChronicle,
    addAIMessage,
    activePaths: paths.filter((p) => p.isActive),
    decayMetrics: [] as any[], // Placeholder for decay metrics
  }
}
