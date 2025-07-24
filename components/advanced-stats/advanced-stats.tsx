"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, AlertTriangle, Target, Clock, Zap, Crown, Activity } from "lucide-react"
import type { UserProfile, Attribute, Path, DailyTask, HunterExam, DecayMetric } from "@/types/limitless"

interface AdvancedStatsProps {
  userProfile: UserProfile
  attributes: Attribute[]
  paths: Path[]
  dailyTasks: DailyTask[]
  hunterExams: HunterExam[]
  decayMetrics: DecayMetric[]
}

const rankXPRequirements = {
  E: 0,
  D: 1000,
  C: 3000,
  B: 7000,
  A: 15000,
  S: 30000,
  SS: 60000,
  SSS: 100000,
}

export function AdvancedStats({
  userProfile,
  attributes = [],
  paths = [],
  dailyTasks = [],
  hunterExams = [],
  decayMetrics = [],
}: AdvancedStatsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")

  // Calculate stats
  const completedTasks = dailyTasks.filter((task) => task.completed).length
  const totalTasks = dailyTasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const activePaths = paths.filter((path) => path.isActive)
  const averagePathProgress =
    activePaths.length > 0 ? activePaths.reduce((sum, path) => sum + path.progress, 0) / activePaths.length : 0

  const averageAttributeValue =
    attributes.length > 0 ? attributes.reduce((sum, attr) => sum + attr.value, 0) / attributes.length : 0

  const nextRankXP = rankXPRequirements[userProfile.rank as keyof typeof rankXPRequirements] || 0
  const currentRankIndex = Object.keys(rankXPRequirements).indexOf(userProfile.rank)
  const nextRank = Object.keys(rankXPRequirements)[currentRankIndex + 1] || "SSS"

  const daysToNextRank =
    userProfile.currentXP > 0
      ? Math.ceil(
          (userProfile.nextRankXP - userProfile.currentXP) / (userProfile.currentXP / Math.max(userProfile.streak, 1)),
        )
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Advanced Statistics
        </h1>
        <p className="text-purple-300">Deep analysis of your transformation journey</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-purple-500/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/30">
            Overview
          </TabsTrigger>
          <TabsTrigger value="progression" className="data-[state=active]:bg-purple-600/30">
            Progression
          </TabsTrigger>
          <TabsTrigger value="decay" className="data-[state=active]:bg-purple-600/30">
            Decay Analysis
          </TabsTrigger>
          <TabsTrigger value="projections" className="data-[state=active]:bg-purple-600/30">
            Projections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-400">Task Completion</p>
                    <p className="text-2xl font-bold text-white">{completionRate.toFixed(1)}%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-400" />
                </div>
                <Progress value={completionRate} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-400">Current Streak</p>
                    <p className="text-2xl font-bold text-white">{userProfile.streak}</p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-xs text-purple-300 mt-2">days consecutive</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-400">Avg Attribute</p>
                    <p className="text-2xl font-bold text-white">{averageAttributeValue.toFixed(1)}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-xs text-purple-300 mt-2">out of 100</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-400">Total XP</p>
                    <p className="text-2xl font-bold text-white">{userProfile.totalXP.toLocaleString()}</p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-xs text-purple-300 mt-2">lifetime earned</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attribute Breakdown */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Attribute Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {attributes.map((attr) => (
                  <div key={attr.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{attr.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" style={{ borderColor: attr.color, color: attr.color }}>
                          {attr.rank}
                        </Badge>
                        <span className="text-purple-300">{attr.value}/100</span>
                      </div>
                    </div>
                    <Progress
                      value={(attr.value / attr.maxValue) * 100}
                      className="h-2"
                      style={
                        {
                          "--progress-foreground": attr.color,
                        } as React.CSSProperties
                      }
                    />
                    <div className="flex justify-between text-xs text-purple-400">
                      <span>XP Gained: {attr.xpGained}</span>
                      <span>Decay: {(attr.decayRate * 100).toFixed(1)}%/day</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Path Progress */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Path Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activePaths.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No active paths</p>
                ) : (
                  activePaths.map((path) => (
                    <div key={path.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{path.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" style={{ borderColor: path.color, color: path.color }}>
                            {path.difficulty}
                          </Badge>
                          <span className="text-purple-300">{path.progress}%</span>
                        </div>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-purple-400">
                        <span>Stage: {path.currentStage}</span>
                        <span>Decay: {(path.decayRate * 100).toFixed(1)}%/day</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Task Analysis */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Task Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {completedTasks}/{totalTasks}
                  </div>
                  <p className="text-sm text-purple-400">Tasks Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {dailyTasks.reduce((sum, task) => sum + task.timeEstimate, 0)}
                  </div>
                  <p className="text-sm text-purple-400">Total Minutes</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {dailyTasks.reduce((sum, task) => sum + task.xpReward, 0)}
                  </div>
                  <p className="text-sm text-purple-400">Potential XP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progression" className="space-y-6">
          {/* Rank Progression */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Rank Progression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Rank {userProfile.rank}</h3>
                  <p className="text-purple-300">{userProfile.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-400">Next Rank: {nextRank}</p>
                  <p className="text-lg font-bold text-white">
                    {userProfile.currentXP}/{userProfile.nextRankXP} XP
                  </p>
                </div>
              </div>

              <Progress value={(userProfile.currentXP / userProfile.nextRankXP) * 100} className="h-4" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">{userProfile.nextRankXP - userProfile.currentXP}</p>
                  <p className="text-sm text-purple-400">XP Needed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">{daysToNextRank}</p>
                  <p className="text-sm text-purple-400">Est. Days</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">{userProfile.level}</p>
                  <p className="text-sm text-purple-400">Current Level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hunter Exams */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Hunter Examinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hunterExams.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No examinations available</p>
              ) : (
                <div className="space-y-4">
                  {hunterExams.map((exam) => (
                    <div key={exam.id} className="p-4 bg-purple-900/20 border border-purple-500/30 rounded">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold">{exam.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-purple-400 border-purple-400">
                            Target: {exam.targetRank}
                          </Badge>
                          <Badge variant={exam.unlocked ? "default" : "secondary"}>
                            {exam.unlocked ? "Available" : "Locked"}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-purple-300 text-sm mb-3">{exam.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-purple-400">Phases:</span>
                          <span className="text-white ml-2">{exam.phases.length}</span>
                        </div>
                        <div>
                          <span className="text-purple-400">Duration:</span>
                          <span className="text-white ml-2">{exam.duration} days</span>
                        </div>
                        <div>
                          <span className="text-purple-400">Attempts:</span>
                          <span className="text-white ml-2">{exam.attempts}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decay" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Decay Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded">
                    <h3 className="text-red-400 font-semibold mb-2">High Risk Attributes</h3>
                    {attributes
                      .filter((attr) => attr.decayRate > 0.1)
                      .map((attr) => (
                        <div key={attr.name} className="flex items-center justify-between text-sm">
                          <span className="text-white">{attr.name}</span>
                          <span className="text-red-400">{(attr.decayRate * 100).toFixed(1)}%/day</span>
                        </div>
                      ))}
                  </div>

                  <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                    <h3 className="text-green-400 font-semibold mb-2">Stable Attributes</h3>
                    {attributes
                      .filter((attr) => attr.decayRate <= 0.05)
                      .map((attr) => (
                        <div key={attr.name} className="flex items-center justify-between text-sm">
                          <span className="text-white">{attr.name}</span>
                          <span className="text-green-400">{(attr.decayRate * 100).toFixed(1)}%/day</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <h3 className="text-yellow-400 font-semibold mb-2">Recommendations</h3>
                  <ul className="space-y-1 text-sm text-purple-300">
                    <li>• Focus on high-decay attributes during daily practice</li>
                    <li>• Maintain consistency to prevent skill degradation</li>
                    <li>• Consider path adjustments for better attribute balance</li>
                    <li>• Use streak protection for critical periods</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Growth Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">30-Day Projection</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Estimated XP Gain:</span>
                      <span className="text-green-400">+{(userProfile.currentXP * 0.3).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Potential Rank:</span>
                      <span className="text-white">{userProfile.rank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Avg Attribute Growth:</span>
                      <span className="text-blue-400">+{(averageAttributeValue * 0.1).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold">90-Day Projection</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Estimated XP Gain:</span>
                      <span className="text-green-400">+{(userProfile.currentXP * 0.9).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Potential Rank:</span>
                      <span className="text-white">{nextRank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Avg Attribute Growth:</span>
                      <span className="text-blue-400">+{(averageAttributeValue * 0.3).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded">
                <h4 className="text-purple-400 font-semibold mb-2">Optimization Suggestions</h4>
                <ul className="space-y-1 text-sm text-purple-300">
                  <li>• Maintain current streak to maximize XP multipliers</li>
                  <li>• Focus on completing all daily tasks for consistent growth</li>
                  <li>• Consider activating additional paths for balanced development</li>
                  <li>• Prepare for upcoming Hunter Examinations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
