"use client"

import { useState, useRef, useEffect } from "react"
import { Brain, Eye, Crown, Target, BookOpen, Flame } from "lucide-react"
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
  }, [messages\
