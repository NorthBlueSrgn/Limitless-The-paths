"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, Zap, Star, Eye, Lock, Unlock } from "lucide-react"
import type { Attribute, SoulTrait } from "@/types/limitless"

interface SoulMapProps {
  attributes: Attribute[]
  soulTraits: SoulTrait[]
}

export function SoulMap({ attributes, soulTraits }: SoulMapProps) {
  const centerX = 200
  const centerY = 200
  const radius = 120

  // Calculate positions for attributes in a hexagon
  const attributePositions = attributes.map((_, index) => {
    const angle = (index * 60 - 90) * (Math.PI / 180) // Start from top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  const getRankColor = (rank: string) => {
    const colors = {
      E: "#6b7280",
      D: "#10b981",
      C: "#3b82f6",
      B: "#8b5cf6",
      A: "#f59e0b",
      S: "#ef4444",
      SS: "#ec4899",
      SSS: "#f97316",
    }
    return colors[rank as keyof typeof colors] || "#6b7280"
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-primary" />
            <span className="font-orbitron chapter-title">Soul Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="wheel" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wheel">Attribute Wheel</TabsTrigger>
              <TabsTrigger value="traits">Soul Traits</TabsTrigger>
              <TabsTrigger value="perks">Unlocked Perks</TabsTrigger>
            </TabsList>

            <TabsContent value="wheel" className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <svg width="400" height="400" className="stat-wheel">
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.6)" />
                        <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
                      </radialGradient>
                    </defs>

                    {/* Connection lines */}
                    {attributes.map((attribute, index) => {
                      const pos = attributePositions[index]
                      return (
                        <line
                          key={`line-${index}`}
                          x1={centerX}
                          y1={centerY}
                          x2={pos.x}
                          y2={pos.y}
                          stroke={attribute.color}
                          strokeWidth="2"
                          opacity="0.6"
                          filter="url(#glow)"
                        />
                      )
                    })}

                    {/* Center core */}
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r="30"
                      fill="url(#centerGlow)"
                      stroke="rgba(139, 92, 246, 0.8)"
                      strokeWidth="3"
                      filter="url(#glow)"
                    />

                    {/* Attribute nodes */}
                    {attributes.map((attribute, index) => {
                      const pos = attributePositions[index]
                      const progress = (attribute.value / attribute.maxValue) * 100

                      return (
                        <g key={attribute.name}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="25"
                            fill={attribute.color}
                            opacity="0.8"
                            filter="url(#glow)"
                            className="soul-node cursor-pointer"
                          />
                          <text
                            x={pos.x}
                            y={pos.y + 5}
                            textAnchor="middle"
                            className="text-xs font-bold fill-white"
                            filter="url(#glow)"
                          >
                            {attribute.value}
                          </text>
                          <text
                            x={pos.x}
                            y={pos.y + 45}
                            textAnchor="middle"
                            className="text-sm font-medium fill-white"
                            filter="url(#glow)"
                          >
                            {attribute.name}
                          </text>
                        </g>
                      )
                    })}

                    {/* Center text */}
                    <text
                      x={centerX}
                      y={centerY + 5}
                      textAnchor="middle"
                      className="text-sm font-bold fill-white font-orbitron"
                      filter="url(#glow)"
                    >
                      SOUL
                    </text>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attributes.map((attribute) => (
                  <Card key={attribute.name} className="glass-card attribute-glow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">{attribute.name}</h3>
                        <Badge
                          className="rank-badge font-orbitron"
                          style={{ backgroundColor: getRankColor(attribute.rank) }}
                        >
                          {attribute.rank}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-400 mb-3">{attribute.description}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {attribute.value}/{attribute.maxValue}
                          </span>
                        </div>
                        <Progress
                          value={(attribute.value / attribute.maxValue) * 100}
                          className="h-2"
                          style={
                            {
                              "--progress-foreground": attribute.color,
                            } as React.CSSProperties
                          }
                        />
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400">+{attribute.xpGained} XP</span>
                        </div>
                        {attribute.decayRate > 0.05 && (
                          <div className="flex items-center gap-2 text-sm text-orange-400 mt-1">
                            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
                            <span>High decay rate</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="traits" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {soulTraits.map((trait) => (
                  <Card
                    key={trait.id}
                    className={`glass-card ${trait.unlocked ? "border-purple-500/50" : "border-gray-600/30"}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: trait.color }}></div>
                          <h3 className={`font-bold ${trait.unlocked ? "text-white" : "text-gray-500"}`}>
                            {trait.name}
                          </h3>
                        </div>
                        {trait.unlocked ? (
                          <div className="flex items-center gap-2">
                            <Unlock className="w-4 h-4 text-green-400" />
                            <Badge className="bg-green-500/20 text-green-400">Level {trait.level}</Badge>
                          </div>
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                      </div>

                      <p className={`text-sm mb-4 ${trait.unlocked ? "text-gray-300" : "text-gray-500"}`}>
                        {trait.description}
                      </p>

                      {trait.unlocked && (
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Active Effects</h4>
                            <ul className="space-y-1">
                              {trait.effects.map((effect, index) => (
                                <li key={index} className="text-xs text-green-400 flex items-center gap-2">
                                  <Star className="w-3 h-3" />
                                  {effect}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {!trait.unlocked && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Prerequisites</h4>
                          <ul className="space-y-1">
                            {trait.prerequisites.map((prereq, index) => (
                              <li key={index} className="text-xs text-gray-500 flex items-center gap-2">
                                <Lock className="w-3 h-3" />
                                {prereq.replace("_", " ").toUpperCase()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="perks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attributes.map((attribute) => (
                  <Card key={attribute.name} className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: attribute.color }}></div>
                        <h3 className="font-semibold text-white">{attribute.name} Perks</h3>
                      </div>

                      <ul className="space-y-2">
                        {attribute.perks.map((perk, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                            <Eye className="w-3 h-3 text-purple-400" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
