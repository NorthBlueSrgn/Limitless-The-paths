"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Target, Search, Crown, TrendingUp, AlertTriangle, Eye, Zap } from "lucide-react"

const availablePaths = [
  {
    id: "path_of_mastery",
    name: "Path of Mastery",
    description: "The relentless pursuit of excellence in chosen domains",
    category: "Mental Mastery",
    difficulty: "Advanced" as const,
    estimatedDuration: "6 months",
    associatedAttributes: ["Intelligence", "Resilience", "Creativity"],
    archetype: "The Perfectionist",
    rewards: [
      { type: "Title", value: 1, target: "Master of Craft" },
      { type: "Trait", value: 1, target: "Obsidian Focus" },
      { type: "XP", value: 3500 },
    ],
    prerequisites: ["Intelligence >= 30", "Complete 'Foundation' path"],
    stages: [
      "Skill identification and baseline",
      "Deliberate practice protocols",
      "Performance measurement systems",
      "Advanced technique integration",
      "Mastery demonstration",
    ],
    philosophy:
      "Excellence is not a skill, it's an attitude. Every repetition is a choice between mediocrity and greatness.",
  },
  {
    id: "path_of_will",
    name: "Path of Will",
    description: "Forge unbreakable mental fortitude and discipline",
    category: "Self Mastery",
    difficulty: "Master" as const,
    estimatedDuration: "12 months",
    associatedAttributes: ["Resilience", "Spiritual", "Physical"],
    archetype: "The Unbreakable",
    rewards: [
      { type: "Title", value: 1, target: "Iron Will" },
      { type: "Trait", value: 1, target: "Obsidian Core" },
      { type: "XP", value: 5000 },
    ],
    prerequisites: ["Resilience >= 40", "60-day streak", "Complete Hunter Exam"],
    stages: [
      "Discomfort tolerance training",
      "Mental resistance protocols",
      "Emotional regulation mastery",
      "Stress inoculation trials",
      "Transcendence achievement",
    ],
    philosophy:
      "The mind is everything. What you think you become. Discipline is the bridge between thought and accomplishment.",
  },
  {
    id: "path_of_spiritual_discipline",
    name: "Path of Spiritual Discipline",
    description: "Cultivate inner awareness and transcendent understanding",
    category: "Spiritual Growth",
    difficulty: "Intermediate" as const,
    estimatedDuration: "9 months",
    associatedAttributes: ["Spiritual", "Intelligence", "Health"],
    archetype: "The Sage",
    rewards: [
      { type: "Title", value: 1, target: "Enlightened Hunter" },
      { type: "Trait", value: 1, target: "Oracle Vision" },
      { type: "XP", value: 4000 },
    ],
    prerequisites: ["Spiritual >= 25", "Daily meditation streak"],
    stages: [
      "Mindfulness foundation",
      "Meditation deepening",
      "Philosophical study",
      "Wisdom integration",
      "Enlightenment glimpse",
    ],
    philosophy: "Know thyself. The greatest victory is victory over the self. Inner peace is the ultimate power.",
  },
  {
    id: "path_of_the_strategist",
    name: "Path of the Strategist",
    description: "Master the art of systematic thinking and long-term planning",
    category: "Mental Mastery",
    difficulty: "Intermediate" as const,
    estimatedDuration: "4 months",
    associatedAttributes: ["Intelligence", "Creativity", "Resilience"],
    archetype: "The Mastermind",
    rewards: [
      { type: "Title", value: 1, target: "Grand Strategist" },
      { type: "Trait", value: 1, target: "Chess Master Mind" },
      { type: "XP", value: 2500 },
    ],
    prerequisites: ["Intelligence >= 20", "Complete logic challenges"],
    stages: [
      "Systems thinking development",
      "Pattern recognition training",
      "Strategic planning protocols",
      "Decision tree mastery",
      "Grand strategy execution",
    ],
    philosophy:
      "Every battle is won before it's fought. The supreme excellence is to subdue the enemy without fighting.",
  },
]

export function Paths() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activePaths, setActivePaths] = useState<string[]>([])
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  const categories = ["All", "Mental Mastery", "Self Mastery", "Spiritual Growth", "Physical Excellence"]

  const filteredPaths = availablePaths.filter((path) => {
    const matchesSearch =
      path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.archetype.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (!activePaths.includes(pathId) && activePaths.length < 3) {
      setActivePaths((prev) => [...prev, pathId])
    }
  }

  const handleDeactivatePath = (pathId: string) => {
    setActivePaths((prev) => prev.filter((id) => id !== pathId))
  }

  const selectedPathData = selectedPath ? availablePaths.find((p) => p.id === selectedPath) : null

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-5xl font-bold chapter-title">PATHS OF ASCENSION</h1>
        <p className="text-gray-400 text-lg manga-text">Choose your journey and forge your destiny</p>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search paths and archetypes..."
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
        <Card className="glass-card border-purple-500/30 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center font-orbitron">
              <Crown className="h-5 w-5 mr-2 text-purple-400" />
              Active Paths ({activePaths.length}/3)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePaths.map((pathId) => {
                const path = availablePaths.find((p) => p.id === pathId)
                if (!path) return null

                return (
                  <div key={pathId} className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white">{path.name}</h3>
                        <p className="text-gray-400 text-sm">{path.archetype}</p>
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
                    <p className="text-purple-400 text-sm mt-1 font-medium">{path.archetype}</p>
                    <p className="text-gray-400 text-xs">{path.category}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant="outline" className={`${difficultyColors[path.difficulty]} font-orbitron`}>
                      {path.difficulty}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 manga-text">{path.description}</p>

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

                {/* Philosophy Quote */}
                <div className="p-3 bg-black/20 rounded-lg border-l-4 border-purple-500">
                  <p className="text-purple-300 text-sm italic manga-text">"{path.philosophy}"</p>
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

                {/* Expanded Path Details */}
                {selectedPath === path.id && (
                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">Path Stages</h4>
                      <div className="space-y-2">
                        {path.stages.map((stage, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                              <span className="text-purple-400 text-xs">{index + 1}</span>
                            </div>
                            <span className="text-gray-300">{stage}</span>
                          </div>
                        ))}
                      </div>
                    </div>

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
                  </div>
                )}

                <Button
                  onClick={() => (isActive ? handleDeactivatePath(path.id) : handleActivatePath(path.id))}
                  className={
                    isActive ? "w-full bg-red-600 hover:bg-red-700" : "w-full bg-purple-600 hover:bg-purple-700"
                  }
                  disabled={!isActive && activePaths.length >= 3}
                >
                  {isActive ? (
                    "Deactivate Path"
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Activate Path
                    </>
                  )}
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

      {/* Soul Map Preview */}
      <Card className="glass-card border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="text-white font-orbitron">Soul Map Evolution</CardTitle>
          <p className="text-gray-400 text-sm">Your path choices shape your archetype development</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center opacity-50">
              <Target className="h-16 w-16 text-white" />
            </div>
            <p className="text-gray-400">Your soul map will evolve as you progress through your chosen paths</p>
            <p className="text-xs text-gray-500 mt-2">
              Archetypes unlock based on path combinations and mastery levels
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
