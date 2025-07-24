"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function StoryChapter() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="font-orbitron text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          The Chronicle of Ascension
        </h1>
        <p className="text-gray-400 text-lg">Chapter 1: The First Steps</p>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          <div className="relative h-64 rounded-t-2xl overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-06-25%20at%2017.55.39-mioWE5tRidLjnrHR703tjyHmBDotlZ.png"
              alt="Chapter 1 Illustration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h2 className="font-orbitron text-3xl font-bold text-white mb-2">The First Steps</h2>
              <p className="text-gray-300">Where legends are forged</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg">
                Hunter 44251628, your journey continues to unfold. The path ahead shimmers with possibility. Each step
                forward is a choice to become more than you were yesterday.
              </p>

              <p className="text-gray-300 leading-relaxed text-lg">
                In the depths of the White Room, where potential meets discipline, you stand at the threshold of
                transformation. The system has awakened, and with it, your true power begins to emerge.
              </p>

              <p className="text-gray-300 leading-relaxed text-lg">
                Every task completed, every challenge overcome, adds another layer to your evolving soul. The question
                is not whether you will grow, but how far you will ascend.
              </p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-orbitron text-lg font-bold text-purple-400 mb-2">Chapter Themes</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      beginning
                    </Badge>
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                      awakening
                    </Badge>
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                      potential
                    </Badge>
                  </div>
                </div>

                <Button className="bg-purple-600 hover:bg-purple-700 text-white" disabled>
                  <span>Next Chapter</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="glass-card p-6 border-green-500/30 bg-green-500/5">
        <div className="text-center">
          <div className="text-green-400 font-bold text-lg mb-2">Chapter Complete</div>
          <p className="text-gray-300">Tomorrow brings a new chapter of your ascension...</p>
        </div>
      </div>
    </div>
  )
}
