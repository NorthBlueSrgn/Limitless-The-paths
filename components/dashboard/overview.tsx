"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Target, Flame, Star, TrendingUp, BookOpen, Trophy, Calendar } from "lucide-react"
import { AttributeRadar } from "./attribute-radar"

export function Overview() {
  // Mock data - replace with actual user data
  const stats = {
    rank: "E",
    dailyTasks: 0,
    dayStreak: 0,
    totalXP: 0,
    nextRankXP: 3000,
  }

  const attributes = {
    spiritual: 0,
    intelligence: 0,
    creative: 0,
    health: 0,
    physical: 0,
    social: 0,
  }

  const weeklyStats = {
    completed: 0,
    remaining: 0,
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card pulse-glow">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-purple-400 neon-glow" />
            <div className="font-orbitron text-4xl font-bold text-purple-400 rank-glow mb-2">{stats.rank}</div>
            <div className="text-gray-400 text-sm font-medium">Current Rank</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-purple-400" />
            <div className="text-4xl font-bold text-purple-400 mb-2">{stats.dailyTasks}%</div>
            <div className="text-gray-400 text-sm font-medium">Daily Tasks</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Flame className="h-12 w-12 mx-auto mb-4 text-orange-400" />
            <div className="text-4xl font-bold text-orange-400 mb-2">{stats.dayStreak}</div>
            <div className="text-gray-400 text-sm font-medium">Day Streak</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
            <div className="text-4xl font-bold text-yellow-400 mb-2">{stats.totalXP}</div>
            <div className="text-gray-400 text-sm font-medium">Total XP</div>
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
            <Progress value={(stats.totalXP / stats.nextRankXP) * 100} className="h-4 bg-gray-800/50" />
            <div className="flex justify-between text-sm text-gray-400">
              <span>
                {stats.totalXP} / {stats.nextRankXP} XP
              </span>
              <span>{stats.nextRankXP - stats.totalXP} XP remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attribute Overview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Attribute Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AttributeRadar attributes={attributes} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <BookOpen className="h-12 w-12 mb-2 opacity-50" />
              <p>No active paths yet</p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Weekly Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tasks Completed</span>
                <span className="text-white font-bold">
                  {weeklyStats.completed}/{weeklyStats.completed + weeklyStats.remaining}
                </span>
              </div>
              <Progress
                value={
                  weeklyStats.completed === 0
                    ? 0
                    : (weeklyStats.completed / (weeklyStats.completed + weeklyStats.remaining)) * 100
                }
                className="h-2 bg-gray-800/50"
              />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">{weeklyStats.completed}</div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{weeklyStats.remaining}</div>
                  <div className="text-xs text-gray-400">Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Milestones */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Recent Milestones</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <Trophy className="h-12 w-12 mb-2 opacity-50" />
              <p>Complete tasks to unlock achievements!</p>
            </div>
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
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Current Chapter</div>
                <div className="font-orbitron text-xl font-bold text-purple-400">Chapter 1</div>
              </div>
              <div className="text-sm text-gray-300 italic">
                "The journey of a thousand paths begins with a single step..."
              </div>
              <div className="text-xs text-gray-400">Complete 5 more tasks to unlock next chapter</div>
            </div>
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
            {Object.entries(attributes).map(([key, value]) => {
              const icons = {
                spiritual: "🕊",
                intelligence: "⚡",
                creative: "🎨",
                health: "💖",
                physical: "💪",
                social: "👥",
              }

              return (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{icons[key as keyof typeof icons]}</span>
                      <div>
                        <div className="font-medium text-white capitalize">{key}</div>
                        <div className="text-sm text-gray-400">{value}/100</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-gray-500 text-gray-400 font-orbitron">
                      E
                    </Badge>
                  </div>
                  <Progress value={value} className="h-2 bg-gray-800/50" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
