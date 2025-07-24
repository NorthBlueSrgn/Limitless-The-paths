"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Database, Plus, Search, Trophy } from "lucide-react"
import type { JournalEntry, Chronicle } from "@/types/limitless"

interface ArchivesProps {
  journalEntries: JournalEntry[]
  chronicles: Chronicle[]
  onAddJournalEntry: (entry: Omit<JournalEntry, "id">) => void
  onAddChronicle: (chronicle: Omit<Chronicle, "id">) => void
}

const entryTypeColors = {
  Reflection: "border-blue-500 text-blue-400",
  Breakthrough: "border-green-500 text-green-400",
  Setback: "border-red-500 text-red-400",
  Philosophy: "border-purple-500 text-purple-400",
  Goal: "border-yellow-500 text-yellow-400",
  "Rival Event": "border-orange-500 text-orange-400",
}

const chronicleTypeColors = {
  Journal: "border-blue-500 text-blue-400",
  "Story Response": "border-purple-500 text-purple-400",
  "Mindset Shift": "border-green-500 text-green-400",
  "Arc Reflection": "border-yellow-500 text-yellow-400",
}

export function Archives({ journalEntries, chronicles, onAddJournalEntry, onAddChronicle }: ArchivesProps) {
  const [activeTab, setActiveTab] = useState("timeline")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    type: "Reflection" as const,
    mood: [] as string[],
    tags: [] as string[],
  })

  const allEntries = [
    ...journalEntries.map((entry) => ({ ...entry, source: "journal" as const })),
    ...chronicles.map((chronicle) => ({ ...chronicle, source: "chronicle" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const filteredEntries = allEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterType === "all" ||
      (filterType === "journal" && entry.source === "journal") ||
      (filterType === "chronicle" && entry.source === "chronicle") ||
      (entry.source === "journal" && (entry as any).type === filterType)
    return matchesSearch && matchesFilter
  })

  const handleAddEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return

    onAddJournalEntry({
      ...newEntry,
      date: new Date().toISOString(),
      season: "Current Season",
      linkedPaths: [],
      xpGained: 50,
    })

    setNewEntry({
      title: "",
      content: "",
      type: "Reflection",
      mood: [],
      tags: [],
    })
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Database className="w-6 h-6 text-primary" />
            <span className="font-orbitron chapter-title">Archives</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 manga-text">
            Your evolution database. Every reflection, breakthrough, and moment of growth is preserved here, forming the
            foundation of your transformation story.
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="chronicles">Chronicles</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          {/* Search and Filter */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search your journey..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter entries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entries</SelectItem>
                    <SelectItem value="journal">Journal Only</SelectItem>
                    <SelectItem value="chronicle">Chronicles Only</SelectItem>
                    <SelectItem value="Breakthrough">Breakthroughs</SelectItem>
                    <SelectItem value="Setback">Setbacks</SelectItem>
                    <SelectItem value="Philosophy">Philosophy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <ScrollArea className="h-96">
                <div className="space-y-6">
                  {filteredEntries.map((entry, index) => (
                    <div key={entry.id} className="timeline-node relative pl-8">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white">{entry.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                entry.source === "journal"
                                  ? entryTypeColors[(entry as any).type]
                                  : chronicleTypeColors[(entry as any).type]
                              }`}
                            >
                              {entry.source === "journal" ? (entry as any).type : (entry as any).type}
                            </Badge>
                            <span className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm line-clamp-3">{entry.content}</p>

                        {entry.source === "journal" && (entry as any).mood && (
                          <div className="flex flex-wrap gap-1">
                            {(entry as any).mood.map((mood: string) => (
                              <Badge key={mood} variant="outline" className="text-xs">
                                {mood}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {entry.source === "chronicle" && (entry as any).insights && (
                          <div className="space-y-1">
                            <span className="text-xs text-gray-400">Key Insights:</span>
                            <ul className="space-y-1">
                              {(entry as any).insights.map((insight: string, i: number) => (
                                <li key={i} className="text-xs text-purple-400 flex items-center gap-2">
                                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                  {insight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Entry Form */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  New Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Entry title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, title: e.target.value }))}
                />

                <Select
                  value={newEntry.type}
                  onValueChange={(value: any) => setNewEntry((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reflection">Reflection</SelectItem>
                    <SelectItem value="Breakthrough">Breakthrough</SelectItem>
                    <SelectItem value="Setback">Setback</SelectItem>
                    <SelectItem value="Philosophy">Philosophy</SelectItem>
                    <SelectItem value="Goal">Goal</SelectItem>
                    <SelectItem value="Rival Event">Rival Event</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="What insights did you gain? How did you grow?"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, content: e.target.value }))}
                  className="min-h-32"
                />

                <Button
                  onClick={handleAddEntry}
                  className="w-full"
                  disabled={!newEntry.title.trim() || !newEntry.content.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Save Entry
                </Button>
              </CardContent>
            </Card>

            {/* Journal Entries */}
            <div className="lg:col-span-2 space-y-4">
              {journalEntries.map((entry) => (
                <Card key={entry.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-white">{entry.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${entryTypeColors[entry.type]}`}>
                          {entry.type}
                        </Badge>
                        <span className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">{entry.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {entry.mood.map((mood) => (
                          <Badge key={mood} variant="outline" className="text-xs">
                            {mood}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-green-400">+{entry.xpGained} XP</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chronicles" className="space-y-6">
          <div className="space-y-4">
            {chronicles.map((chronicle) => (
              <Card key={chronicle.id} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-lg">{chronicle.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${chronicleTypeColors[chronicle.type]}`}>
                        {chronicle.type}
                      </Badge>
                      <span className="text-xs text-gray-400">{new Date(chronicle.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 manga-text mb-4">{chronicle.content}</p>

                  {chronicle.insights && chronicle.insights.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Key Insights</h4>
                      <ul className="space-y-1">
                        {chronicle.insights.map((insight, index) => (
                          <li key={index} className="text-sm text-purple-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Milestones & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <Trophy className="w-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Your achievements will be recorded here</p>
                <p className="text-xs text-gray-500 mt-2">Complete paths and reach milestones to unlock achievements</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
