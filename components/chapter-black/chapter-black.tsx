"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { BookOpen, ChevronLeft, ChevronRight, Star, Lock, Eye, Flame, Crown } from "lucide-react"
import type { StoryChapter, UserProfile } from "@/types/limitless"

interface ChapterBlackProps {
  chapters: StoryChapter[]
  userProfile: UserProfile
}

const toneColors = {
  light: "from-blue-400 to-cyan-400",
  neutral: "from-purple-400 to-blue-400",
  dark: "from-red-400 to-purple-400",
  ascension: "from-yellow-400 to-orange-400",
}

const toneBackgrounds = {
  light: "bg-gradient-to-br from-blue-900/20 to-cyan-900/20",
  neutral: "bg-gradient-to-br from-purple-900/20 to-blue-900/20",
  dark: "bg-gradient-to-br from-red-900/20 to-purple-900/20",
  ascension: "bg-gradient-to-br from-yellow-900/20 to-orange-900/20",
}

export function ChapterBlack({ chapters, userProfile }: ChapterBlackProps) {
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter>(chapters[0])
  const [isReading, setIsReading] = useState(false)

  const unlockedChapters = chapters.filter((chapter) => chapter.unlocked)
  const currentChapterIndex = chapters.findIndex((chapter) => chapter.id === selectedChapter?.id)

  const nextChapter = () => {
    if (currentChapterIndex < unlockedChapters.length - 1) {
      setSelectedChapter(unlockedChapters[currentChapterIndex + 1])
    }
  }

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setSelectedChapter(unlockedChapters[currentChapterIndex - 1])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Chapter Black
        </h1>
        <p className="text-purple-300">Your story unfolds with every choice. Every action shapes the narrative.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapter List */}
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Story Archive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                      chapter.unlocked
                        ? selectedChapter?.id === chapter.id
                          ? `${toneBackgrounds[chapter.tone]} border-purple-400/50 shadow-lg`
                          : "bg-black/20 border-purple-500/20 hover:border-purple-400/40"
                        : "bg-black/10 border-gray-700/20 opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => chapter.unlocked && setSelectedChapter(chapter)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {chapter.unlocked ? (
                        <Eye className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-500" />
                      )}
                      <span className={`font-semibold text-sm ${chapter.unlocked ? "text-white" : "text-gray-500"}`}>
                        Chapter {chapter.chapterNumber}
                      </span>
                      {chapter.completed && <Star className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <h3 className={`font-medium mb-1 ${chapter.unlocked ? "text-white" : "text-gray-500"}`}>
                      {chapter.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {chapter.themes.map((theme) => (
                        <Badge key={theme} variant="secondary" className="text-xs bg-purple-900/30 text-purple-300">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                    {!chapter.unlocked && (
                      <div className="text-xs text-gray-500">
                        Requires {chapter.requiredTaskCompletion}% task completion
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chapter Reader */}
        <div className="lg:col-span-2 space-y-4">
          {selectedChapter && (
            <>
              <Card className={`${toneBackgrounds[selectedChapter.tone]} backdrop-blur-xl border-purple-500/20`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle
                        className={`bg-gradient-to-r ${toneColors[selectedChapter.tone]} bg-clip-text text-transparent`}
                      >
                        {selectedChapter.title}
                      </CardTitle>
                      <p className="text-purple-300 text-sm">Chapter {selectedChapter.chapterNumber}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`bg-gradient-to-r ${toneColors[selectedChapter.tone]} text-black border-none`}
                    >
                      {selectedChapter.tone.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 pr-4">
                    <div className="prose prose-invert max-w-none">
                      <div className="text-purple-100 leading-relaxed whitespace-pre-line font-serif text-base">
                        {selectedChapter.content}
                      </div>
                    </div>
                  </ScrollArea>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-500/20">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevChapter}
                      disabled={currentChapterIndex === 0}
                      className="text-purple-300 hover:text-white"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      {selectedChapter.completed && (
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          <Star className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        onClick={() => setIsReading(!isReading)}
                        className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30"
                      >
                        {isReading ? "Exit Reading Mode" : "Reading Mode"}
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextChapter}
                      disabled={currentChapterIndex === unlockedChapters.length - 1}
                      className="text-purple-300 hover:text-white"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Chapter Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-purple-400 text-sm">Character Moments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedChapter.characterMoments.map((moment, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Crown className="w-3 h-3 text-yellow-400" />
                          <span className="text-purple-300">{moment}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-purple-400 text-sm">Chapter Rewards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedChapter.rewards.map((reward, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Flame className="w-3 h-3 text-orange-400" />
                          <span className="text-purple-300">
                            {reward.type}: {reward.value} {reward.target && `(${reward.target})`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Story Progress */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-400">Story Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Chapters Unlocked</span>
              <span className="text-white">
                {unlockedChapters.length} / {chapters.length}
              </span>
            </div>
            <Progress value={(unlockedChapters.length / chapters.length) * 100} className="h-2" />
            <p className="text-xs text-purple-400">
              Your actions and task completion unlock new chapters in your transformation story.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
