"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Archive,
  BookOpen,
  Plus,
  Calendar,
  Tag,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Target,
  Heart,
  Sword,
} from "lucide-react"
import type { JournalEntry, Chronicle } from "@/types/limitless"

interface ArchivesProps {
  journalEntries: JournalEntry[]
  chronicles: Chronicle[]
  addJournalEntry: (entry: Omit<JournalEntry, "id">) => void
  addChronicle: (chronicle: Omit<Chronicle, "id">) => void
}

const entryTypeIcons = {
  Reflection: Lightbulb,
  Breakthrough: TrendingUp,
  Setback: AlertTriangle,
  Philosophy: BookOpen,
  Goal: Target,
  "Rival Event": Sword,
}

const entryTypeColors = {
  Reflection: "text-blue-400 border-blue-400",
  Breakthrough: "text-green-400 border-green-400",
  Setback: "text-red-400 border-red-400",
  Philosophy: "text-purple-400 border-purple-400",
  Goal: "text-yellow-400 border-yellow-400",
  "Rival Event": "text-orange-400 border-orange-400",
}

const chronicleTypeColors = {
  Journal: "text-blue-400 border-blue-400",
  "Story Response": "text-purple-400 border-purple-400",
  "Mindset Shift": "text-green-400 border-green-400",
  "Arc Reflection": "text-yellow-400 border-yellow-400",
}

export function Archives({ journalEntries = [], chronicles = [], addJournalEntry, addChronicle }: ArchivesProps) {
  const [newEntryTitle, setNewEntryTitle] = useState("")
  const [newEntryContent, setNewEntryContent] = useState("")
  const [newEntryType, setNewEntryType] = useState<JournalEntry["type"]>("Reflection")
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [selectedChronicle, setSelectedChronicle] = useState<Chronicle | null>(null)

  const handleAddEntry = () => {
    if (newEntryTitle.trim() && newEntryContent.trim()) {
      addJournalEntry({
        title: newEntryTitle,
        content: newEntryContent,
        date: new Date().toISOString(),
        mood: ["Reflective"],
        tags: [],
        season: "Current",
        type: newEntryType,
        linkedPaths: [],
        xpGained: 25,
      })
      setNewEntryTitle("")
      setNewEntryContent("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Archives
        </h1>
        <p className="text-purple-300">Chronicle your journey through transformation</p>
      </div>

      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-purple-500/20">
          <TabsTrigger value="journal" className="data-[state=active]:bg-purple-600/30">
            Journal Entries ({journalEntries.length})
          </TabsTrigger>
          <TabsTrigger value="chronicles" className="data-[state=active]:bg-purple-600/30">
            Chronicles ({chronicles.length})
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-600/30">
            Timeline View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="space-y-4">
          {/* Add New Entry */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Journal Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Entry title..."
                  value={newEntryTitle}
                  onChange={(e) => setNewEntryTitle(e.target.value)}
                  className="bg-black/20 border-purple-500/30"
                />
                <select
                  value={newEntryType}
                  onChange={(e) => setNewEntryType(e.target.value as JournalEntry["type"])}
                  className="px-3 py-2 bg-black/20 border border-purple-500/30 rounded-md text-white"
                >
                  {Object.keys(entryTypeIcons).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <Textarea
                placeholder="Write your thoughts, insights, and reflections..."
                value={newEntryContent}
                onChange={(e) => setNewEntryContent(e.target.value)}
                className="bg-black/20 border-purple-500/30 min-h-32"
              />
              <Button onClick={handleAddEntry} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </CardContent>
          </Card>

          {/* Journal Entries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {journalEntries.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 lg:col-span-2">
                <CardContent className="p-12 text-center">
                  <Archive className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-bold text-white mb-2">No Journal Entries</h3>
                  <p className="text-gray-400">Start documenting your transformation journey</p>
                </CardContent>
              </Card>
            ) : (
              journalEntries.map((entry) => {
                const TypeIcon = entryTypeIcons[entry.type]
                return (
                  <Dialog key={entry.id}>
                    <DialogTrigger asChild>
                      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 cursor-pointer hover:border-purple-400/40 transition-all">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2">
                              <TypeIcon className="w-4 h-4" />
                              {entry.title}
                            </CardTitle>
                            <Badge variant="outline" className={`${entryTypeColors[entry.type]} text-xs`}>
                              {entry.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-purple-300 text-sm line-clamp-3">{entry.content}</p>

                          <div className="flex items-center gap-4 text-xs text-purple-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(entry.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />+{entry.xpGained} XP
                            </div>
                          </div>

                          {entry.mood.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {entry.mood.map((mood) => (
                                <Badge
                                  key={mood}
                                  variant="secondary"
                                  className="text-xs bg-purple-900/30 text-purple-300"
                                >
                                  <Heart className="w-2 h-2 mr-1" />
                                  {mood}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {entry.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs text-blue-400 border-blue-400">
                                  <Tag className="w-2 h-2 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/20 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                          <TypeIcon className="w-5 h-5" />
                          {entry.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline" className={`${entryTypeColors[entry.type]}`}>
                            {entry.type}
                          </Badge>
                          <span className="text-purple-400">{new Date(entry.date).toLocaleDateString()}</span>
                          <span className="text-purple-400">+{entry.xpGained} XP</span>
                        </div>

                        <div className="prose prose-invert max-w-none">
                          <p className="text-purple-100 leading-relaxed whitespace-pre-line">{entry.content}</p>
                        </div>

                        {entry.storyImpact && (
                          <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded">
                            <h4 className="text-sm font-medium text-purple-400 mb-1">Story Impact</h4>
                            <p className="text-xs text-purple-300">{entry.storyImpact}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="chronicles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {chronicles.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 lg:col-span-2">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-bold text-white mb-2">No Chronicles</h3>
                  <p className="text-gray-400">Chronicles will appear as your story unfolds</p>
                </CardContent>
              </Card>
            ) : (
              chronicles.map((chronicle) => (
                <Dialog key={chronicle.id}>
                  <DialogTrigger asChild>
                    <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 cursor-pointer hover:border-purple-400/40 transition-all">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">{chronicle.title}</CardTitle>
                          <Badge variant="outline" className={`${chronicleTypeColors[chronicle.type]} text-xs`}>
                            {chronicle.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-purple-300 text-sm line-clamp-3">{chronicle.content}</p>

                        <div className="flex items-center gap-4 text-xs text-purple-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(chronicle.date).toLocaleDateString()}
                          </div>
                          <Badge variant="secondary" className="text-xs bg-purple-900/30 text-purple-300">
                            {chronicle.mood}
                          </Badge>
                        </div>

                        {chronicle.insights.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {chronicle.insights.slice(0, 2).map((insight) => (
                              <Badge
                                key={insight}
                                variant="outline"
                                className="text-xs text-green-400 border-green-400"
                              >
                                <Lightbulb className="w-2 h-2 mr-1" />
                                {insight}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/20 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">{chronicle.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline" className={`${chronicleTypeColors[chronicle.type]}`}>
                          {chronicle.type}
                        </Badge>
                        <span className="text-purple-400">{new Date(chronicle.date).toLocaleDateString()}</span>
                        <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
                          {chronicle.mood}
                        </Badge>
                      </div>

                      <div className="prose prose-invert max-w-none">
                        <p className="text-purple-100 leading-relaxed whitespace-pre-line">{chronicle.content}</p>
                      </div>

                      {chronicle.insights.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-purple-400">Key Insights</h4>
                          <div className="space-y-1">
                            {chronicle.insights.map((insight, index) => (
                              <div key={index} className="flex items-start gap-2 p-2 bg-purple-900/20 rounded text-sm">
                                <Lightbulb className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-purple-300">{insight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {chronicle.orderAnalysis && (
                        <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded">
                          <h4 className="text-sm font-medium text-purple-400 mb-1">The Order's Analysis</h4>
                          <p className="text-xs text-purple-300">{chronicle.orderAnalysis}</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Transformation Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...journalEntries, ...chronicles]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((item, index) => {
                    const isJournal = "type" in item && "xpGained" in item
                    const date = new Date(item.date)

                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${isJournal ? "bg-blue-400" : "bg-purple-400"}`} />
                          {index < 9 && <div className="w-px h-12 bg-purple-500/30 mt-2" />}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-medium">{item.title}</h4>
                            <Badge variant="outline" className="text-xs text-purple-400 border-purple-400">
                              {isJournal ? (item as JournalEntry).type : (item as Chronicle).type}
                            </Badge>
                          </div>
                          <p className="text-sm text-purple-300 mb-2 line-clamp-2">{item.content}</p>
                          <div className="flex items-center gap-4 text-xs text-purple-400">
                            <span>{date.toLocaleDateString()}</span>
                            <span>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            {isJournal && <span className="text-green-400">+{(item as JournalEntry).xpGained} XP</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
