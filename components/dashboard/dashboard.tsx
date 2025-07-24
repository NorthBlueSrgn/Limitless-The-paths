"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Crown, Target, Flame, Star, BookOpen, CheckCircle2, Circle } from "lucide-react"
import { useLimitlessData } from "@/hooks/use-limitless-data"

export function Dashboard() {
  const { userProfile, attributes, soulTraits, activePaths, dailyTasks, storyChapters, completeTask } =
    useLimitlessData()

  const completedTasks = dailyTasks.filter((task) => task.completed).length
  const totalTasks = dailyTasks.length
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const currentChapter = storyChapters.find((chapter) => !chapter.completed) || storyChapters[0]

  const handleTaskComplete = (taskId: string) => {
    completeTask(taskId)
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="font-orbitron text-5xl font-bold chapter-title">LIMITLESS: CHAPTER BLACK</h1>
        <p className="text-gray-400 text-lg manga-text">Your transformation begins in the shadows of potential</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card pulse-glow">
          <CardContent className="p-6 text-center">
            <div className="rank-aura w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8 text-white float-animation" />
            </div>
            <div className="font-orbitron text-4xl font-bold text-purple-400 rank-glow mb-2">{userProfile.rank}</div>
            <div className="text-gray-400 text-sm font-medium">Current Rank</div>
            <div className="text-xs text-purple-300 mt-1">{userProfile.title}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-purple-400" />
            <div className="text-4xl font-bold text-purple-400 mb-2">{Math.round(taskCompletionRate)}%</div>
            <div className="text-gray-400 text-sm font-medium">Daily Progress</div>
            <div className="text-xs text-gray-500 mt-1">
              {completedTasks}/{totalTasks} tasks complete
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Flame className="h-12 w-12 mx-auto mb-4 text-orange-400" />
            <div className="text-4xl font-bold text-orange-400 mb-2">{userProfile.streak}</div>
            <div className="text-gray-400 text-sm font-medium">Day Streak</div>
            <div className="text-xs text-gray-500 mt-1">Consistency is power</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
            <div className="text-4xl font-bold text-yellow-400 mb-2">{userProfile.totalXP}</div>
            <div className="text-gray-400 text-sm font-medium">Total XP</div>
            <div className="text-xs text-gray-500 mt-1">Level {userProfile.level}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Rank */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white font-orbitron">Ascension Progress</CardTitle>
            <Badge variant="outline" className="border-blue-500 text-blue-400 font-orbitron">
              Next: Rank D
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={(userProfile.currentXP / userProfile.nextRankXP) * 100} className="h-4 bg-gray-800/50" />
            <div className="flex justify-between text-sm text-gray-400">
              <span>
                {userProfile.currentXP} / {userProfile.nextRankXP} XP
              </span>
              <span>{userProfile.nextRankXP - userProfile.currentXP} XP to ascension</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Tasks - The Core */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white font-orbitron">Today's Trials</CardTitle>
          <p className="text-gray-400 text-sm">Each task completed shapes your evolution</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  task.completed
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-black/20 border-white/10 hover:border-purple-500/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTaskComplete(task.id)}
                      disabled={task.completed}
                      className="p-0 h-6 w-6 rounded-full"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 hover:text-purple-400" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <h3 className={`font-bold ${task.completed ? "text-green-400 line-through" : "text-white"}`}>
                        {task.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            task.difficulty === "Easy"
                              ? "border-green-500 text-green-400"
                              : task.difficulty === "Medium"
                                ? "border-yellow-500 text-yellow-400"
                                : "border-red-500 text-red-400"
                          }`}
                        >
                          {task.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-500">{task.timeEstimate}min</span>
                        <span className="text-xs text-purple-400">+{task.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attribute Wheel */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white font-orbitron">Soul Attributes</CardTitle>
          <p className="text-gray-400 text-sm">The six pillars of your evolution</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attributes.map((attribute) => {
              const icons = {
                Spiritual: "🕊️",
                Intelligence: "⚡",
                Creativity: "🎨",
                Health: "💖",
                Physical: "💪",
                Resilience: "🛡️",
              }

              return (
                <div key={attribute.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{icons[attribute.name as keyof typeof icons] || "⭐"}</span>
                      <div>
                        <div className="font-medium text-white">{attribute.name}</div>
                        <div className="text-sm text-gray-400">
                          {attribute.value}/{attribute.maxValue}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-gray-500 text-gray-400 font-orbitron">
                      {attribute.rank}
                    </Badge>
                  </div>
                  <Progress
                    value={(attribute.value / attribute.maxValue) * 100}
                    className="h-3 bg-gray-800/50"
                    style={
                      {
                        "--progress-foreground": attribute.color,
                      } as React.CSSProperties
                    }
                  />
                  {attribute.decayRate > 0.1 && (
                    <div className="text-xs text-orange-400 decay-warning">⚠ High decay rate - stay active!</div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Story Progress */}
      <Card className="glass-card border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-white">Chapter Black Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {currentChapter ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Current Chapter</div>
                <div className="font-orbitron text-xl font-bold text-blue-400">
                  Chapter {currentChapter.chapterNumber}: {currentChapter.title}
                </div>
              </div>
              <div className="text-sm text-gray-300 manga-text italic">
                "{currentChapter.content.substring(0, 150)}..."
              </div>
              <div className="flex flex-wrap gap-1">
                {currentChapter.themes.map((theme) => (
                  <Badge key={theme} variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                    {theme}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-gray-400">
                Complete {currentChapter.requiredTaskCompletion}% of daily tasks to unlock the next chapter
              </div>
              <Progress value={taskCompletionRate} className="h-2 bg-gray-800/50" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <BookOpen className="h-12 w-12 mb-2 opacity-50" />
              <p>Your story awaits...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
