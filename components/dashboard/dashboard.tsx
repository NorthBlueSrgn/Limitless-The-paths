"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Target, Flame, Star, BookOpen } from "lucide-react"
import { AttributeRadar } from "./attribute-radar"
import { SoulMap } from "./soul-map"
import { DailyTasks } from "./daily-tasks"
import { useLimitlessData } from "@/hooks/use-limitless-data"

export function Dashboard() {
  const { userProfile, attributes, soulTraits, activePaths, dailyTasks, storyChapters } = useLimitlessData()

  const completedTasks = dailyTasks.filter((task) => task.completed).length
  const totalTasks = dailyTasks.length
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const currentChapter = storyChapters.find((chapter) => !chapter.completed) || storyChapters[0]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card pulse-glow">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-purple-400 neon-glow float-animation" />
            <div className="font-orbitron text-4xl font-bold text-purple-400 rank-glow mb-2">{userProfile.rank}</div>
            <div className="text-gray-400 text-sm font-medium">Current Rank</div>
            <div className="text-xs text-purple-300 mt-1">{userProfile.title}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-purple-400" />
            <div className="text-4xl font-bold text-purple-400 mb-2">{Math.round(taskCompletionRate)}%</div>
            <div className="text-gray-400 text-sm font-medium">Daily Tasks</div>
            <div className="text-xs text-gray-500 mt-1">
              {completedTasks}/{totalTasks} completed
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Flame className="h-12 w-12 mx-auto mb-4 text-orange-400" />
            <div className="text-4xl font-bold text-orange-400 mb-2">{userProfile.streak}</div>
            <div className="text-gray-400 text-sm font-medium">Day Streak</div>
            <div className="text-xs text-gray-500 mt-1">Keep it going!</div>
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
            <CardTitle className="text-white font-orbitron">Progress to Next Rank</CardTitle>
            <Badge variant="outline" className="border-blue-500 text-blue-400 font-orbitron">
              D Rank
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
              <span>{userProfile.nextRankXP - userProfile.currentXP} XP remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attribute Overview */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Attribute Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AttributeRadar attributes={attributes} userProfile={userProfile} />
          </CardContent>
        </Card>

        {/* Soul Map */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Soul Map</CardTitle>
          </CardHeader>
          <CardContent>
            <SoulMap traits={soulTraits} />
          </CardContent>
        </Card>
      </div>

      {/* Daily Tasks */}
      <DailyTasks tasks={dailyTasks} />

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Paths */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Active Paths</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {activePaths.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <Target className="h-12 w-12 mb-2 opacity-50" />
                <p>No active paths yet</p>
                <p className="text-xs text-gray-500">Start your journey by selecting a path</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activePaths.map((path) => (
                  <div key={path.id} className="p-4 bg-black/20 rounded-xl border border-purple-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white">{path.name}</h3>
                        <p className="text-gray-400 text-sm">{path.currentStage}</p>
                      </div>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                        {path.difficulty}
                      </Badge>
                    </div>
                    <Progress value={(path.progress / path.maxProgress) * 100} className="h-2 bg-gray-800/50" />
                    <div className="text-xs text-gray-400 mt-1">
                      {path.progress}/{path.maxProgress} progress
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Story Progress */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Story Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {currentChapter ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Current Chapter</div>
                  <div className="font-orbitron text-xl font-bold text-purple-400">
                    Chapter {currentChapter.chapterNumber}
                  </div>
                  <div className="text-sm text-white mt-1">{currentChapter.title}</div>
                </div>
                <div className="text-sm text-gray-300 italic">"{currentChapter.content.substring(0, 100)}..."</div>
                <div className="flex flex-wrap gap-1">
                  {currentChapter.themes.map((theme) => (
                    <Badge key={theme} variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                      {theme}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-400">
                  Complete {currentChapter.requiredTaskCompletion}% of daily tasks to unlock next chapter
                </div>
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

      {/* Attribute Mastery */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white font-orbitron">Attribute Mastery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attributes.map((attribute) => {
              const icons = {
                Spiritual: "🕊",
                Intelligence: "⚡",
                Creativity: "🎨",
                Health: "💖",
                Physical: "💪",
                Resilience: "🛡",
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
                  <Progress value={(attribute.value / attribute.maxValue) * 100} className="h-2 bg-gray-800/50" />
                  {attribute.decayRate > 0.1 && (
                    <div className="text-xs text-orange-400 decay-warning">⚠ High decay rate - stay active!</div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
