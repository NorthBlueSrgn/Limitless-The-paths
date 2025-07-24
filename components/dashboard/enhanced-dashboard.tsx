"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Zap,
  TrendingUp,
  Calendar,
  Flame,
  Star,
  Brain,
  Heart,
  Dumbbell,
  Palette,
  Shield,
  Sparkles,
} from "lucide-react"
import type { UserProfile, Task } from "@/lib/database/schema"

interface EnhancedDashboardProps {
  userProfile: UserProfile
  tasks: Task[]
  onCompleteTask: (taskId: string) => void
  onGenerateTasks: () => void
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

export function EnhancedDashboard({ userProfile, tasks, onCompleteTask, onGenerateTasks }: EnhancedDashboardProps) {
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
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/20">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-purple-300">Completion Rate</p>
                <p className="text-2xl font-bold text-white">{completionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-500/20">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-purple-300">Total XP</p>
                <p className="text-2xl font-bold text-white">{userProfile.totalXP.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-500/20">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-purple-300">Current Streak</p>
                <p className="text-2xl font-bold text-white">{userProfile.currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/20">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-purple-300">Rank</p>
                <p className="text-2xl font-bold text-white">{userProfile.currentRank}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Stats Visualization */}
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Core Attributes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(userProfile.stats).map(([stat, value]) => {
                const Icon = statIcons[stat as keyof typeof statIcons]
                const colorClass = statColors[stat as keyof typeof statColors]

                return (
                  <div key={stat} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${colorClass}`} />
                        <span className="text-sm font-medium capitalize text-white">{stat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{value}</span>
                        <Badge variant="outline" className={`text-xs ${colorClass} border-current`}>
                          {getRankForStat(value)}
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={value}
                      className="h-2"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Tasks
              </div>
              <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                {completedToday}/{totalTasks} Complete
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-purple-500/20 bg-black/20"
                >
                  <Button
                    size="sm"
                    variant={task.status === "completed" ? "default" : "outline"}
                    onClick={() => task.status !== "completed" && onCompleteTask(task.id)}
                    disabled={task.status === "completed"}
                    className="w-8 h-8 p-0"
                  >
                    {task.status === "completed" ? "✓" : "○"}
                  </Button>

                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        task.status === "completed" ? "line-through text-gray-400" : "text-white"
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-xs text-purple-300">
                      {task.estimatedMinutes}min • {task.xpReward} XP
                    </p>
                  </div>

                  <Badge variant="outline" className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                    Level {task.difficulty}
                  </Badge>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-purple-300 mb-4">No tasks for today</p>
                  <Button onClick={onGenerateTasks} className="bg-purple-600 hover:bg-purple-700">
                    Generate Tasks
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Insights */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-400">Progress Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-purple-500/10">
              <h4 className="font-semibold text-white mb-2">Strongest Attribute</h4>
              <p className="text-purple-300">
                {getStrongestStat(userProfile.stats)} ({Math.max(...Object.values(userProfile.stats))})
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-orange-500/10">
              <h4 className="font-semibold text-white mb-2">Growth Opportunity</h4>
              <p className="text-orange-300">
                {getWeakestStat(userProfile.stats)} ({Math.min(...Object.values(userProfile.stats))})
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <h4 className="font-semibold text-white mb-2">Next Milestone</h4>
              <p className="text-green-300">{getNextMilestone(userProfile)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

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

  if (avgStat < 15) return "Reach Seeker Rank"
  if (avgStat < 30) return "Reach Adept Rank"
  if (avgStat < 45) return "Reach Expert Rank"
  if (avgStat < 60) return "Reach Master Rank"
  if (avgStat < 70) return "Reach Sage Rank"
  return "Achieve Transcendence"
}
