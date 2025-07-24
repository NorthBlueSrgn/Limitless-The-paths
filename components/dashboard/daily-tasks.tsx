"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Clock, Zap, Target } from "lucide-react"
import type { DailyTask } from "@/types/limitless"
import { useLimitlessData } from "@/hooks/use-limitless-data"

interface DailyTasksProps {
  tasks: DailyTask[]
}

export function DailyTasks({ tasks }: DailyTasksProps) {
  const { completeTask } = useLimitlessData()
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set())

  const handleCompleteTask = async (taskId: string) => {
    setCompletingTasks((prev) => new Set(prev).add(taskId))

    // Simulate completion animation
    setTimeout(() => {
      completeTask(taskId)
      setCompletingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }, 500)
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const difficultyColors = {
    Easy: "border-green-500 text-green-400",
    Medium: "border-yellow-500 text-yellow-400",
    Hard: "border-red-500 text-red-400",
  }

  if (tasks.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Daily Quests</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <Target className="h-12 w-12 mb-2 opacity-50" />
            <p>No quests available today</p>
            <p className="text-xs text-gray-500">Check back tomorrow for new challenges</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Daily Quests</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              {completedTasks}/{totalTasks}
            </Badge>
            <div className="text-sm text-gray-400">{Math.round(completionRate)}%</div>
          </div>
        </div>
        <Progress value={completionRate} className="h-2 bg-gray-800/50" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => {
            const isCompleting = completingTasks.has(task.id)

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  task.completed
                    ? "bg-green-500/10 border-green-500/30"
                    : isCompleting
                      ? "bg-purple-500/20 border-purple-500/50 xp-animation"
                      : "bg-black/20 border-white/10 hover:border-purple-500/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => !task.completed && !isCompleting && handleCompleteTask(task.id)}
                      disabled={task.completed || isCompleting}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                      ) : isCompleting ? (
                        <div className="h-6 w-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400 hover:text-purple-400" />
                      )}
                    </Button>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium ${task.completed ? "text-green-300 line-through" : "text-white"}`}>
                          {task.title}
                        </h3>
                        <Badge variant="outline" className={`text-xs ${difficultyColors[task.difficulty]}`}>
                          {task.difficulty}
                        </Badge>
                      </div>

                      <p className="text-gray-400 text-sm mb-2">{task.description}</p>

                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <Zap className="h-3 w-3 text-yellow-400" />
                          <span className="text-yellow-400">{task.xpReward} XP</span>
                        </div>

                        {Object.entries(task.attributeRewards).map(([attr, value]) => (
                          <div key={attr} className="flex items-center space-x-1">
                            <span className="text-purple-400">+{value}</span>
                            <span className="text-gray-400">{attr}</span>
                          </div>
                        ))}

                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400">{task.timeEstimate}min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
