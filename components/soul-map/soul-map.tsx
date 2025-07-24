"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Star, Zap, Lock, Unlock, Eye, Crown } from "lucide-react"
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
  A: "text-red-400",
  S: "text-yellow-400",
  SS: "text-orange-400",
  SSS: "text-pink-400",
}

export function SoulMap({ attributes, soulTraits, userProfile }: SoulMapProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null)
  const [selectedTrait, setSelectedTrait] = useState<SoulTrait | null>(null)

  // Prepare radar chart data
  const radarData = attributes.map((attr) => ({
    attribute: attr.name,
    value: attr.value,
    fullMark: 100,
  }))

  const unlockedTraits = soulTraits.filter((trait) => trait.unlocked)
  const lockedTraits = soulTraits.filter((trait) => !trait.unlocked)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Soul Map
        </h1>
        <p className="text-purple-300">Your inner constellation of power and potential</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar Chart */}
            <div className="lg:col-span-2">
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-400">Attribute Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#8b5cf6" strokeOpacity={0.3} />
                        <PolarAngleAxis dataKey="attribute" tick={{ fill: "#a855f7", fontSize: 12 }} />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={{ fill: "#a855f7", fontSize: 10 }}
                          tickCount={6}
                        />
                        <Radar
                          name="Attributes"
                          dataKey="value"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attribute Detail */}
            <div>
              {selectedAttribute ? (
                <Card className="bg-gradient-to-br from-black/60 to-purple-900/20 backdrop-blur-xl border-purple-500/20 sticky top-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle style={{ color: selectedAttribute.color }}>{selectedAttribute.name}</CardTitle>
                      <Badge variant="outline" className={`${rankColors[selectedAttribute.rank]} border-current`}>
                        Rank {selectedAttribute.rank}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-purple-100 text-sm">{selectedAttribute.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-400">Progress</span>
                        <span className="text-purple-300">
                          {selectedAttribute.value} / {selectedAttribute.maxValue}
                        </span>
                      </div>
                      <Progress
                        value={(selectedAttribute.value / selectedAttribute.maxValue) * 100}
                        className="h-2"
                        style={{
                          background: `${selectedAttribute.color}20`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-purple-400">{selectedAttribute.xpGained}</div>
                        <div className="text-xs text-purple-300">XP Gained</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-400">
                          {(selectedAttribute.decayRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-purple-300">Decay Rate</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">Unlocked Perks:</h4>
                      <div className="space-y-1">
                        {selectedAttribute.perks.map((perk, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-purple-300">
                            <Star className="w-3 h-3 text-yellow-400" />
                            {perk}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 sticky top-6">
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center space-y-2">
                      <Eye className="w-12 h-12 text-purple-400 mx-auto opacity-50" />
                      <p className="text-purple-400">Select an attribute to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Attribute Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attributes.map((attribute) => (
              <Card
                key={attribute.name}
                className={`bg-black/40 backdrop-blur-xl border-purple-500/20 cursor-pointer transition-all duration-300 hover:border-purple-400/40 ${
                  selectedAttribute?.name === attribute.name ? "ring-2 ring-purple-400/50" : ""
                }`}
                onClick={() => setSelectedAttribute(attribute)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold" style={{ color: attribute.color }}>
                      {attribute.name}
                    </h3>
                    <Badge variant="outline" className={`${rankColors[attribute.rank]} border-current text-xs`}>
                      {attribute.rank}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-400">Level</span>
                      <span className="text-purple-300">{attribute.value}/100</span>
                    </div>
                    <Progress
                      value={attribute.value}
                      className="h-2"
                      style={{
                        background: `${attribute.color}20`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-purple-400">+{attribute.xpGained} XP</span>
                    <span className="text-red-400">-{(attribute.decayRate * 100).toFixed(1)}% decay</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traits" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Soul Constellation Visualization */}
            <div className="lg:col-span-2">
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-400">Soul Constellation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-96 bg-gradient-radial from-purple-900/20 to-transparent rounded-lg overflow-hidden">
                    <svg viewBox="-150 -150 300 300" className="w-full h-full">
                      {/* Connection lines between traits */}
                      {soulTraits.map((trait) =>
                        trait.prerequisites
                          .filter((prereq) => soulTraits.find((t) => t.id === prereq))
                          .map((prereqId) => {
                            const prereqTrait = soulTraits.find((t) => t.id === prereqId)
                            if (!prereqTrait) return null
                            return (
                              <line
                                key={`${trait.id}-${prereqId}`}
                                x1={prereqTrait.position.x}
                                y1={prereqTrait.position.y}
                                x2={trait.position.x}
                                y2={trait.position.y}
                                stroke={trait.unlocked ? trait.color : "#374151"}
                                strokeWidth="1"
                                strokeOpacity={trait.unlocked ? 0.6 : 0.3}
                              />
                            )
                          }),
                      )}

                      {/* Trait nodes */}
                      {soulTraits.map((trait) => (
                        <g key={trait.id}>
                          <circle
                            cx={trait.position.x}
                            cy={trait.position.y}
                            r={trait.unlocked ? 12 : 8}
                            fill={trait.unlocked ? trait.color : "#374151"}
                            stroke={trait.unlocked ? "#ffffff" : "#6b7280"}
                            strokeWidth="2"
                            className="cursor-pointer transition-all duration-300 hover:r-14"
                            onClick={() => setSelectedTrait(trait)}
                          />
                          {trait.unlocked && (
                            <text
                              x={trait.position.x}
                              y={trait.position.y + 20}
                              textAnchor="middle"
                              fill={trait.color}
                              fontSize="8"
                              className="font-semibold"
                            >
                              {trait.name.split(" ")[1]}
                            </text>
                          )}
                        </g>
                      ))}
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trait Detail */}
            <div>
              {selectedTrait ? (
                <Card
                  className={`bg-gradient-to-br from-black/60 to-purple-900/20 backdrop-blur-xl border-purple-500/20 sticky top-6 ${
                    selectedTrait.unlocked ? "ring-1 ring-purple-400/30" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle style={{ color: selectedTrait.color }}>{selectedTrait.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {selectedTrait.unlocked ? (
                          <Unlock className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-red-400" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          Level {selectedTrait.level}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-purple-100 text-sm">{selectedTrait.description}</p>

                    {selectedTrait.unlocked && (
                      <div>
                        <h4 className="text-sm font-semibold text-purple-400 mb-2">Active Effects:</h4>
                        <div className="space-y-1">
                          {selectedTrait.effects.map((effect, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-green-300">
                              <Zap className="w-3 h-3 text-yellow-400" />
                              {effect}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!selectedTrait.unlocked && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-400 mb-2">Prerequisites:</h4>
                        <div className="space-y-1">
                          {selectedTrait.prerequisites.map((prereq, index) => (
                            <div key={index} className="text-xs text-gray-400">
                              • {prereq.replace("_", " ").replace(/\d+/, (match) => `${match}+`)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 sticky top-6">
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center space-y-2">
                      <Crown className="w-12 h-12 text-purple-400 mx-auto opacity-50" />
                      <p className="text-purple-400">Select a soul trait to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Trait Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unlocked Traits */}
            <Card className="bg-black/40 backdrop-blur-xl border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Unlock className="w-5 h-5" />
                  Awakened Traits ({unlockedTraits.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {unlockedTraits.map((trait) => (
                  <div
                    key={trait.id}
                    className="p-3 bg-green-900/10 border border-green-500/20 rounded-lg cursor-pointer hover:border-green-400/40 transition-colors"
                    onClick={() => setSelectedTrait(trait)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-300">{trait.name}</h4>
                      <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                        Lv.{trait.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-green-200 opacity-80">{trait.description}</p>
                  </div>
                ))}
                {unlockedTraits.length === 0 && (
                  <p className="text-center text-gray-400 py-8">No traits awakened yet</p>
                )}
              </CardContent>
            </Card>

            {/* Locked Traits */}
            <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Dormant Traits ({lockedTraits.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lockedTraits.map((trait) => (
                  <div
                    key={trait.id}
                    className="p-3 bg-red-900/10 border border-red-500/20 rounded-lg cursor-pointer hover:border-red-400/40 transition-colors opacity-60"
                    onClick={() => setSelectedTrait(trait)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-red-300">{trait.name}</h4>
                      <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
                        Locked
                      </Badge>
                    </div>
                    <p className="text-xs text-red-200 opacity-60">{trait.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </Tabs\
