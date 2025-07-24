"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, BookOpen, Target, Brain, Scroll, Trophy, BarChart3, FileText, Crown, Zap } from "lucide-react"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userProfile: any
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "chapter-black", label: "Chapter Black", icon: BookOpen },
  { id: "paths", label: "Paths", icon: Target },
  { id: "the-order", label: "The Order", icon: Brain },
  { id: "inner-core", label: "Inner Core", icon: Scroll },
  { id: "hunter-exams", label: "Hunter Exams", icon: Trophy },
  { id: "advanced-stats", label: "Advanced Stats", icon: BarChart3 },
  { id: "chronicles", label: "Chronicles", icon: FileText },
]

export function Navigation({ activeTab, onTabChange, userProfile }: NavigationProps) {
  return (
    <div className="glass-card p-6 space-y-6">
      {/* User Profile Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center neon-glow">
          <Crown className="h-10 w-10 text-white float-animation" />
        </div>
        <div>
          <h2 className="font-orbitron text-xl font-bold text-white">{userProfile.username}</h2>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Badge variant="outline" className="border-purple-500 text-purple-400 font-orbitron">
              RANK {userProfile.rank}
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              LVL {userProfile.level}
            </Badge>
          </div>
          <p className="text-gray-400 text-sm mt-1">{userProfile.title}</p>
        </div>
      </div>

      {/* XP Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">XP Progress</span>
          <span className="text-white">
            {userProfile.currentXP} / {userProfile.nextRankXP}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(userProfile.currentXP / userProfile.nextRankXP) * 100}%` }}
          />
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
              className={`w-full justify-start text-left h-12 ${
                isActive
                  ? "bg-purple-600 hover:bg-purple-700 text-white neon-glow"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
              {isActive && <Zap className="h-4 w-4 ml-auto" />}
            </Button>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Streak</span>
          <div className="flex items-center space-x-1">
            <span className="text-orange-400 font-bold">{userProfile.streak}</span>
            <span className="text-gray-400 text-sm">days</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Total XP</span>
          <span className="text-yellow-400 font-bold">{userProfile.totalXP}</span>
        </div>
      </div>
    </div>
  )
}
