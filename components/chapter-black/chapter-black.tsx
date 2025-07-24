"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, ChevronLeft, ChevronRight, Eye, Crown, Zap, Calendar } from "lucide-react"
import type { StoryChapter, UserProfile } from "@/types/limitless"

interface ChapterBlackProps {
  chapters: StoryChapter[]
  userProfile: UserProfile
  completionRate: number
}

const toneStyles = {
  light: "border-blue-500/30 bg-blue-500/5",
  neutral: "border-gray-500/30 bg-gray-500/5",
  dark: "border-red-500/30 bg-red-500/5",
  ascension: "border-purple-500/30 bg-purple-500/5",
}

const toneEmojis = {
  light: "☀️",
  neutral: "⚖️",
  dark: "🌙",
  ascension: "⭐",
}

export function ChapterBlack({ chapters, userProfile, completionRate }: ChapterBlackProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const currentChapter = chapters[currentChapterIndex]
  const nextChapterUnlocked = completionRate >= (currentChapter?.requiredTaskCompletion || 60)

  const navigateChapter = (direction: "prev" | "next") => {
    if (direction === "prev" && currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1)
    } else if (direction === "next" && currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1)
    }
  }

  if (!currentChapter) {
    return (
      <Card className="glass-card">
        <CardContent className="p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">The Story Awaits</h2>
          <p className="text-gray-400 manga-text">Complete your trials to unlock the first chapter</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="font-orbitron chapter-title">Chapter Black</span>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Hunter Chronicles
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentChapter.chapterNumber}</div>
              <div className="text-sm text-muted-foreground">Current Chapter</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userProfile.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{Math.round(completionRate)}%</div>
              <div className="text-sm text-muted-foreground">Story Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{chapters.filter((c) => c.unlocked).length}</div>
              <div className="text-sm text-muted-foreground">Unlocked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Story Display */}
      <Card className={`glass-card story-scroll ${toneStyles[currentChapter.tone]}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{toneEmojis[currentChapter.tone]}</span>
              <div>
                <CardTitle className="font-orbitron text-xl">
                  Chapter {currentChapter.chapterNumber}: {currentChapter.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {currentChapter.unlocked ? "Unlocked" : "Locked"}
                  </span>
                  <Badge variant="outline" className="capitalize text-xs">
                    {currentChapter.tone} Arc
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter("prev")}
                disabled={currentChapterIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter("next")}
                disabled={currentChapterIndex === chapters.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-96 w-full rounded-lg p-4 bg-black/20">
            <div className="prose prose-invert max-w-none">
              <div className="manga-text text-base leading-relaxed whitespace-pre-line text-gray-300">
                {currentChapter.content}
              </div>
            </div>
          </ScrollArea>

          {/* Character Moments */}
          {currentChapter.characterMoments && currentChapter.characterMoments.length > 0 && (
            <div className="mt-6 p-4 rounded-lg bg-black/30 border border-white/10">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                Key Moments
              </h4>
              <ul className="space-y-2">
                {currentChapter.characterMoments.map((moment, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    {moment}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Themes */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-white mb-2">Chapter Themes</h4>
            <div className="flex flex-wrap gap-2">
              {currentChapter.themes.map((theme) => (
                <Badge key={theme} variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Story Choices */}
      {currentChapter.choices && currentChapter.choices.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Story Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentChapter.choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-4 border-purple-500/30 hover:bg-purple-500/10 bg-transparent"
                >
                  <div>
                    <div className="font-medium text-white">{choice.text}</div>
                    <div className="text-sm text-gray-400 mt-1">{choice.consequence}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Chapter Progress */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Chapter Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">Next Chapter Unlock</h3>
                <p className="text-sm text-gray-400">
                  Complete {currentChapter.requiredTaskCompletion}% of daily tasks to unlock the next chapter
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">{Math.round(completionRate)}%</div>
                <div className="text-xs text-gray-400">Current Progress</div>
              </div>
            </div>

            <Progress
              value={completionRate}
              className="h-3"
              style={{ "--progress-foreground": "#8b5cf6" } as React.CSSProperties}
            />

            {nextChapterUnlocked && (
              <div className="text-center">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Next Chapter Unlocked!</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Story Influence */}
      <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            The Order's Observation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <p className="text-gray-300 manga-text italic">
              "Your actions today will determine the tone of tomorrow's chapter. Choose wisely, Hunter. The narrative
              bends to your will, but only if you prove worthy of its power."
            </p>
            <div className="text-xs text-gray-400">
              Story adapts based on your consistency, choices, and growth patterns
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
