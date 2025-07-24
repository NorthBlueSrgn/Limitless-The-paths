"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, MessageSquare } from "lucide-react"

interface TheOrderProps {
  isOpen: boolean
  onClose: () => void
}

export function TheOrder({ isOpen, onClose }: TheOrderProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "system" as const,
      content:
        "Welcome, Hunter. I am The Order, your guide through the path of limitless growth. How may I assist your ascension today?",
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "system" as const,
        content:
          "I understand your query, Hunter. Your path requires dedication and consistency. Focus on small, daily improvements that compound over time.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-6 top-24 bottom-6 w-96 z-30">
      <Card className="glass-card h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white font-orbitron">The Order</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-400">Your AI mentor and guide</p>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-black/40 text-gray-300 border border-white/10"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="text-xs opacity-70 mt-1">{msg.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask The Order for guidance..."
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
