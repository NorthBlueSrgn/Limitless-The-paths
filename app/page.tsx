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
  const { user, tasks, paths, currentChapter, aiMessages, completeTask, activatePath, deactivatePath, addAIMessage } =
    useLimitlessData()

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard user={user} tasks={tasks} paths={paths} onCompleteTask={completeTask} />
      case "chapter-black":
        return <ChapterBlack currentChapter={currentChapter} user={user} />
      case "paths":
        return <Paths paths={paths} user={user} onActivatePath={activatePath} onDeactivatePath={deactivatePath} />
      case "the-order":
        return <TheOrder messages={aiMessages} onSendMessage={addAIMessage} />
      case "inner-core":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-orbitron">Inner Core</h2>
              <p className="text-muted-foreground">Coming Soon</p>
            </div>
          </div>
        )
      case "hunter-exam":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-orbitron">Hunter Exam</h2>
              <p className="text-muted-foreground">Coming Soon</p>
            </div>
          </div>
        )
      case "advanced-stats":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-orbitron">Advanced Stats</h2>
              <p className="text-muted-foreground">Coming Soon</p>
            </div>
          </div>
        )
      case "chronicles":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-orbitron">Chronicles</h2>
              <p className="text-muted-foreground">Coming Soon</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} user={user} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
