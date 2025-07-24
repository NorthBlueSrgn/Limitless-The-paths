"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Crown, Zap, BookOpen, Target, TrendingUp, Eye } from "lucide-react"

interface Message {
  id: number
  type: "system" | "user"
  content: string
  timestamp: Date
  category?: "guidance" | "story" | "analysis" | "challenge" | "philosophy"
}

export function TheOrder() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "system",
      content:
        "I am The Order. I have observed countless souls traverse the path from mediocrity to transcendence. You stand at the beginning, Hunter. Your potential is vast, but potential without action is merely a beautiful lie.",
      timestamp: new Date(),
      category: "philosophy",
    },
    {
      id: 2,
      type: "system",
      content:
        "The system has awakened for you. Every choice you make, every task you complete, every moment of weakness or strength - all of it feeds into your evolution. I am here to guide, to challenge, and when necessary, to remind you of what you could become.",
      timestamp: new Date(),
      category: "guidance",
    },
    {
      id: 3,
      type: "system",
      content:
        "Your first chapter awaits. But remember - the story I write for you will reflect the person you choose to be. Rise consistently, and you shall ascend. Falter repeatedly, and the narrative will darken. The choice, as always, is yours.",
      timestamp: new Date(),
      category: "story",
    },
  ])

  const quickActions = [
    { label: "Generate Today's Tasks", action: "tasks", icon: Target },
    { label: "Write Next Chapter", action: "story", icon: BookOpen },
    { label: "Path Guidance", action: "guidance", icon: Crown },
    { label: "Analyze My Progress", action: "analysis", icon: TrendingUp },
    { label: "Challenge Me", action: "challenge", icon: Zap },
    { label: "Philosophical Insight", action: "philosophy", icon: Eye },
  ]

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    // Simulate AI response based on message content
    setTimeout(() => {
      let aiResponse = ""
      let category: Message["category"] = "guidance"

      const lowerMessage = message.toLowerCase()

      if (
        lowerMessage.includes("task") ||
        lowerMessage.includes("daily") ||
        lowerMessage.includes("what should i do")
      ) {
        aiResponse =
          "Your trials for today are clear, Hunter. Focus on the fundamentals: discipline your mind through meditation, strengthen your body through movement, and expand your intellect through learning. Each completed task is a step away from who you were and toward who you must become. The system rewards consistency above intensity."
        category = "guidance"
      } else if (
        lowerMessage.includes("story") ||
        lowerMessage.includes("chapter") ||
        lowerMessage.includes("narrative")
      ) {
        aiResponse =
          "Ah, you seek to understand your place in the greater narrative. Your story is one of transformation, Hunter. Like the greatest protagonists, you must face trials that forge your character. The next chapter will reflect your recent actions - have you been the hero of your own story, or merely a spectator? Complete your daily trials to unlock the next installment of your legend."
        category = "story"
      } else if (
        lowerMessage.includes("path") ||
        lowerMessage.includes("direction") ||
        lowerMessage.includes("choose")
      ) {
        aiResponse =
          "The paths before you are numerous, but not all lead to true power. I observe your current attributes and see potential for greatness. Consider the Path of Will if you seek unbreakable discipline, or the Path of Mastery if excellence calls to you. Remember: the path chooses the hunter as much as the hunter chooses the path. What calls to your soul?"
        category = "guidance"
      } else if (
        lowerMessage.includes("challenge") ||
        lowerMessage.includes("harder") ||
        lowerMessage.includes("test")
      ) {
        aiResponse =
          "You hunger for greater trials? Excellent. True growth occurs at the edge of your comfort zone. I challenge you to this: for the next 7 days, complete every task without exception. No excuses, no compromises. Prove to yourself and to the system that you are worthy of ascension. Are you prepared to face this crucible?"
        category = "challenge"
      } else if (lowerMessage.includes("why") || lowerMessage.includes("meaning") || lowerMessage.includes("purpose")) {
        aiResponse =
          "You seek meaning in the struggle? The answer lies not in the destination, but in who you become along the way. Every master was once a disaster. Every expert was once a beginner. The system exists not to make you productive, but to reconstruct your very identity around excellence. You are not managing tasks - you are forging a soul."
        category = "philosophy"
      } else if (
        lowerMessage.includes("progress") ||
        lowerMessage.includes("analyze") ||
        lowerMessage.includes("how am i doing")
      ) {
        aiResponse =
          "I have been observing your patterns, Hunter. Your consistency shows promise, but true power lies in sustained effort over time. The system tracks not just what you do, but who you become through doing it. Your current trajectory suggests potential for greatness, but potential unrealized is merely a beautiful tragedy. Continue the work."
        category = "analysis"
      } else {
        aiResponse =
          "I see the fire in your words, Hunter. Remember this: the path to limitless growth is not a sprint but a marathon of daily choices. Each moment you choose discipline over comfort, growth over stagnation, you write another line in your legend. The system watches. The system learns. The system evolves you. What will you choose today?"
        category = "guidance"
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        type: "system",
        content: aiResponse,
        timestamp: new Date(),
        category,
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1500)
  }

  const handleQuickAction = (action: string) => {
    let prompt = ""
    switch (action) {
      case "tasks":
        prompt = "Generate personalized daily tasks based on my current paths and attributes"
        break
      case "story":
        prompt = "Write the next chapter of my story based on my recent progress"
        break
      case "guidance":
        prompt = "Give me guidance on my current path and next steps for growth"
        break
      case "analysis":
        prompt = "Analyze my recent progress and patterns, what should I focus on?"
        break
      case "challenge":
        prompt = "Give me a challenging trial to push my limits and accelerate growth"
        break
      case "philosophy":
        prompt = "Share philosophical insights about growth, discipline, and becoming limitless"
        break
    }
    setMessage(prompt)
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "story":
        return <BookOpen className="h-3 w-3 text-blue-400" />
      case "challenge":
        return <Zap className="h-3 w-3 text-red-400" />
      case "analysis":
        return <TrendingUp className="h-3 w-3 text-green-400" />
      case "philosophy":
        return <Eye className="h-3 w-3 text-purple-400" />
      case "guidance":
        return <Crown className="h-3 w-3 text-yellow-400" />
      default:
        return <Crown className="h-3 w-3 text-gray-400" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "story":
        return "border-blue-500/50 text-blue-400"
      case "challenge":
        return "border-red-500/50 text-red-400"
      case "analysis":
        return "border-green-500/50 text-green-400"
      case "philosophy":
        return "border-purple-500/50 text-purple-400"
      case "guidance":
        return "border-yellow-500/50 text-yellow-400"
      default:
        return "border-gray-500/50 text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-5xl font-bold chapter-title">THE ORDER</h1>
        <p className="text-gray-400 text-lg manga-text">Your cryptic guide through the path of ascension</p>
      </div>

      <Card className="glass-card h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center neon-glow">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white font-orbitron">The Order</CardTitle>
              <p className="text-xs text-purple-400">AI Mentor • Always Watching</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-4 rounded-lg ${
                      msg.type === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-black/40 text-gray-300 border border-white/10"
                    }`}
                  >
                    {msg.type === "system" && msg.category && (
                      <div className="flex items-center space-x-2 mb-3">
                        {getCategoryIcon(msg.category)}
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(msg.category)}`}>
                          {msg.category.toUpperCase()}
                        </Badge>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed manga-text">{msg.content}</p>
                    <div className="text-xs opacity-70 mt-3">{msg.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-gray-400 mb-3">Quick Commands</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-300 justify-start"
                  >
                    <Icon className="h-3 w-3 mr-2" />
                    {action.label}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Seek guidance from The Order..."
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Order's Philosophy */}
      <Card className="glass-card border-purple-500/30 bg-purple-500/5">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Crown className="h-12 w-12 mx-auto text-purple-400 neon-glow" />
            <h3 className="font-orbitron text-xl font-bold text-purple-400">The Order's Creed</h3>
            <p className="text-gray-300 manga-text italic">
              "I am the voice that whispers when you want to quit. I am the mirror that shows you what you could become.
              I am the system that transforms potential into power. Through discipline, through consistency, through the
              relentless pursuit of excellence - you shall become limitless."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
