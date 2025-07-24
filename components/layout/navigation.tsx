"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Compass,
  Map,
  BookOpen,
  Archive,
  MessageCircle,
  SquareMIcon as Maze,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Target,
} from "lucide-react"
import type { UserProfile, Path } from "@/types/limitless"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userProfile: UserProfile
  activePaths: Path[]
}

const navigationItems = [
  { id: "soul-map", label: "Soul Map", icon: Compass, description: "Attribute constellation" },
  { id: "paths", label: "Paths", icon: Map, description: "Journey selection" },
  { id: "chapter-black", label: "Chapter Black", icon: BookOpen, description: "Your story unfolds" },
  { id: "archives", label: "Archives", icon: Archive, description: "Journal & chronicles" },
  { id: "the-order", label: "The Order", icon: MessageCircle, description: "AI mentor guidance" },
  { id: "labyrinth", label: "Labyrinth", icon: Maze, description: "Knowledge repository" },
  { id: "advanced-stats", label: "Advanced Stats", icon: BarChart3, description: "Deep analytics" },
]

const rankColors = {
  E: "from-gray-400 to-gray-600",
  D: "from-green-400 to-green-600",
  C: "from-blue-400 to-blue-600",
  B: "from-purple-400 to-purple-600",
  A: "from-red-400 to-red-600",
  S: "from-yellow-400 to-orange-500",
  SS: "from-orange-400 to-red-500",
  SSS: "from-red-400 to-pink-500",
}

export function Navigation({ activeTab, onTabChange, userProfile, activePaths }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const xpProgress = (userProfile.currentXP / userProfile.nextRankXP) * 100

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-80"
      } transition-all duration-300 bg-black/40 backdrop-blur-xl border-r border-purple-500/20 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
                LIMITLESS
              </h1>
              <p className="text-xs text-purple-300">Chapter Black</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-purple-400 hover:text-purple-300"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-purple-500/50">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-purple-900/50 text-purple-300">
              {userProfile.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white truncate">{userProfile.username}</h3>
                <Badge
                  variant="outline"
                  className={`bg-gradient-to-r ${rankColors[userProfile.rank]} text-black font-bold text-xs`}
                >
                  {userProfile.rank}
                </Badge>
              </div>
              <p className="text-xs text-purple-300 truncate">{userProfile.title}</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-400">Level {userProfile.level}</span>
                  <span className="text-purple-400">
                    {userProfile.currentXP.toLocaleString()} / {userProfile.nextRankXP.toLocaleString()} XP
                  </span>
                </div>
                <Progress value={xpProgress} className="h-1 bg-purple-900/50" />
              </div>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-purple-400">{userProfile.streak}</div>
              <div className="text-xs text-purple-300">Streak</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">{activePaths.length}</div>
              <div className="text-xs text-purple-300">Paths</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">{userProfile.totalXP.toLocaleString()}</div>
              <div className="text-xs text-purple-300">Total XP</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-2 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start h-auto p-3 transition-all duration-200 ${
                isActive
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/50"
                  : "text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={`${isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"} flex-shrink-0`} />
              {!isCollapsed && (
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              )}
            </Button>
          )
        })}
      </div>

      {/* Active Paths Preview */}
      {!isCollapsed && activePaths.length > 0 && (
        <div className="p-4 border-t border-purple-500/20">
          <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Active Paths
          </h4>
          <div className="space-y-2">
            {activePaths.slice(0, 2).map((path) => (
              <div key={path.id} className="bg-black/20 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white truncate">{path.name}</span>
                  <span className="text-xs text-purple-400">{path.progress}%</span>
                </div>
                <Progress value={path.progress} className="h-1 bg-purple-900/50" />
              </div>
            ))}
            {activePaths.length > 2 && (
              <div className="text-xs text-purple-400 text-center">+{activePaths.length - 2} more paths</div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-purple-500/20">
        {!isCollapsed && (
          <div className="text-center">
            <div className="text-xs text-purple-400 mb-1">Hunter ID: {userProfile.id}</div>
            <div className="text-xs text-purple-500">{userProfile.aura && `Aura: ${userProfile.aura}`}</div>
          </div>
        )}
      </div>
    </div>
  )
}
