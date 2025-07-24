"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "./navigation"
import { Header } from "./header"
import { TheOrder } from "../ai/the-order"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isOrderOpen, setIsOrderOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/3 to-transparent rounded-full" />
      </div>

      <Header onToggleOrder={() => setIsOrderOpen(!isOrderOpen)} />

      <div className="flex relative z-10">
        <Navigation />

        <main className="flex-1 p-6 ml-64">{children}</main>

        <TheOrder isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
      </div>
    </div>
  )
}
