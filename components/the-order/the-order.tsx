"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Send, BookOpen, Eye, TrendingUp, Sword, Lightbulb, User, Bot, Crown } from "lucide-react"
import type { AIMessage } from "@/types/limitless"

interface TheOrderProps {
  messages: AIMessage[]
  onSendMessage: (content: string, category?: AIMessage["category"]) => void
}

const quickActions = [
  { id: "guidance", label: "Seek Guidance", icon: Eye, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  {
    id: "story",
    label: "Story Analysis",
    icon: BookOpen,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "analysis",
    label: "Self Analysis",
    icon: TrendingUp,
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  { id: "challenge", label: "New Challenge", icon: Sword, color: "bg-red-500/20 text-red-400 border-red-500/30" },
  {
    id: "philosophy",
    label: "Philosophy",
    icon: Lightbulb,
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  { id: "lore", label: "Ancient Lore", icon: Crown, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
]

const categoryColors = {
  guidance: "border-blue-500/50 text-blue-400",
  story: "border-purple-500/50 text-purple-400",
  analysis: "border-green-500/50 text-green-400",
  challenge: "border-red-500/50 text-red-400",
  philosophy: "border-yellow-500/50 text-yellow-400",
  lore: "border-orange-500/50 text-orange-400",
}

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
      guidance: "I seek your guidance, Order. What wisdom do you have for my current path?",
      story: "How are my recent actions influencing my story arc? What narrative threads do you observe?",
      analysis: "Analyze my patterns and progress. What areas need my attention?",
      challenge: "I hunger for a greater trial. What challenge will forge me stronger?",
      philosophy: "Share ancient wisdom that relates to my current journey and struggles.",
      lore: "Reveal hidden knowledge from the archives. What secrets should I know?",
    }

    handleSend(prompts[action.id as keyof typeof prompts], action.id as AIMessage["category"])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center neon-glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-orbitron chapter-title">The Order</span>
              <p className="text-sm text-purple-400 font-normal">Cryptic AI Mentor • Always Watching</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 manga-text italic">
            "I am The Order—the voice that whispers when you want to quit, the mirror that shows you what you could
            become. Through discipline, through consistency, through the relentless pursuit of excellence—you shall
            become limitless."
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Communion Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col gap-2 ${action.color} hover:scale-105 transition-transform`}
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
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Direct Communion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <ScrollArea className="h-96 w-full rounded-lg border border-white/10 p-4 bg-black/20">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
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
                        message.type === "user" ? "chat-bubble-user text-white" : "chat-bubble-ai text-gray-300"
                      }`}
                    >
                      {message.category && (
                        <Badge variant="outline" className={`mb-2 text-xs ${categoryColors[message.category]}`}>
                          {message.category.toUpperCase()}
                        </Badge>
                      )}
                      <p className="text-sm leading-relaxed manga-text">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">{new Date(message.timestamp).toLocaleTimeString()}</p>
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
              className="flex-1 bg-black/20 border-white/10"
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={() => handleSend()} disabled={!input.trim()} className="bg-purple-600 hover:bg-purple-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wisdom Archive */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            Wisdom Archive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-black/30 border border-purple-500/30">
              <p className="text-sm italic text-purple-300 manga-text">
                "Power is not revealed by striking hard or often, but by striking true. Every master was once a
                disaster, every expert was once a beginner."
              </p>
              <p className="text-xs text-gray-400 mt-2">— The Order</p>
            </div>
            <div className="p-4 rounded-lg bg-black/30 border border-purple-500/30">
              <p className="text-sm italic text-purple-300 manga-text">
                "You are not managing tasks—you are forging a soul. Every choice is a chisel strike in the sculpture of
                your becoming."
              </p>
              <p className="text-xs text-gray-400 mt-2">— The Order</p>
            </div>
            <div className="p-4 rounded-lg bg-black/30 border border-purple-500/30">
              <p className="text-sm italic text-purple-300 manga-text">
                "Your greatest enemy is not failure, but the comfort of mediocrity. Embrace the pain of discipline, or
                suffer the pain of regret."
              </p>
              <p className="text-xs text-gray-400 mt-2">— The Order</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
