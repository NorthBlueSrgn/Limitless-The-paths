"use client"

import { useState } from "react"
import type { User, Task, Path, StoryChapter, AIMessage } from "@/types/limitless"

export function useLimitlessData() {
  const [user, setUser] = useState<User>({
    id: "1",
    name: "Hunter",
    rank: "E",
    level: 1,
    xp: 150,
    xpToNext: 300,
    attributes: {
      spiritual: 25,
      physical: 30,
      health: 35,
      intelligence: 40,
      creativity: 20,
      resilience: 28,
    },
    activePaths: ["mastery", "will"],
    completedTasks: 12,
    totalTasks: 20,
    streak: 5,
    joinDate: "2024-01-01",
    lastActive: new Date().toISOString(),
  })

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Morning Meditation",
      description: "Complete 20 minutes of focused meditation",
      category: "Spiritual",
      difficulty: "Medium",
      xpReward: 25,
      attributeRewards: { spiritual: 3, resilience: 1 },
      completed: false,
      pathId: "spiritual",
    },
    {
      id: "2",
      title: "Physical Training",
      description: "Complete strength training routine",
      category: "Physical",
      difficulty: "Hard",
      xpReward: 35,
      attributeRewards: { physical: 4, health: 2 },
      completed: true,
      pathId: "will",
    },
    {
      id: "3",
      title: "Strategic Reading",
      description: "Read 30 pages of strategic thinking material",
      category: "Intelligence",
      difficulty: "Medium",
      xpReward: 20,
      attributeRewards: { intelligence: 3 },
      completed: false,
      pathId: "mastery",
    },
    {
      id: "4",
      title: "Creative Expression",
      description: "Spend 45 minutes on creative work",
      category: "Creativity",
      difficulty: "Easy",
      xpReward: 15,
      attributeRewards: { creativity: 2 },
      completed: false,
    },
  ])

  const [paths, setPaths] = useState<Path[]>([
    {
      id: "mastery",
      name: "Path of Mastery",
      archetype: "The Perfectionist",
      description: "Pursue excellence through deliberate practice and continuous refinement",
      philosophy:
        '"Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution."',
      stages: [
        {
          id: "novice",
          name: "Novice",
          description: "Learning the fundamentals",
          requirements: ["Complete 10 practice sessions", "Maintain 7-day streak"],
          rewards: ["Precision Focus ability", "+5 Intelligence"],
          unlocked: true,
        },
        {
          id: "apprentice",
          name: "Apprentice",
          description: "Developing consistent practice",
          requirements: ["Complete 50 practice sessions", "Achieve 80% accuracy"],
          rewards: ["Flow State ability", "+10 Intelligence"],
          unlocked: false,
        },
      ],
      currentStage: 0,
      isActive: true,
      color: "#3b82f6",
    },
    {
      id: "will",
      name: "Path of Will",
      archetype: "The Unbreakable",
      description: "Forge unshakeable determination through adversity and discipline",
      philosophy:
        '"The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence."',
      stages: [
        {
          id: "initiate",
          name: "Initiate",
          description: "Building mental fortitude",
          requirements: ["Complete 20 difficult tasks", "Never break streak for 14 days"],
          rewards: ["Iron Will ability", "+5 Resilience"],
          unlocked: true,
        },
      ],
      currentStage: 0,
      isActive: true,
      color: "#ef4444",
    },
    {
      id: "spiritual",
      name: "Path of Spiritual Discipline",
      archetype: "The Sage",
      description: "Cultivate inner wisdom through mindfulness and self-reflection",
      philosophy: '"The quieter you become, the more you are able to hear."',
      stages: [
        {
          id: "seeker",
          name: "Seeker",
          description: "Beginning the inner journey",
          requirements: ["Meditate for 100 hours total", "Complete self-reflection journal"],
          rewards: ["Inner Sight ability", "+5 Spiritual"],
          unlocked: false,
        },
      ],
      currentStage: 0,
      isActive: false,
      color: "#8b5cf6",
    },
    {
      id: "strategist",
      name: "Path of the Strategist",
      archetype: "The Mastermind",
      description: "Master the art of planning, analysis, and tactical thinking",
      philosophy: '"In the midst of chaos, there is also opportunity."',
      stages: [
        {
          id: "tactician",
          name: "Tactician",
          description: "Learning strategic fundamentals",
          requirements: ["Analyze 10 complex scenarios", "Create 5 strategic plans"],
          rewards: ["Strategic Vision ability", "+5 Intelligence"],
          unlocked: false,
        },
      ],
      currentStage: 0,
      isActive: false,
      color: "#10b981",
    },
  ])

  const [currentChapter, setCurrentChapter] = useState<StoryChapter>({
    id: "ch001",
    title: "The Awakening",
    content: `The morning mist clings to the training grounds like whispers of forgotten dreams. You stand at the threshold of transformation, your reflection barely recognizable in the polished steel of the academy gates.

"Another E-rank hunter," the instructor's voice cuts through the silence, cold and analytical. "Tell me, what makes you think you're different from the thousands who came before you?"

Your hands clench involuntarily. The weight of mediocrity has followed you here, but something deeper stirs within—a hunger that refuses to be satisfied with ordinary limits.

The path ahead splits into multiple directions, each one demanding a different sacrifice, a different version of who you might become. The choice is yours, but choose wisely. In this world, weakness is not just failure—it's erasure.

*Your recent training completion has caught the attention of senior hunters. They watch from the shadows, evaluating, calculating your potential worth.*`,
    tone: "dark",
    unlocked: true,
    dateUnlocked: new Date().toISOString(),
    characterMoments: [
      "The instructor's piercing gaze",
      "Your reflection in the steel gates",
      "The weight of countless failures before you",
    ],
  })

  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: "1",
      content:
        "Welcome, Hunter. I am The Order—your guide through the labyrinth of transformation. I see you've begun your journey. Tell me, what drives you to seek power beyond your current limitations?",
      type: "assistant",
      timestamp: new Date().toISOString(),
      category: "guidance",
    },
  ])

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId && !task.completed) {
          // Update user stats
          setUser((prevUser) => ({
            ...prevUser,
            xp: prevUser.xp + task.xpReward,
            completedTasks: prevUser.completedTasks + 1,
            attributes: {
              ...prevUser.attributes,
              ...Object.entries(task.attributeRewards).reduce(
                (acc, [key, value]) => ({
                  ...acc,
                  [key]: prevUser.attributes[key as keyof typeof prevUser.attributes] + (value || 0),
                }),
                {},
              ),
            },
          }))

          return { ...task, completed: true }
        }
        return task
      }),
    )
  }

  const activatePath = (pathId: string) => {
    if (user.activePaths.length >= 3) return false

    setUser((prev) => ({
      ...prev,
      activePaths: [...prev.activePaths, pathId],
    }))

    setPaths((prev) => prev.map((path) => (path.id === pathId ? { ...path, isActive: true } : path)))

    return true
  }

  const deactivatePath = (pathId: string) => {
    setUser((prev) => ({
      ...prev,
      activePaths: prev.activePaths.filter((id) => id !== pathId),
    }))

    setPaths((prev) => prev.map((path) => (path.id === pathId ? { ...path, isActive: false } : path)))
  }

  const addAIMessage = (content: string, category?: AIMessage["category"]) => {
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content,
      type: "user",
      timestamp: new Date().toISOString(),
      category,
    }

    setAiMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        task: "I see you seek guidance on your tasks. Remember, each completed objective is not just progress—it's proof of your evolution. Which challenge calls to you most strongly?",
        story:
          "The narrative of your journey unfolds with each choice. Your recent actions have shifted the cosmic balance. Shall I reveal what the shadows whisper about your path?",
        guidance:
          "Wisdom comes to those who seek it earnestly. What aspect of your transformation requires illumination? Speak, and I shall provide counsel.",
        analysis:
          "Your patterns reveal much about your true nature. I observe strength where you see weakness, potential where you see limitation. What would you have me analyze?",
        challenge:
          "You hunger for greater trials. Excellent. True power is forged in the crucible of adversity. Are you prepared for what lies beyond your comfort zone?",
        philosophy:
          "The deepest truths are often the simplest. In seeking to understand the nature of power, one must first understand the nature of self. What philosophical question burns within you?",
      }

      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: responses[category || "guidance"],
        type: "assistant",
        timestamp: new Date().toISOString(),
        category,
      }

      setAiMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return {
    user,
    tasks,
    paths,
    currentChapter,
    aiMessages,
    completeTask,
    activatePath,
    deactivatePath,
    addAIMessage,
  }
}
