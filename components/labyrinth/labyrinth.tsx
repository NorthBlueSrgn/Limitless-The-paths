"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Compass, Search, Lock, Unlock, Crown, BookOpen, Lightbulb, Sword, Eye } from "lucide-react"
import type { CodexEntry } from "@/types/limitless"

interface LabyrinthProps {
  codexEntries: CodexEntry[]
  userRank: string
}

const categoryIcons = {
  Philosophy: Lightbulb,
  Tactic: Sword,
  Ritual: Eye,
  Legend: Crown,
  Secret: Lock,
  "Mental Model": BookOpen,
}

const rarityColors = {
  Common: "border-gray-500 text-gray-400",
  Rare: "border-blue-500 text-blue-400",
  Epic: "border-purple-500 text-purple-400",
  Legendary: "border-yellow-500 text-yellow-400",
}

const rarityGlow = {
  Common: "",
  Rare: "shadow-blue-500/20",
  Epic: "shadow-purple-500/20",
  Legendary: "shadow-yellow-500/20",
}

export function Labyrinth({ codexEntries, userRank }: LabyrinthProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null)

  const categories = ["all", "Philosophy", "Tactic", "Ritual", "Legend", "Secret", "Mental Model"]

  const filteredEntries = codexEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const unlockedEntries = filteredEntries.filter((entry) => entry.unlocked)
  const lockedEntries = filteredEntries.filter((entry) => !entry.unlocked)

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-primary" />
            <span className="font-orbitron chapter-title">The Labyrinth</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 manga-text">
            A vast repository of ancient wisdom, forbidden knowledge, and legendary secrets. Each entry unlocks as you
            prove worthy through your journey of transformation.
          </p>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search the archives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-white/10"
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
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="unlocked" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unlocked">Unlocked Knowledge</TabsTrigger>
          <TabsTrigger value="locked">Sealed Archives</TabsTrigger>
        </TabsList>

        <TabsContent value="unlocked" className="space-y-6">
          {unlockedEntries.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-bold text-white mb-2">No Knowledge Unlocked</h3>
                <p className="text-gray-400">Progress through your paths to unlock ancient wisdom</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedEntries.map((entry) => {
                const Icon = categoryIcons[entry.category]
                return (
                  <Card
                    key={entry.id}
                    className={`codex-card cursor-pointer ${rarityGlow[entry.rarity]}`}
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-6 h-6 text-purple-400" />
                        <Badge variant="outline" className={`${rarityColors[entry.rarity]} font-orbitron`}>
                          {entry.rarity}
                        </Badge>
                      </div>

                      <h3 className="font-bold text-white mb-2 font-orbitron">{entry.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{entry.category}</p>
                      <p className="text-sm text-gray-300 line-clamp-3 manga-text">
                        {entry.content.substring(0, 150)}...
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <Unlock className="w-4 h-4 text-green-400" />
                        <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                          <Eye className="w-4 h-4 mr-1" />
                          Read
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="locked" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedEntries.map((entry) => {
              const Icon = categoryIcons[entry.category]
              return (
                <Card key={entry.id} className="codex-card opacity-60">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-6 h-6 text-gray-500" />
                      <Badge variant="outline" className="border-gray-500 text-gray-500 font-orbitron">
                        {entry.rarity}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-gray-500 mb-2 font-orbitron">{entry.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{entry.category}</p>
                    <p className="text-sm text-gray-500">[SEALED KNOWLEDGE - REQUIREMENTS NOT MET]</p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-red-400">Locked</span>
                      </div>

                      {entry.requiredRank && (
                        <div className="text-xs text-gray-500">Requires: Rank {entry.requiredRank}</div>
                      )}

                      {entry.requiredPath && (
                        <div className="text-xs text-gray-500">
                          Requires: Complete {entry.requiredPath.replace("_", " ")}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <Card className="glass-card border-purple-500/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                {React.createElement(categoryIcons[selectedEntry.category], {
                  className: "w-6 h-6 text-purple-400",
                })}
                <span className="font-orbitron">{selectedEntry.title}</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${rarityColors[selectedEntry.rarity]} font-orbitron`}>
                  {selectedEntry.rarity}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setSelectedEntry(null)}>
                  ✕
                </Button>
              </div>
            </div>
            <Badge variant="outline" className="w-fit">
              {selectedEntry.category}
            </Badge>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full rounded-lg p-4 bg-black/20">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 manga-text leading-relaxed">{selectedEntry.content}</p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
