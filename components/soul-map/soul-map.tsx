"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Star, Eye } from "lucide-react"
import type { Attribute, SoulTrait, UserProfile } from "@/types/limitless"

interface SoulMapProps {
  attributes: Attribute[]
  soulTraits: SoulTrait[]
  userProfile: UserProfile
}

const rankColors = {
  E: "text-gray-400",
  D: "text-green-400",
  C: "text-blue-400",
  B: "text-purple-400",
  A: "text-yellow-400",
  S: "text-orange-400",
  SS: "text-red-400",
  SSS: "text-pink-400",
}

export function SoulMap({ attributes, soulTraits, userProfile }: SoulMapProps) {
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
        <p className="text-purple-300">Your spiritual blueprint - the architecture of your becoming</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attribute Wheel */}
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Attribute Constellation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-96 flex items-center justify-center">
              <svg width="400" height="400" className="absolute inset-0">
                {/* Background circles */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke="rgba(139, 92, 246, 0.1)"
                  strokeWidth="1"
                />
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius * 0.7}
                  fill="none"
                  stroke="rgba(139, 92, 246, 0.05)"
                  strokeWidth="1"
                />
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius * 0.4}
                  fill="none"
                  stroke="rgba(139, 92, 246, 0.05)"
                  strokeWidth="1"
                />

                {/* Attribute segments */}
                {attributes.map((attr, index) => {
                  const angle = (index * 60 - 90) * (Math.PI / 180)
                  const valueRadius = (attr.value / attr.maxValue) * radius
                  const x = centerX + Math.cos(angle) * valueRadius
                  const y = centerY + Math.sin(angle) * valueRadius
                  const labelX = centerX + Math.cos(angle) * (radius + 30)
                  const labelY = centerY + Math.sin(angle) * (radius + 30)

                  return (
                    <g key={attr.name}>
                      {/* Attribute line */}
                      <line x1={centerX} y1={centerY} x2={x} y2={y} stroke={attr.color} strokeWidth="3" opacity="0.8" />
                      {/* Attribute point */}
                      <circle cx={x} cy={y} r="6" fill={attr.color} className="animate-pulse" />
                      {/* Attribute label */}
                      <text x={labelX} y={labelY} textAnchor="middle" className="text-xs fill-purple-300 font-medium">
                        {attr.name}
                      </text>
                    </g>
                  )
                })}

                {/* Center point */}
                <circle cx={centerX} cy={centerY} r="8" fill="url(#centerGradient)" className="animate-pulse" />

                {/* Gradient definition */}
                <defs>
                  <radialGradient id="centerGradient">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Attribute Details */}
        <div className="space-y-4">
          {attributes.map((attr) => (
            <Card key={attr.name} className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: attr.color }} />
                    <h3 className="font-semibold text-white">{attr.name}</h3>
                    <Badge variant="outline" className={`${rankColors[attr.rank]} border-current text-xs`}>
                      {attr.rank}
                    </Badge>
                  </div>
                  <span className="text-sm text-purple-300">
                    {attr.value}/{attr.maxValue}
                  </span>
                </div>

                <Progress value={(attr.value / attr.maxValue) * 100} className="h-2 mb-2" />

                <p className="text-xs text-purple-400 mb-2">{attr.description}</p>

                {attr.perks.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {attr.perks.map((perk, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-purple-900/30 text-purple-300">
                        {perk}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Soul Traits */}
      <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Soul Traits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {soulTraits.map((trait) => (
              <div
                key={trait.id}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  trait.unlocked
                    ? "bg-gradient-to-br from-purple-900/20 to-black/20 border-purple-500/30 shadow-lg shadow-purple-500/10"
                    : "bg-black/20 border-gray-700/30 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${trait.unlocked ? "animate-pulse" : ""}`}
                    style={{ backgroundColor: trait.unlocked ? trait.color : "#6b7280" }}
                  />
                  <h3 className={`font-semibold ${trait.unlocked ? "text-white" : "text-gray-400"}`}>{trait.name}</h3>
                  {trait.unlocked && (
                    <Badge variant="outline" className="text-xs text-purple-400 border-purple-400">
                      Lv.{trait.level}
                    </Badge>
                  )}
                </div>

                <p className={`text-xs mb-3 ${trait.unlocked ? "text-purple-300" : "text-gray-500"}`}>
                  {trait.description}
                </p>

                {trait.unlocked && trait.effects.length > 0 && (
                  <div className="space-y-1">
                    {trait.effects.map((effect, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-green-400">
                        <Zap className="w-3 h-3" />
                        {effect}
                      </div>
                    ))}
                  </div>
                )}

                {!trait.unlocked && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 mb-1">Requirements:</p>
                    {trait.prerequisites.map((req, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        • {req.replace("_", " ").replace(/\d+/, (match) => `${match}+`)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
