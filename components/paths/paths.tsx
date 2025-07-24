"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Route, Target, Crown, Zap, BookOpen, Plus } from "lucide-react"
import type { Path, DailyTask } from "@/types/limitless"

interface PathsProps {
  paths: Path[]
  tasks: DailyTask[]
  onCompleteTask: (taskId: string) => void
}

const difficultyColors = {
  Beginner: "border-green-500 text-green-400",
  Intermediate: "border-yellow-500 text-yellow-400",
  Advanced: "border-orange-500 text-orange-400",
  Master: "border-red-500 text-red-400",
}

const taskDifficultyColors = {
  Easy: "bg-green-500/20 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Hard: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Extreme: "bg-red-500/20 text-red-400 border-red-500/30",
}

export function Paths({ paths, tasks, onCompleteTask }: PathsProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [taskFilter, setTaskFilter] = useState<string>("all")

  const activePaths = paths.filter((p) => p.isActive)
  const availablePaths = paths.filter((p) => !p.isActive)

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === "all") return true
    if (taskFilter === "completed") return task.completed
    if (taskFilter === "pending") return !task.completed
    return task.pathId === taskFilter
  })

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Route className="w-6 h-6 text-primary" />
            <span className="font-orbitron chapter-title">Paths of Ascension</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 manga-text">
            Choose your paths wisely, Hunter. Each journey shapes your evolution, unlocks unique abilities, and
            influences the very fabric of your story. The Order watches your choices with great interest.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Paths</TabsTrigger>
          <TabsTrigger value="available">Available Paths</TabsTrigger>
          <TabsTrigger value="tasks">Path Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activePaths.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <Route className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-bold text-white mb-2">No Active Paths</h3>
                <p className="text-gray-400">Select a path to begin your transformation journey</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activePaths.map((path) => (
                <Card key={path.id} className="path-card glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full neon-glow" style={{ backgroundColor: path.color }}></div>
                        <span className="font-orbitron">{path.name}</span>
                      </CardTitle>
                      <Badge variant="outline" className={`${difficultyColors[path.difficulty]} font-orbitron`}>
                        {path.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">{path.archetype}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 manga-text">{path.description}</p>

                    <div className="p-4 rounded-lg bg-black/30 border border-purple-500/30">
                      <p className="text-sm italic text-purple-300">"{path.philosophy}"</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{path.progress}%</span>
                      </div>
                      <Progress
                        value={path.progress}
                        className="h-3"
                        style={
                          {
                            "--progress-foreground": path.color,
                          } as React.CSSProperties
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Current Stage:</span>
                        <p className="text-white font-medium">{path.currentStage}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Next Stage:</span>
                        <p className="text-white font-medium">{path.nextStage}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 text-sm">Associated Attributes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {path.associatedAttributes.map((attr) => (
                          <Badge key={attr} variant="outline" className="text-xs">
                            {attr}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      Deactivate Path
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availablePaths.map((path) => (
              <Card key={path.id} className="path-card glass-card opacity-80 hover:opacity-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full opacity-60" style={{ backgroundColor: path.color }}></div>
                      <span className="font-orbitron">{path.name}</span>
                    </CardTitle>
                    <Badge variant="outline" className={`${difficultyColors[path.difficulty]} font-orbitron`}>
                      {path.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">{path.archetype}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 manga-text">{path.description}</p>

                  <div className="p-4 rounded-lg bg-black/30 border border-purple-500/30">
                    <p className="text-sm italic text-purple-300">"{path.philosophy}"</p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/20 border border-white/10">
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Path Lore
                    </h4>
                    <p className="text-xs text-gray-400">{path.lore}</p>
                  </div>

                  <div>
                    <span className="text-gray-400 text-sm">Associated Attributes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {path.associatedAttributes.map((attr) => (
                        <Badge key={attr} variant="outline" className="text-xs">
                          {attr}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setSelectedPath(path.id)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Activate Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Path Tasks
                </CardTitle>
                <Select value={taskFilter} onValueChange={setTaskFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    {activePaths.map((path) => (
                      <SelectItem key={path.id} value={path.id}>
                        {path.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-lg bg-black/20 border border-white/10">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => !task.completed && onCompleteTask(task.id)}
                        className="mt-1"
                      />

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-white"}`}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${taskDifficultyColors[task.difficulty]}`}>
                              {task.difficulty}
                            </Badge>
                            {task.pathId && (
                              <Badge variant="outline" className="text-xs">
                                {paths.find((p) => p.id === task.pathId)?.name}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-400">{task.description}</p>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-500">⏱️ {task.timeEstimate}min</span>
                            <span className="text-gray-500">📂 {task.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-400">{task.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
