"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { SoulMap } from "@/components/soul-map/soul-map"
import { Paths } from "@/components/paths/paths"
import { ChapterBlack } from "@/components/chapter-black/chapter-black"
import { Archives } from "@/components/archives/archives"
import { TheOrder } from "@/components/the-order/the-order"
import { Labyrinth } from "@/components/labyrinth/labyrinth"
import { AdvancedStats } from "@/components/advanced-stats/advanced-stats"
import { useLimitlessData } from "@/hooks/use-limitless-data"

export default function LimitlessApp() {
  const [activeTab, setActiveTab] = useState("soul-map")
  const {
    userProfile,
    attributes,
    soulTraits,
    paths,
    dailyTasks,
    storyChapters,
    journalEntries,
    hunterExams,
    chronicles,
    codexEntries,
    aiMessages,
    completeTask,
    addJournalEntry,
    addChronicle,
    addAIMessage,
    activePaths,
    decayMetrics,
  } = useLimitlessData()

  const renderActiveTab = () => {
    switch (activeTab) {
      case "soul-map":
        return <SoulMap attributes={attributes} soulTraits={soulTraits} userProfile={userProfile} />
      case "paths":
        return <Paths paths={paths} dailyTasks={dailyTasks} completeTask={completeTask} />
      case "chapter-black":
        return <ChapterBlack storyChapters={storyChapters} userProfile={userProfile} />
      case "archives":
        return (
          <Archives
            journalEntries={journalEntries}
            chronicles={chronicles}
            addJournalEntry={addJournalEntry}
            addChronicle={addChronicle}
          />
        )
      case "the-order":
        return <TheOrder messages={aiMessages} addMessage={addAIMessage} userProfile={userProfile} />
      case "labyrinth":
        return <Labyrinth codexEntries={codexEntries} />
      case "advanced-stats":
        return (
          <AdvancedStats
            userProfile={userProfile}
            attributes={attributes}
            paths={paths}
            dailyTasks={dailyTasks}
            hunterExams={hunterExams}
            decayMetrics={decayMetrics}
          />
        )
      default:
        return <SoulMap attributes={attributes} soulTraits={soulTraits} userProfile={userProfile} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/3 to-transparent rounded-full animate-spin-slow" />
      </div>

      <div className="relative z-10 flex h-screen">
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userProfile={userProfile}
          activePaths={activePaths}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{renderActiveTab()}</div>
        </main>
      </div>
    </div>
  )
}
