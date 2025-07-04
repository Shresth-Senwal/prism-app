/**
 * @fileoverview This file has been refactored for pixel-perfect replication of the new UI design and now includes AI-powered topic analysis integration.
 * @author Cursor AI
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchTerm })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to analyze topic")
      }
      // Optionally, you could pass the result via state or cache
      router.push(`/analysis?topic=${encodeURIComponent(searchTerm)}`)
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-24">
      <div className="max-w-3xl w-full">
        <h1 className="text-6xl font-bold text-white mb-4">
          See the whole story.
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Enter any topic to get an instant, AI-powered analysis of different perspectives from across the digital
          world.
        </p>
        <form
          className="relative w-full flex items-center bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-full p-2"
          onSubmit={e => { e.preventDefault(); handleSearch(); }}
        >
          <Input
            type="text"
            placeholder="Enter a topic to analyze..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow bg-transparent focus:outline-none focus:ring-0 border-none h-12 text-lg text-white placeholder:text-muted-foreground pl-6"
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-primary hover:bg-primary/90 text-white rounded-full h-12 w-12 flex-shrink-0"
            disabled={loading}
          >
            {loading ? <Skeleton className="h-6 w-6 rounded-full bg-primary/40 animate-pulse" /> : <Search className="h-6 w-6" />}
          </Button>
        </form>
        {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
      </div>
    </div>
  )
}
