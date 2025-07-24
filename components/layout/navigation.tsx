"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Compass, BookOpen, Target, MessageSquare, Scroll, Sword, TrendingUp, FileText, Crown } from "lucide-react"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Compass, emoji: "🧭" },
  { id: "chapter-black", label: "Chapter Black", icon: BookOpen, emoji: "📚" },
  { id: "paths", label: "Paths", icon: Target, emoji: "🔮" },
  { id: "the-order", label: "The Order", icon: MessageSquare, emoji: "🧠" },
  { id: "inner-core", label: "Inner Core", icon: Scroll, emoji: "🧾" },
  { id: "hunter-exam", label: "Hunter Exam", icon: Sword, emoji: "⚔️" },
  { id: "advanced-stats", label: "Advanced Stats", icon: TrendingUp, emoji: "📈" },
  { id: "chronicles", label: "Chronicles", icon: FileText, emoji: "📖" },
]

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userProfile?: any
}

export function Navigation({ activeTab, onTabChange, userProfile }: NavigationProps) {
  return (
    <nav className="fixed left-0 top-0 h-full w-72 glass-card m-6 p-6 z-10">
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-left p-4 h-auto transition-all duration-200 ${
                isActive
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 neon-glow"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="text-lg mr-3">{item.emoji}</span>
              <Icon className={`h-4 w-4 mr-3 ${isActive ? "text-purple-400" : ""}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Hunter Status */}
      <div className="mt-8 p-4 glass-card pulse-glow">
        <div className="text-center">
          <div className="rank-aura w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Crown className="h-8 w-8 text-white float-animation" />
          </div>
          <div className="text-sm text-gray-400">Hunter Classification</div>
          <div className="font-orbitron text-2xl font-bold text-purple-400 rank-glow">
            RANK {userProfile?.rank || "E"}
          </div>
          <div className="text-xs text-gray-500 mt-1">{userProfile?.title || "Unranked Hunter"}</div>
          <Badge variant="outline" className="mt-2 border-purple-500/50 text-purple-400 text-xs">
            {userProfile?.aura || "Dormant"}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 p-3 glass-card">
        <div className="text-xs text-gray-400 mb-2">Today's Progress</div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Tasks</span>
            <span className="text-purple-400">0/3</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Streak</span>
            <span className="text-orange-400">{userProfile?.streak || 0} days</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">XP</span>
            <span className="text-green-400">{userProfile?.currentXP || 0}</span>
          </div>
        </div>
      </div>

      {/* Chapter Black Notification */}
      <div className="mt-4 p-3 glass-card border-blue-500/30 bg-blue-500/5">
        <div className="text-center">
          <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-400" />
          <div className="text-xs text-blue-400 font-medium">New Chapter Available</div>
          <div className="text-xs text-gray-400 mt-1">Complete 60% of tasks to unlock</div>
        </div>
      </div>
    </nav>
  )
}
