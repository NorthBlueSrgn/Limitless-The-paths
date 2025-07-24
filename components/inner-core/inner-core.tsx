"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scroll, Plus, Search, Calendar, TrendingUp, BookOpen } from "lucide-react"
import { useLimitlessData } from "@/hooks/use-limitless-data"

const entryTypes = ["Reflection", "Breakthrough", "Setback", "Philosophy", "Goal"]
const moods = [
  "Motivated",
  "Challenged",
  "Accomplished",
  "Reflective",
  "Determined",
  "Inspired",
  "Frustrated",
  "Focused",
]
const seasons = ["Spring of Growth", "Summer of Action", "Autumn of Reflection", "Winter of Preparation"]

export function InnerCore() {
  const { journalEntries, addJournalEntry } = useLimitlessData()
  const [activeTab, setActiveTab] = useState("journal")
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    type: "Reflection" as const,
    mood: [] as string[],
    tags: [] as string[],
    season: seasons[0],
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [newTag, setNewTag] = useState("")

  const handleSaveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return

    addJournalEntry({
      ...newEntry,
      date: new Date().toISOString(),
      linkedPaths: [],
      xpGained: 50,
    })

    setNewEntry({
      title: "",
      content: "",
      type: "Reflection",
      mood: [],
      tags: [],
      season: seasons[0],
    })
  }

  const toggleMood = (mood: string) => {
    setNewEntry((prev) => ({
      ...prev,
      mood: prev.mood.includes(mood) ? prev.mood.filter((m) => m !== mood) : [...prev.mood, mood],
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !newEntry.tags.includes(newTag.trim())) {
      setNewEntry((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewEntry((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const filteredEntries = journalEntries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const typeColors = {
    Reflection: "border-blue-500 text-blue-400",
    Breakthrough: "border-green-500 text-green-400",
    Setback: "border-red-500 text-red-400",
    Philosophy: "border-purple-500 text-purple-400",
    Goal: "border-yellow-500 text-yellow-400",
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          Inner Core
        </h1>
        <p className="text-gray-400 text-lg">Archive of your journey, lessons, and evolution</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="journal" className="data-[state=active]:bg-purple-500/20">
            <Scroll className="h-4 w-4 mr-2" />
            Journal
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-purple-500/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="milestones" className="data-[state=active]:bg-purple-500/20">
            <Calendar className="h-4 w-4 mr-2" />
            Milestones
          </TabsTrigger>
          <TabsTrigger value="archive" className="data-[state=active]:bg-purple-500/20">
            <BookOpen className="h-4 w-4 mr-2" />
            Archive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Entry Form */}
            <Card className="glass-card lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-purple-400" />
                  New Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Entry title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                />

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {entryTypes.map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => setNewEntry((prev) => ({ ...prev, type: type as any }))}
                        className={`text-xs ${
                          newEntry.type === type
                            ? typeColors[type as keyof typeof typeColors] + " bg-opacity-20"
                            : "border-gray-600 text-gray-400"
                        }`}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                <Textarea
                  placeholder="What insights did you gain? How did you grow?"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, content: e.target.value }))}
                  className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 min-h-[120px]"
                />

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Mood</label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <Button
                        key={mood}
                        variant="outline"
                        size="sm"
                        onClick={() => toggleMood(mood)}
                        className={`text-xs ${
                          newEntry.mood.includes(mood)
                            ? "border-purple-500 bg-purple-500/20 text-purple-300"
                            : "border-gray-600 text-gray-400"
                        }`}
                      >
                        {mood}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Tags</label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button onClick={addTag} size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {newEntry.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-purple-500/50 text-purple-400 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSaveEntry}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!newEntry.title.trim() || !newEntry.content.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Save Entry
                </Button>
              </CardContent>
            </Card>

            {/* Entries List */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Journal Entries</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search entries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400 w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredEntries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                      <Scroll className="h-12 w-12 mb-2 opacity-50" />
                      <p>No entries yet</p>
                      <p className="text-xs text-gray-500">Start documenting your journey</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEntries.map((entry) => (
                        <div key={entry.id} className="p-4 bg-black/20 rounded-xl border border-white/10">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-white">{entry.title}</h3>
                              <p className="text-gray-400 text-sm">
                                {new Date(entry.date).toLocaleDateString()} • {entry.season}
                              </p>
                            </div>
                            <Badge variant="outline" className={`${typeColors[entry.type]} text-xs`}>
                              {entry.type}
                            </Badge>
                          </div>

                          <p className="text-gray-300 text-sm mb-3 line-clamp-3">{entry.content}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {entry.mood.map((mood) => (
                                <Badge
                                  key={mood}
                                  variant="outline"
                                  className="text-xs border-blue-500/50 text-blue-400"
                                >
                                  {mood}
                                </Badge>
                              ))}
                              {entry.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs border-purple-500/50 text-purple-400"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-xs text-green-400">+{entry.xpGained} XP</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Growth Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Insights will appear as you document your journey</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Key Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Your milestones will be recorded here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archive" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Seasonal Archive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {seasons.map((season) => (
                  <div key={season} className="p-4 bg-black/20 rounded-xl border border-white/10 text-center">
                    <h3 className="font-bold text-white mb-2">{season}</h3>
                    <p className="text-gray-400 text-sm">0 entries</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
