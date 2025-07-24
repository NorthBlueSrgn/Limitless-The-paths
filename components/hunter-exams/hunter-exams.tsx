"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Crown, Shield, Zap, Clock, CheckCircle2, Lock, AlertTriangle } from "lucide-react"
import { useLimitlessData } from "@/hooks/use-limitless-data"

export function HunterExams() {
  const { hunterExams, userProfile } = useLimitlessData()
  const [selectedExam, setSelectedExam] = useState<string | null>(null)

  const examHistory = [
    {
      name: "The Third Gate",
      rank: "B",
      status: "PASSED",
      daysAgo: 14,
      description: "Rank B Qualification",
      score: 95,
    },
    {
      name: "The Second Gate",
      rank: "C",
      status: "PASSED",
      daysAgo: 60,
      description: "Rank C Qualification",
      score: 87,
    },
    {
      name: "The First Gate",
      rank: "D",
      status: "PASSED",
      daysAgo: 120,
      description: "Rank D Qualification",
      score: 92,
    },
  ]

  const examRewards = [
    {
      title: "Strategic Hunter",
      description: "+15% XP for Mental Mastery paths",
      icon: Crown,
      color: "text-purple-400",
      unlocked: true,
    },
    {
      title: "Iron Will",
      description: "Reduced stat decay rate",
      icon: Shield,
      color: "text-blue-400",
      unlocked: true,
    },
    {
      title: "Dedicated Hunter",
      description: "Unlocked advanced path customization",
      icon: Zap,
      color: "text-purple-400",
      unlocked: false,
    },
  ]

  const nextExam = hunterExams[0]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          Hunter Examination System
        </h1>
        <p className="text-gray-400 text-lg">Prove your worth and ascend to higher ranks through rigorous trials.</p>
      </div>

      {/* Current Rank Status */}
      <Card className="glass-card border-purple-500/30 bg-purple-500/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center neon-glow">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="font-orbitron text-2xl font-bold text-purple-400 rank-glow">RANK {userProfile.rank}</h2>
                <p className="text-gray-300">{userProfile.title}</p>
                <p className="text-sm text-gray-400">
                  {userProfile.currentXP} / {userProfile.nextRankXP} XP to next exam
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-2">Progress to Next Exam</div>
              <Progress
                value={(userProfile.currentXP / userProfile.nextRankXP) * 100}
                className="h-3 w-48 bg-gray-800/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Available Exam */}
        {nextExam && (
          <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                  Next Examination
                </CardTitle>
                <Badge variant="outline" className="border-yellow-500 text-yellow-400 font-orbitron">
                  {nextExam.targetRank} RANK
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-orbitron text-xl font-bold text-yellow-400 mb-2">{nextExam.name}</h3>
                <p className="text-gray-300">{nextExam.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-white">Examination Phases</h4>
                {nextExam.phases.map((phase, index) => (
                  <div key={phase.id} className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        phase.completed ? "bg-green-500" : "bg-gray-600"
                      }`}
                    >
                      {phase.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-white text-sm">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{phase.name}</div>
                      <div className="text-sm text-gray-400">{phase.description}</div>
                      {phase.timeLimit && (
                        <div className="flex items-center space-x-1 text-xs text-yellow-400 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{phase.timeLimit} minutes</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-white">Requirements</h4>
                <div className="space-y-1">
                  {nextExam.phases[0]?.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <AlertTriangle className="h-3 w-3 text-yellow-400" />
                      <span className="text-gray-400">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                disabled={!nextExam.unlocked}
              >
                {nextExam.unlocked ? (
                  "Begin Examination"
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Requirements Not Met
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Exam Rewards */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Hunter Privileges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {examRewards.map((reward, index) => {
              const Icon = reward.icon
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    reward.unlocked ? "bg-purple-500/10 border-purple-500/30" : "bg-black/20 border-gray-600/30"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-6 w-6 ${reward.unlocked ? reward.color : "text-gray-500"} mt-1`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-bold ${reward.unlocked ? "text-white" : "text-gray-500"}`}>
                          {reward.title}
                        </h3>
                        {reward.unlocked ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">ACTIVE</Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-500 text-gray-500">
                            LOCKED
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${reward.unlocked ? "text-gray-300" : "text-gray-500"}`}>
                        {reward.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Examination History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Examination History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {examHistory.map((exam, index) => (
              <div key={index} className="p-4 bg-black/20 rounded-xl border border-green-500/30">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-orbitron text-lg font-bold text-white">{exam.name}</h3>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">{exam.status}</Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{exam.description}</p>
                    <p className="text-xs text-gray-500">{exam.daysAgo} days ago</p>
                  </div>
                  <div className="text-right">
                    <div className="font-orbitron text-xl font-bold text-green-400 mb-1">{exam.score}%</div>
                    <Badge variant="outline" className="border-green-500 text-green-400 font-orbitron">
                      RANK {exam.rank}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
