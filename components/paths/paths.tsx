"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Target, Plus, Search, Crown, TrendingUp, AlertTriangle } from "lucide-react"

const availablePaths = [
  {
    id: "chess_predator",
    name: "Chess Predator",
    description: "Master the art of strategic thinking through chess mastery",
    category: "Mental Mastery",
    difficulty: "Intermediate" as const,
    estimatedDuration: "3 months",
    associatedAttributes: ["Intelligence", "Resilience"],
    rewards: [
      { type: "Title", value: 1, target: "Chess Master" },
      { type: "Trait", value: 1, target: "Strategist" },
      { type: "XP", value: 2000 },
    ],
    prerequisites: ["Intelligence >= 25", "Complete 'Foundation of Logic' path"],
    stages: [
      "Learn basic tactics",
      "Master opening principles",
      "Develop endgame skills",
      "Achieve rating milestones",
      "Tournament participation",
    ],
  },
  {
    id: "acolyte_discipline",
    name: "Acolyte of Discipline",
    description: "Forge unbreakable habits and iron willpower",
    category: "Self Mastery",
    difficulty: "Advanced" as const,
    estimatedDuration: "6 months",
    associatedAttributes: ["Resilience", "Spiritual"],
    rewards: [
      { type: "Title", value: 1, target: "Iron Will" },
      { type: "Trait", value: 1, target: "Obsidian" },
      { type: "XP", value: 3500 },
    ],
    prerequisites: ["Resilience >= 30", "30-day streak"],
    stages: [
      "Morning routine mastery",
      "Meditation consistency",
      "Physical discipline",
      "Mental fortitude trials",
      "Transcendence",
    ],
  },
  {
    id: "creative_forge",
    name: "Creative Forge",
    description: "Unleash your creative potential through daily practice",
    category: "Creative Expression",
    difficulty: "Beginner" as const,
    estimatedDuration: "2 months",
    associatedAttributes: ["Creativity", "Intelligence"],
    rewards: [
      { type: "Title", value: 1, target: "Artisan" },
      { type: "XP", value: 1500 },
    ],
    prerequisites: ["None"],
    stages: ["Daily sketching", "Idea generation", "Project completion", "Style development", "Portfolio creation"],
  },
]

export function Paths() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activePaths, setActivePaths] = useState<string[]>([])

  const categories = ["All", "Mental Mastery", "Self Mastery", "Creative Expression", "Physical Excellence"]

  const filteredPaths = availablePaths.filter((path) => {
    const matchesSearch =
      path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || path.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const difficultyColors = {
    Beginner: "border-green-500 text-green-400",
    Intermediate: "border-yellow-500 text-yellow-400",
    Advanced: "border-red-500 text-red-400",
    Master: "border-purple-500 text-purple-400",
  }

  const handleActivatePath = (pathId: string) => {
    if (!activePaths.includes(pathId)) {
      setActivePaths((prev) => [...prev, pathId])
    }
  }

  const handleDeactivatePath = (pathId: string) => {
    setActivePaths((prev) => prev.filter((id) => id !== pathId))
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          Paths of Ascension
        </h1>
        <p className="text-gray-400 text-lg">Choose your journey and forge your destiny</p>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border-gray-600 text-gray-400 hover:border-gray-500"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Paths */}
      {activePaths.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Crown className="h-5 w-5 mr-2 text-purple-400" />
              Active Paths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePaths.map((pathId) => {
                const path = availablePaths.find((p) => p.id === pathId)
                if (!path) return null

                return (
                  <div key={pathId} className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white">{path.name}</h3>
                        <p className="text-gray-400 text-sm">{path.category}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivatePath(pathId)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        Deactivate
                      </Button>
                    </div>
                    <Progress value={Math.random() * 100} className="h-2 bg-gray-800/50 mb-2" />
                    <div className="text-xs text-gray-400">Stage 2/5: {path.stages[1]}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPaths.map((path) => {
          const isActive = activePaths.includes(path.id)

          return (
            <Card key={path.id} className="glass-card hover:border-purple-500/30 transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white font-orbitron">{path.name}</CardTitle>
                    <p className="text-gray-400 text-sm mt-1">{path.category}</p>
                  </div>
                  <Badge variant="outline" className={`${difficultyColors[path.difficulty]} font-orbitron`}>
                    {path.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">{path.description}</p>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-400">{path.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-400">{path.associatedAttributes.join(", ")}</span>
                  </div>
                </div>

                {/* Prerequisites */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Prerequisites</h4>
                  <div className="space-y-1">
                    {path.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <AlertTriangle className="h-3 w-3 text-yellow-400" />
                        <span className="text-gray-400">{prereq}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stages */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Path Stages</h4>
                  <div className="space-y-1">
                    {path.stages.slice(0, 3).map((stage, index) => (
                      <div key={index} className="text-xs text-gray-400">
                        {index + 1}. {stage}
                      </div>
                    ))}
                    {path.stages.length > 3 && (
                      <div className="text-xs text-gray-500">+{path.stages.length - 3} more stages...</div>
                    )}
                  </div>
                </div>

                {/* Rewards */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Rewards</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.rewards.map((reward, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-green-500/50 text-green-400">
                        {reward.type === "XP" ? `${reward.value} XP` : reward.target}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => (isActive ? handleDeactivatePath(path.id) : handleActivatePath(path.id))}
                  className={
                    isActive ? "w-full bg-red-600 hover:bg-red-700" : "w-full bg-purple-600 hover:bg-purple-700"
                  }
                  disabled={!isActive && activePaths.length >= 3}
                >
                  {isActive ? "Deactivate Path" : "Activate Path"}
                  {!isActive && <Plus className="h-4 w-4 ml-2" />}
                </Button>

                {!isActive && activePaths.length >= 3 && (
                  <p className="text-xs text-yellow-400 text-center">
                    Maximum 3 active paths. Deactivate one to add another.
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
