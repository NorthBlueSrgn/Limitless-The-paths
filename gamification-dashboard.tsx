"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Star, Target, Zap, Crown, Award, TrendingUp, Calendar, CheckCircle2, Lock } from "lucide-react"

// Types
interface User {
  id: string
  name: string
  avatar: string
  level: number
  xp: number
  totalXP: number
  rank: number
  streak: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
  unlocked: boolean
  progress?: number
  maxProgress?: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface Challenge {
  id: string
  title: string
  description: string
  xpReward: number
  timeLeft: string
  progress: number
  maxProgress: number
  completed: boolean
}

interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  xp: number
  level: number
}

export default function GamificationDashboard() {
  const [user, setUser] = useState<User>({
    id: "1",
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 12,
    xp: 2450,
    totalXP: 15750,
    rank: 3,
    streak: 7,
  })

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first task",
      icon: "👶",
      xpReward: 100,
      unlocked: true,
      rarity: "common",
    },
    {
      id: "2",
      title: "Streak Master",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      xpReward: 500,
      unlocked: true,
      rarity: "rare",
    },
    {
      id: "3",
      title: "Level Up!",
      description: "Reach level 10",
      icon: "⭐",
      xpReward: 1000,
      unlocked: true,
      rarity: "epic",
    },
    {
      id: "4",
      title: "Champion",
      description: "Reach top 3 on leaderboard",
      icon: "👑",
      xpReward: 2000,
      unlocked: true,
      rarity: "legendary",
    },
    {
      id: "5",
      title: "Task Master",
      description: "Complete 100 tasks",
      icon: "✅",
      xpReward: 750,
      unlocked: false,
      progress: 67,
      maxProgress: 100,
      rarity: "rare",
    },
    {
      id: "6",
      title: "Social Butterfly",
      description: "Help 50 team members",
      icon: "🦋",
      xpReward: 1500,
      unlocked: false,
      progress: 23,
      maxProgress: 50,
      rarity: "epic",
    },
  ])

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Daily Grind",
      description: "Complete 5 tasks today",
      xpReward: 200,
      timeLeft: "18h 32m",
      progress: 3,
      maxProgress: 5,
      completed: false,
    },
    {
      id: "2",
      title: "Team Player",
      description: "Collaborate on 3 projects this week",
      xpReward: 400,
      timeLeft: "4d 12h",
      progress: 1,
      maxProgress: 3,
      completed: false,
    },
    {
      id: "3",
      title: "Speed Demon",
      description: "Complete a task in under 30 minutes",
      xpReward: 300,
      timeLeft: "2d 8h",
      progress: 0,
      maxProgress: 1,
      completed: false,
    },
  ])

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", xp: 18500, level: 15 },
    { rank: 2, name: "Mike Rodriguez", avatar: "/placeholder.svg?height=32&width=32", xp: 16200, level: 13 },
    { rank: 3, name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32", xp: 15750, level: 12 },
    { rank: 4, name: "Emma Wilson", avatar: "/placeholder.svg?height=32&width=32", xp: 14300, level: 11 },
    { rank: 5, name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", xp: 13800, level: 11 },
  ])

  const xpToNextLevel = (user.level + 1) * 1000 - (user.totalXP % 1000)
  const levelProgress = (user.xp / ((user.level + 1) * 1000)) * 100

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const completeChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId ? { ...challenge, completed: true, progress: challenge.maxProgress } : challenge,
      ),
    )

    const challenge = challenges.find((c) => c.id === challengeId)
    if (challenge) {
      setUser((prev) => ({
        ...prev,
        xp: prev.xp + challenge.xpReward,
        totalXP: prev.totalXP + challenge.xpReward,
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Gamification Dashboard</h1>
          <p className="text-gray-600">Track your progress, earn rewards, and compete with others!</p>
        </div>

        {/* User Profile Card */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-4 border-white">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <div className="flex items-center space-x-4 text-purple-100">
                    <span className="flex items-center">
                      <Crown className="h-4 w-4 mr-1" />
                      Level {user.level}
                    </span>
                    <span className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1" />
                      Rank #{user.rank}
                    </span>
                    <span className="flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      {user.streak} day streak
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{user.xp.toLocaleString()}</div>
                <div className="text-purple-100">XP Points</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to Level {user.level + 1}</span>
                <span>{xpToNextLevel} XP needed</span>
              </div>
              <Progress value={levelProgress} className="h-3 bg-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{user.totalXP.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total XP</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{achievements.filter((a) => a.unlocked).length}</div>
                  <div className="text-sm text-gray-600">Achievements</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{challenges.filter((c) => c.completed).length}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{user.streak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements
                    .filter((a) => a.unlocked)
                    .slice(0, 3)
                    .map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold">{achievement.title}</div>
                          <div className="text-sm text-gray-600">{achievement.description}</div>
                        </div>
                        <Badge className={getRarityColor(achievement.rarity)}>+{achievement.xpReward} XP</Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Active Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {challenges
                    .filter((c) => !c.completed)
                    .slice(0, 3)
                    .map((challenge) => (
                      <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold">{challenge.title}</div>
                            <div className="text-sm text-gray-600">{challenge.description}</div>
                          </div>
                          <Badge variant="outline">+{challenge.xpReward} XP</Badge>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>
                            {challenge.progress}/{challenge.maxProgress}
                          </span>
                          <span className="text-orange-600">{challenge.timeLeft}</span>
                        </div>
                        <Progress value={(challenge.progress / challenge.maxProgress) * 100} className="h-2" />
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`${achievement.unlocked ? "bg-white" : "bg-gray-50"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`text-3xl ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>
                        {achievement.unlocked ? achievement.icon : "🔒"}
                      </div>
                      <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                    </div>
                    <h3 className={`font-semibold mb-1 ${achievement.unlocked ? "" : "text-gray-500"}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm mb-3 ${achievement.unlocked ? "text-gray-600" : "text-gray-400"}`}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">+{achievement.xpReward} XP</span>
                      </div>
                    ) : achievement.progress !== undefined ? (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                          <span className="text-gray-500">+{achievement.xpReward} XP</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress!) * 100} className="h-2" />
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <Lock className="h-4 w-4 mr-1" />
                        <span className="text-sm">Locked</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className={challenge.completed ? "bg-green-50 border-green-200" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {challenge.completed ? (
                            <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                          ) : (
                            <Target className="h-5 w-5 mr-2 text-blue-600" />
                          )}
                          {challenge.title}
                        </CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </div>
                      <Badge variant={challenge.completed ? "default" : "outline"}>+{challenge.xpReward} XP</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>
                          Progress: {challenge.progress}/{challenge.maxProgress}
                        </span>
                        {!challenge.completed && (
                          <span className="flex items-center text-orange-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {challenge.timeLeft}
                          </span>
                        )}
                      </div>
                      <Progress
                        value={(challenge.progress / challenge.maxProgress) * 100}
                        className={`h-3 ${challenge.completed ? "bg-green-200" : ""}`}
                      />
                      {!challenge.completed && challenge.progress < challenge.maxProgress && (
                        <Button onClick={() => completeChallenge(challenge.id)} className="w-full" variant="outline">
                          Simulate Progress
                        </Button>
                      )}
                      {challenge.completed && (
                        <div className="text-center text-green-600 font-medium">✅ Challenge Completed!</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Global Leaderboard
                </CardTitle>
                <CardDescription>See how you rank against other users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        entry.name === user.name ? "bg-blue-50 border-2 border-blue-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            entry.rank === 1
                              ? "bg-yellow-400 text-yellow-900"
                              : entry.rank === 2
                                ? "bg-gray-300 text-gray-700"
                                : entry.rank === 3
                                  ? "bg-orange-400 text-orange-900"
                                  : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {entry.rank <= 3 ? (entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉") : entry.rank}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {entry.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{entry.name}</div>
                          <div className="text-sm text-gray-600">Level {entry.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{entry.xp.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
