"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Compass, Search, Lock, Eye, Star, Crown, Zap, BookOpen, Brain, Target, Lightbulb } from "lucide-react"
import type { CodexEntry } from "@/types/limitless"

interface LabyrinthProps {
  codexEntries: CodexEntry[]
}

const categoryIcons = {
  Philosophy: Lightbulb,
  Tactic: Target,
  Ritual: Star,
  Legend: Crown,
  Secret: Eye,
  "Mental Model": Brain,
}

const categoryColors = {
  Philosophy: "text-blue-400 border-blue-400",
  Tactic: "text-green-400 border-green-400",
  Ritual: "text-purple-400 border-purple-400",
  Legend: "text-yellow-400 border-yellow-400",
  Secret: "text-red-400 border-red-400",
  "Mental Model": "text-orange-400 border-orange-400",
}

const rarityColors = {
  Common: "text-gray-400 border-gray-400",
  Rare: "text-blue-400 border-blue-400",
  Epic: "text-purple-400 border-purple-400",
  Legendary: "text-yellow-400 border-yellow-400",
  Mythic: "text-pink-400 border-pink-400",
}

const rarityGradients = {
  Common: "from-gray-600 to-gray-800",
  Rare: "from-blue-600 to-blue-800",
  Epic: "from-purple-600 to-purple-800",
  Legendary: "from-yellow-600 to-yellow-800",
  Mythic: "from-pink-600 to-pink-800",
}

export function Labyrinth({ codexEntries = [] }: LabyrinthProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedRarity, setSelectedRarity] = useState<string>("all")
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null)

  const filteredEntries = codexEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory
    const matchesRarity = selectedRarity === "all" || entry.rarity === selectedRarity

    return matchesSearch && matchesCategory && matchesRarity
  })

  const unlockedEntries = filteredEntries.filter((entry) => entry.unlocked)
  const lockedEntries = filteredEntries.filter((entry) => !entry.unlocked)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          The Labyrinth
        </h1>
        <p className="text-purple-300">Repository of forbidden knowledge and ancient wisdom</p>
      </div>

      {/* Filters */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Knowledge Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search knowledge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/20 border-purple-500/30"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-black/20 border border-purple-500/30 rounded-md text-white"
            >
              <option value="all">All Categories</option>
              {Object.keys(categoryIcons).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-3 py-2 bg-black/20 border border-purple-500/30 rounded-md text-white"
            >
              <option value="all">All Rarities</option>
              {Object.keys(rarityColors).map((rarity) => (
                <option key={rarity} value={rarity}>
                  {rarity}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-sm text-purple-400">
            <span>Found: {filteredEntries.length} entries</span>
            <span>Unlocked: {unlockedEntries.length}</span>
            <span>Locked: {lockedEntries.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Grid */}
      <div className="space-y-6">
        {/* Unlocked Entries */}
        {unlockedEntries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-400" />
              Unlocked Knowledge ({unlockedEntries.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedEntries.map((entry) => {
                const CategoryIcon = categoryIcons[entry.category]
                return (
                  <Dialog key={entry.id}>
                    <DialogTrigger asChild>
                      <Card
                        className={`bg-gradient-to-br ${rarityGradients[entry.rarity]} backdrop-blur-xl border-purple-500/20 cursor-pointer hover:scale-105 transition-all duration-300`}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                              <CategoryIcon className="w-4 h-4" />
                              {entry.title}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                              {[...Array(entry.powerLevel)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`${categoryColors[entry.category]} text-xs`}>
                              {entry.category}
                            </Badge>
                            <Badge variant="outline" className={`${rarityColors[entry.rarity]} text-xs`}>
                              {entry.rarity}
                            </Badge>
                          </div>

                          <p className="text-purple-100 text-sm line-clamp-3">{entry.content.substring(0, 120)}...</p>

                          {entry.source && <p className="text-xs text-purple-300 italic">Source: {entry.source}</p>}

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-purple-400">Power Level: {entry.powerLevel}</span>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              <BookOpen className="w-3 h-3 mr-1" />
                              Read
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/20 max-w-4xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                          <CategoryIcon className="w-5 h-5" />
                          {entry.title}
                        </DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh]">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className={`${categoryColors[entry.category]}`}>
                              {entry.category}
                            </Badge>
                            <Badge variant="outline" className={`${rarityColors[entry.rarity]}`}>
                              {entry.rarity}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {[...Array(entry.powerLevel)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>

                          <div className="prose prose-invert max-w-none">
                            <p className="text-purple-100 leading-relaxed whitespace-pre-line">{entry.content}</p>
                          </div>

                          {entry.applications && entry.applications.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-white font-semibold">Applications</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {entry.applications.map((app, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-purple-900/20 rounded text-sm"
                                  >
                                    <Zap className="w-3 h-3 text-green-400" />
                                    <span className="text-purple-300">{app}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {entry.source && (
                            <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded">
                              <h4 className="text-sm font-medium text-purple-400 mb-1">Source</h4>
                              <p className="text-xs text-purple-300">{entry.source}</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                )
              })}
            </div>
          </div>
        )}

        {/* Locked Entries */}
        {lockedEntries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" />
              Forbidden Knowledge ({lockedEntries.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedEntries.map((entry) => {
                const CategoryIcon = categoryIcons[entry.category]
                return (
                  <Card key={entry.id} className="bg-black/60 backdrop-blur-xl border-red-500/20 opacity-75">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-gray-400 flex items-center gap-2 text-lg">
                          <CategoryIcon className="w-4 h-4" />
                          {entry.title}
                        </CardTitle>
                        <Lock className="w-4 h-4 text-red-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-gray-400 border-gray-400 text-xs">
                          {entry.category}
                        </Badge>
                        <Badge variant="outline" className={`${rarityColors[entry.rarity]} text-xs opacity-50`}>
                          {entry.rarity}
                        </Badge>
                      </div>

                      <p className="text-gray-500 text-sm">
                        This knowledge is sealed. Complete the requirements to unlock its secrets.
                      </p>

                      {entry.unlockRequirements && entry.unlockRequirements.length > 0 && (
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium text-gray-400">Requirements:</h4>
                          {entry.unlockRequirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-red-400">
                              <Lock className="w-2 h-2" />
                              {req}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredEntries.length === 0 && (
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-12 text-center">
              <Compass className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-bold text-white mb-2">No Knowledge Found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
