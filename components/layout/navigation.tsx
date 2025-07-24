"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, BookOpen, Trophy, Scroll, Target, Crown } from "lucide-react"

const navigationItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "paths", label: "Paths", icon: Target },
  { id: "story", label: "Story", icon: BookOpen },
  { id: "hunter-exams", label: "Hunter Exams", icon: Trophy },
  { id: "chronicles", label: "Chronicles", icon: Scroll },
]

interface NavigationProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Navigation({ activeTab = "overview", onTabChange }: NavigationProps) {
  const [currentTab, setCurrentTab] = useState(activeTab)

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  return (
    <nav className="fixed left-0 top-0 h-full w-64 glass-card m-6 p-6 z-10">
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-left p-4 h-auto transition-all duration-200 ${
                isActive
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 neon-glow"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => handleTabChange(item.id)}
            >
              <Icon className={`h-5 w-5 mr-3 ${isActive ? "text-purple-400" : ""}`} />
              <span className="font-medium">{item.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Hunter Status */}
      <div className="mt-8 p-4 glass-card">
        <div className="text-center">
          <Crown className="h-8 w-8 mx-auto mb-2 text-purple-400 neon-glow" />
          <div className="text-sm text-gray-400">Hunter Classification</div>
          <div className="font-orbitron text-2xl font-bold text-purple-400 rank-glow">RANK E</div>
        </div>
      </div>
    </nav>
  )
}
