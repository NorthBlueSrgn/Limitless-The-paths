"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { X, Send, Crown, Zap, Brain, Sparkles, Target, TrendingUp, Lightbulb, Star, Flame, Eye } from "lucide-react"

interface TheOrderProps {
  isOpen: boolean
  onClose: () => void
  userProfile: any
  userProgress: any
}

interface Message {
  id: number
  type: "system" | "user"
  content: string
  timestamp: Date
  personality?: string
  suggestions?: string[]
  nextActions?: string[]
  insights?: string[]
  mood?: string
  sessionType?: string
}

const AI_PERSONALITIES = {
  "The Order": {
    icon: Crown,
    color: "from-purple-600 to-blue-600",
    description: "Ancient Wisdom",
  },
  "The Catalyst": {
    icon: Flame,
    color: "from-red-500 to-orange-500",
    description: "High Energy Coach",
  },
  "The Philosopher": {
    icon: Brain,
    color: "from-indigo-600 to-purple-600",
    description: "Deep Thinker",
  },
  "The Chronicler": {
    icon: Sparkles,
    color: "from-emerald-600 to-teal-600",
    description: "Story Weaver",
  },
}

export function TheOrder({ isOpen, onClose, userProfile, userProgress }: TheOrderProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "system",
      content: `Welcome, ${userProfile?.username || "Seeker"}. I am The Order, your guide through the infinite paths of growth. I have witnessed countless souls transform from mere potential into legends of their own making.`,
      timestamp: new Date(),
      personality: "The Order",
      insights: ["Your journey begins with a single step", "Every master was once a beginner"],
    },
    {
      id: 2,
      type: "system",
      content: `Your current essence resonates at Level ${userProfile?.level || 1}, with ${userProfile?.totalXP || 0} XP flowing through your being. I sense great potential within you. What aspect of your growth calls to you most strongly today?`,
      timestamp: new Date(),
      personality: "The Order",
      suggestions: ["Explore your weakest areas", "Build on your strengths", "Seek new challenges"],
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPersonality, setCurrentPersonality] = useState("The Order")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    {
      label: "Generate Tasks",
      action: "Generate 3 personalized tasks for my current level and goals",
      icon: Target,
      category: "planning",
    },
    {
      label: "Story Chapter",
      action: "Tell me the next chapter of my heroic journey",
      icon: Sparkles,
      category: "story",
    },
    {
      label: "Growth Analysis",
      action: "Analyze my recent progress and suggest optimizations",
      icon: TrendingUp,
      category: "analysis",
    },
    {
      label: "Wisdom Seeking",
      action: "Share deep wisdom about personal transformation",
      icon: Lightbulb,
      category: "philosophy",
    },
    {
      label: "Motivation Boost",
      action: "I need motivation to push through current challenges",
      icon: Flame,
      category: "motivation",
    },
    {
      label: "Reflection Guide",
      action: "Help me reflect on my recent experiences and growth",
      icon: Eye,
      category: "reflection",
    },
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          userProfile,
          userProgress,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: messages.length + 2,
        type: "system",
        content: data.message,
        timestamp: new Date(),
        personality: data.personality,
        suggestions: data.suggestions,
        nextActions: data.nextActions,
        insights: data.insights,
        mood: data.context?.mood,
        sessionType: data.context?.sessionType,
      }

      setMessages((prev) => [...prev, aiMessage])
      setCurrentPersonality(data.personality || "The Order")
    } catch (error) {
      console.error("Failed to fetch AI response:", error)

      const errorMessage: Message = {
        id: messages.length + 2,
        type: "system",
        content: `The digital veil flickers, ${userProfile?.username || "Seeker"}. Even The Order faces moments of interference. Your dedication to the path remains unwavering, and wisdom will flow again shortly.`,
        timestamp: new Date(),
        personality: "The Order",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setMessage(action)
  }

  const getPersonalityIcon = (personality?: string) => {
    const personalityData =
      AI_PERSONALITIES[personality as keyof typeof AI_PERSONALITIES] || AI_PERSONALITIES["The Order"]
    const IconComponent = personalityData.icon
    return <IconComponent className="h-3 w-3" />
  }

  const getPersonalityColor = (personality?: string) => {
    const personalityData =
      AI_PERSONALITIES[personality as keyof typeof AI_PERSONALITIES] || AI_PERSONALITIES["The Order"]
    return personalityData.color
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-6 top-24 bottom-6 w-[420px] z-30">
      <Card className="glass-card h-full flex flex-col border-white/20 shadow-2xl">
        <CardHeader className="flex-shrink-0 border-b border-white/10 bg-gradient-to-r from-black/40 to-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 bg-gradient-to-r ${getPersonalityColor(currentPersonality)} rounded-xl flex items-center justify-center neon-glow shadow-lg`}
              >
                {getPersonalityIcon(currentPersonality)}
              </div>
              <div>
                <CardTitle className="text-white font-orbitron text-lg">{currentPersonality}</CardTitle>
                <p className="text-xs text-purple-400">
                  {AI_PERSONALITIES[currentPersonality as keyof typeof AI_PERSONALITIES]?.description} • Online
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Status Bar */}
          <div className="flex items-center justify-between mt-3 p-2 bg-black/20 rounded-lg">
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-gray-300">
                <Star className="h-3 w-3 inline mr-1" />
                Level {userProfile?.level || 1}
              </span>
              <span className="text-purple-400">{userProfile?.totalXP || 0} XP</span>
              <span className="text-green-400">{userProfile?.streak || 0} day streak</span>
            </div>
            <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
              {userProfile?.rank || "Initiate"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${msg.type === "user" ? "" : "space-y-3"}`}>
                    <div
                      className={`p-4 rounded-xl ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : "bg-black/40 text-gray-300 border border-white/10 shadow-lg"
                      }`}
                    >
                      {msg.type === "system" && msg.personality && (
                        <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-white/10">
                          <div
                            className={`w-5 h-5 bg-gradient-to-r ${getPersonalityColor(msg.personality)} rounded-md flex items-center justify-center`}
                          >
                            {getPersonalityIcon(msg.personality)}
                          </div>
                          <span className="text-xs font-medium text-purple-300">{msg.personality}</span>
                          {msg.mood && (
                            <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-300">
                              {msg.mood}
                            </Badge>
                          )}
                        </div>
                      )}

                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                      <div className="text-xs opacity-70 mt-3 text-right">{msg.timestamp.toLocaleTimeString()}</div>
                    </div>

                    {/* Enhanced Message Metadata */}
                    {msg.type === "system" && (msg.suggestions || msg.nextActions || msg.insights) && (
                      <div className="space-y-2 ml-2">
                        {msg.insights && msg.insights.length > 0 && (
                          <div className="p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20">
                            <div className="flex items-center space-x-1 mb-2">
                              <Lightbulb className="h-3 w-3 text-blue-400" />
                              <span className="text-xs font-medium text-blue-300">Insights</span>
                            </div>
                            <div className="space-y-1">
                              {msg.insights.map((insight, idx) => (
                                <p key={idx} className="text-xs text-blue-200 leading-relaxed">
                                  • {insight}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="p-3 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-500/20">
                            <div className="flex items-center space-x-1 mb-2">
                              <Target className="h-3 w-3 text-green-400" />
                              <span className="text-xs font-medium text-green-300">Suggestions</span>
                            </div>
                            <div className="space-y-1">
                              {msg.suggestions.map((suggestion, idx) => (
                                <p key={idx} className="text-xs text-green-200 leading-relaxed">
                                  • {suggestion}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {msg.nextActions && msg.nextActions.length > 0 && (
                          <div className="p-3 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg border border-orange-500/20">
                            <div className="flex items-center space-x-1 mb-2">
                              <Zap className="h-3 w-3 text-orange-400" />
                              <span className="text-xs font-medium text-orange-300">Next Actions</span>
                            </div>
                            <div className="space-y-1">
                              {msg.nextActions.map((action, idx) => (
                                <p key={idx} className="text-xs text-orange-200 leading-relaxed">
                                  • {action}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-4 bg-black/40 border border-white/10 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-purple-300">{currentPersonality} is contemplating...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Enhanced Quick Actions */}
          <div className="p-4 border-t border-white/10 bg-gradient-to-r from-black/20 to-black/10">
            <div className="text-xs text-gray-400 mb-3 font-medium">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon
                return (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-300 hover:bg-purple-500/10 transition-all duration-200 flex items-center space-x-1 h-8"
                    disabled={isLoading}
                  >
                    <IconComponent className="h-3 w-3" />
                    <span>{action.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Enhanced Input Area */}
          <div className="p-4 border-t border-white/10 bg-gradient-to-r from-black/30 to-black/20">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Seek guidance from ${currentPersonality}...`}
                className="bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                disabled={isLoading || !message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">Press Enter to send • Shift+Enter for new line</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
