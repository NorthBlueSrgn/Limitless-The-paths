"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, AlertTriangle, Calendar, BarChart3, Flame } from "lucide-react"
import { useLimitlessData } from "@/hooks/use-limitless-data"

export function AdvancedStats() {
  const { userProfile, attributes, activePaths, decayMetrics } = useLimitlessData()

  // Mock data for demonstration
  const mockDecayMetrics = [
    {
      pathId: "chess_predator",
      pathName: "Chess Predator",
      currentDecay: 15,
      maxDecay: 100,
      lastActivity: "3 days ago",
      riskLevel: "Medium" as const,
      recommendations: ["Complete daily tactics training", "Play at least one game"],
    },
    {
      pathId: "creative_forge",
      pathName: "Creative Forge",
      currentDecay: 45,
      maxDecay: 100,
      lastActivity: "1 week ago",
      riskLevel: "High" as const,
      recommendations: ["Resume daily sketching", "Complete pending project"],
    },
  ]

  const xpHistory = [
    { date: "2024-01-01", xp: 0 },
    { date: "2024-01-07", xp: 150 },
    { date: "2024-01-14", xp: 320 },
    { date: "2024-01-21", xp: 280 },
    { date: "2024-01-28", xp: 450 },
  ]

  const consistencyScore = 75
  const weeklyStreak = 3
  const monthlyStreak = 0

  const riskColors = {
    Low: "border-green-500 text-green-400",
    Medium: "border-yellow-500 text-yellow-400",
    High: "border-red-500 text-red-400",
    Critical: "border-red-600 text-red-300",
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          Advanced Statistics
        </h1>
        <p className="text-gray-400 text-lg">Deep insights into your growth patterns and performance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-400" />
            <div className="text-3xl font-bold text-blue-400 mb-2">{consistencyScore}%</div>
            <div className="text-gray-400 text-sm font-medium">Consistency Score</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Flame className="h-12 w-12 mx-auto mb-4 text-orange-400" />
            <div className="text-3xl font-bold text-orange-400 mb-2">{weeklyStreak}</div>
            <div className="text-gray-400 text-sm font-medium">Weekly Streak</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-purple-400" />
            <div className="text-3xl font-bold text-purple-400 mb-2">{monthlyStreak}</div>
            <div className="text-gray-400 text-sm font-medium">Monthly Streak</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-green-400" />
            <div className="text-3xl font-bold text-green-400 mb-2">{userProfile.totalXP}</div>
            <div className="text-gray-400 text-sm font-medium">Total XP Earned</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="decay" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="decay" className="data-[state=active]:bg-purple-500/20">
            <AlertTriangle className="h-4 w-4\
