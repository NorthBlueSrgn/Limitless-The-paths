"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, ChevronLeft, ChevronRight, Star, Lock, Eye } from "lucide-react"
import type { StoryChapter, UserProfile } from "@/types/limitless"

interface ChapterBlackProps {
  storyChapters: StoryChapter[]
  userProfile: UserProfile
}

const toneColors = {
  light: "from-yellow-400 to-orange-400",
  neutral: "from-blue-400 to-purple-400",
  dark: "from-purple-400 to-red-400",
  ascension: "from-purple-400 to-pink-400",
}

const toneBackgrounds = {
  light: "bg-yellow-900/20 border-yellow-500/30",
  neutral: "bg-blue-900/20 border-blue-500/30",
  dark: "bg-red-900/20 border-red-500/30",
  ascension: "bg-purple-900/20 border-purple-500/30",
}

export function ChapterBlack({ storyChapters = [], userProfile }: ChapterBlackProps) {
  const [currentChapter, setCurrentChapter] = useState(0)

  if (storyChapters.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Chapter Black
          </h1>
          <p className="text-purple-300">Your story awaits to be written</p>
        </div>

        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-bold text-white mb-2">No Chapters Available</h3>
            <p className="text-gray-400">Complete tasks to unlock your first chapter</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const chapter = storyChapters[currentChapter]
  const canGoNext = currentChapter < storyChapters.length - 1
  const canGoPrev = currentChapter > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Chapter Black
        </h1>
        <p className="text-purple-300">Your transformation story unfolds</p>
      </div>

      {/* Chapter Navigation */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Story Navigation
            </CardTitle>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              {currentChapter + 1} of {storyChapters.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentChapter(currentChapter - 1)}
              disabled={!canGoPrev}
              className="border-purple-500/30 text-purple-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex-1 flex justify-center gap-2">
              {storyChapters.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentChapter(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentChapter
                      ? "bg-purple-400"
                      : storyChapters[index].unlocked
                        ? "bg-purple-600/50 hover:bg-purple-500"
                        : "bg-gray-600"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentChapter(currentChapter + 1)}
              disabled={!canGoNext}
              className="border-purple-500/30 text-purple-300"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Chapter Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapter Content */}
        <div className="lg:col-span-2">
          <Card className={`bg-black/40 backdrop-blur-xl border-purple-500/20 ${toneBackgrounds[chapter.tone]}`}>
            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2
                    className={`text-2xl font-orbitron font-bold bg-gradient-to-r ${toneColors[chapter.tone]} bg-clip-text text-transparent`}
                  >
                    Chapter {chapter.chapterNumber}: {chapter.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    {chapter.unlocked ? (
                      <Eye className="w-5 h-5 text-green-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        chapter.tone === "light"
                          ? "text-yellow-400 border-yellow-400"
                          : chapter.tone === "neutral"
                            ? "text-blue-400 border-blue-400"
                            : chapter.tone === "dark"
                              ? "text-red-400 border-red-400"
                              : "text-purple-400 border-purple-400"
                      }`}
                    >
                      {chapter.tone}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {chapter.themes?.map((theme) => (
                    <Badge key={theme} variant="secondary" className="text-xs bg-purple-900/30 text-purple-300">
                      {theme}
                    </Badge>
                  )) || []}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="prose prose-invert max-w-none">
                  <div className="text-purple-100 leading-relaxed whitespace-pre-line">{chapter.content}</div>
                </div>
              </ScrollArea>

              {chapter.completed && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <div className="flex items-center gap-2 text-green-400">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">Chapter Completed</span>
                  </div>
                  <p className="text-xs text-green-300 mt-1">
                    You have successfully completed this chapter and earned its rewards.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chapter Details */}
        <div className="space-y-4">
          {/* Chapter Info */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-lg">Chapter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Progress Required</h4>
                <p className="text-sm text-purple-300">{chapter.requiredTaskCompletion}% task completion needed</p>
              </div>

              {chapter.characterMoments && chapter.characterMoments.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Key Moments</h4>
                  <ul className="space-y-1">
                    {chapter.characterMoments.map((moment, index) => (
                      <li key={index} className="text-sm text-purple-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                        {moment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {chapter.rewards && chapter.rewards.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Rewards</h4>
                  <div className="space-y-1">
                    {chapter.rewards.map((reward, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-purple-900/20 rounded text-sm">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-purple-300">
                          {reward.type}: {reward.value} {reward.target && `(${reward.target})`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Story Progression */}
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-lg">Story Arc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {storyChapters.map((chap, index) => (
                  <div
                    key={chap.id}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${
                      index === currentChapter
                        ? "bg-purple-600/20 border border-purple-500/30"
                        : "hover:bg-purple-600/10"
                    }`}
                    onClick={() => chap.unlocked && setCurrentChapter(index)}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        chap.completed
                          ? "bg-green-500 text-white"
                          : chap.unlocked
                            ? "bg-purple-500 text-white"
                            : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {chap.chapterNumber}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${chap.unlocked ? "text-white" : "text-gray-400"}`}>
                        {chap.title}
                      </p>
                      <p className="text-xs text-purple-400">
                        {chap.completed ? "Completed" : chap.unlocked ? "Available" : "Locked"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
