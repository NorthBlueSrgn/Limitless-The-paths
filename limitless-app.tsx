"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Dashboard } from "@/components/dashboard/dashboard"
import { SoulMap } from "@/components/soul-map/soul-map"
import { Paths } from "@/components/paths/paths"
import { ChapterBlack } from "@/components/chapter-black/chapter-black"
import { Archives } from "@/components/archives/archives"
import { TheOrder } from "@/components/the-order/the-order"
import { Labyrinth } from "@/components/labyrinth/labyrinth"
import { AdvancedStats } from "@/components/advanced-stats/advanced-stats"
import { useLimitlessData } from "@/hooks/use-limitless-data"

export default function LimitlessApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const {
    userProfile,
    attributes,
    soulTraits,
    paths,
    activePaths,
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
  } = useLimitlessData()

  // Calculate user progress for The Order
  const userProgress = {
    activePaths: activePaths.map((path) => path.name),
    completedTasks: dailyTasks.filter((task) => task.completed).length,
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            userProfile={userProfile}
            attributes={attributes}
            paths={activePaths}
            dailyTasks={dailyTasks}
            storyChapters={storyChapters}
            onCompleteTask={completeTask}
          />
        )
      case "soul-map":
        return <SoulMap attributes={attributes} soulTraits={soulTraits} userProfile={userProfile} />
      case "paths":
        return <Paths paths={paths} userProfile={userProfile} />
      case "chapter-black":
        return <ChapterBlack storyChapters={storyChapters} userProfile={userProfile} />
      case "archives":
        return (
          <Archives
            journalEntries={journalEntries}
            chronicles={chronicles}
            onAddJournalEntry={addJournalEntry}
            onAddChronicle={addChronicle}
          />
        )
      case "the-order":
        return (
          <TheOrder
            messages={aiMessages}
            addMessage={addAIMessage}
            userProfile={userProfile}
            userProgress={userProgress}
          />
        )
      case "labyrinth":
        return <Labyrinth codexEntries={codexEntries} userProfile={userProfile} />
      case "advanced-stats":
        return <AdvancedStats userProfile={userProfile} attributes={attributes} paths={paths} />
      default:
        return (
          <Dashboard
            userProfile={userProfile}
            attributes={attributes}
            paths={activePaths}
            dailyTasks={dailyTasks}
            storyChapters={storyChapters}
            onCompleteTask={completeTask}
          />
        )
    }
  }

  return (
    <MainLayout userProfile={userProfile} activePaths={activePaths} activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MainLayout>
  )
}
