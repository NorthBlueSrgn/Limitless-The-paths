"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Dashboard } from "@/components/dashboard/dashboard"
import { Paths } from "@/components/paths/paths"
import { StoryChapter } from "@/components/story/story-chapter"
import { InnerCore } from "@/components/inner-core/inner-core"
import { HunterExams } from "@/components/hunter-exams/hunter-exams"
import { AdvancedStats } from "@/components/advanced-stats/advanced-stats"

export default function LimitlessApp() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "paths":
        return <Paths />
      case "story":
        return <StoryChapter />
      case "inner-core":
        return <InnerCore />
      case "hunter-exam":
        return <HunterExams />
      case "advanced-stats":
        return <AdvancedStats />
      case "settings":
        return (
          <div className="text-center py-12 text-gray-400">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p>Configuration options coming soon...</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Pass navigation handler to layout if needed */}
        <div style={{ display: "none" }}>
          <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button onClick={() => setActiveTab("paths")}>Paths</button>
          <button onClick={() => setActiveTab("story")}>Story</button>
          <button onClick={() => setActiveTab("inner-core")}>Inner Core</button>
          <button onClick={() => setActiveTab("hunter-exam")}>Hunter Exam</button>
          <button onClick={() => setActiveTab("advanced-stats")}>Advanced Stats</button>
          <button onClick={() => setActiveTab("settings")}>Settings</button>
        </div>
        {renderContent()}
      </div>
    </MainLayout>
  )
}
