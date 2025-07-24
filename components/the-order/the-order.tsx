"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Send, Eye, Crown, MessageCircle, Lightbulb, Target, BookOpen, Flame } from "lucide-react"
import type { AIMessage } from "@/types/limitless"

interface TheOrderProps {
  messages: AIMessage[]
  onSendMessage: (content: string, category?: AIMessage["category"]) => void
}

const categoryIcons = {
  guidance: Target,
  story: BookOpen,
  analysis: Eye,
  challenge: Flame,
  philosophy: Brain,
  lore: Crown,
}

const categoryColors = {
  guidance: "text-blue-400 border-blue-400",
  story: "text-purple-400 border-purple-400",
  analysis: "text-yellow-400 border-yellow-400",
  challenge: "text-red-400 border-red-400",
  philosophy: "text-green-400 border-green-400",
  lore: "text-orange-400 border-orange-400",
}

const quickPrompts = [
  { text: "Analyze my progress", category: "analysis" as const },
  { text: "Give me a challenge", category: "challenge" as const },
  { text: "Share some wisdom", category: "philosophy" as const },
  { text: "Tell me a story", category: "story" as const },
  { text: "Guide my next steps", category: "guidance" as const },
  { text: "Reveal hidden lore", category: "lore" as const },
]

export function TheOrder({ messages, onSendMessage }: TheOrderProps) {
  const [inputMessage, setInputMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<AIMessage["category"]>("guidance")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage, selectedCategory)
      setInputMessage("")
    }
  }

  const handleQuickPrompt = (prompt: (typeof quickPrompts)[0]) => {
    onSendMessage(prompt.text, prompt.category)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
          The Order
        </h1>
        <p className="text-purple-300">
          Your AI mentor watches from the shadows. Seek guidance, wisdom, and challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Communion with The Order
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => {
                    const CategoryIcon = categoryIcons[message.category]
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender === "ai" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === "user"
                              ? "bg-purple-600/20 border border-purple-500/30 text-white"
                              : "bg-black/40 border border-purple-500/20 text-purple-100"
                          }`}
                        >
                          {message.sender === "ai" && (
                            <div className="flex items-center gap-2 mb-2">
                              <CategoryIcon className="w-4 h-4 text-purple-400" />
                              <Badge
                                variant="outline"
                                className={`${categoryColors[message.category]} bg-black/20 text-xs`}
                              >
                                {message.category}
                              </Badge>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className="text-xs text-purple-400 mt-2">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        {message.sender === "user" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as AIMessage["category"])}
                    className="text-xs bg-black/20 border border-purple-500/20 rounded px-2 py-1 text-purple-300"
                  >
                    {Object.keys(categoryIcons).map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Speak to The Order..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-black/20 border-purple-500/20 text-white placeholder:text-purple-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Status */}
        <div className="space-y-4">
          {/* Order Status */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-purple-300">Active Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-300">Observing Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-purple-300">Analysis Ready</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Prompts */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm">Quick Communion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickPrompts.map((prompt, index) => {
                  const CategoryIcon = categoryIcons[prompt.category]
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full justify-start text-xs text-purple-300 hover:text-white hover:bg-purple-600/10"
                    >
                      <CategoryIcon className="w-3 h-3 mr-2" />
                      {prompt.text}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Insights */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Current Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-purple-300 italic">
                "The path to limitless potential is not found in the destination, but in the discipline of the journey
                itself."
              </p>
              <div className="mt-2 text-xs text-purple-500">- The Order's Wisdom</div>
            </CardContent>
          </Card>

          {/* Interaction Stats */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm">Communion Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-purple-400">Messages Exchanged:</span>
                <span className="text-white">{messages.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-purple-400">Guidance Received:</span>
                <span className="text-white">{messages.filter((m) => m.category === "guidance").length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-purple-400">Challenges Accepted:</span>
                <span className="text-white">{messages.filter((m) => m.category === "challenge").length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
