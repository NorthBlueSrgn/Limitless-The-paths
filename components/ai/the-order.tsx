"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, MessageSquare, Crown, Zap } from "lucide-react"

interface TheOrderProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: number
  type: "system" | "user"
  content: string
  timestamp: Date
  category?: "story" | "guidance" | "task" | "analysis"
}

export function TheOrder({ isOpen, onClose }: TheOrderProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "system",
      content:
        "Welcome, Hunter. I am The Order, your guide through the path of limitless growth. I have watched countless souls ascend from the depths of mediocrity to the heights of transcendence.",
      timestamp: new Date(),
      category: "guidance",
    },
    {
      id: 2,
      type: "system",
      content:
        "Your journey begins now. Each choice you make, each task you complete, each moment of reflection - all of it shapes the hunter you will become. Tell me, what drives you to seek power?",
      timestamp: new Date(),
      category: "story",
    },
  ])

  const quickActions = [
    { label: "Generate Daily Tasks", action: "tasks" },
    { label: "Story Chapter", action: "story" },
    { label: "Path Guidance", action: "guidance" },
    { label: "Analyze Progress", action: "analysis" },
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

      if (message.toLowerCase().includes("task") || message.toLowerCase().includes("quest")) {
        aiResponse =
          "I sense your hunger for challenge. Very well. Today, you must prove your dedication through focused action. Complete your meditation practice, engage in strategic thinking, and document your insights. Each task completed brings you closer to your next evolution."
        category = "task"
      } else if (message.toLowerCase().includes("story") || message.toLowerCase().includes("chapter")) {
        aiResponse =
          "Ah, you seek to understand your narrative. Your story is one of transformation, Hunter. Like the protagonists of old, you must face trials that forge your character. The next chapter awaits your actions - complete 60% of today's tasks to unlock it."
        category = "story"
      } else if (message.toLowerCase().includes("path") || message.toLowerCase().includes("direction")) {
        aiResponse =
          "The paths before you are numerous, but not all lead to true power. Focus on consistency over intensity. Choose paths that challenge your weaknesses, not just amplify your strengths. A true hunter masters all aspects of their being."
        category = "guidance"
      } else {
        aiResponse =
          "I see the fire in your words, Hunter. Remember, true strength comes not from avoiding failure, but from rising each time you fall. Your current rank is merely a starting point - your potential is limitless."
        category = "analysis"
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
        prompt = "Generate personalized daily tasks for me"
        break
      case "story":
        prompt = "Tell me about my current story chapter"
        break
      case "guidance":
        prompt = "Give me guidance on my current path"
        break
      case "analysis":
        prompt = "Analyze my recent progress and patterns"
        break
    }
    setMessage(prompt)
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "story":
        return <Crown className="h-3 w-3 text-purple-400" />
      case "task":
        return <Zap className="h-3 w-3 text-yellow-400" />
      case "analysis":
        return <MessageSquare className="h-3 w-3 text-blue-400" />
      default:
        return <MessageSquare className="h-3 w-3 text-green-400" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-6 top-24 bottom-6 w-96 z-30">
      <Card className="glass-card h-full flex flex-col">
        <CardHeader className="flex-shrink-0 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center neon-glow">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-white font-orbitron">The Order</CardTitle>
                <p className="text-xs text-purple-400">AI Mentor • Online</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-black/40 text-gray-300 border border-white/10"
                    }`}
                  >
                    {msg.type === "system" && msg.category && (
                      <div className="flex items-center space-x-1 mb-2 opacity-70">
                        {getCategoryIcon(msg.category)}
                        <span className="text-xs capitalize">{msg.category}</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className="text-xs opacity-70 mt-2">{msg.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-gray-400 mb-2">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action) => (
                <Button
                  key={action.action}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.action)}
                  className="text-xs border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-300"
                >
                  {action.label}
                </Button>
              ))}
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
    </div>
  )
}
