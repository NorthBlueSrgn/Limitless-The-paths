"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Crown, Shield, Zap } from "lucide-react"

export function HunterExams() {
  const examHistory = [
    {
      name: "The Third Gate",
      rank: "B",
      status: "PASSED",
      daysAgo: 14,
      description: "Rank B Qualification",
    },
    {
      name: "The Second Gate",
      rank: "C",
      status: "PASSED",
      daysAgo: 60,
      description: "Rank C Qualification",
    },
    {
      name: "The First Gate",
      rank: "D",
      status: "PASSED",
      daysAgo: 120,
      description: "Rank D Qualification",
    },
  ]

  const examRewards = [
    {
      title: "Strategic Hunter",
      description: "+15% XP for Mental Mastery paths",
      icon: Crown,
      color: "text-purple-400",
    },
    {
      title: "Iron Will",
      description: "Reduced stat decay rate",
      icon: Shield,
      color: "text-blue-400",
    },
    {
      title: "Dedicated Hunter",
      description: "Unlocked advanced path customization",
      icon: Zap,
      color: "text-purple-400",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          Hunter Examination System
        </h1>
        <p className="text-gray-400 text-lg">Prove your worth and ascend to higher ranks through rigorous trials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Examination History */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Examination History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {examHistory.map((exam, index) => (
              <div key={index} className="p-4 bg-black/20 rounded-xl border border-green-500/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-orbitron text-lg font-bold text-white">{exam.name}</h3>
                    <p className="text-gray-400 text-sm">{exam.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 mb-1">{exam.status}</Badge>
                    <div className="text-xs text-gray-400">{exam.daysAgo} days ago</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Exam Rewards */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Exam Rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {examRewards.map((reward, index) => {
              const Icon = reward.icon
              return (
                <div key={index} className="p-4 bg-black/20 rounded-xl border border-purple-500/30">
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-6 w-6 ${reward.color} mt-1`} />
                    <div>
                      <h3 className="font-bold text-white mb-1">{reward.title}</h3>
                      <p className="text-gray-400 text-sm">{reward.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Next Exam Available */}
      <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Trophy className="h-16 w-16 mx-auto text-yellow-400 neon-glow" />
            <div>
              <h2 className="font-orbitron text-2xl font-bold text-yellow-400 mb-2">The Fourth Gate</h2>
              <p className="text-gray-300 mb-4">Rank A Qualification Available</p>
              <p className="text-sm text-gray-400 mb-6">
                Complete your current paths and demonstrate mastery to unlock this examination.
              </p>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold" disabled>
                Requirements Not Met
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
