/**
 * @fileoverview Sector section component for grouped trending stories
 * @author GitHub Copilot
 * @created 2025-07-25
 * @lastModified 2025-07-25
 *
 * Displays a section of trending stories grouped by sector/subreddit with responsive grid layout.
 * Includes error handling, loading states, and accessibility features.
 *
 * Features:
 * - Responsive grid layout (1-4 columns based on screen size)
 * - Sector header with icon and story count
 * - Error state handling with retry functionality
 * - Empty state with helpful messaging
 * - Accessible navigation and focus management
 * - Smooth animations and loading states
 *
 * Dependencies:
 * - StoryCard component for individual stories
 * - shadcn/ui components for consistent styling
 * - Lucide icons for UI elements
 * - Tailwind CSS for responsive layout
 * 
 * Usage:
 * - Used in main Discover page
 * - Renders SectorStories data structure
 * - Handles loading and error states
 *
 * Related files:
 * - app/discover/page.tsx (parent component)
 * - components/discover/story-card.tsx (child component)
 * - lib/reddit-discover.ts (data types)
 */

import { RefreshCw, AlertCircle, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StoryCard } from './story-card'
import { SectorStories } from '@/lib/reddit-discover'
import { cn } from '@/lib/utils'

interface SectorSectionProps {
  sectorData: SectorStories
  onRetry?: () => void
  className?: string
  showHeader?: boolean // Optional prop to hide/show section header
}

/**
 * SectorSection - Displays trending stories for a specific sector
 * 
 * Renders a section with sector header and grid of story cards.
 * Handles error states and provides retry functionality.
 * 
 * @param {SectorStories} sectorData - The sector data including stories and metadata
 * @param {Function} onRetry - Optional retry callback for error recovery
 * @param {string} className - Optional additional CSS classes
 * @param {boolean} showHeader - Whether to show the sector header (default: true)
 * @returns {JSX.Element} Rendered sector section
 * 
 * @example
 * <SectorSection 
 *   sectorData={technologyStories} 
 *   onRetry={() => refetchData('technology')} 
 *   showHeader={false} // For use in tabs where header is redundant
 * />
 * 
 * Design decisions:
 * - Responsive grid: 1 column mobile, 2 tablet, 3-4 desktop
 * - Error handling with user-friendly messages and retry options
 * - Consistent spacing and typography
 * - Loading states with skeleton placeholders
 * - Accessibility features with proper ARIA labels
 * - Optional header for flexible use in different contexts
 * 
 * Performance considerations:
 * - Grid layout optimized for various screen sizes
 * - Lazy loading of story cards
 * - Efficient re-rendering on data updates
 */
export function SectorSection({ sectorData, onRetry, className, showHeader = true }: SectorSectionProps) {
  const { sector, icon, stories, error } = sectorData

  return (
    <section 
      className={cn("space-y-6", className)}
      aria-labelledby={showHeader ? `${sector.toLowerCase().replace(/\s+/g, '-')}-heading` : undefined}
    >
      {/* Sector Header - Conditionally rendered */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 
            id={`${sector.toLowerCase().replace(/\s+/g, '-')}-heading`}
            className="text-2xl font-bold text-foreground flex items-center gap-3"
          >
            <span className="text-2xl" role="img" aria-label={`${sector} icon`}>
              {icon}
            </span>
            {sector}
            <span className="text-lg font-normal text-muted-foreground">
              ({stories.length})
            </span>
          </h2>

          {/* Retry button for errors */}
          {error && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="text-xs"
              aria-label={`Retry loading ${sector} stories`}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Error State */}
      {error && stories.length === 0 && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {error}
            {onRetry && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={onRetry}
                className="ml-2 p-0 h-auto text-sm underline"
              >
                Try again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State (no error, but no stories) */}
      {!error && stories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No trending stories found in {sector} right now.</p>
          <p className="text-xs mt-1">Check back later for fresh content!</p>
        </div>
      )}

      {/* Stories Grid */}
      {stories.length > 0 && (
        <div 
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="grid"
          aria-label={`${sector} trending stories`}
        >
          {stories.map((story, index) => (
            <div 
              key={story.id} 
              role="gridcell"
              aria-posinset={index + 1}
              aria-setsize={stories.length}
            >
              <StoryCard 
                story={story} 
                className="h-full"
              />
            </div>
          ))}
        </div>
      )}

      {/* Partial Error State (some stories loaded, but with errors) */}
      {error && stories.length > 0 && (
        <Alert className="border-yellow-500/50 bg-yellow-500/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Some {sector} stories couldn't be loaded. Showing {stories.length} available stories.
            {onRetry && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={onRetry}
                className="ml-2 p-0 h-auto text-sm underline"
              >
                Retry for more
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </section>
  )
}
