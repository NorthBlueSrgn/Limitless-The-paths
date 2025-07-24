"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Settings } from "lucide-react"
import type { UserProfile } from "@/types/limitless"

interface HeaderProps {
  onToggleOrder: () => void
  userProfile: UserProfile
}

export function Header({ onToggleOrder, userProfile }: HeaderProps) {
  const xpProgress = (userProfile.currentXP / userProfile.nextRankXP) * 100

  return (
    <header className="glass-card mx-6 mt-6 p-4 relative z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center neon-glow float-animation">
              <span className="text-white font-bold text-xl">∞</span>
            </div>
            <div>
              <h1 className="font-orbitron text-2xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Limitless: The Path
              </h1>
              <p className="text-gray-400 text-sm">Ascend Beyond Limits</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">{userProfile.username}</span>
              <Badge
                variant="outline"
                className={`font-orbitron font-bold text-lg px-3 py-1 border-purple-500 text-purple-400 rank-glow pulse-glow`}
              >
                RANK {userProfile.rank}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-purple-400 font-bold">{userProfile.currentXP} XP</span>
              <div className="w-32">
                <Progress value={xpProgress} className="h-2 bg-gray-800/50" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleOrder}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 neon-glow"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300 hover:bg-gray-500/10">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
