"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Target,
  TrendingUp,
  Calendar,
  MessageCircle,
  Plus,
  Zap,
  Brain,
  Heart,
  Users,
  Palette,
  Eye,
  Trophy,
  Star,
  Clock,
  CheckCircle2,
} from "lucide-react"
import type { UserProfile } from "@/types/limitless"

interface MobileDashboardProps {
  userProfile: UserProfile
  onOpenChat: () => void
  onGenerateTask: () => void
}

const statIcons = {
  Physical: Zap,
  Mental: Brain,
  Emotional: Heart,
  Social: Users,
  Creative: Palette,
  Spiritual: Eye,
}

const statColors = {
  Physical: "text-red-400 bg-red-400/10 border-red-400/20",
  Mental: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Emotional: "text-green-400 bg-green-400/10 border-green-400/20",
  Social: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Creative: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Spiritual: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
}

export function MobileDashboard({ userProfile, onOpenChat, onGenerateTask }: MobileDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const totalXP = userProfile.totalXP || 0
  const level = userProfile.level || 1
  const nextLevelXP = level * 1000 // Simple progression formula
  const currentLevelXP = totalXP % 1000
  const progressPercentage = (currentLevelXP / nextLevelXP) * 100

  const stats = userProfile.stats || {
    Physical: 0,
    Mental: 0,
    Emotional: 0,
    Social: 0,
    Creative: 0,
    Spiritual: 0,
  }

  const recentAchievements = [
    { id: 1, title: "First Steps", rarity: "common", icon: "👣" },
    { id: 2, title: "Week Warrior", rarity: "uncommon", icon: "🔥" },
    { id: 3, title: "Balanced Growth", rarity: "rare", icon: "⚖️" },
  ]

  const activeTasks = [
    { id: 1, title: "Complete morning routine", difficulty: "easy", xp: 25, timeLeft: "2h" },
    { id: 2, title: "Read for 30 minutes", difficulty: "medium", xp: 50, timeLeft: "5h" },
    { id: 3, title: "Practice meditation", difficulty: "medium", xp: 75, timeLeft: "8h" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{userProfile.rank?.[0] || "N"}</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">{userProfile.username || "Hunter"}</h1>
              <p className="text-xs text-purple-300">{userProfile.title || "Seeker"}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">Lv. {level}</div>
            <div className="text-xs text-purple-300">{totalXP.toLocaleString()} XP</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-purple-300 mb-1">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-purple-900/50" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 pb-2">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onOpenChat}
            className="bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 h-12"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat with Order
          </Button>
          <Button
            onClick={onGenerateTask}
            className="bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-purple-500/20">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">
              Stats
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs">
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Streak Card */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Current Streak</h3>
                      <p className="text-sm text-gray-400">Keep the momentum going</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">{userProfile.streak || 0}</div>
                    <div className="text-xs text-gray-400">days</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                  <div className="text-lg font-bold">{userProfile.achievements?.length || 0}</div>
                  <div className="text-xs text-gray-400">Achievements</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
                  <div className="text-lg font-bold">{userProfile.completedTasks || 0}</div>
                  <div className="text-xs text-gray-400">Tasks Done</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <div className="text-lg">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Tasks</h2>
              <Button size="sm" onClick={onGenerateTask} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {activeTasks.map((task) => (
                <Card key={task.id} className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm flex-1">{task.title}</h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ml-2 ${
                          task.difficulty === "easy"
                            ? "text-green-400 border-green-400/30"
                            : task.difficulty === "medium"
                              ? "text-yellow-400 border-yellow-400/30"
                              : "text-red-400 border-red-400/30"
                        }`}
                      >
                        {task.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />+{task.xp} XP
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.timeLeft}
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-green-400 hover:text-green-300">
                        <CheckCircle2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(stats).map(([statName, value]) => {
                const IconComponent = statIcons[statName as keyof typeof statIcons]
                const colorClass = statColors[statName as keyof typeof statColors]
                const percentage = Math.min((value / 100) * 100, 100)

                return (
                  <Card key={statName} className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{statName}</h3>
                            <p className="text-xs text-gray-400">Level {Math.floor(value / 10) + 1}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{value}</div>
                          <div className="text-xs text-gray-400">points</div>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2 bg-gray-800" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4 mt-4">
            {/* Level Progress */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Current Level</span>
                    <span className="font-bold">{level}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 bg-gray-800" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{currentLevelXP.toLocaleString()} XP</span>
                    <span>{nextLevelXP.toLocaleString()} XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rank Information */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  Hunter Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{userProfile.rank?.[0] || "N"}</span>
                  </div>
                  <h3 className="font-bold text-lg">{userProfile.rank || "Novice"}</h3>
                  <p className="text-sm text-gray-400">{userProfile.title || "Seeker of Truth"}</p>
                  <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                    {userProfile.hunterType || "Balanced"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Summary */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-400" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">12</div>
                    <div className="text-xs text-gray-400">Tasks Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">850</div>
                    <div className="text-xs text-gray-400">XP Gained</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Padding for Tab Navigation */}
      <div className="h-20"></div>
    </div>
  )
}
