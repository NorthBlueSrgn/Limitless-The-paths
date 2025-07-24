"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, AlertTriangle, BarChart3, Target, Flame, Activity } from "lucide-react"
import type { UserProfile, Attribute, Path } from "@/types/limitless"

interface AdvancedStatsProps {
  userProfile: UserProfile
  attributes: Attribute[]
  paths: Path[]
}

export function AdvancedStats({ userProfile, attributes, paths }: AdvancedStatsProps) {
  // Mock data for demonstration
  const streakData = {
    current: userProfile.streak,
    longest: 45,
    weekly: 7,
    monthly: 23
  }

  const decayMetrics = [
    {
      pathId: "path_of_mastery",
      pathName: "Path of Mastery", 
      currentDecay: 15,
      maxDecay: 100,
      lastActivity: "2 days ago",
      riskLevel: "Medium" as const
    },
    {
      pathId: "creative_forge",
      pathName: "Creative Forge",
      currentDecay: 45,
      maxDecay: 100, 
      lastActivity: "1 week ago",
      riskLevel: "High" as const
    }
  ]

  const taskCategories = [
    { name: "Spiritual", completed: 23, total: 30, percentage: 77 },
    { name: "Physical", completed: 18, total: 25, percentage: 72 },
    { name: "Intelligence", completed: 28, total: 32, percentage: 88 },
    { name: "Creativity", completed: 15, total: 20, percentage: 75 },
    { name: "Health", completed: 22, total: 24, percentage: 92 },
    { name: "Resilience", completed: 20, total: 28, percentage: 71 }
  ]

  const riskColors = {
    Low: "border-green-500 text-green-400",
    Medium: "border-yellow-500 text-yellow-400", 
    High: "border-red-500 text-red-400",
    Critical: "border-red-600 text-red-300"
  }

  const nextRankProjection = {
    currentXP: userProfile.currentXP,
    requiredXP: userProfile.nextRankXP,
    dailyAverage: 125,
    estimatedDays: Math.ceil((userProfile.nextRankXP - userProfile.currentXP) / 125)
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-primary" />
            <span className="font-orbitron chapter-title">Advanced Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 manga-text">
            Deep insights into your growth patterns, performance metrics, and optimization opportunities. 
            The Order analyzes every data point to guide your ascension.
          </p>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Flame className="h-12 w-12 mx-auto mb-4 text-orange-400" />
            <div className="text-3xl font-bold text-orange-400 mb-2">{streakData.current}</div>
            <div className="text-gray-400 text-sm font-medium">Current Streak</div>
            <div className="text-xs text-gray-500 mt-1">Longest: {streakData.longest} days</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-400" />
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {Math.round((taskCategories.reduce((acc, cat) => acc + cat.percentage, 0) / taskCategories.length))}%
            </div>
            <div className="text-gray-400 text-sm font-medium">Avg Completion</div>
            <div className="text-xs text-gray-500 mt-1">Across all categories</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-purple-400" />
            <div className="text-3xl font-bold text-purple-400 mb-2">{nextRankProjection.estimatedDays}</div>
            <div className="text-gray-400 text-sm font-medium">Days to Next Rank</div>
            <div className="text-xs text-gray-500 mt-1">At current pace</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Activity className="h-12 w-12 mx-auto mb-4 text-green-400" />
            <div className="text-3xl font-bold text-green-400 mb-2">{paths.filter(p => p.isActive).length}</div>
            <div className="text-gray-400 text-sm font-medium">Active Paths</div>
            <div className="text-xs text-gray-500 mt-1">Avg progress: 55%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="decay" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="decay">Decay Monitor</TabsTrigger>
          <TabsTrigger value="categories">Task Categories</TabsTrigger>
          <TabsTrigger value="streaks">Streak Analysis</TabsTrigger>
          <TabsTrigger value="projection">Rank Projection</TabsTrigger>
        </TabsList>

        <TabsContent value="decay" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Path Decay Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {decayMetrics.map((metric) => (
                  <div key={metric.pathId} className="p-4 bg-black/20 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white">{metric.pathName}</h3>
                        <p className="text-gray-400 text-sm">Last activity: {metric.lastActivity}</p>
                      </div>
                      <Badge variant="outline" className={riskColors[metric.riskLevel]}>
                        {metric.riskLevel} Risk
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Decay Level</span>
                        <span className="text-white">{metric.currentDecay}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={metric.currentDecay} className="h-3" />
                        <div 
                          className="decay-indicator absolute top-0 left-0 h-3 rounded"
                          style={{ width: `${metric.currentDecay}%` }}
                        ></div>
                      </div>
                    </div>

                    {metric.currentDecay > 30 && (
                      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                        ⚠️ High decay detected. Resume activity to prevent skill degradation.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Task Category Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taskCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {category.completed}/{category.total}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={category.percentage >= 80 ? "text-green-400 border-green-500" : 
                                   category.percentage >= 60 ? "text-yellow-400 border-yellow-500" :
                                   "text-red-400 border-red-500"}
                        >
                          {category.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  Streak Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-black/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">{streakData.current}</div>
                    <div className="text-sm text-gray-400">Current</div>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">{streakData.longest}</div>
                    <div className="text-sm text-gray-400">Longest</div>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">{streakData.weekly}</div>
                    <div className="text-sm text-gray-400">This Week</div>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg">\
