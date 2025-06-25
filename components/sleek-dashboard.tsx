"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Crown,
  Zap,
  Target,
  TrendingUp,
  Plus,
  LogOut,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  User,
} from "lucide-react"

import type { UserData, Path } from "../types"
import { getRankColor, getRankGlow, getNextRankThreshold } from "../utils/ranking"

interface SleekDashboardProps {
  userData: UserData
  onTogglePrerequisite: (pathId: string, prereqId: string) => void
  onAddPath: (pathTemplate: Omit<Path, "id" | "isActive">) => void
  onRemovePath: (pathId: string) => void
  onLogout: () => void
}

export function SleekDashboard({
  userData,
  onTogglePrerequisite,
  onAddPath,
  onRemovePath,
  onLogout,
}: SleekDashboardProps) {
  const [newPathGoal, setNewPathGoal] = useState("")
  const [isCreatePathOpen, setIsCreatePathOpen] = useState(false)

  const totalActivePaths = userData.activePaths.length
  const completedTasksToday = userData.activePaths.reduce(
    (sum, path) => sum + path.prerequisites.filter((p) => p.type === "daily" && p.completed).length,
    0,
  )

  const totalDailyTasks = userData.activePaths.reduce(
    (sum, path) => sum + path.prerequisites.filter((p) => p.type === "daily").length,
    0,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Sleek Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23a855f7%22%20fillOpacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

        <div className="relative border-b border-purple-500/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg ${getRankGlow(userData.overallRank)}`}
                  >
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                      Limitless
                    </h1>
                    <p className="text-purple-300 flex items-center mt-1">
                      <User className="h-4 w-4 mr-2" />
                      {userData.username}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {userData.totalXP.toLocaleString()}
                  </div>
                  <div className="text-purple-300 text-sm">Total XP</div>
                </div>

                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Sleek Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Overall Rank</p>
                  <p className={`text-3xl font-bold ${getRankColor(userData.overallRank)}`}>{userData.overallRank}</p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 ${getRankGlow(userData.overallRank)}`}
                >
                  <Crown className={`h-6 w-6 ${getRankColor(userData.overallRank)}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Level</p>
                  <p className="text-3xl font-bold text-yellow-400">{userData.level}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 shadow-lg shadow-yellow-400/20">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Active Paths</p>
                  <p className="text-3xl font-bold text-green-400">{totalActivePaths}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 shadow-lg shadow-green-400/20">
                  <Target className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Today's Progress</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {completedTasksToday}/{totalDailyTasks}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 shadow-lg shadow-blue-400/20">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attributes Overview */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-300 flex items-center">
              <Sparkles className="h-6 w-6 mr-3" />
              Attribute Mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(userData.attributes).map((attr) => {
                const { nextRank, threshold, progress } = getNextRankThreshold(attr.value)
                return (
                  <div key={attr.name} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{attr.icon}</span>
                        <div>
                          <p className="font-semibold text-white">{attr.name}</p>
                          <p className="text-sm text-gray-400">{attr.value} points</p>
                        </div>
                      </div>
                      <Badge className={`${getRankColor(attr.rank)} border-current text-lg px-3 py-1 font-bold`}>
                        {attr.rank}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress to {nextRank}</span>
                        <span className="text-purple-300">{Math.max(0, threshold - attr.value)} needed</span>
                      </div>
                      <Progress value={progress} className="h-2 bg-gray-800" />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Paths Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Your Paths</h2>
            <Dialog open={isCreatePathOpen} onOpenChange={setIsCreatePathOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Path
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-purple-500/30">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-purple-300">Create New Path</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">What do you want to master?</label>
                    <Input
                      value={newPathGoal}
                      onChange={(e) => setNewPathGoal(e.target.value)}
                      placeholder="e.g., chess, gym, coding, meditation..."
                      className="bg-gray-800/50 border-purple-500/30 text-white mt-2"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (newPathGoal.trim()) {
                        // This would call the AI path generation
                        setNewPathGoal("")
                        setIsCreatePathOpen(false)
                      }
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Create Path
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userData.activePaths.map((path) => {
              const completedPrereqs = path.prerequisites.filter((p) => p.completed).length
              const totalPrereqs = path.prerequisites.length
              const completionRate = totalPrereqs > 0 ? (completedPrereqs / totalPrereqs) * 100 : 0

              return (
                <Card
                  key={path.id}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl font-bold text-purple-300">{path.name}</CardTitle>
                          <Button
                            onClick={() => onRemovePath(path.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{path.description}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                            {path.currentTitle}
                          </Badge>
                          <Badge variant="outline" className="border-gray-500/50 text-gray-300 text-xs">
                            {path.domain}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-purple-300">
                          {completedPrereqs}/{totalPrereqs}
                        </span>
                      </div>
                      <Progress value={completionRate} className="h-2 bg-gray-800" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {path.prerequisites.map((prereq) => (
                      <div key={prereq.id} className="group">
                        <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-200">
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onTogglePrerequisite(path.id, prereq.id)}
                              className="p-0 h-auto hover:bg-transparent"
                            >
                              {prereq.completed ? (
                                <CheckCircle2 className="h-6 w-6 text-green-400" />
                              ) : (
                                <Circle className="h-6 w-6 text-gray-500 group-hover:text-gray-400" />
                              )}
                            </Button>
                            <div className="flex-1">
                              <div className="font-medium text-white">{prereq.name}</div>
                              <div className="text-sm text-gray-400">{prereq.description}</div>
                              {prereq.type === "weekly" && (
                                <div className="text-xs text-purple-400 mt-1 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {prereq.weeklyProgress}/{prereq.weeklyTarget} this week
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">
                              +{prereq.xpReward} XP
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}

            {userData.activePaths.length === 0 && (
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-purple-500/20 col-span-full">
                <CardContent className="p-12 text-center">
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full w-fit mx-auto mb-6">
                    <Target className="h-12 w-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Active Paths</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Your journey begins with a single step. Create your first path and start your ascension to
                    greatness.
                  </p>
                  <Button
                    onClick={() => setIsCreatePathOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Path
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
