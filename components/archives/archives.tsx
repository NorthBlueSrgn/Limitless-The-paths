"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, Tag, Heart, BookOpen, Lightbulb, TrendingUp, Target, Zap } from "lucide-react"
import type { JournalEntry, Chronicle } from "@/types/limitless"

interface ArchivesProps {
  journalEntries: JournalEntry[]
  chronicles: Chronicle[]
  onAddJournalEntry: (entry: Omit<JournalEntry, "id">) => void
  onAddChronicle: (chronicle: Omit<Chronicle, "id">) => void
}

const entryTypeIcons = {
  Reflection: Heart,
  Breakthrough: Lightbulb,
  Setback: TrendingUp,
  Philosophy: BookOpen,
  Goal: Target,
  "Rival Event": Zap,
}

const entryTypeColors = {
  Reflection: "text-blue-400 border-blue-400",
  Breakthrough: "text-yellow-400 border-yellow-400",
  Setback: "text-red-400 border-red-400",
  Philosophy: "text-purple-400 border-purple-400",
  Goal: "text-green-400 border-green-400",
  "Rival Event": "text-orange-400 border-orange-400",
}

const chronicleTypeColors = {
  Journal: "text-blue-400",
  "Story Response": "text-purple-400",
  "Mindset Shift": "text-yellow-400",
  "Arc Reflection": "text-green-400",
}

export function Archives({ journalEntries, chronicles, onAddJournalEntry, onAddChronicle }: ArchivesProps) {
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    type: "Reflection" as JournalEntry["type"],
    mood: [] as string[],
    tags: [] as string[],
  })

  const handleAddEntry = () => {
    if (newEntry.title && newEntry.content) {
      onAddJournalEntry({
        ...newEntry,
        date: new Date().toISOString(),
        season: "Current Season",
        linkedPaths: [],
        xpGained: 25,
      })
      setNewEntry({ title: "", content: "", type: "Reflection", mood: [], tags: [] })
      setIsAddingEntry(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Archives
        </h1>
        <p className="text-purple-300">Chronicle your journey. Reflect on your growth. Document your transformation.</p>
      </div>

      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-purple-500/20">
          <TabsTrigger value="journal" className="data-[state=active]:bg-purple-600/30">
            Journal Entries
          </TabsTrigger>
          <TabsTrigger value="chronicles" className="data-[state=active]:bg-purple-600/30">
            Chronicles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="space-y-4">
          {/* Add Entry Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => setIsAddingEntry(!isAddingEntry)}
              className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </div>

          {/* Add Entry Form */}
          {isAddingEntry && (
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400">New Journal Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Entry title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="bg-black/20 border-purple-500/20"
                />

                <select
                  value={newEntry.type}
                  onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as JournalEntry["type"] })}
                  className="w-full p-2 bg-black/20 border border-purple-500/20 rounded text-white"
                >
                  {Object.keys(entryTypeIcons).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <Textarea
                  placeholder="Write your thoughts..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  className="bg-black/20 border-purple-500/20 min-h-32"
                />

                <div className="flex gap-2">
                  <Button onClick={handleAddEntry} size="sm">
                    Save Entry
                  </Button>
                  <Button variant="ghost" onClick={() => setIsAddingEntry(false)} size="sm">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Journal Entries */}
          <div className="space-y-4">
            {journalEntries.map((entry) => {
              const TypeIcon = entryTypeIcons[entry.type]
              return (
                <Card key={entry.id} className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-5 h-5 text-purple-400" />
                        <CardTitle className="text-white">{entry.title}</CardTitle>
                        <Badge variant="outline" className={`${entryTypeColors[entry.type]} bg-black/20`}>
                          {entry.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-purple-100 leading-relaxed">{entry.content}</p>

                    <div className="flex flex-wrap gap-2">
                      {entry.mood.map((mood) => (
                        <Badge key={mood} variant="secondary" className="bg-purple-900/30 text-purple-300">
                          <Heart className="w-3 h-3 mr-1" />
                          {mood}
                        </Badge>
                      ))}
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-blue-400 border-blue-400">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {entry.xpGained > 0 && (
                      <div className="flex items-center gap-1 text-sm text-green-400">
                        <Zap className="w-4 h-4" />+{entry.xpGained} XP gained from reflection
                      </div>
                    )}

                    {entry.storyImpact && (
                      <div className="p-2 bg-purple-900/20 rounded border border-purple-500/20">
                        <p className="text-xs text-purple-400 mb-1">Story Impact:</p>
                        <p className="text-sm text-purple-300">{entry.storyImpact}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="chronicles" className="space-y-4">
          <div className="space-y-4">
            {chronicles.map((chronicle) => (
              <Card key={chronicle.id} className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{chronicle.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${chronicleTypeColors[chronicle.type]} border-current bg-black/20`}
                      >
                        {chronicle.type}
                      </Badge>
                      <span className="text-sm text-purple-400">{new Date(chronicle.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-purple-100 leading-relaxed">{chronicle.content}</p>

                  {chronicle.insights.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">Key Insights:</h4>
                      <div className="space-y-1">
                        {chronicle.insights.map((insight, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-purple-300">
                            <Lightbulb className="w-3 h-3 text-yellow-400" />
                            {insight}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {chronicle.orderAnalysis && (
                    <div className="p-3 bg-gradient-to-r from-purple-900/20 to-black/20 rounded border border-purple-500/20">
                      <h4 className="text-sm font-semibold text-purple-400 mb-1">The Order's Analysis:</h4>
                      <p className="text-sm text-purple-300 italic">"{chronicle.orderAnalysis}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
