"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Sparkles, Crown, Zap, Award, Flame } from "lucide-react"
import type { Achievement } from "@/lib/achievements/achievement-engine"

interface AchievementCeremonyProps {
  achievement: Achievement
  isVisible: boolean
  onComplete: () => void
}

const rarityConfig = {
  common: {
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
    borderColor: "border-gray-500/30",
    icon: Award,
    particles: 20,
  },
  rare: {
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
    icon: Star,
    particles: 40,
  },
  epic: {
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
    icon: Sparkles,
    particles: 60,
  },
  legendary: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    icon: Crown,
    particles: 100,
  },
  mythic: {
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
    icon: Flame,
    particles: 150,
  },
}

export function AchievementCeremony({ achievement, isVisible, onComplete }: AchievementCeremonyProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showInteractive, setShowInteractive] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  const config = rarityConfig[achievement.rarity]
  const Icon = config.icon

  useEffect(() => {
    if (isVisible) {
      // Generate particles
      const newParticles = Array.from({ length: config.particles }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }))
      setParticles(newParticles)

      // Phase progression
      const timer = setTimeout(() => {
        setCurrentPhase(1)
        setTimeout(() => {
          setShowInteractive(true)
        }, 1000)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isVisible, config.particles])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        {/* Particle Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                opacity: 0,
                scale: 0,
                x: `${particle.x}vw`,
                y: `${particle.y}vh`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: `${particle.y - 20}vh`,
              }}
              transition={{
                duration: 3,
                delay: particle.delay,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2,
              }}
              className={`absolute w-1 h-1 ${config.bgColor} rounded-full`}
            />
          ))}
        </div>

        {/* Main Achievement Card */}
        <motion.div
          initial={{ scale: 0, rotateY: -180 }}
          animate={{
            scale: currentPhase >= 1 ? 1 : 0,
            rotateY: currentPhase >= 1 ? 0 : -180,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 1,
          }}
          className="relative"
        >
          <Card className={`w-96 ${config.bgColor} ${config.borderColor} border-2 backdrop-blur-xl`}>
            <CardContent className="p-8 text-center">
              {/* Achievement Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: currentPhase >= 1 ? 1 : 0,
                  rotate: currentPhase >= 1 ? 0 : -180,
                }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={`mx-auto mb-6 p-4 rounded-full ${config.bgColor} ${config.borderColor} border`}
              >
                <Icon className={`w-12 h-12 ${config.color}`} />
              </motion.div>

              {/* Rarity Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: currentPhase >= 1 ? 1 : 0, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-4"
              >
                <Badge
                  variant="outline"
                  className={`${config.color} ${config.borderColor} text-sm font-bold uppercase tracking-wider`}
                >
                  {achievement.rarity}
                </Badge>
              </motion.div>

              {/* Achievement Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: currentPhase >= 1 ? 1 : 0, y: 0 }}
                transition={{ delay: 1.0 }}
                className={`text-2xl font-bold mb-4 ${config.color}`}
              >
                {achievement.title}
              </motion.h2>

              {/* Achievement Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: currentPhase >= 1 ? 1 : 0 }}
                transition={{ delay: 1.2 }}
                className="text-gray-300 mb-6 leading-relaxed"
              >
                {achievement.description}
              </motion.p>

              {/* Ceremony Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: currentPhase >= 1 ? 1 : 0, scale: 1 }}
                transition={{ delay: 1.4 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{achievement.ceremonyContent.title}</h3>
                <p className="text-purple-300 text-sm leading-relaxed">{achievement.ceremonyContent.description}</p>
              </motion.div>

              {/* Rewards Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: currentPhase >= 1 ? 1 : 0, y: 0 }}
                transition={{ delay: 1.6 }}
                className="mb-6 space-y-2"
              >
                {achievement.xpReward > 0 && (
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold">+{achievement.xpReward.toLocaleString()} XP</span>
                  </div>
                )}

                {Object.entries(achievement.statRewards).length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {Object.entries(achievement.statRewards).map(([stat, value]) => (
                      <Badge key={stat} variant="outline" className="text-green-400 border-green-500/30">
                        +{value} {stat}
                      </Badge>
                    ))}
                  </div>
                )}

                {achievement.titleUnlocked && (
                  <div className="flex items-center justify-center gap-2 text-purple-400 mt-2">
                    <Crown className="w-4 h-4" />
                    <span className="font-semibold">Title: {achievement.titleUnlocked}</span>
                  </div>
                )}
              </motion.div>

              {/* Interactive Elements */}
              <AnimatePresence>
                {showInteractive && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {achievement.ceremonyContent.interactiveElements?.map((element, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-lg ${config.bgColor} ${config.borderColor} border cursor-pointer transition-all hover:brightness-110`}
                      >
                        <span className="text-white text-sm">{element.trigger}</span>
                      </motion.div>
                    ))}

                    <Button
                      onClick={onComplete}
                      className={`w-full ${config.bgColor} ${config.color} border ${config.borderColor} hover:brightness-110 transition-all`}
                      variant="outline"
                    >
                      Continue Your Journey
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Glow Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: currentPhase >= 1 ? [0.3, 0.6, 0.3] : 0,
              scale: currentPhase >= 1 ? [0.8, 1.2, 0.8] : 0.8,
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className={`absolute inset-0 -z-10 ${config.bgColor} rounded-lg blur-xl`}
          />
        </motion.div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, ${config.color.replace("text-", "")} 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
