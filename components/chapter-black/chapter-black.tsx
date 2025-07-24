"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Lock, Unlock, Calendar, Eye, Zap, Crown } from "lucide-react"
import type { StoryChapter, User } from "@/types/limitless"

interface ChapterBlackProps {
  currentChapter: StoryChapter
  user: User
}

const toneStyles = {
  light: "border-blue-500/30 bg-blue-500/10",
  dark: "border-red-500/30 bg-red-500/10",
  neutral: "border-gray-500/30 bg-gray-500/10",
  ascension: "border-purple-500/30 bg-purple-500/10",
}

const toneIcons = {
  light: "☀️",
  dark: "🌙",
  neutral: "⚖️",
  ascension: "⭐",
}

export function ChapterBlack({ currentChapter, user }: ChapterBlackProps) {
  const completionRate = (user.completedTasks / user.totalTasks) * 100
  const nextChapterUnlocked = completionRate >= 60 // Unlock next chapter at 60% task completion

  return (
    <div className="space-y-6">
      {/* Chapter Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              <span className="chapter-title font-orbitron">Chapter Black</span>
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Rank {user.rank} Chronicles
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.completedTasks}</div>
              <div className="text-sm text-muted-foreground">Actions Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completionRate.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Story Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Chapter */}
      <Card className={`glass-card ${toneStyles[currentChapter.tone]}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl">{toneIcons[currentChapter.tone]}</span>
              <div>
                <h2 className="text-xl font-orbitron">{currentChapter.title}</h2>
                <p className="text-sm text-muted-foreground font-normal">
                  Unlocked {new Date(currentChapter.dateUnlocked!).toLocaleDateString()}
                </p>
              </div>
            </CardTitle>
            <Badge variant="outline" className="capitalize">
              {currentChapter.tone} Arc
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <div className="manga-text text-base leading-relaxed whitespace-pre-line">{currentChapter.content}</div>
          </div>

          {currentChapter.characterMoments && currentChapter.characterMoments.length > 0 && (
            <div className="mt-6 p-4 rounded-lg bg-black/30 border border-white/10">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Key Moments
              </h4>
              <ul className="space-y-2">
                {currentChapter.characterMoments.map((moment, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {moment}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Chapter Preview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {nextChapterUnlocked ? (
              <Unlock className="w-5 h-5 text-green-400" />
            ) : (
              <Lock className="w-5 h-5 text-red-400" />
            )}
            Next Chapter
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nextChapterUnlocked ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400">
                <Zap className="w-4 h-4" />
                <span className="font-medium">Chapter Unlocked!</span>
              </div>
              <p className="text-muted-foreground">
                Your consistent actions have opened new narrative paths. The story evolves based on your choices and
                dedication.
              </p>
              <Button className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Read Next Chapter
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress to unlock</span>
                <span className="text-sm text-muted-foreground">{completionRate.toFixed(0)}% / 60%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Complete more daily tasks to unlock the next chapter of your story. Your actions shape the narrative.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Story Influence */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Story Influence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Recent Actions Impact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Physical training → Strength-based story elements
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Meditation practice → Spiritual awakening themes
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Strategic thinking → Tactical narrative choices
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Narrative Tone</h4>
              <p className="text-sm text-muted-foreground">
                Your current {user.streak}-day streak and {completionRate.toFixed(0)}% completion rate is influencing
                the story toward {currentChapter.tone === "dark" ? "challenging trials" : "ascending power"}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
