"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, BookOpen, Eye, Clock } from "lucide-react"
import { useLimitlessData } from "@/hooks/use-limitless-data"

export function ChapterBlack() {
  const { storyChapters, userProfile, dailyTasks } = useLimitlessData()
  const currentChapter = storyChapters[0] // For demo, using first chapter

  const completedTasks = dailyTasks.filter((task) => task.completed).length
  const totalTasks = dailyTasks.length
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  if (!currentChapter) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="font-orbitron text-5xl font-bold chapter-title">CHAPTER BLACK</h1>
          <p className="text-gray-400 text-lg manga-text">The narrative of your ascension</p>
        </div>

        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-purple-400 opacity-50" />
            <h2 className="text-xl font-bold text-white mb-2">The Story Awaits</h2>
            <p className="text-gray-400 manga-text">Complete your daily trials to unlock your first chapter</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "light":
        return "border-green-500/30 bg-green-500/5"
      case "dark":
        return "border-red-500/30 bg-red-500/5"
      case "ascension":
        return "border-purple-500/30 bg-purple-500/5"
      default:
        return "border-blue-500/30 bg-blue-500/5"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-5xl font-bold chapter-title">CHAPTER BLACK</h1>
        <p className="text-gray-400 text-lg manga-text">The narrative of your ascension unfolds</p>
      </div>

      {/* Chapter Navigation */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Eye className="h-5 w-5 text-purple-400" />
              <div>
                <div className="font-orbitron text-lg font-bold text-white">Chapter {currentChapter.chapterNumber}</div>
                <div className="text-sm text-gray-400">Hunter ID: {userProfile.id}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-purple-500 text-purple-400 font-orbitron">
                {currentChapter.tone.toUpperCase()}
              </Badge>
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">5 min read</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Chapter Content */}
      <Card className={`glass-card ${getToneColor(currentChapter.tone)}`}>
        <CardContent className="p-0">
          {currentChapter.imageUrl && (
            <div className="relative h-80 rounded-t-2xl overflow-hidden">
              <img
                src={currentChapter.imageUrl || "/placeholder.svg"}
                alt={`Chapter ${currentChapter.chapterNumber} Illustration`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="font-orbitron text-4xl font-bold text-white mb-2">{currentChapter.title}</h2>
                <p className="text-gray-300 manga-text">Chapter {currentChapter.chapterNumber}</p>
              </div>
            </div>
          )}

          <div className="p-8 space-y-8">
            {/* Chapter Content */}
            <div className="prose prose-invert max-w-none">
              {currentChapter.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-gray-300 leading-relaxed text-lg mb-6 manga-text">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Character Moments */}
            {currentChapter.characterMoments && currentChapter.characterMoments.length > 0 && (
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-orbitron text-lg font-bold text-purple-400 mb-4">Key Moments</h3>
                <div className="space-y-2">
                  {currentChapter.characterMoments.map((moment, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">{moment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Themes */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-orbitron text-lg font-bold text-purple-400 mb-2">Chapter Themes</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentChapter.themes.map((theme) => (
                      <Badge key={theme} variant="outline" className="border-purple-500/50 text-purple-400">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="border-gray-600 text-gray-400 bg-transparent" disabled>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={taskCompletionRate < currentChapter.requiredTaskCompletion}
                  >
                    <span>Next Chapter</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapter Unlock Progress */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white mb-1">Chapter Progression</h3>
                <p className="text-gray-400 text-sm">
                  Complete {currentChapter.requiredTaskCompletion}% of daily tasks to unlock the next chapter
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">{Math.round(taskCompletionRate)}%</div>
                <div className="text-xs text-gray-400">Tasks completed today</div>
              </div>
            </div>
            <Progress value={taskCompletionRate} className="h-3 bg-gray-800/50" />
            {taskCompletionRate >= currentChapter.requiredTaskCompletion && (
              <div className="text-center">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Next Chapter Unlocked!</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Story Impact */}
      <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <h3 className="font-orbitron text-lg font-bold text-yellow-400">The Order Observes</h3>
            <p className="text-gray-300 manga-text italic">
              "Your actions today will determine the tone of tomorrow's chapter. Choose wisely, Hunter."
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
