"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Scroll, Plus } from "lucide-react"

export function Chronicles() {
  const [reflection, setReflection] = useState("")
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])

  const moods = ["Motivated", "Challenged", "Accomplished", "Reflective", "Determined", "Inspired"]

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) => (prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]))
  }

  const handleSaveReflection = () => {
    // Save reflection logic here
    console.log("Saving reflection:", { reflection, moods: selectedMoods })
    setReflection("")
    setSelectedMoods([])
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          Chronicles of Growth
        </h1>
        <p className="text-gray-400 text-lg">Document your journey and reflect on your transformation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Milestone Journey */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Scroll className="h-5 w-5 mr-2 text-purple-400" />
              Milestone Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Scroll className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg mb-2">Your milestone journey begins with your first achievement...</p>
              <p className="text-sm">Complete tasks and unlock your story</p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Reflection */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Today's Reflection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What insights did you gain today? How did you grow?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 min-h-[120px]"
              />

              <div>
                <p className="text-sm text-gray-400 mb-3">How are you feeling?</p>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <Button
                      key={mood}
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMood(mood)}
                      className={`text-xs ${
                        selectedMoods.includes(mood)
                          ? "border-purple-500 bg-purple-500/20 text-purple-300"
                          : "border-gray-600 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {mood}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveReflection}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!reflection.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Save Reflection
              </Button>
            </CardContent>
          </Card>

          {/* Growth Metrics */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Growth Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total XP Gained</span>
                <span className="text-white font-bold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Streak</span>
                <span className="text-white font-bold">0 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Consistency Score</span>
                <span className="text-white font-bold">0%</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reflections */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Recent Reflections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                      reflective
                    </Badge>
                    <span className="text-xs text-gray-400">1h ago</span>
                  </div>
                  <p className="text-sm text-gray-300">Can I see this</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
