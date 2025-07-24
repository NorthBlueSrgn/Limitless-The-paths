"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Book, Sword, RatioIcon as Ritual, Crown, Eye, Brain, Lock, Star, Zap } from "lucide-react"
import type { CodexEntry } from "@/types/limitless"

interface LabyrinthProps {
  codexEntries: CodexEntry[]
}

const categoryIcons = {
  Philosophy: Book,
  Tactic: Sword,
  Ritual: Ritual,
  Legend: Crown,
  Secret: Eye,
  "Mental Model": Brain,
}

const rarityColors = {
  Common: "from-gray-400 to-gray-600",
  Rare: "from-blue-400 to-blue-600",
  Epic: "from-purple-400 to-purple-600",
  Legendary: "from-orange-400 to-red-500",
  Mythic: "from-red-400 to-pink-500",
}

const rarityBorders = {
  Common: "border-gray-500/50",
  Rare: "border-blue-500/50",
  Epic: "border-purple-500/50",
  Legendary: "border-orange-500/50",
  Mythic: "border-pink-500/50",
}

export function Labyrinth({ codexEntries }: LabyrinthProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null)

  // Filter entries
  const filteredEntries = codexEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const unlockedEntries = filteredEntries.filter((entry) => entry.unlocked)
  const lockedEntries = filteredEntries.filter((entry) => !entry.unlocked)

  const categories = ["all", ...Array.from(new Set(codexEntries.map((entry) => entry.category)))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          The Labyrinth
        </h1>
        <p className="text-purple-300">Repository of forbidden knowledge and ancient wisdom</p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
              <Input
                placeholder="Search the depths of knowledge..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-purple-500/30 text-purple-100 placeholder-purple-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? "bg-purple-600 text-white"
                      : "border-purple-500/30 text-purple-400 hover:bg-purple-900/20"
                  }`}
                >
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="unlocked" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-purple-500/20">
          <TabsTrigger value="unlocked" className="data-[state=active]:bg-purple-600/30">
            Unlocked Knowledge ({unlockedEntries.length})
          </TabsTrigger>
          <TabsTrigger value="locked" className="data-[state=active]:bg-purple-600/30">
            Sealed Secrets ({lockedEntries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unlocked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedEntries.map((entry) => {
              const Icon = categoryIcons[entry.category as keyof typeof categoryIcons]
              return (
                <Dialog key={entry.id}>
                  <DialogTrigger asChild>
                    <Card
                      className={`bg-gradient-to-br from-black/60 to-purple-900/20 backdrop-blur-xl ${rarityBorders[entry.rarity]} cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-purple-400" />
                            <Badge
                              variant="outline"
                              className={`bg-gradient-to-r ${rarityColors[entry.rarity]} text-black font-bold text-xs`}
                            >
                              {entry.rarity}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, Math.ceil(entry.powerLevel / 3)) }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <CardTitle className="text-purple-100 text-lg leading-tight">{entry.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-purple-300 text-sm line-clamp-3 mb-3">{entry.content.split("\n")[0]}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-purple-400">{entry.category}</span>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Zap className="w-3 h-3" />
                            <span>{entry.powerLevel}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] bg-black/90 backdrop-blur-xl border-purple-500/20">
                    <DialogHeader>
                      <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl text-purple-100 flex items-center gap-3">
                          <Icon className="w-6 h-6 text-purple-400" />
                          {entry.title}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`bg-gradient-to-r ${rarityColors[entry.rarity]} text-black font-bold`}
                          >
                            {entry.rarity}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, Math.ceil(entry.powerLevel / 3)) }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-purple-400">{entry.powerLevel}</div>
                            <div className="text-xs text-purple-300">Power Level</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-400">{entry.category}</div>
                            <div className="text-xs text-purple-300">Category</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-400">{entry.applications.length}</div>
                            <div className="text-xs text-purple-300">Applications</div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-purple-400 mb-3">Knowledge</h3>
                          <div className="prose prose-invert max-w-none">
                            {entry.content.split("\n").map((paragraph, index) => (
                              <p key={index} className="text-purple-100 mb-3">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>

                        {entry.applications.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-purple-400 mb-3">Applications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {entry.applications.map((application, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-purple-300">
                                  <Zap className="w-3 h-3 text-yellow-400" />
                                  {application}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.source && (
                          <div className="text-center pt-4 border-t border-purple-500/20">
                            <p className="text-sm text-purple-400">Source: {entry.source}</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )
            })}
          </div>
          {unlockedEntries.length === 0 && (
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-purple-400">No unlocked knowledge found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedEntries.map((entry) => {
              const Icon = categoryIcons[entry.category as keyof typeof categoryIcons]
              return (
                <Card
                  key={entry.id}
                  className="bg-gradient-to-br from-black/60 to-red-900/20 backdrop-blur-xl border-red-500/20 opacity-60"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-red-400" />
                        <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
                          Sealed
                        </Badge>
                      </div>
                      <Lock className="w-4 h-4 text-red-400" />
                    </div>
                    <CardTitle className="text-red-300 text-lg leading-tight">{entry.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-200 text-sm mb-3">
                      This knowledge remains sealed. Fulfill the requirements to unlock its secrets.
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs text-red-400 font-semibold">Requirements:</div>
                      {entry.unlockRequirements.map((req, index) => (
                        <div key={index} className="text-xs text-red-300">
                          • {req.replace("_", " ").replace(/\d+/, (match) => `${match}+`)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {lockedEntries.length === 0 && (
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-purple-400">No sealed knowledge found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
