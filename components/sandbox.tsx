"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock message type for chat
interface ChatMessage {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: string
}

export default function ChatPage({ params }: { params: { slug: string } }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize app based on slug
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true)
      try {
        // Call backend to create chat session
        const response = await fetch(`https://mili-hack.onrender.com/api/sandbox/create?slug=${params.slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Include cookies if your backend uses sessions
        })
        const data = await response.json()
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to initialize chat app")
        }
        // Set initial bot message
        setMessages([
          {
            id: "1",
            content: data.message || `Welcome to ${params.slug}! Start chatting to explore your new app.`,
            sender: "bot",
            timestamp: new Date().toLocaleTimeString(),
          },
        ])
      } catch (err: any) {
        setError(err.message || "Failed to create chat app.")
      } finally {
        setIsLoading(false)
      }
    }
    initializeApp()
  }, [params.slug])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Send message to backend
      const response = await fetch(`https://mili-hack.onrender.com/api/sandbox/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies if needed
        body: JSON.stringify({
          slug: params.slug,
          content: input,
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send message")
      }
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.message || `Echo from ${params.slug}: ${input}`,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, botResponse])
    } catch (err: any) {
      setError(err.message || "Failed to send message.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-gentle-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img src="/logo.png" alt="App Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-heading-bold mb-2">{params.slug} Chat</h1>
          <p className="text-muted-foreground font-body">Your instant chat app powered by Sandbox</p>
        </div>

        <Card className="card-glass border-0">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl text-center font-heading">{params.slug}</CardTitle>
            <CardDescription className="text-center font-body">
              Start chatting in your custom app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                {error}
              </div>
            )}

            {/* Chat Messages */}
            <div className="h-[400px] overflow-y-auto p-4 bg-input/20 rounded-lg border border-border/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="font-body">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-12 bg-input/50 border-border/50 focus:bg-background transition-colors"
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="h-12 btn-primary font-body-medium"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground font-body">Powered by Sandbox</p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground font-body">
            <span className="flex items-center">🚀 Instant Setup</span>
            <span className="flex items-center">💬 Real-time Chat</span>
            <span className="flex items-center">🔧 Customizable</span>
          </div>
        </div>
      </div>
    </div>
  )
}