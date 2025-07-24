/**
 * @fileoverview Home page with dynamic, mobile-first search interface
 * @author GitHub Copilot
 * @created 2024-12-19
 * @lastModified 2025-01-27
 * 
 * Refactored to use the new dynamic UI system with mobile-first responsive design,
 * accessibility enhancements, and smooth animations. Features our new DynamicSearch
 * component for consistent UX across the application.
 */

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DynamicSearch } from "@/components/content/dynamic-search"
import { useIsMobile } from "@/hooks/use-mobile"
import { prefersReducedMotion, defaultSearchConfig } from "@/lib/ui-config"

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isMobile = useIsMobile()
  const searchConfig = defaultSearchConfig

  const handleSearch = async (query: string) => {
    if (!query.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Navigate directly to analysis page - the analysis page will handle the API call
      router.push(`/analysis?topic=${encodeURIComponent(query.trim())}`)
    } catch (err: any) {
      setError(err.message || "Unknown error")
      setLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion() ? 0 : 0.8,
        staggerChildren: prefersReducedMotion() ? 0 : 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion() ? 0 : 0.6
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-24">
      <motion.div
        className="max-w-3xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className={`
            ${isMobile ? 'text-4xl' : 'text-6xl'} 
            font-bold text-white mb-4
          `}
        >
          See the whole story.
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className={`
            ${isMobile ? 'text-lg' : 'text-xl'} 
            text-muted-foreground mb-8 leading-relaxed
          `}
        >
          Enter any topic to get an instant, AI-powered analysis of different perspectives from across the digital world.
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <DynamicSearch
            config={{
              ...searchConfig,
              placeholder: "Enter a topic to analyze...",
            }}
            onSearch={handleSearch}
            className="w-full"
          />
        </motion.div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive mt-4 text-sm bg-destructive/10 rounded-lg p-3 border border-destructive/20"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
