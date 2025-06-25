"use client"

import type { Path } from "../types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface PathCardProps {
  path: Path
  onTogglePrerequisite: (pathId: string, prereqId: string) => void
}

export function PathCard({ path, onTogglePrerequisite }: PathCardProps) {
  const completedPrereqs = path.prerequisites.filter((p) => p.completed).length
  const totalPrereqs = path.prerequisites.length
  const completionRate = totalPrereqs > 0 ? (completedPrereqs / totalPrereqs) * 100 : 0

  return (
    <Card className="bg-gray-900 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-purple-300 text-lg">{path.name}</CardTitle>
            <p className="text-gray-400 text-sm mt-1">{path.description}</p>
          </div>
          <Badge variant="outline" className="border-purple-500 text-purple-300">
            {path.currentTitle}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-purple-300">
              {completedPrereqs}/{totalPrereqs}
            </span>
          </div>
          <Progress value={completionRate} className="h-2 bg-gray-800" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {path.prerequisites.map((prereq) => (
          <div key={prereq.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePrerequisite(path.id, prereq.id)}
                className="p-0 h-auto hover:bg-transparent"
              >
                {prereq.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-500" />
                )}
              </Button>
              <div>
                <div className="text-sm font-medium text-gray-200">{prereq.name}</div>
                <div className="text-xs text-gray-400">{prereq.description}</div>
                {prereq.type === "weekly" && (
                  <div className="text-xs text-purple-400 mt-1">
                    {prereq.weeklyProgress}/{prereq.weeklyTarget} this week
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs">
                +{prereq.xpReward} XP
              </Badge>
              {prereq.type === "weekly" && <Clock className="h-4 w-4 text-blue-400" />}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
