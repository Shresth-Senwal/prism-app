/**
 * @fileoverview Discover page component with comprehensive Framer Motion animations
 * @author Cursor AI
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * 
 * This component displays analysis reports with filtering and sorting capabilities.
 * Features sophisticated animations for professional user experience including
 * staggered list animations, hover effects, and smooth transitions.
 * 
 * Dependencies:
 * - framer-motion: For advanced animations and transitions
 * - date-fns: For consistent date formatting
 * - next/image: For optimized image handling
 * - shadcn/ui: For consistent UI components
 * 
 * Usage:
 * - Rendered at /discover route
 * - Displays filterable and sortable analysis reports
 * - Provides navigation to individual analysis pages
 * 
 * Related files:
 * - app/analysis/page.tsx: Target page for report analysis
 * - app/page.tsx: Main landing page with search functionality
 */

"use client"

import { useState } from "react"
import { format } from "date-fns"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * Analysis reports data with comprehensive metadata
 * Each report includes thematic imagery and detailed descriptions
 */
const analysisReports = [
  {
    id: 1,
    title: "The Future of Artificial Intelligence",
    description: "Exploring the trajectory of AI, from large language models to AGI.",
    date: "2024-01-15",
    popularity: 95,
    image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=300&h=200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Quantum Computing's Impact on Cryptography",
    description: "Analyzing the imminent threat and opportunities quantum computers pose to current encryption standards.",
    date: "2024-01-12",
    popularity: 87,
    image: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?q=80&w=300&h=200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Decentralized Finance: A New World Order?",
    description: "Examining the pros and cons of DeFi and its potential to reshape global finance.",
    date: "2024-01-10",
    popularity: 82,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=300&h=200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "The Ethics of Gene Editing",
    description: "A multi-perspective look at CRISPR technology and its ethical implications for humanity.",
    date: "2024-01-08",
    popularity: 78,
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=300&h=200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Brain-Computer Interfaces",
    description: "Analyzing the future of human-computer interaction and the potential of neural links.",
    date: "2024-01-05",
    popularity: 91,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&h=200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "The Global Shift to Renewable Energy",
    description: "A comprehensive analysis of the challenges and opportunities in transitioning to sustainable energy sources.",
    date: "2024-01-03",
    popularity: 73,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&h=200&auto=format&fit=crop",
  },
]

/**
 * Animation variants for sophisticated motion design
 * Provides consistent animation patterns across the component
 */
const animationVariants = {
  // Page container animation
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  },
  
  // Individual item entrance animation
  item: {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  },
  
  // Header animation with dramatic effect
  header: {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 15,
        delay: 0.1
      }
    }
  },
  
  // Controls animation
  controls: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        delay: 0.2
      }
    }
  },
  
  // Grid container for staggered card animations
  grid: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  },
  
  // Individual card animation
  card: {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      y: -50,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  },
  
  // Empty state animation
  emptyState: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        delay: 0.2
      }
    }
  }
}

/**
 * DiscoverPage Component - Analysis reports discovery interface
 * 
 * Features comprehensive animations for professional user experience:
 * - Staggered entrance animations for reports grid
 * - Smooth filtering and sorting transitions
 * - Interactive hover effects
 * - Micro-interactions for enhanced usability
 * 
 * @returns {JSX.Element} Fully animated discover page component
 */
export default function DiscoverPage() {
  const [sortBy, setSortBy] = useState("recent")

  /**
   * Sort reports based on user input
   * Provides real-time sorting with smooth animations
   */
  const sortedReports = analysisReports
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return b.popularity - a.popularity
      }
    })

  /**
   * Handle report card click with navigation
   * Navigates to analysis page for the selected report
   * 
   * @param {string} title - Report title for analysis
   */
  const handleReportClick = (title: string) => {
    window.location.href = `/analysis?topic=${encodeURIComponent(title)}`
  }

  return (
    <motion.div 
      className="container py-12"
      initial="hidden"
      animate="visible"
      variants={animationVariants.container}
    >
      <div className="space-y-8">
        {/* Page Header with animated entrance */}
        <motion.div 
          className="space-y-6"
          variants={animationVariants.header}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-serif font-bold"
            variants={animationVariants.item}
          >
            Discover Perspectives
          </motion.h1>

          {/* Controls with interactive animations */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 max-w-2xl"
            variants={animationVariants.controls}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-card border-border/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Content Grid with staggered animations */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={animationVariants.grid}
          layout
        >
          <AnimatePresence mode="popLayout">
            {sortedReports.map((report) => (
              <motion.div
                key={report.id}
                variants={animationVariants.card}
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <Card
                  className="bg-card/50 border-border/50 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full"
                  onClick={() => handleReportClick(report.title)}
                >
                  <motion.div 
                    className="relative h-48 overflow-hidden rounded-t-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Image
                      src={report.image || "/placeholder.svg"}
                      alt={report.title}
                      fill
                      className="object-cover transition-transform duration-300"
                    />
                  </motion.div>
                  <CardHeader>
                    <motion.div
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardTitle className="font-serif text-lg group-hover:text-primary transition-colors">
                        {report.title}
                      </CardTitle>
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-sm">
                      {report.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(report.date), "yyyy-MM-dd")}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        Read Analysis →
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}
