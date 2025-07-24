"use client"

import { useState } from "react"
import { MainLayout } from "./components/layout/main-layout"
import { Navigation } from "./components/layout/navigation"
import { Overview } from "./components/dashboard/overview"
import { StoryChapter } from "./components/story/story-chapter"
import { Chronicles } from "./components/chronicles/chronicles"
import { HunterExams } from "./components/hunter-exams/hunter-exams"

export default function LimitlessApp() {
  const [activeTab, setActiveTab] = useState("overview")

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />
      case "paths":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Paths</h2>
            <p className="text-gray-400">Path management coming soon...</p>
          </div>
        )
      case "story":
        return <StoryChapter />
      case "hunter-exams":
        return <HunterExams />
      case "chronicles":
        return <Chronicles />
      default:
        return <Overview />
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/3 to-transparent rounded-full" />
      </div>

      <MainLayout>
        <div className="flex">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 ml-64">{renderContent()}</main>
        </div>
      </MainLayout>
    </div>
  )
}
