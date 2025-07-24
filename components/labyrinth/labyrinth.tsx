"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Eye, Star, BookOpen, Lightbulb, Crown, Zap, Scroll, Brain, Target, Flame } from "lucide-react"
import type { CodexEntry, UserProfile } from "@/types/limitless"

interface LabyrinthProps {
  codexEntries: CodexEntry[]
  userProfile: UserProfile
}

const categoryIcons = {
  Philosophy: Brain,
  Secret: Eye,
  Quote: Scroll,
  Tactic: Target,
  Ritual: Flame,
  "Mental Model": Lightbulb,
  "Legendary Figure": Crown,
}

const categoryColors = {
  Philosophy: "from-purple-400 to-blue-400",
  Secret: "from-red-400 to-orange-400",
  Quote: "from-green-400 to-blue-400",
  Tactic: "from-yellow-400 to-orange-400",
  Ritual: "from-red-400 to-purple-400",
  "Mental Model": "from-blue-400 to-cyan-400",
  "Legendary Figure": "from-yellow-400 to-red-400",
}

const rarityColors = {
  Common: "text-gray-400 border-gray-400",
  Rare: "text-blue-400 border-blue-400",
  Epic: "text-purple-400 border-purple-400",
  Legendary: "text-yellow-400 border-yellow-400",
  Mythic: "text-red-400 border-red-400",
}

const rarityGlow = {
  Common: "shadow-gray-400/20",
  Rare: "shadow-blue-400/20",
  Epic: "shadow-purple-400/20",
  Legendary: "shadow-yellow-400/20",
  Mythic: "shadow-red-400/20",
}

export function Labyrinth({ codexEntries, userProfile }: LabyrinthProps) {
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const unlockedEntries = codexEntries.filter((entry) => entry.unlocked)
  const lockedEntries = codexEntries.filter((entry) => !entry.unlocked)

  const filteredEntries =
    selectedCategory === "all"
      ? unlockedEntries
      : unlockedEntries.filter((entry) => entry.category === selectedCategory)

  const categories = Array.from(new Set(codexEntries.map((entry) => entry.category)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
          The Labyrinth
        </h1>
        <p className="text-purple-300">
          Ancient knowledge awaits. Unlock the secrets of transformation through your journey.
        </p>
      </div>

      <Tabs defaultValue="codex" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-purple-500/20">
          <TabsTrigger value="codex" className="data-[state=active]:bg-purple-600/30">
            Codex Entries
          </TabsTrigger>
          <TabsTrigger value="locked" className="data-[state=active]:bg-purple-600/30">
            Sealed Knowledge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="codex" className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="text-xs"
            >
              All Categories
            </Button>
            {categories.map((category) => {
              const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  <CategoryIcon className="w-3 h-3 mr-1" />
                  {category}
                </Button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Entry Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEntries.map((entry) => {
                  const CategoryIcon = categoryIcons[entry.category as keyof typeof categoryIcons]
                  return (
                    <Card
                      key={entry.id}
                      className={`bg-black/40 backdrop-blur-xl border-purple-500/20 cursor-pointer transition-all duration-300 hover:border-purple-400/40 ${
                        selectedEntry?.id === entry.id ? "ring-2 ring-purple-400/50" : ""
                      } ${rarityGlow[entry.rarity]} hover:shadow-lg`}
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="w-4 h-4 text-purple-400" />
                            <Badge variant="outline" className={`${rarityColors[entry.rarity]} bg-black/20 text-xs`}>
                              {entry.rarity}
                            </Badge>
                          </div>
                          <Badge variant="secondary" className="text-xs bg-purple-900/30 text-purple-300">
                            {entry.category}
                          </Badge>
                        </div>
                        <CardTitle
                          className={`text-sm bg-gradient-to-r ${categoryColors[entry.category as keyof typeof categoryColors]} bg-clip-text text-transparent`}
                        >
                          {entry.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-purple-300 line-clamp-3">{entry.content.substring(0, 120)}...</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 text-xs text-purple-400">
                            <Star className="w-3 h-3" />
                            {entry.powerLevel}
                          </div>
                          {entry.source && <div className="text-xs text-purple-500">- {entry.source}</div>}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Entry Detail */}
            <div>
              {selectedEntry ? (
                <Card
                  className={`bg-gradient-to-br from-black/60 to-purple-900/20 backdrop-blur-xl border-purple-500/20 ${rarityGlow[selectedEntry.rarity]} shadow-lg sticky top-6`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {React.createElement(categoryIcons[selectedEntry.category as keyof typeof categoryIcons], {
                        className: "w-5 h-5 text-purple-400",
                      })}
                      <Badge variant="outline" className={`${rarityColors[selectedEntry.rarity]} bg-black/20`}>
                        {selectedEntry.rarity}
                      </Badge>
                    </div>
                    <CardTitle
                      className={`bg-gradient-to-r ${categoryColors[selectedEntry.category as keyof typeof categoryColors]} bg-clip-text text-transparent`}
                    >
                      {selectedEntry.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScrollArea className="h-64">
                      <div className="prose prose-invert max-w-none">
                        <p className="text-purple-100 leading-relaxed text-sm whitespace-pre-line">
                          {selectedEntry.content}
                        </p>
                      </div>
                    </ScrollArea>

                    {selectedEntry.applications.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-purple-400 mb-2">Applications:</h4>
                        <div className="space-y-1">
                          {selectedEntry.applications.map((app, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-purple-300">
                              <Zap className="w-3 h-3 text-yellow-400" />
                              {app}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
                      <div className="flex items-center gap-1 text-xs text-purple-400">
                        <Star className="w-3 h-3" />
                        Power Level: {selectedEntry.powerLevel}
                      </div>
                      {selectedEntry.source && (
                        <div className="text-xs text-purple-500">Source: {selectedEntry.source}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 sticky top-6">
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center space-y-2">
                      <BookOpen className="w-12 h-12 text-purple-400 mx-auto opacity-50" />
                      <p className="text-purple-400">Select an entry to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedEntries.map((entry) => {
              const CategoryIcon = categoryIcons[entry.category as keyof typeof categoryIcons]
              return (
                <Card key={entry.id} className="bg-black/20 backdrop-blur-xl border-gray-700/20 opacity-60">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-gray-500" />
                        <Badge variant="outline" className="text-gray-500 border-gray-500 bg-black/20 text-xs">
                          Sealed
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-gray-800/30 text-gray-400">
                        {entry.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm text-gray-400">{entry.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500 mb-3">This knowledge remains sealed...</p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 mb-1">Unlock Requirements:</p>
                      {entry.unlockRequirements.map((req, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          • {req.replace("_", " ").replace(/\d+/, (match) => `${match}+`)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Collection Stats */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-400">Collection Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">{unlockedEntries.length}</div>
              <div className="text-sm text-purple-300">Unlocked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">{lockedEntries.length}</div>
              <div className="text-sm text-purple-300">Sealed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {unlockedEntries.filter((e) => e.rarity === "Legendary" || e.rarity === "Mythic").length}
              </div>
              <div className="text-sm text-purple-300">Rare Finds</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.round((unlockedEntries.length / codexEntries.length) * 100)}%
              </div>
              <div className="text-sm text-purple-300">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
