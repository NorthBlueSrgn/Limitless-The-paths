"use client"

interface AttributeRadarProps {
  attributes: {
    spiritual: number
    intelligence: number
    creative: number
    health: number
    physical: number
    social: number
  }
  size?: number
}

export function AttributeRadar({ attributes, size = 300 }: AttributeRadarProps) {
  const center = size / 2
  const radius = size / 2 - 40
  const attributeArray = Object.entries(attributes)
  const angleStep = (2 * Math.PI) / attributeArray.length

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2
    const normalizedValue = Math.min(value / 100, 1)
    const x = center + Math.cos(angle) * radius * normalizedValue
    const y = center + Math.sin(angle) * radius * normalizedValue
    return { x, y }
  }

  const getLabelPoint = (index: number) => {
    const angle = index * angleStep - Math.PI / 2
    const x = center + Math.cos(angle) * (radius + 25)
    const y = center + Math.sin(angle) * (radius + 25)
    return { x, y }
  }

  const pathData = attributeArray.map(([_, value], index) => getPoint(value, index))
  const pathString = pathData.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z"

  const attributeLabels = {
    spiritual: "Spiritual",
    intelligence: "Intelligence",
    creative: "Creative",
    health: "Health",
    physical: "Physical",
    social: "Social",
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="drop-shadow-2xl">
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.05)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={center} cy={center} r={radius} fill="url(#radarGlow)" />

        {/* Background circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="1"
            filter="url(#glow)"
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
              stroke="rgba(139, 92, 246, 0.4)"
              strokeWidth="2"
              filter="url(#glow)"
            />
          )
        })}

        {/* Data area */}
        <path
          d={pathString}
          fill="rgba(139, 92, 246, 0.4)"
          stroke="rgb(139, 92, 246)"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* Data points */}
        {pathData.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="rgb(139, 92, 246)"
            stroke="white"
            strokeWidth="3"
            filter="url(#glow)"
          />
        ))}

        {/* Labels */}
        {attributeArray.map(([key], index) => {
          const labelPoint = getLabelPoint(index)
          return (
            <text
              key={index}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              className="text-sm font-medium fill-purple-300"
              filter="url(#glow)"
            >
              {attributeLabels[key as keyof typeof attributeLabels]}
            </text>
          )
        })}

        {/* Center rank display */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          className="font-orbitron text-2xl font-bold fill-purple-400"
          filter="url(#glow)"
        >
          RANK E
        </text>
        <text x={center} y={center + 15} textAnchor="middle" className="text-sm fill-gray-400">
          Hunter Classification
        </text>
      </svg>
    </div>
  )
}
