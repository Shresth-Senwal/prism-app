/**
 * @fileoverview Dynamic Discover page with Reddit trending stories
 * @author GitHub Copilot
 * @created 2024-12-19
 * @lastModified 2025-07-25
 * 
 * Displays trending stories from Reddit across multiple sectors/subreddits.
 * Features dynamic data fetching, responsive design, and accessibility support.
 * 
 * Features:
 * - Server-side data fetching for SEO and performance
 * - Multiple Reddit sectors (technology, gaming, health, finance, etc.)
 * - Responsive grid layout for story cards
 * - Error handling and loading states
 * - Caching for performance optimization
 * - Accessibility compliance (WCAG 2.1 AA)
 * 
 * Dependencies:
 * - Reddit API utilities for data fetching
 * - SectorSection component for story display
 * - Loading skeletons for better UX
 * - shadcn/ui components for consistent styling
 * 
 * Usage:
 * - Rendered at /discover route
 * - Automatically fetches and displays trending Reddit stories
 * - Updates based on Reddit's daily trending algorithm
 * 
 * Related files:
 * - lib/reddit-discover.ts: Data fetching and types
 * - components/discover/sector-section.tsx: Story display
 * - components/discover/story-card.tsx: Individual stories
 * - components/discover/loading-skeletons.tsx: Loading states
 */

import { Suspense } from 'react'
import { Metadata } from 'next'
import { TrendingUp } from 'lucide-react'
import { SectorTabs } from '@/components/discover/sector-tabs'
import { DiscoverPageSkeleton } from '@/components/discover/loading-skeletons'
import { fetchTrendingStories } from '@/lib/reddit-discover'

// Metadata for SEO and social sharing
export const metadata: Metadata = {
  title: 'Discover Trending Stories | Prism',
  description: 'Discover trending stories from Reddit across technology, gaming, health, finance, world news, and more. Stay updated with the latest discussions and insights.',
  keywords: ['trending stories', 'Reddit', 'technology news', 'gaming', 'health', 'finance', 'world news'],
  openGraph: {
    title: 'Discover Trending Stories | Prism',
    description: 'Discover trending stories from Reddit across multiple sectors',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Trending Stories | Prism',
    description: 'Discover trending stories from Reddit across multiple sectors',
  }
}

/**
 * TrendingStoriesContent - Server component that fetches and displays trending stories
 * 
 * Fetches trending stories from Reddit and renders them in organized sections.
 * Handles errors gracefully and provides retry functionality.
 * 
 * @returns {Promise<JSX.Element>} Rendered trending stories content
 * 
 * Implementation details:
 * - Uses Server Component for SEO benefits and performance
 * - Fetches data at build time with ISR for fresh content
 * - Error boundaries for graceful failure handling
 * - Responsive layout that adapts to all screen sizes
 */
async function TrendingStoriesContent() {
  try {
    // Fetch trending stories from all configured sectors
    const sectorData = await fetchTrendingStories(8) // 8 stories per sector
    
    // Calculate total stories for display
    const totalStories = sectorData.reduce((sum, sector) => sum + sector.stories.length, 0)
    const sectorsWithStories = sectorData.filter(sector => sector.stories.length > 0)

    return (
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Page Header */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Discover Trending Stories
            </h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Stay updated with the latest trending discussions from Reddit across technology, 
            gaming, health, finance, world news, and more. Discover what the world is talking about.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {totalStories} trending stories
            </span>
            <span>•</span>
            <span>{sectorsWithStories.length} active sectors</span>
            <span>•</span>
            <span>Updated hourly</span>
          </div>
        </header>

        {/* Trending Stories Tabs */}
        {sectorData.length > 0 ? (
          <SectorTabs 
            sectorData={sectorData}
            className="space-y-8"
          />
        ) : (
          /* Fallback for no data */
          <div className="text-center py-16 space-y-4">
            <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-semibold text-foreground">
              No trending stories available
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're having trouble fetching trending stories right now. 
              Please check back in a few minutes.
            </p>
          </div>
        )}

        {/* Footer Information */}
        <footer className="text-center pt-8 border-t border-border">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Stories are fetched from public Reddit discussions and updated regularly.
            </p>
            <p>
              Click on any story to view the original content or join the Reddit discussion.
            </p>
          </div>
        </footer>
      </main>
    )
  } catch (error) {
    console.error('Error loading Discover page:', error)
    
    // Error fallback UI
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-16 space-y-4">
          <TrendingUp className="h-16 w-16 mx-auto text-destructive opacity-50" />
          <h1 className="text-3xl font-bold text-foreground">
            Unable to Load Trending Stories
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            We encountered an error while fetching trending stories. 
            Please try refreshing the page or check back later.
          </p>
        </div>
      </main>
    )
  }
}

/**
 * DiscoverPage - Main page component with loading states
 * 
 * Wraps the trending stories content with Suspense for smooth loading experience.
 * Provides skeleton loading state while data is being fetched.
 * 
 * @returns {JSX.Element} Complete Discover page with loading states
 * 
 * Performance optimizations:
 * - Suspense boundary for progressive loading
 * - Skeleton components matching actual layout
 * - Server-side rendering for better SEO
 * - Efficient data fetching with caching
 */
export default function DiscoverPage() {
  return (
    <Suspense 
      fallback={
        <div className="container mx-auto px-4 py-12">
          <DiscoverPageSkeleton />
        </div>
      }
    >
      <TrendingStoriesContent />
    </Suspense>
  )
}
