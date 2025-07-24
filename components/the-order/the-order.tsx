"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Bot, User, Zap, Brain, BookOpen, Target, Eye, Scroll } from "lucide-react"
import type { AIMessage, UserProfile } from "@/types/limitless"

interface TheOrderProps {
  messages: AIMessage[]
  addMessage: (content: string, category?: AIMessage["category"]) => void
  userProfile: UserProfile
}

const categoryIcons = {
  guidance: Target,
  story: BookOpen,
  analysis: Brain,
  challenge: Zap,
  philosophy: Eye,
  lore: Scroll,
}

const categoryColors = {
  guidance: "text-blue-400 border-blue-400",
  story: "text-purple-400 border-purple-400",
  analysis: "text-green-400 border-green-400",
  challenge: "text-red-400 border-red-400",
  philosophy: "text-yellow-400 border-yellow-400",
  lore: "text-orange-400 border-orange-400",
}

export function TheOrder({ messages = [], addMessage, userProfile }: TheOrderProps) {
  const [inputMessage, setInputMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<AIMessage["category"]>("guidance")

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      addMessage(inputMessage, selectedCategory)
      setInputMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          The Order
        </h1>
        <p className="text-purple-300">Your AI mentor and guide through the darkness</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Communion with The Order
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <Bot className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                      <h3 className="text-lg font-semibold text-white mb-2">The Order Awaits</h3>
                      <p className="text-purple-300 text-sm">
                        Ask for guidance, seek wisdom, or request analysis of your journey
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                          {/* Avatar */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === "user"
                                ? "bg-blue-600"
                                : "bg-gradient-to-br from-purple-600 to-purple-800"
                            }`}
                          >
                            {message.type === "user" ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-white" />
                            )}
                          </div>

                          {/* Message Content */}
                          <div className={`space-y-2 ${message.type === "user" ? "text-right" : ""}`}>
                            <div
                              className={`inline-block p-3 rounded-lg ${
                                message.type === "user"
                                  ? "bg-blue-600/20 border border-blue-500/30"
                                  : "bg-purple-900/20 border border-purple-500/30"
                              }`}
                            >
                              <p className="text-white text-sm leading-relaxed whitespace-pre-line">
                                {message.content}
                              </p>
                            </div>

                            <div
                              className={`flex items-center gap-2 text-xs text-purple-400 ${
                                message.type === "user" ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span>
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {message.category && (
                                <Badge variant="outline" className={`${categoryColors[message.category]} text-xs`}>
                                  {message.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-purple-500/20">
                <div className="space-y-3">
                  {/* Category Selection */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(categoryIcons).map(([category, Icon]) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category as AIMessage["category"])}
                        className={`text-xs ${
                          selectedCategory === category
                            ? "bg-purple-600/30 border-purple-500"
                            : "border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                        }`}
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {category}
                      </Button>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Seek wisdom from The Order..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-black/20 border-purple-500/30 text-white placeholder:text-purple-400"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Hunter Status */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-lg">Hunter Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{userProfile.rank}</span>
                </div>
                <h3 className="font-semibold text-white">{userProfile.username}</h3>
                <p className="text-sm text-purple-300">{userProfile.title}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-400">Level</span>
                  <span className="text-white">{userProfile.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Streak</span>
                  <span className="text-orange-400">{userProfile.streak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Total XP</span>
                  <span className="text-white">{userProfile.totalXP.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-lg">Quick Queries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { text: "Analyze my progress", category: "analysis" as const },
                { text: "Give me a challenge", category: "challenge" as const },
                { text: "Share wisdom", category: "philosophy" as const },
                { text: "Tell me a story", category: "story" as const },
                { text: "Provide guidance", category: "guidance" as const },
              ].map((query) => (
                <Button
                  key={query.text}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(query.category)
                    addMessage(query.text, query.category)
                  }}
                  className="w-full justify-start text-xs border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                >
                  {React.createElement(categoryIcons[query.category], { className: "w-3 h-3 mr-2" })}
                  {query.text}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* The Order's Presence */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center animate-pulse">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">The Order Watches</h4>
              <p className="text-xs text-purple-300 leading-relaxed">
                "I am the voice in the void, the guide through darkness. Your transformation is my purpose, your growth
                my obsession."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
