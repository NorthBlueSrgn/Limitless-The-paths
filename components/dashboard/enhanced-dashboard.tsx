"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Crown,
  Zap,
  Target,
  TrendingUp,
  Star,
  Flame,
  Brain,
  Heart,
  Sparkles,
  Trophy,
  Calendar,
  Clock,
  CheckCircle2,
  BarChart3,
  Activity,
  Users,
  Award,
  Lightbulb,
  BookOpen,
  Sword,
  Shield,
  Eye,
  Compass,
} from "lucide-react"
import { TheOrder } from "@/components/ai/the-order"
import { useLimitlessData } from "@/hooks/use-limitless-data"

interface EnhancedDashboardProps {
  userProfile: any
}

export function EnhancedDashboard({ userProfile }: EnhancedDashboardProps) {
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [dailyTasks, setDailyTasks] = useState<any[]>([])
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false)
  const [storyContent, setStoryContent] = useState<any>(null)

  const { userProgress, recentAchievements, activePaths, weeklyStats, isLoading } = useLimitlessData(userProfile?.id)

  // Generate daily tasks on component mount
  useEffect(() => {
    generateDailyTasks()
  }, [userProfile])

  const generateDailyTasks = async () => {
    if (!userProfile) return

    setIsGeneratingTasks(true)
    try {
      const response = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile,
          userProgress,
          preferences: { count: 3 },
        }),
      })

      const data = await response.json()
      setDailyTasks(data.tasks || [])
    } catch (error) {
      console.error("Failed to generate tasks:", error)
    } finally {
      setIsGeneratingTasks(false)
    }
  }

  const generateStoryChapter = async () => {
    try {
      const response = await fetch("/api/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile,
          storyContext: {
            currentChapter: `Chapter ${Math.floor(userProfile.level / 5) + 1}`,
            recentAchievements,
            activePaths,
          },
          requestType: "chapter",
        }),
      })

      const data = await response.json()
      setStoryContent(data)
    } catch (error) {
      console.error("Failed to generate story:", error)
    }
  }

  const completeTask = async (taskId: string) => {
    try {
      const response = await fetch("/api/tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, userId: userProfile.id }),
      })

      if (response.ok) {
        setDailyTasks((prev) =>
          prev.map((task) => (task.id === taskId ? { ...task, status: "completed", completedAt: new Date() } : task)),
        )
      }
    } catch (error) {
      console.error("Failed to complete task:", error)
    }
  }

  const getStatIcon = (stat: string) => {
    const icons: Record<string, any> = {
      physical: Activity,
      mental: Brain,
      emotional: Heart,
      spiritual: Sparkles,
      social: Users,
      creativity: Lightbulb,
      wisdom: BookOpen,
      strength: Sword,
      resilience: Shield,
      focus: Eye,
      leadership: Crown,
    }
    return icons[stat] || Target
  }

  const getStatColor = (stat: string) => {
    const colors: Record<string, string> = {
      physical: "text-red-400",
      mental: "text-blue-400",
      emotional: "text-pink-400",
      spiritual: "text-purple-400",
      social: "text-green-400",
      creativity: "text-yellow-400",
      wisdom: "text-indigo-400",
      strength: "text-orange-400",
      resilience: "text-gray-400",
      focus: "text-cyan-400",
      leadership: "text-amber-400",
    }
    return colors[stat] || "text-gray-400"
  }

  const calculateLevelProgress = () => {
    const currentLevelXP = userProfile.level * 1000
    const nextLevelXP = (userProfile.level + 1) * 1000
    const progressXP = userProfile.totalXP - currentLevelXP
    const neededXP = nextLevelXP - currentLevelXP
    return Math.max(0, Math.min(100, (progressXP / neededXP) * 100))
  }

  const getStreakColor = () => {
    if (userProfile.streak >= 30) return "text-purple-400"
    if (userProfile.streak >= 14) return "text-blue-400"
    if (userProfile.streak >= 7) return "text-green-400"
    return "text-gray-400"
  }

  const completedTasksToday = dailyTasks.filter((task) => task.status === "completed").length
  const totalTasksToday = dailyTasks.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold font-orbitron bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Welcome back, {userProfile.username}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                {userProfile.rank} • Level {userProfile.level}
              </Badge>
              <span className="flex items-center space-x-1">
                <Flame className={`h-4 w-4 ${getStreakColor()}`} />
                <span className={getStreakColor()}>{userProfile.streak} day streak</span>
              </span>
              <span className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{userProfile.totalXP.toLocaleString()} XP</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsOrderOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
            >
              <Crown className="h-4 w-4 mr-2" />
              Consult The Order
            </Button>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Level Progress</p>
                  <p className="text-2xl font-bold">{userProfile.level}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <Progress value={calculateLevelProgress()} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">{Math.round(calculateLevelProgress())}% to next level</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Today's Tasks</p>
                  <p className="text-2xl font-bold">
                    {completedTasksToday}/{totalTasksToday}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <Progress value={(completedTasksToday / Math.max(1, totalTasksToday)) * 100} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">
                {Math.round((completedTasksToday / Math.max(1, totalTasksToday)) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Paths</p>
                  <p className="text-2xl font-bold">{activePaths?.length || 0}</p>
                </div>
                <Compass className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {activePaths?.length ? "Journeys in progress" : "Ready to begin"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Achievements</p>
                  <p className="text-2xl font-bold">{recentAchievements?.length || 0}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-xs text-gray-500 mt-3">Recent accomplishments</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-black/20 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600">
              <Target className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-green-600">
              <Activity className="h-4 w-4 mr-2" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="story" className="data-[state=active]:bg-orange-600">
              <BookOpen className="h-4 w-4 mr-2" />
              Story
            </TabsTrigger>
            <TabsTrigger value="paths" className="data-[state=active]:bg-pink-600">
              <Compass className="h-4 w-4 mr-2" />
              Paths
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Achievements */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    <span>Recent Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    {recentAchievements?.length ? (
                      <div className="space-y-3">
                        {recentAchievements.map((achievement, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-white">{achievement.title}</p>
                              <p className="text-xs text-gray-400">{achievement.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              +{achievement.xpReward} XP
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No recent achievements</p>
                        <p className="text-xs">Complete tasks to earn your first achievement!</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Weekly Progress */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <span>Weekly Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyStats ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-black/20 rounded-lg">
                            <p className="text-2xl font-bold text-green-400">{weeklyStats.tasksCompleted}</p>
                            <p className="text-xs text-gray-400">Tasks Completed</p>
                          </div>
                          <div className="text-center p-3 bg-black/20 rounded-lg">
                            <p className="text-2xl font-bold text-blue-400">{weeklyStats.xpGained}</p>
                            <p className="text-xs text-gray-400">XP Gained</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completion Rate</span>
                            <span className="text-green-400">{weeklyStats.completionRate}%</span>
                          </div>
                          <Progress value={weeklyStats.completionRate} />
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Building your weekly stats...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Today's Quests</h2>
              <Button
                onClick={generateDailyTasks}
                disabled={isGeneratingTasks}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isGeneratingTasks ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate New Tasks
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-4">
              {dailyTasks.map((task) => (
                <Card key={task.id} className="glass-card border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              task.status === "completed"
                                ? "bg-green-600"
                                : "bg-gradient-to-r from-purple-600 to-blue-600"
                            }`}
                          >
                            {task.status === "completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : (
                              <Target className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-medium ${
                                task.status === "completed" ? "line-through text-gray-400" : "text-white"
                              }`}
                            >
                              {task.title}
                            </h3>
                            <p className="text-sm text-gray-400">{task.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{task.estimatedMinutes} min</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>{task.xpReward} XP</span>
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: task.difficulty }).map((_, i) => (
                              <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {task.status !== "completed" && (
                        <Button
                          onClick={() => completeTask(task.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {dailyTasks.length === 0 && !isGeneratingTasks && (
                <Card className="glass-card border-white/10">
                  <CardContent className="p-8 text-center">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                    <p className="text-gray-400 mb-4">Generate your personalized daily quests to begin your journey</p>
                    <Button onClick={generateDailyTasks} className="bg-gradient-to-r from-purple-600 to-blue-600">
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Tasks
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(userProfile.stats || {}).map(([stat, value]) => {
                const IconComponent = getStatIcon(stat)
                const colorClass = getStatColor(stat)
                return (
                  <Card key={stat} className="glass-card border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <IconComponent className={`h-5 w-5 ${colorClass}`} />
                          <span className="font-medium capitalize">{stat}</span>
                        </div>
                        <span className="text-2xl font-bold">{value as number}</span>
                      </div>
                      <Progress value={Math.min(100, ((value as number) / 100) * 100)} />
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>Level {Math.floor((value as number) / 10) + 1}</span>
                        <span>{value as number}/100</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="story" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Epic Journey</h2>
              <Button onClick={generateStoryChapter} className="bg-gradient-to-r from-orange-600 to-red-600">
                <BookOpen className="h-4 w-4 mr-2" />
                Generate Chapter
              </Button>
            </div>

            {storyContent ? (
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-orange-400" />
                    <span>{storyContent.chapterTitle}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{storyContent.content}</p>
                  </div>

                  {storyContent.choices && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Choose your path:</h4>
                      {storyContent.choices.map((choice: any, index: number) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full text-left justify-start h-auto p-4 border-white/20 hover:border-purple-500 bg-transparent"
                        >
                          <div>
                            <p className="font-medium">{choice.text}</p>
                            <p className="text-xs text-gray-400 mt-1">{choice.consequence}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}

                  {storyContent.nextChapterHint && (
                    <div className="p-3 bg-black/20 rounded-lg border border-purple-500/20">
                      <p className="text-sm text-purple-300">
                        <Eye className="h-4 w-4 inline mr-2" />
                        {storyContent.nextChapterHint}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card border-white/10">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Your story awaits</h3>
                  <p className="text-gray-400 mb-4">Generate your next chapter to continue your epic journey</p>
                  <Button onClick={generateStoryChapter} className="bg-gradient-to-r from-orange-600 to-red-600">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Begin Story
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="paths" className="space-y-6">
            <h2 className="text-2xl font-bold">Active Paths</h2>

            <div className="grid gap-4">
              {activePaths?.length ? (
                activePaths.map((path: any, index: number) => (
                  <Card key={index} className="glass-card border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-white">{path.name}</h3>
                        <Badge variant="outline">{path.progress}% Complete</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{path.description}</p>
                      <Progress value={path.progress} className="mb-2" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{path.currentMilestone}</span>
                        <span>{path.nextMilestone}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="glass-card border-white/10">
                  <CardContent className="p-8 text-center">
                    <Compass className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No active paths</h3>
                    <p className="text-gray-400 mb-4">Discover and embark on growth paths tailored to your journey</p>
                    <Button className="bg-gradient-to-r from-pink-600 to-purple-600">
                      <Compass className="h-4 w-4 mr-2" />
                      Explore Paths
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* The Order AI Assistant */}
      <TheOrder
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        userProfile={userProfile}
        userProgress={userProgress}
      />
    </div>
  )
}
