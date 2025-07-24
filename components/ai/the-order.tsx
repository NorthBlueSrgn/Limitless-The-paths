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

  // NEW async function to send message to your API
  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: message,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    try {
      // Call your backend API route with the user message
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      const aiReply = data.reply || "Sorry, no response from AI."

      // Categorize AI response roughly by keywords — adjust if needed
      let category: Message["category"] = "guidance"
      if (aiReply.toLowerCase().includes("task")) category = "task"
      else if (aiReply.toLowerCase().includes("story")) category = "story"
      else if (aiReply.toLowerCase().includes("path")) category = "guidance"
      else if (aiReply.toLowerCase().includes("strength") || aiReply.toLowerCase().includes("progress")) category = "analysis"

      const aiMessage: Message = {
        id: messages.length + 2,
        type: "system",
        content: aiReply,
        timestamp: new Date(),
        category,
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Failed to fetch AI response:", error)
      const errorMessage: Message = {
        id: messages.length + 2,
        type: "system",
        content: "Failed to get response from AI. Please try again later.",
        timestamp: new Date(),
        category: "analysis",
      }
      setMessages((prev) => [...prev, errorMessage])
    }
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
