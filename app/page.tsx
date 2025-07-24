"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Dashboard } from "@/components/dashboard/dashboard"
import { ChapterBlack } from "@/components/chapter-black/chapter-black"
import { Paths } from "@/components/paths/paths"
import { TheOrder } from "@/components/the-order/the-order"
import { useLimitlessData } from "@/hooks/use-limitless-data"

export default function LimitlessApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { userProfile } = useLimitlessData()

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "chapter-black":
        return <ChapterBlack />
      case "paths":
        return <Paths />
      case "the-order":
        return <TheOrder />
      case "inner-core":
        return (
          <div className="text-center py-12 text-gray-400">
            <h2 className="text-2xl font-bold mb-4">Inner Core</h2>
            <p>Your evolution database - coming soon...</p>
          </div>
        )
      case "hunter-exam":
        return (
          <div className="text-center py-12 text-gray-400">
            <h2 className="text-2xl font-bold mb-4">Hunter Exam</h2>
            <p>Rank ascension trials - coming soon...</p>
          </div>
        )
      case "advanced-stats":
        return (
          <div className="text-center py-12 text-gray-400">
            <h2 className="text-2xl font-bold mb-4">Advanced Stats</h2>
            <p>Deep performance analytics - coming soon...</p>
          </div>
        )
      case "chronicles":
        return (
          <div className="text-center py-12 text-gray-400">
            <h2 className="text-2xl font-bold mb-4">Chronicles</h2>
            <p>Your journey journal - coming soon...</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} userProfile={userProfile} />
      <main className="ml-80 p-6">{renderContent()}</main>
    </div>
  )
}
