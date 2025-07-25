/**
 * @fileoverview Loading skeleton components for Discover page
 * @author GitHub Copilot
 * @created 2025-07-25
 * @lastModified 2025-07-25
 *
 * Provides skeleton loading states for the Discover page while fetching Reddit data.
 * Matches the layout and structure of the actual content for smooth loading experience.
 *
 * Features:
 * - Skeleton cards matching StoryCard layout
 * - Sector section skeleton with header placeholder
 * - Responsive grid layout matching actual content
 * - Smooth pulse animations
 * - Accessibility support with proper ARIA labels
 *
 * Dependencies:
 * - shadcn/ui Skeleton component
 * - Tailwind CSS for layout and animations
 * 
 * Usage:
 * - Shown while fetchTrendingStories() is loading
 * - Used in Discover page loading state
 * - Provides visual feedback during data fetching
 *
 * Related files:
 * - app/discover/page.tsx (consumer)
 * - components/discover/story-card.tsx (matches layout)
 * - components/discover/sector-section.tsx (matches structure)
 */

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

/**
 * StoryCardSkeleton - Loading placeholder for individual story cards
 * 
 * Matches the layout and dimensions of the actual StoryCard component
 * to provide seamless loading experience.
 * 
 * @returns {JSX.Element} Skeleton card matching StoryCard layout
 * 
 * Design decisions:
 * - Same aspect ratio and spacing as real StoryCard
 * - Subtle pulse animation for loading feedback
 * - Accessible with proper ARIA labels
 * - Consistent with design system skeleton patterns
 */
export function StoryCardSkeleton() {
  return (
    <Card className="h-full flex flex-col bg-card border-border/50">
      <CardHeader className="p-0">
        {/* Thumbnail Skeleton */}
        <Skeleton 
          className="aspect-video w-full rounded-t-lg" 
          aria-label="Loading story thumbnail"
        />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-3">
        {/* Title Skeleton - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" aria-label="Loading story title" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Snippet Skeleton - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" aria-label="Loading story snippet" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        {/* Metadata Row Skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-16" aria-label="Loading subreddit" />
            <Skeleton className="h-3 w-12" aria-label="Loading author" />
          </div>
          <Skeleton className="h-3 w-10" aria-label="Loading timestamp" />
        </div>

        {/* Stats Row Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-8" aria-label="Loading score" />
          <Skeleton className="h-3 w-6" aria-label="Loading comments" />
          <Skeleton className="h-3 w-12" aria-label="Loading domain" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 flex-1" aria-label="Loading action button" />
          <Skeleton className="h-8 flex-1" aria-label="Loading action button" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * SectorSectionSkeleton - Loading placeholder for sector sections
 * 
 * Displays sector header skeleton and grid of story card skeletons
 * matching the layout of the actual SectorSection component.
 * 
 * @param {number} cardCount - Number of skeleton cards to show (default: 6)
 * @returns {JSX.Element} Complete sector section skeleton
 * 
 * @example
 * <SectorSectionSkeleton cardCount={8} />
 * 
 * Performance considerations:
 * - Uses consistent grid layout with actual content
 * - Minimal DOM elements for fast rendering
 * - Smooth animations without layout shifts
 */
export function SectorSectionSkeleton({ cardCount = 6 }: { cardCount?: number }) {
  return (
    <section className="space-y-6" aria-label="Loading trending stories section">
      {/* Sector Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded" aria-label="Loading sector icon" />
          <Skeleton className="h-8 w-32" aria-label="Loading sector title" />
          <Skeleton className="h-6 w-8" aria-label="Loading story count" />
        </div>
      </div>

      {/* Stories Grid Skeleton */}
      <div 
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-label="Loading stories grid"
      >
        {Array.from({ length: cardCount }, (_, index) => (
          <StoryCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    </section>
  )
}

/**
 * DiscoverPageSkeleton - Complete loading state for Discover page
 * 
 * Shows multiple sector skeletons with different card counts to simulate
 * the actual Discover page loading experience.
 * 
 * @returns {JSX.Element} Full page skeleton with multiple sectors
 * 
 * Usage notes:
 * - Matches the actual number of sectors and typical story counts
 * - Provides visual feedback during initial page load
 * - Maintains responsive layout consistency
 */
export function DiscoverPageSkeleton() {
  return (
    <div className="space-y-12" aria-label="Loading Discover page">
      {/* Page Header Skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-10 w-48 mx-auto" aria-label="Loading page title" />
        <Skeleton className="h-4 w-96 mx-auto" aria-label="Loading page description" />
      </div>

      {/* Multiple Sector Skeletons */}
      {Array.from({ length: 6 }, (_, index) => (
        <SectorSectionSkeleton 
          key={`sector-skeleton-${index}`} 
          cardCount={Math.max(4, 8 - index)} // Vary card count for realism
        />
      ))}
    </div>
  )
}
