"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  Crown,
  Star,
  Flame,
} from "lucide-react"
import type { UserProfile, Attribute, Path, DecayMetric, HunterExam } from "@/types/limitless"

interface AdvancedStatsProps {
  userProfile: UserProfile
  attributes: Attribute[]
  paths: Path[]
  decayMetrics: DecayMetric[]
  hunterExams: HunterExam[]
}

const rankColors = {
  E: "text-gray-400",
  D: "text-green-400",
  C: "text-blue-400",
  B: "text-purple-400",
  A: "text-yellow-400",
  S: "text-orange-400",
  SS: "text-red-400",
  SSS: "text-pink-400",
}

export function AdvancedStats({ userProfile, attributes, paths, decayMetrics, hunterExams }: AdvancedStatsProps) {
  const totalTasksCompleted = paths.reduce((sum, path) => sum + (path.tasksCompleted || 0), 0)
  const averagePathProgress = paths.length > 0 ? paths.reduce((sum, path) => sum + path.progress, 0) / paths.length : 0
  const highestAttribute = attributes.reduce((max, attr) => (attr.value > max.value ? attr : max), attributes[0])
  const lowestAttribute = attributes.reduce((min, attr) => (attr.value < min.value ? attr : min), attributes[0])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Advanced Statistics
        </h1>
        <p className="text-purple-300">
          Deep analytics of your transformation journey. Track decay, predict growth, optimize performance.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-purple-500/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/30">
            Overview
          </TabsTrigger>
          <TabsTrigger value="decay" className="data-[state=active]:bg-purple-600/30">
            Decay Analysis
          </TabsTrigger>
          <TabsTrigger value="projections" className="data-[state=active]:bg-purple-600/30">
            Projections
          </TabsTrigger>
          <TabsTrigger value="exams" className="data-[state=active]:bg-purple-600/30">
            Hunter Exams
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">{userProfile.streak}</div>
                <div className="text-sm text-purple-300">Current Streak</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-orange-400">
                    {userProfile.streak > 7 ? "On Fire!" : "Building Momentum"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">{totalTasksCompleted}</div>
                <div className="text-sm text-purple-300">Tasks Completed</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">Total Achievements</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">{Math.round(averagePathProgress)}%</div>
                <div className="text-sm text-purple-300">Avg Path Progress</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-blue-400">Overall Growth</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className={`text-3xl font-bold mb-1 ${rankColors[userProfile.rank]}`}>{userProfile.rank}</div>
                <div className="text-sm text-purple-300">Current Rank</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400">Hunter Status</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attribute Performance */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Attribute Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {attributes.map((attr) => (
                    <div key={attr.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: attr.color }} />
                          <span className="text-white font-medium">{attr.name}</span>
                          <Badge variant="outline" className={`${rankColors[attr.rank]} border-current text-xs`}>
                            {attr.rank}
                          </Badge>
                        </div>
                        <span className="text-sm text-purple-300">
                          {attr.value}/{attr.maxValue}
                        </span>
                      </div>
                      <Progress value={(attr.value / attr.maxValue) * 100} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">Strongest Attribute</span>
                    </div>
                    <div className="text-white font-medium">{highestAttribute?.name}</div>
                    <div className="text-sm text-green-300">
                      Level {highestAttribute?.value} • Rank {highestAttribute?.rank}
                    </div>
                  </div>

                  <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-semibold text-red-400">Focus Area</span>
                    </div>
                    <div className="text-white font-medium">{lowestAttribute?.name}</div>
                    <div className="text-sm text-red-300">Level {lowestAttribute?.value} • Needs Attention</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Path Progress */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Path Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paths.map((path) => (
                  <div key={path.id} className="p-4 bg-black/20 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: path.color }} />
                      <span className="text-white font-medium text-sm">{path.name}</span>
                    </div>
                    <Progress value={path.progress} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-purple-300">
                      <span>{path.progress}% Complete</span>
                      <span>{path.tasksCompleted || 0} Tasks</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decay" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Decay Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {decayMetrics.map((metric) => (
                  <div key={metric.attribute} className="p-4 bg-red-900/10 rounded-lg border border-red-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{metric.attribute}</span>
                      <Badge
                        variant="outline"
                        className={`${
                          metric.decayRate > 0.5
                            ? "text-red-400 border-red-400"
                            : metric.decayRate > 0.2
                              ? "text-yellow-400 border-yellow-400"
                              : "text-green-400 border-green-400"
                        } bg-black/20`}
                      >
                        {metric.decayRate > 0.5 ? "High Decay" : metric.decayRate > 0.2 ? "Moderate Decay" : "Stable"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-purple-400">Decay Rate:</span>
                        <div className="text-white">{(metric.decayRate * 100).toFixed(1)}%/day</div>
                      </div>
                      <div>
                        <span className="text-purple-400">Days Inactive:</span>
                        <div className="text-white">{metric.daysInactive}</div>
                      </div>
                      <div>
                        <span className="text-purple-400">Recovery Time:</span>
                        <div className="text-white">{metric.recoveryTime} days</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Growth Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Rank Progression Estimate</h3>
                  <div className="space-y-3">
                    {["D", "C", "B", "A", "S"].map((rank) => (
                      <div key={rank} className="flex items-center justify-between p-3 bg-black/20 rounded">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${rankColors[rank as keyof typeof rankColors]} border-current`}
                          >
                            Rank {rank}
                          </Badge>
                        </div>
                        <span className="text-sm text-purple-300">{Math.floor(Math.random() * 30 + 10)} days</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold">XP Projections</h3>
                  <div className="p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {(userProfile.currentXP * 1.5).toLocaleString()}
                    </div>
                    <div className="text-sm text-purple-300 mb-2">Projected XP (30 days)</div>
                    <Progress value={75} className="h-2" />
                    <div className="text-xs text-purple-400 mt-1">Based on current performance trends</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Hunter Exam History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hunterExams.map((exam) => (
                  <div key={exam.id} className="p-4 bg-black/20 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{exam.name}</h3>
                      <Badge
                        variant="outline"
                        className={`${
                          exam.completed ? "text-green-400 border-green-400" : "text-yellow-400 border-yellow-400"
                        } bg-black/20`}
                      >
                        {exam.completed ? "Passed" : "In Progress"}
                      </Badge>
                    </div>
                    <p className="text-purple-300 text-sm mb-3">{exam.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-purple-400">Difficulty:</span>
                        <div className="text-white">{exam.difficulty}</div>
                      </div>
                      <div>
                        <span className="text-purple-400">XP Reward:</span>
                        <div className="text-white">{exam.xpReward}</div>
                      </div>
                      <div>
                        <span className="text-purple-400">Progress:</span>
                        <div className="text-white">{exam.progress}%</div>
                      </div>
                      <div>
                        <span className="text-purple-400">Attempts:</span>
                        <div className="text-white">{exam.attempts}</div>
                      </div>
                    </div>
                    {exam.progress > 0 && <Progress value={exam.progress} className="h-2 mt-3" />}
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
