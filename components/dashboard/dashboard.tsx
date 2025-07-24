"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Target, Zap, TrendingUp, Calendar, Flame, Star } from "lucide-react"
import type { User, Task, Path } from "@/types/limitless"

interface DashboardProps {
  user: User
  tasks: Task[]
  paths: Path[]
  onCompleteTask: (taskId: string) => void
}

const attributeIcons = {
  spiritual: "🧘",
  physical: "💪",
  health: "❤️",
  intelligence: "🧠",
  creativity: "🎨",
  resilience: "🛡️",
}

const difficultyColors = {
  Easy: "bg-green-500/20 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Hard: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Extreme: "bg-red-500/20 text-red-400 border-red-500/30",
}

export function Dashboard({ user, tasks, paths, onCompleteTask }: DashboardProps) {
  const activePaths = paths.filter((path) => user.activePaths.includes(path.id))
  const completionRate = (user.completedTasks / user.totalTasks) * 100
  const todaysTasks = tasks.filter((task) => !task.completed)
  const completedToday = tasks.filter((task) => task.completed).length

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-500/20">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current XP</p>
                <p className="text-2xl font-bold">{user.xp}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/20">
                <Flame className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{user.streak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/20">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Paths</p>
                <p className="text-2xl font-bold">{user.activePaths.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attribute Wheel */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Attribute Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(user.attributes).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize flex items-center gap-2">
                      <span>{attributeIcons[key as keyof typeof attributeIcons]}</span>
                      {key}
                    </span>
                    <span className="text-sm font-bold">{value}</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Paths */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Active Paths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activePaths.map((path) => (
              <div key={path.id} className="p-4 rounded-lg border border-white/10 bg-black/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{path.name}</h3>
                  <Badge variant="outline" style={{ borderColor: path.color, color: path.color }}>
                    {path.archetype}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{path.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span>Stage:</span>
                  <span className="font-medium">{path.stages[path.currentStage]?.name || "Not Started"}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Daily Tasks */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Tasks
            </div>
            <Badge variant="outline">
              {completedToday}/{tasks.length} Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-black/20">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => !task.completed && onCompleteTask(task.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </h3>
                    <Badge className={`text-xs ${difficultyColors[task.difficulty]}`}>{task.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-yellow-400">
                    <Zap className="w-4 h-4" />
                    {task.xpReward}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Object.entries(task.attributeRewards).map(([attr, value]) => (
                      <span key={attr} className="mr-1">
                        {attributeIcons[attr as keyof typeof attributeIcons]} +{value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
