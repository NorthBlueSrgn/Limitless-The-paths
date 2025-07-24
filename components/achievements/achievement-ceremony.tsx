"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Sparkles, Crown, Zap, X, ChevronRight } from "lucide-react"
import type { Achievement } from "@/lib/achievements/achievement-engine"

interface AchievementCeremonyProps {
  achievement: Achievement | null
  isOpen: boolean
  onClose: () => void
  onClaim: (achievementId: string) => void
}

const rarityConfig = {
  common: {
    color: "from-gray-400 to-gray-600",
    textColor: "text-gray-300",
    borderColor: "border-gray-500",
    bgColor: "bg-gray-900/80",
    particles: 10,
    icon: Trophy,
  },
  uncommon: {
    color: "from-green-400 to-green-600",
    textColor: "text-green-300",
    borderColor: "border-green-500",
    bgColor: "bg-green-900/80",
    particles: 15,
    icon: Star,
  },
  rare: {
    color: "from-blue-400 to-blue-600",
    textColor: "text-blue-300",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-900/80",
    particles: 20,
    icon: Sparkles,
  },
  epic: {
    color: "from-purple-400 to-purple-600",
    textColor: "text-purple-300",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-900/80",
    particles: 25,
    icon: Crown,
  },
  legendary: {
    color: "from-orange-400 to-orange-600",
    textColor: "text-orange-300",
    borderColor: "border-orange-500",
    bgColor: "bg-orange-900/80",
    particles: 30,
    icon: Zap,
  },
  mythic: {
    color: "from-pink-400 via-purple-500 to-indigo-600",
    textColor: "text-pink-300",
    borderColor: "border-pink-500",
    bgColor: "bg-gradient-to-br from-pink-900/80 to-indigo-900/80",
    particles: 50,
    icon: Sparkles,
  },
}

export function AchievementCeremony({ achievement, isOpen, onClose, onClaim }: AchievementCeremonyProps) {
  const [showParticles, setShowParticles] = useState(false)
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    if (isOpen && achievement) {
      setShowParticles(true)
      setClaimed(false)

      // Auto-hide particles after animation
      const timer = setTimeout(() => setShowParticles(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, achievement])

  if (!achievement) return null

  const config = rarityConfig[achievement.rarity]
  const IconComponent = config.icon

  const handleClaim = () => {
    setClaimed(true)
    onClaim(achievement.id)

    // Close after a brief delay
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  const particles = Array.from({ length: config.particles }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-white rounded-full"
      initial={{
        x: "50%",
        y: "50%",
        scale: 0,
        opacity: 0,
      }}
      animate={
        showParticles
          ? {
              x: `${50 + (Math.random() - 0.5) * 200}%`,
              y: `${50 + (Math.random() - 0.5) * 200}%`,
              scale: Math.random() * 2 + 0.5,
              opacity: [0, 1, 0],
            }
          : {}
      }
      transition={{
        duration: 2 + Math.random() * 2,
        ease: "easeOut",
        delay: Math.random() * 0.5,
      }}
    />
  ))

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">{particles}</div>

            <Card className={`${config.bgColor} ${config.borderColor} border-2 backdrop-blur-xl`}>
              <CardContent className="p-8 text-center space-y-6">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Achievement Unlocked Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <h2 className="text-2xl font-orbitron font-bold text-white">Achievement Unlocked!</h2>
                  <Badge
                    variant="outline"
                    className={`${config.textColor} ${config.borderColor} text-sm font-semibold uppercase tracking-wider`}
                  >
                    {achievement.rarity}
                  </Badge>
                </motion.div>

                {/* Achievement Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                    delay: 0.3,
                  }}
                  className="relative"
                >
                  <div
                    className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-2xl`}
                  >
                    <div className="text-4xl">{achievement.icon}</div>
                  </div>

                  {/* Glow effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className={`absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${config.color} blur-xl -z-10`}
                  />
                </motion.div>

                {/* Achievement Details */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{achievement.description}</p>
                </motion.div>

                {/* Rewards */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <h4 className="text-lg font-semibold text-white">Rewards</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30">
                      +{achievement.rewards.xp} XP
                    </Badge>
                    {achievement.rewards.title && (
                      <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                        Title: {achievement.rewards.title}
                      </Badge>
                    )}
                    {achievement.rewards.unlocks && achievement.rewards.unlocks.length > 0 && (
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                        +{achievement.rewards.unlocks.length} Unlocks
                      </Badge>
                    )}
                  </div>
                </motion.div>

                {/* Claim Button */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                  <Button
                    onClick={handleClaim}
                    disabled={claimed}
                    className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200`}
                  >
                    {claimed ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Claimed!
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Claim Reward
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </motion.div>

                {/* The Order's Message */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="pt-4 border-t border-white/10"
                >
                  <p className="text-xs text-gray-400 italic">
                    "Your dedication has been noted. The Order acknowledges your progress."
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
