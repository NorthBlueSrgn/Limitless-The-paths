"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Route, Brain, Database, TrendingUp, ScrollText, Zap, Crown, Map } from "lucide-react"
import type { UserProfile, Path } from "@/types/limitless"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userProfile: UserProfile
  activePaths: Path[]
}

const navigationItems = [
  { id: "soul-map", label: "Soul Map", icon: Map },
  { id: "paths", label: "Paths", icon: Route },
  { id: "chapter-black", label: "Chapter Black", icon: BookOpen },
  { id: "archives", label: "Archives", icon: ScrollText },
  { id: "the-order", label: "The Order", icon: Brain },
  { id: "labyrinth", label: "The Labyrinth", icon: Database },
  { id: "advanced-stats", label: "Advanced Stats", icon: TrendingUp },
]

const rankColors = {
  E: "text-gray-400 border-gray-400",
  D: "text-green-400 border-green-400",
  C: "text-blue-400 border-blue-400",
  B: "text-purple-400 border-purple-400",
  A: "text-yellow-400 border-yellow-400",
  S: "text-orange-400 border-orange-400",
  SS: "text-red-400 border-red-400",
  SSS: "text-pink-400 border-pink-400",
}

const rankGlow = {
  E: "shadow-gray-400/20",
  D: "shadow-green-400/20",
  C: "shadow-blue-400/20",
  B: "shadow-purple-400/20",
  A: "shadow-yellow-400/20",
  S: "shadow-orange-400/20",
  SS: "shadow-red-400/20",
  SSS: "shadow-pink-400/20",
}

export function Navigation({ activeTab, onTabChange, userProfile, activePaths }: NavigationProps) {
  const xpPercentage = (userProfile.currentXP / userProfile.nextRankXP) * 100

  return (
    <div className="w-80 min-h-screen bg-black/40 backdrop-blur-xl border-r border-purple-500/20 p-6 overflow-y-auto">
      {/* Hunter Status */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`relative p-2 rounded-full bg-gradient-to-br from-purple-600/20 to-black/40 border ${rankColors[userProfile.rank]} ${rankGlow[userProfile.rank]} shadow-lg`}
          >
            <Crown className={`w-8 h-8 ${rankColors[userProfile.rank].split(" ")[0]}`} />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-purple-600/10 animate-pulse"></div>
          </div>
          <div>
            <h2 className="font-orbitron text-xl font-bold text-white">{userProfile.username}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${rankColors[userProfile.rank]} bg-black/20 backdrop-blur-sm`}>
                Rank {userProfile.rank}
              </Badge>
              <span className="text-sm text-purple-300">Level {userProfile.level}</span>
            </div>
            {userProfile.title && <p className="text-xs text-purple-400 mt-1">{userProfile.title}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-purple-300">
            <span>XP Progress</span>
            <span>
              {userProfile.currentXP.toLocaleString()}/{userProfile.nextRankXP.toLocaleString()}
            </span>
          </div>
          <Progress value={xpPercentage} className="h-2 bg-black/40 border border-purple-500/20" />
          <div className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 h-0.5 opacity-60 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div className="text-center p-3 bg-black/20 rounded-lg border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-400">{userProfile.streak}</div>
            <div className="text-purple-300">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-lg border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-400">{userProfile.totalXP.toLocaleString()}</div>
            <div className="text-purple-300">Total XP</div>
          </div>
        </div>

        {userProfile.aura && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-900/20 to-black/20 rounded-lg border border-purple-500/20">
            <div className="text-xs text-purple-400 uppercase tracking-wide">Current Aura</div>
            <div className="text-sm font-medium text-white">{userProfile.aura}</div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2 mb-8">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-12 transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50 shadow-lg shadow-purple-500/20 text-white"
                  : "text-purple-300 hover:text-white hover:bg-purple-600/10 border border-transparent hover:border-purple-500/30"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.id === "chapter-black" && <Zap className="w-4 h-4 ml-auto text-yellow-400 animate-pulse" />}
            </Button>
          )
        })}
      </nav>

      {/* Active Paths */}
      <div className="p-4 bg-black/20 rounded-lg border border-purple-500/20">
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-purple-400">Active Paths</h3>
        <div className="space-y-2">
          {activePaths.slice(0, 3).map((path) => (
            <div key={path.id} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: path.color }}></div>
              <span className="text-purple-300 flex-1">{path.name}</span>
              <span className="text-xs text-purple-500">{path.progress}%</span>
            </div>
          ))}
          {activePaths.length === 0 && <p className="text-xs text-purple-500 italic">No active paths</p>}
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 p-3 bg-gradient-to-br from-black/40 to-purple-900/20 rounded-lg border border-purple-500/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-purple-400 uppercase tracking-wide">System Status</span>
        </div>
        <p className="text-xs text-purple-300">Chapter Black Protocol: Active</p>
        <p className="text-xs text-purple-300">The Order: Monitoring</p>
      </div>
    </div>
  )
}
