"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Map, Star, Zap, Eye, Lock } from "lucide-react"
import type { Attribute, SoulTrait, UserProfile } from "@/types/limitless"

interface SoulMapProps {
  attributes: Attribute[]
  soulTraits: SoulTrait[]
  userProfile: UserProfile
}

const rankColors = {
  E: "#6b7280",
  D: "#10b981",
  C: "#3b82f6",
  B: "#8b5cf6",
  A: "#f59e0b",
  S: "#f97316",
  SS: "#ef4444",
  SSS: "#ec4899",
}

export function SoulMap({ attributes, soulTraits, userProfile }: SoulMapProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(attributes[0] || null)
  const [selectedTrait, setSelectedTrait] = useState<SoulTrait | null>(null)

  const centerX = 200
  const centerY = 200
  const radius = 120

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Soul Map
        </h1>
        <p className="text-purple-300">Your spiritual architecture visualized</p>
      </div>

      <Tabs defaultValue="constellation" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-purple-500/20">
          <TabsTrigger value="constellation" className="data-[state=active]:bg-purple-600/30">
            Attribute Constellation
          </TabsTrigger>
          <TabsTrigger value="traits" className="data-[state=active]:bg-purple-600/30">
            Soul Traits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="constellation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Attribute Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 flex items-center justify-center">
                  <svg width="400" height="400" className="absolute">
                    {/* Grid circles */}
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
                      <circle
                        key={scale}
                        cx={centerX}
                        cy={centerY}
                        r={radius * scale}
                        fill="none"
                        stroke="rgba(139, 92, 246, 0.2)"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Attribute lines and points */}
                    {attributes.map((attr, index) => {
                      const angle = (index * 60 - 90) * (Math.PI / 180)
                      const value = attr.value / 100
                      const x = centerX + Math.cos(angle) * radius * value
                      const y = centerY + Math.sin(angle) * radius * value
                      const labelX = centerX + Math.cos(angle) * (radius + 30)
                      const labelY = centerY + Math.sin(angle) * (radius + 30)

                      return (
                        <g key={attr.name}>
                          {/* Grid line */}
                          <line
                            x1={centerX}
                            y1={centerY}
                            x2={centerX + Math.cos(angle) * radius}
                            y2={centerY + Math.sin(angle) * radius}
                            stroke="rgba(139, 92, 246, 0.3)"
                            strokeWidth="1"
                          />

                          {/* Value point */}
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            fill={attr.color}
                            className="cursor-pointer hover:r-8 transition-all"
                            onClick={() => setSelectedAttribute(attr)}
                          />

                          {/* Label */}
                          <text
                            x={labelX}
                            y={labelY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-xs fill-purple-300 font-medium"
                          >
                            {attr.name}
                          </text>
                        </g>
                      )
                    })}

                    {/* Connection lines between points */}
                    <polygon
                      points={attributes
                        .map((attr, index) => {
                          const angle = (index * 60 - 90) * (Math.PI / 180)
                          const value = attr.value / 100
                          const x = centerX + Math.cos(angle) * radius * value
                          const y = centerY + Math.sin(angle) * radius * value
                          return `${x},${y}`
                        })
                        .join(" ")}
                      fill="rgba(139, 92, 246, 0.1)"
                      stroke="rgba(139, 92, 246, 0.5)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Attribute Details */}
            <div className="space-y-4">
              {attributes.map((attr) => (
                <Card
                  key={attr.name}
                  className={`bg-black/40 backdrop-blur-xl border-purple-500/20 cursor-pointer transition-all ${
                    selectedAttribute?.name === attr.name ? "border-purple-400/60 bg-purple-900/20" : ""
                  }`}
                  onClick={() => setSelectedAttribute(attr)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: attr.color }} />
                          {attr.name}
                        </h3>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: rankColors[attr.rank],
                            color: rankColors[attr.rank],
                          }}
                        >
                          Rank {attr.rank}
                        </Badge>
                      </div>

                      <p className="text-sm text-purple-300">{attr.description}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-400">Progress</span>
                          <span className="text-white">
                            {attr.value}/{attr.maxValue}
                          </span>
                        </div>
                        <Progress
                          value={(attr.value / attr.maxValue) * 100}
                          className="h-2"
                          style={
                            {
                              "--progress-foreground": attr.color,
                            } as React.CSSProperties
                          }
                        />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {attr.perks.map((perk) => (
                          <Badge key={perk} variant="secondary" className="text-xs bg-purple-900/30 text-purple-300">
                            {perk}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-purple-400">
                        <span>XP Gained: {attr.xpGained}</span>
                        <span>Decay: {(attr.decayRate * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="traits" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Soul Trait Constellation */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Soul Trait Constellation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 flex items-center justify-center">
                  <svg width="400" height="400" className="absolute">
                    {/* Central core */}
                    <circle cx={centerX} cy={centerY} r="20" fill="url(#coreGradient)" className="animate-pulse" />

                    {/* Gradient definition */}
                    <defs>
                      <radialGradient id="coreGradient">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </radialGradient>
                    </defs>

                    {/* Soul traits */}
                    {soulTraits.map((trait) => {
                      const x = centerX + trait.position.x
                      const y = centerY + trait.position.y

                      return (
                        <g key={trait.id}>
                          {/* Connection line to center */}
                          {trait.unlocked && (
                            <line
                              x1={centerX}
                              y1={centerY}
                              x2={x}
                              y2={y}
                              stroke={trait.color}
                              strokeWidth="2"
                              opacity="0.6"
                            />
                          )}

                          {/* Trait node */}
                          <circle
                            cx={x}
                            cy={y}
                            r={trait.unlocked ? "12" : "8"}
                            fill={trait.unlocked ? trait.color : "#374151"}
                            stroke={trait.color}
                            strokeWidth="2"
                            className={`cursor-pointer transition-all ${
                              trait.unlocked ? "animate-pulse" : "opacity-50"
                            }`}
                            onClick={() => setSelectedTrait(trait)}
                          />

                          {/* Level indicator */}
                          {trait.unlocked && trait.level > 0 && (
                            <text x={x} y={y + 4} textAnchor="middle" className="text-xs fill-white font-bold">
                              {trait.level}
                            </text>
                          )}
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Trait Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {soulTraits.map((trait) => (
                  <Card
                    key={trait.id}
                    className={`bg-black/40 backdrop-blur-xl border-purple-500/20 cursor-pointer transition-all ${
                      selectedTrait?.id === trait.id ? "border-purple-400/60 bg-purple-900/20" : ""
                    } ${!trait.unlocked ? "opacity-60" : ""}`}
                    onClick={() => setSelectedTrait(trait)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            {trait.unlocked ? (
                              <Eye className="w-4 h-4 text-green-400" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                            {trait.name}
                          </h3>
                          {trait.unlocked && (
                            <Badge
                              variant="outline"
                              style={{
                                borderColor: trait.color,
                                color: trait.color,
                              }}
                            >
                              Level {trait.level}
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-purple-300">{trait.description}</p>

                        {trait.unlocked ? (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-white">Effects:</h4>
                            <ul className="space-y-1">
                              {trait.effects.map((effect, index) => (
                                <li key={index} className="text-xs text-green-400 flex items-center gap-2">
                                  <Zap className="w-3 h-3" />
                                  {effect}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-white">Prerequisites:</h4>
                            <ul className="space-y-1">
                              {trait.prerequisites.map((req, index) => (
                                <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
                                  <Lock className="w-3 h-3" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
