/**
 * @fileoverview Analysis page - presents a stunning, interactive, and animated multi-perspective analysis.
 * @author Cursor AI
 * @created 2024-12-19
 * @lastModified 2024-12-19
 *
 * This component has been completely refactored to provide a modern, engaging user experience.
 * It replaces the static accordion layout with a dynamic, tab-based interface powered by Framer Motion
 * and custom-styled shadcn/ui components. The goal is to make the analysis not just informative,
 * but also visually compelling and interactive.
 *
 * Key Features:
 * - Dynamic Tabs: Analysis is segmented into "Overview", "Perspectives", "Contrasts", and "Insights".
 * - Interactive Perspective Cards: Each perspective shows sentiment, key points, and has an expandable full content view.
 * - Sophisticated Animations: Uses Framer Motion for staggered content reveals and smooth layout transitions.
 * - Structured Data Handling: Consumes a rich JSON object from the backend API for a robust presentation.
 * - Custom Styling: Includes a subtle, slow-animated gradient background and refined typography.
 *
 * Dependencies:
 * - framer-motion: For all animations.
 * - next/navigation: To get the topic from URL search parameters.
 * - shadcn/ui (Tabs, Card, Skeleton, Button): For the core UI structure.
 *
 * Usage:
 * - This page is navigated to from the home page after a topic is submitted for analysis.
 * - It fetches data from the `/api/analyze` endpoint.
 *
 * Related files:
 * - app/api/analyze/route.ts: The backend API that provides the rich, structured analysis data.
 * - app/analysis/loading.tsx: The loading skeleton for this page.
 */

"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence, Variants } from "framer-motion"
import {
  FileText,
  Users,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  GitCommitHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"

// --- TYPES (Matching the new API response) ---

/**
 * @typedef {'Positive' | 'Negative' | 'Neutral'} Sentiment
 */
type Sentiment = "Positive" | "Negative" | "Neutral"

/**
 * @typedef {object} Perspective
 * @property {string} title - The title of the perspective.
 * @property {Sentiment} sentiment - The sentiment of the perspective.
 * @property {string[]} key_points - A list of key takeaways.
 * @property {string} content - The detailed content of the perspective.
 */
type Perspective = {
  title: string
  sentiment: Sentiment
  key_points: string[]
  content: string
}

/**
 * @typedef {object} AnalysisData
 * @property {string} summary - The synthesized summary.
 * @property {Perspective[]} perspectives - An array of diverse perspectives.
 * @property {string[]} contrasting_points - A list of key disagreements.
 * @property {string[]} insights - A list of hidden insights or biases.
 */
type AnalysisData = {
  summary: string
  perspectives: Perspective[]
  contrasting_points: string[]
  insights: string[]
}

// --- ANIMATION VARIANTS ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 70, // Adjusted for smoother spring effect
      damping: 18,   // Adjusted for smoother spring effect
    },
  },
}

// --- MAIN COMPONENT ---

export default function AnalysisPage() {
  const searchParams = useSearchParams()
  const topic = searchParams.get("topic") || ""

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({}); // State to manage individual card expansions

  useEffect(() => {
    if (!topic) {
      setLoading(false)
      setError("No topic provided for analysis.")
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)

    const fetchAnalysis = async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "An unknown error occurred during analysis.")
        }
        const data: AnalysisData = await response.json()

        // Basic validation and fallback for API response structure
        const validatedData: AnalysisData = {
            summary: data.summary || "No summary provided.",
            perspectives: Array.isArray(data.perspectives) ? data.perspectives : [],
            contrasting_points: Array.isArray(data.contrasting_points) ? data.contrasting_points : [],
            insights: Array.isArray(data.insights) ? data.insights : [],
        };
        setAnalysis(validatedData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [topic])

  const memoizedAnalysis = useMemo(() => analysis, [analysis])

  const renderContent = () => {
    if (loading) {
      return <AnalysisSkeleton />
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center text-red-400 bg-red-950/50 p-8 rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
          <p>{error}</p>
        </motion.div>
      )
    }

    if (!memoizedAnalysis) {
  return (
        <div className="text-center text-muted-foreground">
          No analysis data available for this topic.
        </div>
      )
    }

    return (
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-transparent border-b border-white/10 rounded-none p-0">
          {["Overview", "Perspectives", "Contrasts", "Insights"].map(tab => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase()}
              className="data-[state=active]:bg-white/5 data-[state=active]:text-white data-[state=active]:shadow-none text-white/60 rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all duration-300 py-3"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TabsContent value="overview">
                <InfoListCard
                  title="Summary"
                  items={memoizedAnalysis.summary ? [memoizedAnalysis.summary] : []}
                  icon={<FileText className="h-6 w-6 text-primary" />}
                />
              </TabsContent>

              <TabsContent value="perspectives">
                <motion.div
                  className="columns-1 md:columns-2 gap-6 space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {memoizedAnalysis.perspectives.length > 0 ? (
                    memoizedAnalysis.perspectives.map((p, i) => {
                      const uniqueKey = `${p.title}-${i}`;
                      return (
                        <motion.div key={uniqueKey} variants={itemVariants} className="mb-6 break-inside-avoid">
                          <PerspectiveCard
                            perspective={p}
                            isExpanded={expandedStates[uniqueKey] || false} // Use uniqueKey for state lookup
                            onToggle={() => setExpandedStates(prev => ({
                              ...prev,
                              [uniqueKey]: !prev[uniqueKey] // Use uniqueKey for state update
                            }))}
                          />
                        </motion.div>
                      );
                    })
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground">No distinct perspectives were found.</p>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="contrasts">
                <InfoListCard
                  title="Contrasting Points"
                  items={memoizedAnalysis.contrasting_points}
                  icon={<GitCommitHorizontal className="h-6 w-6 text-primary" />}
                />
              </TabsContent>

              <TabsContent value="insights">
                <InfoListCard
                  title="Key Insights"
                  items={memoizedAnalysis.insights}
                  icon={<Lightbulb className="h-6 w-6 text-primary" />}
                />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    )
  }

  return (
    <main className="relative min-h-screen container mx-auto px-4 pt-28 pb-12"> {/* Added padding for sticky header */}
        {/* RE-REMOVED: Subtle background radial gradient per user feedback. */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[#1A1B26]"></div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Analysis of: <span className="text-[#7B61FF] capitalize">{topic}</span>
        </h1>
        <p className="mt-2 text-lg text-gray-400">An AI-generated multi-perspective overview</p>
      </motion.header>

      <div className="max-w-6xl mx-auto">
        {renderContent()}
      </div>
    </main>
  )
}

// --- CHILD COMPONENTS ---

/**
 * Maps sentiment strings to specific icons and colors.
 */
const sentimentMap: { [key in Sentiment]: { icon: React.ElementType, color: string } } = {
  Positive: { icon: TrendingUp, color: "text-green-400" },
  Negative: { icon: TrendingDown, color: "text-red-400" },
  Neutral: { icon: Minus, color: "text-gray-400" },
}

/**
 * A stateful, interactive card for displaying a single perspective.
 * Features sentiment icon, key points, and an expandable full content view.
 */
const PerspectiveCard = React.memo(({ perspective, isExpanded, onToggle }: {
  perspective: Perspective;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const SentimentIcon = sentimentMap[perspective.sentiment]?.icon || Minus

  return (
    <Card className="h-full flex flex-col bg-card/80 backdrop-blur-lg border border-border">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="flex-shrink-0">
          <SentimentIcon className={`h-6 w-6 ${sentimentMap[perspective.sentiment]?.color || "text-white/60"}`} />
        </div>
        <div className="flex-grow">
          <CardTitle className="text-lg font-semibold text-foreground">
            {perspective.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="flex-grow space-y-3">
          {perspective.key_points.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 mt-0.5 text-[#7B61FF] flex-shrink-0" />
              <p className="text-gray-300 text-sm">{point}</p>
            </div>
          ))}
        </div>
        
        {perspective.content && perspective.content.length > 0 && (
            <>
                <AnimatePresence initial={false}> {/* Set initial to false to prevent initial animation on mount */}
                    {isExpanded && (
                        <motion.div 
                            className="prose prose-invert max-w-none text-gray-400 text-sm leading-6 mt-4"
                            dangerouslySetInnerHTML={{ __html: perspective.content.replace(/\n/g, '<br />') }}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                    )}
                </AnimatePresence>
                
                <Button
                    onClick={onToggle} // Call the passed onToggle prop
                    variant="link"
                    className="text-[#7B61FF] p-0 h-auto self-start mt-4 flex items-center gap-1"
                >
                    {isExpanded ? "Read Less" : "Read More"}
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        <ChevronDown className="h-4 w-4"/>
                    </motion.div>
                </Button>
            </>
        )}
      </CardContent>
    </Card>
  )
})

/**
 * A reusable card for displaying a list of informational points (for Insights and Contrasts).
 */
const InfoListCard = React.memo(({
  title,
  items,
  icon,
}: {
  title: string
  items: string[]
  icon: React.ReactNode
}) => (
    <Card className="bg-card/80 backdrop-blur-lg border border-border">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
                {icon}
                <span>{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            {items && items.length > 0 ? (
                <motion.ul variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                    {items.map((item, i) => (
                        <motion.li key={i} variants={itemVariants} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 mt-0.5 text-[#7B61FF] flex-shrink-0" />
                            <p className="text-gray-300">{item}</p>
                        </motion.li>
                    ))}
                </motion.ul>
            ) : (
                <p className="text-muted-foreground">No information available.</p>
            )}
        </CardContent>
    </Card>
));


/**
 * A skeleton component for the analysis page's loading state.
 * It now mimics the 4-tab layout.
 */
const AnalysisSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-4 gap-4 p-2 rounded-xl bg-white/5">
      <Skeleton className="h-10 w-full bg-white/10" />
      <Skeleton className="h-10 w-full bg-white/10" />
      <Skeleton className="h-10 w-full bg-white/10" />
      <Skeleton className="h-10 w-full bg-white/10" />
    </div>
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <Skeleton className="h-8 w-1/3 bg-white/10" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full bg-white/10" />
        <Skeleton className="h-4 w-full bg-white/10" />
        <Skeleton className="h-4 w-2/3 bg-white/10" />
      </CardContent>
    </Card>
  </div>
)
