"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Crown, Zap, Target, BookOpen, TrendingUp } from "lucide-react"

import type { UserData, Path } from "./types"
import { calculateAttributeRank, calculateOverallRank, getNextRankThreshold, getRankColor } from "./utils/ranking"
import { saveUserData, loadUserData, createInitialUserData, shouldResetDaily, shouldResetWeekly } from "./utils/storage"
import { SAMPLE_PATHS, createCustomPath } from "./utils/paths"
import { RadarChart } from "./components/radar-chart"
import { PathCard } from "./components/path-card"

export default function LimitlessDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [newPathGoal, setNewPathGoal] = useState("")
  const [isCreatePathOpen, setIsCreatePathOpen] = useState(false)

  // Initialize or load user data
  useEffect(() => {
    let data = loadUserData()

    if (!data) {
      data = createInitialUserData()
      saveUserData(data)
    } else {
      // Check for resets
      const now = new Date().toISOString()
      let needsSave = false

      if (shouldResetDaily(data.lastDailyReset)) {
        // Reset daily tasks
        data.activePaths = data.activePaths.map((path) => ({
          ...path,
          prerequisites: path.prerequisites.map((prereq) =>
            prereq.type === "daily" ? { ...prereq, completed: false } : prereq,
          ),
        }))
        data.lastDailyReset = now
        needsSave = true
      }

      if (shouldResetWeekly(data.lastWeeklyReset)) {
        // Reset weekly tasks
        data.activePaths = data.activePaths.map((path) => ({
          ...path,
          prerequisites: path.prerequisites.map((prereq) =>
            prereq.type === "weekly" ? { ...prereq, completed: false, weeklyProgress: 0 } : prereq,
          ),
        }))
        data.lastWeeklyReset = now
        needsSave = true
      }

      if (needsSave) {
        saveUserData(data)
      }
    }

    setUserData(data)
  }, [])

  // Save data whenever userData changes
  useEffect(() => {
    if (userData) {
      saveUserData(userData)
    }
  }, [userData])

  const addPath = (pathTemplate: Omit<Path, "id" | "isActive">) => {
    if (!userData) return

    const newPath: Path = {
      ...pathTemplate,
      id: `path-${Date.now()}`,
      isActive: true,
    }

    setUserData((prev) =>
      prev
        ? {
            ...prev,
            activePaths: [...prev.activePaths, newPath],
          }
        : null,
    )
  }

  const createNewPath = () => {
    if (!newPathGoal.trim()) return

    const pathTemplate = createCustomPath(newPathGoal.trim())
    addPath(pathTemplate)
    setNewPathGoal("")
    setIsCreatePathOpen(false)
  }

  const togglePrerequisite = (pathId: string, prereqId: string) => {
    if (!userData) return

    setUserData((prev) => {
      if (!prev) return null

      const updatedPaths = prev.activePaths.map((path) => {
        if (path.id !== pathId) return path

        const updatedPrereqs = path.prerequisites.map((prereq) => {
          if (prereq.id !== prereqId) return prereq

          const newCompleted = !prereq.completed
          let newWeeklyProgress = prereq.weeklyProgress || 0

          if (prereq.type === "weekly" && newCompleted && prereq.weeklyProgress !== undefined) {
            newWeeklyProgress = Math.min((prereq.weeklyProgress || 0) + 1, prereq.weeklyTarget || 1)
          }

          return {
            ...prereq,
            completed: prereq.type === "daily" ? newCompleted : newWeeklyProgress >= (prereq.weeklyTarget || 1),
            weeklyProgress: prereq.type === "weekly" ? newWeeklyProgress : undefined,
          }
        })

        return { ...path, prerequisites: updatedPrereqs }
      })

      // Calculate attribute and XP gains
      const completedPrereq = prev.activePaths
        .find((p) => p.id === pathId)
        ?.prerequisites.find((p) => p.id === prereqId)

      if (completedPrereq && !completedPrereq.completed) {
        const updatedAttributes = { ...prev.attributes }
        const xpGain = completedPrereq.xpReward

        // Apply attribute rewards
        Object.entries(completedPrereq.attributeRewards).forEach(([attrName, reward]) => {
          if (updatedAttributes[attrName]) {
            const newValue = updatedAttributes[attrName].value + reward
            updatedAttributes[attrName] = {
              ...updatedAttributes[attrName],
              value: newValue,
              rank: calculateAttributeRank(newValue),
            }
          }
        })

        const newTotalXP = prev.totalXP + xpGain
        const newOverallRank = calculateOverallRank(updatedAttributes)

        return {
          ...prev,
          activePaths: updatedPaths,
          attributes: updatedAttributes,
          totalXP: newTotalXP,
          overallRank: newOverallRank,
          level: Math.floor(newTotalXP / 1000) + 1,
        }
      }

      return { ...prev, activePaths: updatedPaths }
    })
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading your path...</div>
      </div>
    )
  }

  const totalActivePaths = userData.activePaths.length
  const completedTasksToday = userData.activePaths.reduce(
    (sum, path) => sum + path.prerequisites.filter((p) => p.type === "daily" && p.completed).length,
    0,
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-black border-b border-purple-500/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Limitless: The Path
              </h1>
              <p className="text-purple-300 mt-1">Rise beyond your limits, Hunter {userData.name}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-400">{userData.totalXP.toLocaleString()}</div>
              <div className="text-purple-300">Total XP</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Crown className={`h-8 w-8 mx-auto mb-2 ${getRankColor(userData.overallRank)}`} />
              <div className={`text-2xl font-bold ${getRankColor(userData.overallRank)}`}>{userData.overallRank}</div>
              <div className="text-purple-300 text-sm">Overall Rank</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">{userData.level}</div>
              <div className="text-purple-300 text-sm">Level</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{totalActivePaths}</div>
              <div className="text-purple-300 text-sm">Active Paths</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{completedTasksToday}</div>
              <div className="text-purple-300 text-sm">Tasks Today</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-purple-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="attributes" className="data-[state=active]:bg-purple-600">
              Attributes
            </TabsTrigger>
            <TabsTrigger value="paths" className="data-[state=active]:bg-purple-600">
              Paths
            </TabsTrigger>
            <TabsTrigger value="story" className="data-[state=active]:bg-purple-600">
              Story
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-300">Attribute Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadarChart attributes={userData.attributes} />
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-300">Attribute Rankings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.values(userData.attributes).map((attr) => {
                    const { nextRank, threshold, progress } = getNextRankThreshold(attr.value)
                    return (
                      <div key={attr.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{attr.icon}</span>
                            <span className="text-sm font-medium text-gray-300">{attr.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getRankColor(attr.rank)} border-current`}>{attr.rank}</Badge>
                            <span className="text-xs text-gray-400">{attr.value}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Progress to {nextRank}</span>
                            <span>{threshold - attr.value} needed</span>
                          </div>
                          <Progress value={progress} className="h-1 bg-gray-800" />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attributes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(userData.attributes).map((attr) => {
                const { nextRank, threshold, progress } = getNextRankThreshold(attr.value)
                return (
                  <Card key={attr.name} className="bg-gray-900 border-purple-500/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{attr.icon}</span>
                          <CardTitle className="text-lg text-purple-300">{attr.name}</CardTitle>
                        </div>
                        <Badge className={`${getRankColor(attr.rank)} border-current text-lg px-3 py-1`}>
                          {attr.rank}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{attr.value}</div>
                        <div className="text-sm text-gray-400">Current Value</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress to {nextRank}</span>
                          <span className="text-purple-300">{threshold - attr.value} needed</span>
                        </div>
                        <Progress value={progress} className="h-3 bg-gray-800" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="paths" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-purple-300">Your Active Paths</h2>
              <Dialog open={isCreatePathOpen} onOpenChange={setIsCreatePathOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Path
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-purple-300">Create New Path</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Goal or Skill</label>
                      <Input
                        value={newPathGoal}
                        onChange={(e) => setNewPathGoal(e.target.value)}
                        placeholder="e.g., fitness, meditation, coding..."
                        className="bg-gray-800 border-purple-500/30 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <p className="text-sm text-gray-400">Or choose a preset:</p>
                      {SAMPLE_PATHS.map((path) => (
                        <Button
                          key={path.name}
                          variant="outline"
                          onClick={() => addPath(path)}
                          className="justify-start border-purple-500/30 hover:bg-purple-600/20"
                        >
                          {path.name}
                        </Button>
                      ))}
                    </div>
                    <Button onClick={createNewPath} className="w-full bg-purple-600 hover:bg-purple-700">
                      Create Path
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userData.activePaths.map((path) => (
                <PathCard key={path.id} path={path} onTogglePrerequisite={togglePrerequisite} />
              ))}

              {userData.activePaths.length === 0 && (
                <Card className="bg-gray-900 border-purple-500/30 col-span-full">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-purple-300 mb-2">No Active Paths</h3>
                    <p className="text-gray-400 mb-4">Begin your journey by creating your first path</p>
                    <Button onClick={() => setIsCreatePathOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Path
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="story" className="space-y-6">
            <Card className="bg-gray-900 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300">Story Mode</CardTitle>
                <p className="text-gray-400">Your personal journey unfolds...</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Chapter 1: The Awakening</h3>
                  <p className="text-gray-300 leading-relaxed">
                    In a world where potential lies dormant within every soul, you have taken the first step on the path
                    to limitless growth. The system has recognized your determination, Hunter {userData.name}. Your
                    current rank of {userData.overallRank} is merely the beginning of your ascension.
                  </p>
                  <p className="text-gray-300 leading-relaxed mt-3">
                    Each path you choose will forge your destiny. Every task completed strengthens not just your
                    attributes, but your very essence. The question remains: How far will you rise?
                  </p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                    Story Mode - Coming Soon
                  </Badge>
                  <p className="text-sm text-gray-400 mt-2">AI-generated chapters will be unlocked as you progress</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
