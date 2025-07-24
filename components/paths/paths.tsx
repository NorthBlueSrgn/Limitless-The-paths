"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Route, Target, Crown, Lock, Plus, Minus, Eye, Zap } from "lucide-react"
import type { Path, User } from "@/types/limitless"

interface PathsProps {
  paths: Path[]
  user: User
  onActivatePath: (pathId: string) => boolean
  onDeactivatePath: (pathId: string) => void
}

export function Paths({ paths, user, onActivatePath, onDeactivatePath }: PathsProps) {
  const activePaths = paths.filter((path) => path.isActive)
  const availablePaths = paths.filter((path) => !path.isActive)
  const canActivateMore = user.activePaths.length < 3

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Route className="w-6 h-6" />
              <span className="font-orbitron">Soul Paths</span>
            </div>
            <Badge variant="outline">{user.activePaths.length}/3 Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Choose your paths wisely. Each path shapes your evolution, unlocks unique abilities, and influences your
            story's direction. You may walk up to 3 paths simultaneously.
          </p>
        </CardContent>
      </Card>

      {/* Active Paths */}
      {activePaths.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            Active Paths
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activePaths.map((path) => (
              <Card key={path.id} className="glass-card border-2" style={{ borderColor: `${path.color}30` }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: path.color }}></div>
                      {path.name}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeactivatePath(path.id)}
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Badge variant="outline" style={{ borderColor: path.color, color: path.color }}>
                    {path.archetype}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{path.description}</p>

                  <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                    <p className="text-sm italic text-primary">{path.philosophy}</p>
                  </div>

                  {/* Current Stage */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Current Stage
                    </h4>
                    {path.stages[path.currentStage] ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{path.stages[path.currentStage].name}</span>
                          <Badge variant="outline" className="text-xs">
                            Stage {path.currentStage + 1}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{path.stages[path.currentStage].description}</p>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Requirements:</h5>
                          <ul className="space-y-1">
                            {path.stages[path.currentStage].requirements.map((req, index) => (
                              <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Rewards:</h5>
                          <ul className="space-y-1">
                            {path.stages[path.currentStage].rewards.map((reward, index) => (
                              <li key={index} className="text-xs text-green-400 flex items-center gap-2">
                                <Zap className="w-3 h-3" />
                                {reward}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No stages defined</p>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stage Progress</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Paths */}
      {availablePaths.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Available Paths
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availablePaths.map((path) => (
              <Card key={path.id} className="glass-card opacity-75 hover:opacity-100 transition-opacity">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full opacity-50" style={{ backgroundColor: path.color }}></div>
                      {path.name}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onActivatePath(path.id)}
                      disabled={!canActivateMore}
                      className="text-green-400 border-green-400/30 hover:bg-green-400/10 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Badge variant="outline" style={{ borderColor: path.color, color: path.color }}>
                    {path.archetype}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{path.description}</p>

                  <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                    <p className="text-sm italic text-primary">{path.philosophy}</p>
                  </div>

                  {/* First Stage Preview */}
                  {path.stages[0] && (
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        First Stage: {path.stages[0].name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{path.stages[0].description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Soul Map Preview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Soul Map Evolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full border border-primary/50"></div>
              <div className="absolute inset-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              {activePaths.map((path, index) => (
                <div
                  key={path.id}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: path.color,
                    top: `${20 + index * 20}%`,
                    right: `${10 + index * 15}%`,
                  }}
                ></div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Your soul map evolves as you progress through your chosen paths. Each path adds unique elements to your
              spiritual architecture.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
