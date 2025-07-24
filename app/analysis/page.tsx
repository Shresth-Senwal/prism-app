/**
 * @fileoverview Dynamic analysis page with mobile-first responsive design
 * @author GitHub Copilot
 * @created 2025-07-24
 * @lastModified 2025-07-24
 *
 * Completely refactored analysis page using dynamic components, mobile-first design,
 * and comprehensive responsive behavior. Features dynamic tab generation, empty states,
 * accessibility enhancements, and progressive loading.
 *
 * Key Features:
 * - Dynamic Tabs: Generated based on data availability
 * - Mobile-First: Responsive design from mobile to desktop
 * - Accessibility: Full keyboard navigation and screen reader support
 * - Progressive Loading: Context-aware loading states
 * - Empty States: Graceful handling of missing data
 * - Source Display: Dynamic source rendering with metadata
 *
 * Dependencies:
 * - framer-motion: For all animations and micro-interactions
 * - next/navigation: To get the topic from URL search parameters
 * - components/content: Dynamic tabs and content components
 * - lib/ui-config: Configuration management
 *
 * Usage:
 * - This page is navigated to from the home page after a topic is submitted for analysis.
 * - It fetches data from the `/api/analyze` endpoint and renders it dynamically.
 *
 * Related files:
 * - app/api/analyze/route.ts: The backend API that provides the analysis data
 * - components/content/dynamic-tabs.tsx: Dynamic tabs component
 * - lib/ui-config.ts: UI configuration and tab definitions
 */

"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  RefreshCw, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  FileText,
  GitCommitHorizontal,
  Lightbulb,
  AlertCircle,
  Search,
} from "lucide-react"
import Link from "next/link"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { TabsBar, TabItem } from "@/components/ui/tabs-bar"
import { useIsMobile } from "@/hooks/use-mobile"
import { 
  analysisTabConfigs, 
  defaultAnalysisConfig,
  getLoadingConfig,
  getErrorConfig,
  prefersReducedMotion
} from "@/lib/ui-config"
import { cn } from "@/lib/utils"

// --- TYPES (Matching the API response) ---

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
 * @typedef {object} Source
 * @property {string} source - The source type (e.g., 'Reddit', 'Web')
 * @property {string} title - The title or headline
 * @property {string} url - The source URL
 * @property {string} snippet - A content snippet
 * @property {Record<string, any>} [metadata] - Additional metadata
 */
type Source = {
  source: string
  title: string
  url: string
  snippet: string
  metadata?: Record<string, any>
}

/**
 * @typedef {object} AnalysisData
 * @property {string} summary - The synthesized summary.
 * @property {Perspective[]} perspectives - An array of diverse perspectives.
 * @property {string[]} contrasting_points - A list of key disagreements.
 * @property {string[]} insights - A list of hidden insights or biases.
 * @property {Source[]} [sources] - Sources used in the analysis.
 */
type AnalysisData = {
  summary: string
  perspectives: Perspective[]
  contrasting_points: string[]
  insights: string[]
  sources?: Source[]
}

// --- UTILITY FUNCTIONS ---

/**
 * Convert DynamicTabConfig to TabItem format for the new TabsBar component
 * Filters out tabs that are not visible based on the analysis data
 * 
 * @param data - The analysis data to check against
 * @returns Array of TabItem objects for visible tabs
 */
const convertToTabItems = (data: AnalysisData | null): TabItem[] => {
  if (!data) return []
  
  return analysisTabConfigs
    .filter(config => config.isVisible(data))
    .map(config => ({
      key: config.key,
      label: config.label,
      icon: config.icon,
      badgeCount: config.badgeCount ? config.badgeCount(data) : 0,
      ariaLabel: config.ariaLabel,
      disabled: false
    }))
}

// --- MAIN COMPONENT ---

export default function AnalysisPage() {
  const searchParams = useSearchParams()
  const topic = searchParams.get("topic") || ""
  const isMobile = useIsMobile()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  // Set default tab to 'overview' so the Overview tab is always active by default
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch analysis data
  useEffect(() => {
    if (!topic) {
      setLoading(false)
      setError("No topic provided for analysis.")
      return
    }

    fetchAnalysis()
  }, [topic])

  const fetchAnalysis = async () => {
    setLoading(true)
    setError(null)
    setAnalysis(null)

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
      
      const data: any = await response.json()
      
      // Basic validation and fallback for API response structure
      const validatedData: AnalysisData = {
        summary: data.summary || "No summary provided.",
        perspectives: Array.isArray(data.perspectives) ? data.perspectives : [],
        contrasting_points: Array.isArray(data.contrasting_points) ? data.contrasting_points : [],
        insights: Array.isArray(data.insights) ? data.insights : [],
        sources: Array.isArray(data.sources) ? data.sources : [],
      }
      
      setAnalysis(validatedData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAnalysis()
    setIsRefreshing(false)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Analysis of ${topic}`,
          text: `Check out this AI-powered analysis of "${topic}"`,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const memoizedAnalysis = useMemo(() => analysis, [analysis])
  
  // Convert analysis data to tab items for the new TabsBar component
  const tabItems = useMemo(() => convertToTabItems(memoizedAnalysis), [memoizedAnalysis])

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion() ? 0 : 0.5,
        staggerChildren: prefersReducedMotion() ? 0 : 0.1
      }
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion() ? 0 : 0.6
      }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion() ? 0 : 0.4
      }
    }
  }

  if (loading) {
    return <AnalysisLoadingSkeleton topic={topic} />
  }

  if (error) {
    return <AnalysisErrorState error={error} onRetry={fetchAnalysis} />
  }

  if (!memoizedAnalysis) {
    return <AnalysisEmptyState topic={topic} />
  }

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background"
      id="main-content"
    >
      {/* Header Section */}
      <motion.div
        variants={headerVariants}
        className={cn(
          "sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border",
          "px-4 py-6 sm:px-6 lg:px-8"
        )}
      >
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          {isMobile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="flex-shrink-0"
                >
                  <Link href="/" aria-label="Go back to search">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <h1 className="text-lg font-bold text-foreground truncate">
                  {topic}
                </h1>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  AI Analysis
                </Badge>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    aria-label="Refresh analysis"
                  >
                    <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    aria-label="Share analysis"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop Header */
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  asChild
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Search</span>
                  </Link>
                </Button>
                
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Analysis of: <span className="text-primary">{topic}</span>
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    AI-generated multi-perspective overview
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {memoizedAnalysis.sources?.length || 0} sources analyzed
                </Badge>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        variants={contentVariants}
        className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
      >
        {/* TabsBar Component */}
        <div className="mb-8">
          <TabsBar
            tabs={tabItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="w-full"
            showBorder={true}
          />
        </div>

        {/* Tab Content Based on Active Tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: prefersReducedMotion() ? 0 : 0.3 }}
          >
            {activeTab === 'overview' && memoizedAnalysis && (
              <OverviewContent analysis={memoizedAnalysis} />
            )}
            {activeTab === 'perspectives' && memoizedAnalysis && (
              <PerspectivesContent perspectives={memoizedAnalysis.perspectives} />
            )}
            {activeTab === 'contrasts' && memoizedAnalysis && (
              <ContrastsContent contrasts={memoizedAnalysis.contrasting_points} />
            )}
            {activeTab === 'insights' && memoizedAnalysis && (
              <InsightsContent insights={memoizedAnalysis.insights} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.main>
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
            <AnimatePresence initial={false}>
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
              onClick={onToggle}
              variant="link"
              className="text-[#7B61FF] p-0 h-auto self-start mt-4 flex items-center gap-1"
            >
              {isExpanded ? "Read Less" : "Read More"}
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
});

// --- SOURCES SECTION COMPONENT ---
const SourcesSection = ({ sources }: { sources: Source[] }) => (
  <Card className="mt-8 bg-card/80 border border-border">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-lg">
        <Users className="h-5 w-5 text-primary" />
        <span>Sources Used in Analysis</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="divide-y divide-border">
        {sources.map((src, i) => (
          <li key={i} className="py-3 flex flex-col md:flex-row md:items-center md:gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7B61FF] mr-2">{src.source}</span>
            <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all font-medium">
              {src.title || src.url}
            </a>
            {src.snippet && (
              <span className="block text-gray-400 text-xs mt-1 md:mt-0 md:ml-2">{src.snippet.slice(0, 120)}{src.snippet.length > 120 ? '…' : ''}</span>
            )}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

/**
 * InfoListCard - Generic card for displaying a list of information items with an icon and title.
 *
 * Renders a Card with a title, an icon, and a list of string items.
 *
 * @param {string} title - The card's title
 * @param {string[]} items - The list of items to display
 * @param {React.ReactNode} icon - The icon to display next to the title
 * @returns {JSX.Element} The rendered info list card
 *
 * @example
 * <InfoListCard title="Summary" items={["Point 1", "Point 2"]} icon={<FileText />} />
 *
 * Design decisions:
 * - Uses shadcn/ui Card for consistent styling
 * - Handles empty item arrays gracefully
 * - Ensures accessibility with semantic markup
 */
const InfoListCard = ({
  title,
  items,
  icon,
}: {
  title: string
  items: string[]
  icon: React.ReactNode
}) => (
  <Card className="bg-card/80 border border-border mb-6">
    <CardHeader className="flex flex-row items-center gap-3">
      <span>{icon}</span>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {items && items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="text-gray-300 text-base leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">No information available.</p>
      )}
    </CardContent>
  </Card>
);



/**
 * A skeleton component for the analysis page's loading state.
 * It now mimics the 4-tab layout.
 */
/**
 * AnalysisSkeleton - Loading skeleton for the analysis page
 *
 * Mimics the 4-tab layout and a single card to provide a visually consistent loading state.
 *
 * @returns {JSX.Element} Skeleton UI for loading state
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
);

/**
 * AnalysisLoadingSkeleton - Enhanced loading skeleton with topic context
 */
const AnalysisLoadingSkeleton = ({ topic }: { topic: string }) => (
  <div className="space-y-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4"
    >
      <div className="flex items-center justify-center gap-2">
        <RefreshCw className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">
          Analyzing {topic}...
        </span>
      </div>
    </motion.div>
    <AnalysisSkeleton />
  </div>
);

/**
 * AnalysisErrorState - Error state component
 */
const AnalysisErrorState = ({ 
  error, 
  onRetry 
}: { 
  error: string
  onRetry: () => void 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center space-y-6 py-12"
  >
    <div className="space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Analysis Failed</h3>
        <p className="text-muted-foreground max-w-md">{error}</p>
      </div>
    </div>
    <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
      <RefreshCw className="h-4 w-4" />
      Try Again
    </Button>
  </motion.div>
);

/**
 * AnalysisEmptyState - Empty state component
 */
const AnalysisEmptyState = ({ topic }: { topic: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center space-y-6 py-12"
  >
    <div className="space-y-4">
      <Search className="h-12 w-12 text-muted-foreground mx-auto" />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">No Analysis Available</h3>
        <p className="text-muted-foreground max-w-md">
          We couldn't find enough information to analyze "{topic}". Try a different topic or check your search terms.
        </p>
      </div>
    </div>
    <Button asChild variant="outline">
      <Link href="/" className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Search
      </Link>
    </Button>
  </motion.div>
);

/**
 * OverviewContent - Overview tab content
 *
 * Always renders a summary card. If the summary is missing or empty, shows a fallback message.
 */
const OverviewContent = ({ analysis }: { analysis: AnalysisData }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analysis.summary && analysis.summary.trim() ? (
          <p className="text-muted-foreground leading-relaxed">
            {analysis.summary}
          </p>
        ) : (
          <div className="text-muted-foreground italic">No summary available for this topic.</div>
        )}
      </CardContent>
    </Card>

    {analysis.sources && analysis.sources.length > 0 && (
      <SourcesSection sources={analysis.sources} />
    )}
  </div>
);

/**
 * PerspectivesContent - Perspectives tab content
 */
const PerspectivesContent = ({ perspectives }: { perspectives: Perspective[] }) => {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const toggleCard = (index: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-6">
      {perspectives.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {perspectives.map((perspective, index) => (
            <PerspectiveCard
              key={`${perspective.title}-${index}`}
              perspective={perspective}
              isExpanded={expandedCards[index] || false}
              onToggle={() => toggleCard(index)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Perspectives Found</h3>
          <p className="text-muted-foreground">
            We couldn't identify distinct perspectives for this topic.
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * ContrastsContent - Contrasts tab content
 */
const ContrastsContent = ({ contrasts }: { contrasts: string[] }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCommitHorizontal className="h-5 w-5 text-primary" />
          Contrasting Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contrasts.length > 0 ? (
          <ul className="space-y-3">
            {contrasts.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No contrasting points identified.</p>
        )}
      </CardContent>
    </Card>
  </div>
);

/**
 * InsightsContent - Insights tab content
 */
const InsightsContent = ({ insights }: { insights: string[] }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <ul className="space-y-3">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{insight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No insights available.</p>
        )}
      </CardContent>
    </Card>
  </div>
);
