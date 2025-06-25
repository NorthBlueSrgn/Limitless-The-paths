"use client"

import type { Attribute } from "../types"

interface RadarChartProps {
  attributes: { [key: string]: Attribute }
  size?: number
}

export function RadarChart({ attributes, size = 200 }: RadarChartProps) {
  const attributeArray = Object.values(attributes)
  const center = size / 2
  const radius = size / 2 - 20
  const angleStep = (2 * Math.PI) / attributeArray.length

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2
    const normalizedValue = Math.min(value / 500, 1) // Normalize to 0-1 based on max expected value
    const x = center + Math.cos(angle) * radius * normalizedValue
    const y = center + Math.sin(angle) * radius * normalizedValue
    return { x, y }
  }

  const getLabelPoint = (index: number) => {
    const angle = index * angleStep - Math.PI / 2
    const x = center + Math.cos(angle) * (radius + 15)
    const y = center + Math.sin(angle) * (radius + 15)
    return { x, y }
  }

  const pathData = attributeArray.map((attr, index) => getPoint(attr.value, index))
  const pathString = pathData.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z"

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} className="drop-shadow-lg">
        {/* Background circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="rgba(147, 51, 234, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {attributeArray.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2
          const endX = center + Math.cos(angle) * radius
          const endY = center + Math.sin(angle) * radius
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="rgba(147, 51, 234, 0.2)"
              strokeWidth="1"
            />
          )
        })}

        {/* Data area */}
        <path d={pathString} fill="rgba(147, 51, 234, 0.3)" stroke="rgb(147, 51, 234)" strokeWidth="2" />

        {/* Data points */}
        {pathData.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="4" fill="rgb(147, 51, 234)" stroke="white" strokeWidth="2" />
        ))}

        {/* Labels */}
        {attributeArray.map((attr, index) => {
          const labelPoint = getLabelPoint(index)
          return (
            <g key={index}>
              <text
                x={labelPoint.x}
                y={labelPoint.y - 5}
                textAnchor="middle"
                className="text-xs font-medium fill-purple-300"
              >
                {attr.icon}
              </text>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 8}
                textAnchor="middle"
                className="text-xs font-medium fill-purple-300"
              >
                {attr.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
