"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Send, Target, BookOpen, Eye, TrendingUp, Sword, Lightbulb, User, Bot } from "lucide-react"
import type { AIMessage } from "@/types/limitless"

interface TheOrderProps {
  messages: AIMessage[]
  onSendMessage: (content: string, category?: AIMessage["category"]) => void
}

const quickActions = [
  { id: "task", label: "Task Guidance", icon: Target, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  {
    id: "story",
    label: "Story Insight",
    icon: BookOpen,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  { id: "guidance", label: "Life Guidance", icon: Eye, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  {
    id: "analysis",
    label: "Self Analysis",
    icon: TrendingUp,
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  { id: "challenge", label: "New Challenge", icon: Sword, color: "bg-red-500/20 text-red-400 border-red-500/30" },
  {
    id: "philosophy",
    label: "Philosophy",
    icon: Lightbulb,
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
]

export function TheOrder({ messages, onSendMessage }: TheOrderProps) {
  const [input, setInput] = useState("")

  const handleSend = (content?: string, category?: AIMessage["category"]) => {
    const messageContent = content || input
    if (!messageContent.trim()) return

    onSendMessage(messageContent, category)
    setInput("")
  }

  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    const prompts = {
      task: "What tasks should I focus on today to maximize my growth?",
      story: "How are my recent actions influencing my story arc?",
      guidance: "I need guidance on my current path. What wisdom can you share?",
      analysis: "Analyze my recent patterns and suggest improvements.",
      challenge: "Give me a challenge that will push my limits.",
      philosophy: "Share a philosophical insight that relates to my journey.",
    }

    handleSend(prompts[action.id as keyof typeof prompts], action.id as AIMessage["category"])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-orbitron">The Order</span>
            <Badge variant="outline" className="text-xs">
              AI Guide
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            I am The Order—your cryptic guide through the labyrinth of transformation. I observe, analyze, and provide
            counsel as you forge your path to transcendence.
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Quick Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col gap-2 ${action.color}`}
                  onClick={() => handleQuickAction(action)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Communion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <ScrollArea className="h-96 w-full rounded-lg border border-white/10 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === "user" ? "bg-primary/20 text-primary" : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-primary/20 text-primary-foreground"
                          : "bg-black/40 border border-white/10"
                      }`}
                    >
                      {message.category && (
                        <Badge variant="outline" className="mb-2 text-xs">
                          {message.category}
                        </Badge>
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak your thoughts to The Order..."
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={() => handleSend()} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wisdom Archive */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Wisdom Archive</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-black/30 border border-white/10">
              <p className="text-sm italic text-primary">
                "Power is not revealed by striking hard or often, but by striking true."
              </p>
              <p className="text-xs text-muted-foreground mt-1">— The Order</p>
            </div>
            <div className="p-3 rounded-lg bg-black/30 border border-white/10">
              <p className="text-sm italic text-primary">
                "The path to mastery is not a destination, but a way of traveling."
              </p>
              <p className="text-xs text-muted-foreground mt-1">— The Order</p>
            </div>
            <div className="p-3 rounded-lg bg-black/30 border border-white/10">
              <p className="text-sm italic text-primary">
                "Your greatest enemy is not failure, but the comfort of mediocrity."
              </p>
              <p className="text-xs text-muted-foreground mt-1">— The Order</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
