"use client"

import type { SoulTrait } from "@/types/limitless"

interface SoulMapProps {
  traits: SoulTrait[]
  size?: number
}

export function SoulMap({ traits, size = 280 }: SoulMapProps) {
  const center = size / 2
  const radius = size / 2 - 40

  // Position traits in a web pattern
  const traitPositions = [
    { x: center, y: center - radius * 0.8 }, // Top
    { x: center + radius * 0.6, y: center - radius * 0.3 }, // Top Right
    { x: center + radius * 0.6, y: center + radius * 0.3 }, // Bottom Right
    { x: center, y: center + radius * 0.8 }, // Bottom
    { x: center - radius * 0.6, y: center + radius * 0.3 }, // Bottom Left
    { x: center - radius * 0.6, y: center - radius * 0.3 }, // Top Left
  ]

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="drop-shadow-2xl">
        <defs>
          <filter id="soulGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="soulCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.6)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
          </radialGradient>
        </defs>

        {/* Web connections */}
        {traits.map((trait, index) => {
          const pos = traitPositions[index] || { x: center, y: center }
          return (
            <line
              key={`connection-${index}`}
              x1={center}
              y1={center}
              x2={pos.x}
              y2={pos.y}
              stroke={trait.unlocked ? trait.color : "rgba(107, 114, 128, 0.3)"}
              strokeWidth={trait.unlocked ? "3" : "1"}
              filter={trait.unlocked ? "url(#soulGlow)" : undefined}
              opacity={trait.unlocked ? 0.8 : 0.3}
            />
          )
        })}

        {/* Trait connections */}
        {traits.map((trait, index) => {
          if (!trait.unlocked) return null

          return trait.prerequisites.map((prereqId) => {
            const prereqIndex = traits.findIndex((t) => t.id === prereqId)
            if (prereqIndex === -1) return null

            const startPos = traitPositions[index] || { x: center, y: center }
            const endPos = traitPositions[prereqIndex] || { x: center, y: center }

            return (
              <line
                key={`trait-connection-${index}-${prereqIndex}`}
                x1={startPos.x}
                y1={startPos.y}
                x2={endPos.x}
                y2={endPos.y}
                stroke={trait.color}
                strokeWidth="2"
                opacity="0.6"
                filter="url(#soulGlow)"
              />
            )
          })
        })}

        {/* Center soul core */}
        <circle
          cx={center}
          cy={center}
          r="20"
          fill="url(#soulCenter)"
          stroke="rgba(139, 92, 246, 0.8)"
          strokeWidth="3"
          filter="url(#soulGlow)"
          className="soul-node"
        />

        {/* Trait nodes */}
        {traits.map((trait, index) => {
          const pos = traitPositions[index] || { x: center, y: center }
          return (
            <g key={trait.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={trait.unlocked ? "15" : "10"}
                fill={trait.unlocked ? trait.color : "rgba(107, 114, 128, 0.5)"}
                stroke={trait.unlocked ? "white" : "rgba(107, 114, 128, 0.8)"}
                strokeWidth="2"
                filter={trait.unlocked ? "url(#soulGlow)" : undefined}
                className="soul-node cursor-pointer"
                opacity={trait.unlocked ? 1 : 0.4}
              />
              <text
                x={pos.x}
                y={pos.y + 25}
                textAnchor="middle"
                className={`text-xs font-medium ${trait.unlocked ? "fill-white" : "fill-gray-500"}`}
                filter={trait.unlocked ? "url(#soulGlow)" : undefined}
              >
                {trait.name}
              </text>
              {trait.unlocked && trait.level > 0 && (
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white"
                  filter="url(#soulGlow)"
                >
                  {trait.level}
                </text>
              )}
            </g>
          )
        })}

        {/* Center text */}
        <text
          x={center}
          y={center + 5}
          textAnchor="middle"
          className="text-xs font-bold fill-white"
          filter="url(#soulGlow)"
        >
          SOUL
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400 mb-2">Soul Traits</div>
        <div className="text-xs text-gray-500">Complete paths and maintain consistency to unlock traits</div>
      </div>
    </div>
  )
}
