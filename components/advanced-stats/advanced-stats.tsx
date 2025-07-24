"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, AlertTriangle, Calendar, BarChart3, Target, Flame } from "lucide-react"
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
            <AlertTriangle className="h-4 w-4 mr-2" />
            Decay Monitor
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-purple-500/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="streaks" className="data-[state=active]:bg-purple-500/20">
            <Flame className="h-4 w-4 mr-2" />
            Streaks
          </TabsTrigger>
          <TabsTrigger value="evolution" className="data-[state=active]:bg-purple-500/20">
            <Target className="h-4 w-4 mr-2" />
            Evolution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="decay" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                Path Decay Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockDecayMetrics.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No active paths to monitor</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockDecayMetrics.map((metric) => (
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

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Decay Level</span>
                          <span className="text-white">{metric.currentDecay}%</span>
                        </div>
                        <Progress
                          value={metric.currentDecay}
                          className={`h-2 ${
                            metric.riskLevel === "High"
                              ? "bg-red-900/50"
                              : metric.riskLevel === "Medium"
                                ? "bg-yellow-900/50"
                                : "bg-gray-800/50"
                          }`}
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                          {metric.recommendations.map((rec, index) => (
                            <li key={index} className="text-xs text-gray-400 flex items-center space-x-2">
                              <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Attribute Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attributes.map((attr) => (
                    <div key={attr.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">{attr.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 text-xs">+{attr.xpGained}</span>
                          <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                            {attr.rank}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(attr.value / attr.maxValue) * 100} className="h-2 bg-gray-800/50" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">XP History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-400">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>XP tracking chart would go here</p>
                  <p className="text-xs text-gray-500">Showing weekly XP gains over time</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="streaks" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Streak Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Streak calendar visualization would go here</p>
                <p className="text-xs text-gray-500">Track daily consistency patterns</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Soul Evolution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Soul map comparison would go here</p>
                <p className="text-xs text-gray-500">Compare your growth from Week 1 to now</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
