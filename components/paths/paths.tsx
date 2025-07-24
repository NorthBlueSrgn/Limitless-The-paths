"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Clock, Zap, Star, CheckCircle2, Circle, Play, Route } from "lucide-react"
import type { Path, DailyTask } from "@/types/limitless"

interface PathsProps {
  paths: Path[]
  dailyTasks: DailyTask[]
  completeTask: (taskId: string) => void
}

const difficultyColors = {
  Beginner: "text-green-400 border-green-400",
  Intermediate: "text-yellow-400 border-yellow-400",
  Advanced: "text-orange-400 border-orange-400",
  Master: "text-red-400 border-red-400",
}

const taskDifficultyColors = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-orange-400",
  Extreme: "text-red-400",
}

export function Paths({ paths = [], dailyTasks = [], completeTask }: PathsProps) {
  const [selectedPath, setSelectedPath] = useState<Path | null>(null)

  // Safely filter paths
  const activePaths = paths.filter((path) => path?.isActive) || []
  const availablePaths = paths.filter((path) => path && !path.isActive) || []

  // Set initial selected path
  if (!selectedPath && activePaths.length > 0) {
    setSelectedPath(activePaths[0])
  }

  const getPathTasks = (pathId: string) => {
    return dailyTasks.filter((task) => task?.pathId === pathId) || []
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Paths of Evolution
        </h1>
        <p className="text-purple-300">Choose your journey. Master your destiny. Transcend your limits.</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-purple-500/20">
          <TabsTrigger value="active" className="data-[state=active]:bg-purple-600/30">
            Active Paths ({activePaths.length})
          </TabsTrigger>
          <TabsTrigger value="available" className="data-[state=active]:bg-purple-600/30">
            Available Paths ({availablePaths.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-600/30">
            Daily Tasks ({dailyTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activePaths.length === 0 ? (
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-12 text-center">
                <Route className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-bold text-white mb-2">No Active Paths</h3>
                <p className="text-gray-400">Select a path to begin your transformation journey</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activePaths.map((path) => (
                <Card
                  key={path.id}
                  className="bg-black/40 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedPath(path)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: path.color }} />
                        {path.name}
                      </CardTitle>
                      <Badge variant="outline" className={`${difficultyColors[path.difficulty]} bg-black/20`}>
                        {path.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-purple-300 text-sm">{path.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Progress</span>
                        <span className="text-purple-300">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-purple-400">Current Stage:</span>
                        <p className="text-white">{path.currentStage}</p>
                      </div>
                      <div>
                        <span className="text-purple-400">Next Stage:</span>
                        <p className="text-white">{path.nextStage}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {path.associatedAttributes?.map((attr) => (
                        <Badge key={attr} variant="secondary" className="text-xs bg-purple-900/30 text-purple-300">
                          {attr}
                        </Badge>
                      )) || []}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Selected Path Details */}
          {selectedPath && (
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Path Details: {selectedPath.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-semibold mb-2">Philosophy</h3>
                      <p className="text-purple-300 text-sm italic">"{selectedPath.philosophy}"</p>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-2">Archetype</h3>
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        {selectedPath.archetype}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-semibold mb-2">Lore</h3>
                      <p className="text-purple-300 text-sm">{selectedPath.lore}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3">Path Rewards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedPath.rewards?.map((reward, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-purple-900/20 rounded">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-purple-300">
                          {reward.type}: {reward.value} {reward.target && `(${reward.target})`}
                        </span>
                      </div>
                    )) || []}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {availablePaths.length === 0 ? (
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-12 text-center">
                <Circle className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-bold text-white mb-2">No Available Paths</h3>
                <p className="text-gray-400">All paths are currently active or locked</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {availablePaths.map((path) => (
                <Card
                  key={path.id}
                  className="bg-black/40 backdrop-blur-xl border-purple-500/20 opacity-75 hover:opacity-100 transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Circle className="w-4 h-4 text-gray-400" />
                      {path.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-purple-300 text-sm">{path.description}</p>
                    <Badge variant="outline" className={`${difficultyColors[path.difficulty]} bg-black/20`}>
                      {path.difficulty}
                    </Badge>
                    <Button
                      size="sm"
                      className="w-full bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Activate Path
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {dailyTasks.length === 0 ? (
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-12 text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-bold text-white mb-2">No Tasks Available</h3>
                <p className="text-gray-400">Complete path activation to unlock daily tasks</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dailyTasks.map((task) => (
                <Card key={task.id} className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => completeTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`font-semibold ${task.completed ? "text-green-400 line-through" : "text-white"}`}
                          >
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`${taskDifficultyColors[task.difficulty]} border-current text-xs`}
                            >
                              {task.difficulty}
                            </Badge>
                            {task.completed && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                          </div>
                        </div>

                        <p className="text-purple-300 text-sm">{task.description}</p>

                        <div className="flex items-center gap-4 text-xs text-purple-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.timeEstimate}min
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {task.xpReward} XP
                          </div>
                          <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
                            {task.category}
                          </Badge>
                        </div>

                        {task.attributeRewards && Object.keys(task.attributeRewards).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(task.attributeRewards).map(([attr, value]) => (
                              <Badge key={attr} variant="outline" className="text-xs text-blue-400 border-blue-400">
                                +{value} {attr}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
