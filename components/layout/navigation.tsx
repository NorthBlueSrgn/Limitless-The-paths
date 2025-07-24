"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, BookOpen, Trophy, Scroll, Target, Crown, TrendingUp, Settings } from "lucide-react"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "paths", label: "Paths", icon: Target },
  { id: "story", label: "Limitless: Chapter Series", icon: BookOpen },
  { id: "inner-core", label: "Inner Core", icon: Scroll },
  { id: "hunter-exam", label: "Hunter Exam", icon: Trophy },
  { id: "advanced-stats", label: "Advanced Stats", icon: TrendingUp },
  { id: "settings", label: "Settings", icon: Settings },
]

interface NavigationProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Navigation({ activeTab = "dashboard", onTabChange }: NavigationProps) {
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
              <span className="font-medium text-sm">{item.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Hunter Status */}
      <div className="mt-8 p-4 glass-card pulse-glow">
        <div className="text-center">
          <Crown className="h-8 w-8 mx-auto mb-2 text-purple-400 neon-glow float-animation" />
          <div className="text-sm text-gray-400">Hunter Classification</div>
          <div className="font-orbitron text-2xl font-bold text-purple-400 rank-glow">RANK E</div>
          <div className="text-xs text-gray-500 mt-1">Novice Hunter</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 p-3 glass-card">
        <div className="text-xs text-gray-400 mb-2">Today's Progress</div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Tasks</span>
            <span className="text-purple-400">0/0</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Streak</span>
            <span className="text-orange-400">0 days</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
