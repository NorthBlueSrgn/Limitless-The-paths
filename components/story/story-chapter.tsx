"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, BookOpen } from "lucide-react"
import { useLimitlessData } from "@/hooks/use-limitless-data"

export function StoryChapter() {
  const { storyChapters, userProfile } = useLimitlessData()
  const currentChapter = storyChapters[0] // For demo, using first chapter

  if (!currentChapter) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            The Chronicle of Ascension
          </h1>
          <p className="text-gray-400 text-lg">Your story awaits...</p>
        </div>

        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-purple-400 opacity-50" />
            <h2 className="text-xl font-bold text-white mb-2">No Chapters Available</h2>
            <p className="text-gray-400">Complete daily tasks to unlock your first chapter</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          The Chronicle of Ascension
        </h1>
        <p className="text-gray-400 text-lg">
          Chapter {currentChapter.chapterNumber}: {currentChapter.title}
        </p>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          {currentChapter.imageUrl && (
            <div className="relative h-64 rounded-t-2xl overflow-hidden">
              <img
                src={currentChapter.imageUrl || "/placeholder.svg"}
                alt={`Chapter ${currentChapter.chapterNumber} Illustration`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h2 className="font-orbitron text-3xl font-bold text-white mb-2">{currentChapter.title}</h2>
                <p className="text-gray-300">Where legends are forged</p>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            <div className="prose prose-invert max-w-none">
              {currentChapter.content.split("\n").map((paragraph, index) => (
                <p key={index} className="text-gray-300 leading-relaxed text-lg mb-4">
                  {paragraph}
                </p>
              ))}

              <div className="mt-8 p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <p className="text-purple-300 italic text-center">
                  "Hunter {userProfile.id.slice(-6)}, your journey continues to unfold. The path ahead shimmers with
                  possibility. Each step forward is a choice to become more than you were yesterday."
                </p>
              </div>
            </div>

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
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white" disabled>
                    <span>Next Chapter</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapter Progress */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white mb-1">Chapter Progress</h3>
              <p className="text-gray-400 text-sm">
                Complete {currentChapter.requiredTaskCompletion}% of daily tasks to unlock the next chapter
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">0%</div>
              <div className="text-xs text-gray-400">Tasks completed today</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentChapter.completed && (
        <div className="glass-card p-6 border-green-500/30 bg-green-500/5">
          <div className="text-center">
            <div className="text-green-400 font-bold text-lg mb-2">Chapter Complete</div>
            <p className="text-gray-300">Tomorrow brings a new chapter of your ascension...</p>
          </div>
        </div>
      )}
    </div>
  )
}
