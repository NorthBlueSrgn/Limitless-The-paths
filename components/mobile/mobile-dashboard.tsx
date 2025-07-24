"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  TrendingUp,
  Calendar,
  Flame,
  Brain,
  Heart,
  Dumbbell,
  Palette,
  Shield,
  Sparkles,
  MessageCircle,
  Trophy,
} from "lucide-react"
import type { UserProfile, Task } from "@/lib/database/schema"

interface MobileDashboardProps {
  userProfile: UserProfile
  tasks: Task[]
  onCompleteTask: (taskId: string) => void
  onGenerateTasks: () => void
  onOpenChat: () => void
}

const statIcons = {
  spiritual: Sparkles,
  health: Heart,
  intelligence: Brain,
  physical: Dumbbell,
  creativity: Palette,
  resilience: Shield,
}

const statColors = {
  spiritual: "text-purple-400",
  health: "text-green-400",
  intelligence: "text-blue-400",
  physical: "text-red-400",
  creativity: "text-yellow-400",
  resilience: "text-indigo-400",
}

export function MobileDashboard({
  userProfile,
  tasks,
  onCompleteTask,
  onGenerateTasks,
  onOpenChat,
}: MobileDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [completedToday, setCompletedToday] = useState(0)
  const [totalTasks, setTotalTasks] = useState(0)

  useEffect(() => {
    const today = new Date().toDateString()
    const todaysTasks = tasks.filter((task) => new Date(task.createdAt).toDateString() === today)

    setTotalTasks(todaysTasks.length)
    setCompletedToday(todaysTasks.filter((task) => task.status === "completed").length)
  }, [tasks])

  const completionRate = totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{userProfile.username}</h1>
            <p className="text-sm text-purple-300">
              {userProfile.currentRank} • Level {userProfile.level}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
              {userProfile.totalXP.toLocaleString()} XP
            </Badge>
            <Button size="sm" onClick={onOpenChat} className="bg-purple-600 hover:bg-purple-700">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 border-purple-500/20 mx-4 mt-4">
          <TabsTrigger value="overview" className="text-xs">
            <Target className="w-4 h-4 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">
            <Calendar className="w-4 h-4 mr-1" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-xs">
            <TrendingUp className="w-4 h-4 mr-1" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-xs">
            <Trophy className="w-4 h-4 mr-1" />
            Progress
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="p-4 space-y-4">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-500/20">
                    <Target className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-300">Today</p>
                    <p className="text-lg font-bold text-white">{completionRate.toFixed(0)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-orange-500/20">
                    <Flame className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-300">Streak</p>
                    <p className="text-lg font-bold text-white">{userProfile.currentStreak}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Priority Tasks */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 text-sm flex items-center justify-between">
                Priority Tasks
                <Badge variant="outline" className="text-xs text-purple-300 border-purple-500/30">
                  {completedToday}/{totalTasks}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 rounded-lg border border-purple-500/20 bg-black/20"
                >
                  <Button
                    size="sm"
                    variant={task.status === "completed" ? "default" : "outline"}
                    onClick={() => task.status !== "completed" && onCompleteTask(task.id)}
                    disabled={task.status === "completed"}
                    className="w-6 h-6 p-0 text-xs"
                  >
                    {task.status === "completed" ? "✓" : "○"}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-medium truncate ${
                        task.status === "completed" ? "line-through text-gray-400" : "text-white"
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-xs text-purple-300">
                      {task.estimatedMinutes}min • {task.xpReward} XP
                    </p>
                  </div>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-purple-300 text-sm mb-3">No tasks for today</p>
                  <Button onClick={onGenerateTasks} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Generate Tasks
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={onOpenChat} className="bg-purple-600 hover:bg-purple-700 h-12">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with Order
            </Button>
            <Button
              onClick={onGenerateTasks}
              variant="outline"
              className="border-purple-500/30 text-purple-300 h-12 bg-transparent"
            >
              <Target className="w-4 h-4 mr-2" />
              New Tasks
            </Button>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">All Tasks</h2>
            <Button onClick={onGenerateTasks} size="sm" className="bg-purple-600 hover:bg-purple-700">
              Generate More
            </Button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task.id} className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Button
                      size="sm"
                      variant={task.status === "completed" ? "default" : "outline"}
                      onClick={() => task.status !== "completed" && onCompleteTask(task.id)}
                      disabled={task.status === "completed"}
                      className="w-8 h-8 p-0 mt-1"
                    >
                      {task.status === "completed" ? "✓" : "○"}
                    </Button>

                    <div className="flex-1">
                      <h3
                        className={`font-medium mb-1 ${
                          task.status === "completed" ? "line-through text-gray-400" : "text-white"
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">{task.description}</p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs text-purple-300 border-purple-500/30">
                          {task.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-500/30">
                          {task.xpReward} XP
                        </Badge>
                        <Badge variant="outline" className="text-xs text-blue-400 border-blue-500/30">
                          {task.estimatedMinutes}min
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                          Level {task.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="p-4 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Core Attributes</h2>

          <div className="space-y-4">
            {Object.entries(userProfile.stats).map(([stat, value]) => {
              const Icon = statIcons[stat as keyof typeof statIcons]
              const colorClass = statColors[stat as keyof typeof statColors]

              return (
                <Card key={stat} className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-full bg-current/20`}>
                        <Icon className={`w-5 h-5 ${colorClass}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium capitalize text-white">{stat}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">{value}</span>
                            <Badge variant="outline" className={`text-xs ${colorClass} border-current`}>
                              {getRankForStat(value)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={value}
                      className="h-2"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                      }}
                    />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="p-4 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Your Journey</h2>

          {/* Rank Progress */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm">Current Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">{userProfile.currentRank}</div>
                <div className="text-sm text-purple-300 mb-4">Level {userProfile.level}</div>
                <Progress value={userProfile.rankProgress} className="h-2" />
                <p className="text-xs text-gray-400 mt-2">Progress to next rank</p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Preview */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm">Complete tasks to unlock achievements</p>
              </div>
            </CardContent>
          </Card>

          {/* Journey Insights */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm">Journey Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Strongest Attribute</span>
                <span className="text-sm font-medium text-white capitalize">{getStrongestStat(userProfile.stats)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Growth Opportunity</span>
                <span className="text-sm font-medium text-orange-300 capitalize">
                  {getWeakestStat(userProfile.stats)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Next Milestone</span>
                <span className="text-sm font-medium text-green-300">{getNextMilestone(userProfile)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions
function getRankForStat(value: number): string {
  if (value >= 90) return "S"
  if (value >= 80) return "A"
  if (value >= 70) return "B"
  if (value >= 60) return "C"
  if (value >= 50) return "D"
  return "E"
}

function getDifficultyColor(difficulty: number): string {
  const colors = {
    1: "text-green-400 border-green-500/30",
    2: "text-blue-400 border-blue-500/30",
    3: "text-yellow-400 border-yellow-500/30",
    4: "text-orange-400 border-orange-500/30",
    5: "text-red-400 border-red-500/30",
  }
  return colors[difficulty as keyof typeof colors] || colors[1]
}

function getStrongestStat(stats: UserProfile["stats"]): string {
  return Object.entries(stats).reduce((max, [stat, value]) => (value > max.value ? { stat, value } : max), {
    stat: "",
    value: -1,
  }).stat
}

function getWeakestStat(stats: UserProfile["stats"]): string {
  return Object.entries(stats).reduce((min, [stat, value]) => (value < min.value ? { stat, value } : min), {
    stat: "",
    value: 101,
  }).stat
}

function getNextMilestone(user: UserProfile): string {
  const totalStats = Object.values(user.stats).reduce((sum, stat) => sum + stat, 0)
  const avgStat = totalStats / 6

  if (avgStat < 15) return "Seeker Rank"
  if (avgStat < 30) return "Adept Rank"
  if (avgStat < 45) return "Expert Rank"
  if (avgStat < 60) return "Master Rank"
  if (avgStat < 70) return "Sage Rank"
  return "Transcendence"
}
