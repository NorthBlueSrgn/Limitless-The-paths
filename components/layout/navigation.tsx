"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Compass, BookOpen, Route, Brain, Database, Sword, TrendingUp, ScrollText, Zap, Crown } from "lucide-react"
import type { User } from "@/types/limitless"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  user: User
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Compass },
  { id: "chapter-black", label: "Chapter Black", icon: BookOpen },
  { id: "paths", label: "Paths", icon: Route },
  { id: "the-order", label: "The Order", icon: Brain },
  { id: "inner-core", label: "Inner Core", icon: Database },
  { id: "hunter-exam", label: "Hunter Exam", icon: Sword },
  { id: "advanced-stats", label: "Advanced Stats", icon: TrendingUp },
  { id: "chronicles", label: "Chronicles", icon: ScrollText },
]

const rankColors = {
  E: "text-gray-400",
  D: "text-green-400",
  C: "text-blue-400",
  B: "text-purple-400",
  A: "text-yellow-400",
  S: "text-orange-400",
  SS: "text-red-400",
  SSS: "text-pink-400",
}

export function Navigation({ activeTab, onTabChange, user }: NavigationProps) {
  const xpPercentage = (user.xp / user.xpToNext) * 100

  return (
    <div className="w-80 glass-card p-6 h-screen overflow-y-auto">
      {/* Hunter Status */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="rank-aura">
            <Crown className={`w-8 h-8 ${rankColors[user.rank]}`} />
          </div>
          <div>
            <h2 className="font-orbitron text-xl font-bold">{user.name}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${rankColors[user.rank]} border-current`}>
                Rank {user.rank}
              </Badge>
              <span className="text-sm text-muted-foreground">Level {user.level}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>XP Progress</span>
            <span>
              {user.xp}/{user.xpToNext}
            </span>
          </div>
          <Progress value={xpPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{user.streak}</div>
            <div className="text-muted-foreground">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{user.completedTasks}</div>
            <div className="text-muted-foreground">Tasks Done</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-12 ${
                isActive ? "neon-glow bg-primary/20 border border-primary/30" : ""
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.id === "chapter-black" && <Zap className="w-4 h-4 ml-auto text-yellow-400" />}
            </Button>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-black/20 rounded-lg border border-white/10">
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Active Paths</h3>
        <div className="space-y-2">
          {user.activePaths.slice(0, 3).map((pathId, index) => (
            <div key={pathId} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="capitalize">{pathId.replace("-", " ")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
