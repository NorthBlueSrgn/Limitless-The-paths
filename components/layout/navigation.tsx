"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Map, Route, BookOpen, Archive, MessageCircle, Compass, BarChart3, Crown, Zap, Target } from "lucide-react"
import type { UserProfile, Path } from "@/types/limitless"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userProfile: UserProfile
  activePaths: Path[]
}

const tabs = [
  { id: "soul-map", label: "Soul Map", icon: Map },
  { id: "paths", label: "Paths", icon: Route },
  { id: "chapter-black", label: "Chapter Black", icon: BookOpen },
  { id: "archives", label: "Archives", icon: Archive },
  { id: "the-order", label: "The Order", icon: MessageCircle },
  { id: "labyrinth", label: "The Labyrinth", icon: Compass },
  { id: "advanced-stats", label: "Advanced Stats", icon: BarChart3 },
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

export function Navigation({ activeTab, onTabChange, userProfile, activePaths }: NavigationProps) {
  const xpProgress = (userProfile.currentXP / userProfile.nextRankXP) * 100

  return (
    <div className="w-80 bg-black/40 backdrop-blur-xl border-r border-purple-500/20 p-6 space-y-6">
      {/* User Profile */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-white">{userProfile.username}</h3>
              <p className="text-sm text-purple-300">{userProfile.title}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-400">Rank</span>
              <Badge className={`${rankColors[userProfile.rank]} bg-black/20 border-current`}>{userProfile.rank}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-400">Level</span>
              <span className="text-white font-bold">{userProfile.level}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-400">Streak</span>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-orange-400" />
                <span className="text-orange-400 font-bold">{userProfile.streak}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-400">XP Progress</span>
              <span className="text-white">
                {userProfile.currentXP}/{userProfile.nextRankXP}
              </span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>

          {userProfile.aura && (
            <div className="text-center p-2 bg-purple-900/20 rounded border border-purple-500/30">
              <p className="text-xs text-purple-300">Aura</p>
              <p className="text-sm font-bold text-purple-400">{userProfile.aura}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Active Paths */}
      {activePaths.length > 0 && (
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 p-4">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Route className="w-4 h-4" />
            Active Paths
          </h4>
          <div className="space-y-2">
            {activePaths.slice(0, 3).map((path) => (
              <div key={path.id} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: path.color }} />
                <span className="text-sm text-purple-300 truncate">{path.name}</span>
                <span className="text-xs text-purple-400 ml-auto">{path.progress}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Navigation Tabs */}
      <div className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                isActive
                  ? "bg-purple-600/30 text-white border border-purple-500/50"
                  : "text-purple-300 hover:text-white hover:bg-purple-600/10"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Quick Stats */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 p-4">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Quick Stats
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-purple-400">Total XP</span>
            <span className="text-white">{userProfile.totalXP.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-400">Active Paths</span>
            <span className="text-white">{activePaths.length}/3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-400">Join Date</span>
            <span className="text-white">{new Date(userProfile.joinDate).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
