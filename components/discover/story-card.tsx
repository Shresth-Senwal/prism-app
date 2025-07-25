"use client"

/**
 * @fileoverview Story card component for Discover page trending stories
 * @author GitHub Copilot
 * @created 2025-07-25
 * @lastModified 2025-07-25
 *
 * Displays individual Reddit trending stories with rich metadata and interactive elements.
 * Optimized for both mobile and desktop with responsive design and accessibility features.
 *
 * Features:
 * - Responsive card layout with thumbnail support
 * - Rich metadata display (score, comments, time, subreddit)
 * - Hover effects and smooth animations
 * - Accessible keyboard navigation
 * - External link handling for Reddit and original URLs
 * - Fallback handling for missing thumbnails
 * - Client-side image error handling with useState
 *
 * Dependencies:
 * - Next.js Image for optimized thumbnails
 * - Lucide icons for UI elements
 * - shadcn/ui Card components
 * - Tailwind CSS for styling
 * - React useState for image error state management
 * 
 * Usage:
 * - Used within SectorSection component
 * - Renders individual TrendingStory objects
 * - Handles click events for navigation
 *
 * Related files:
 * - app/discover/page.tsx (parent page)
 * - lib/reddit-discover.ts (data types)
 */

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, MessageCircle, TrendingUp, ExternalLink, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TrendingStory, formatScore, getTimeAgo } from '@/lib/reddit-discover'

interface StoryCardProps {
  story: TrendingStory
  className?: string
}

/**
 * StoryCard - Displays a single trending Reddit story
 * 
 * Renders a story card with thumbnail, title, metadata, and action buttons.
 * Provides links to both the original URL and Reddit discussion.
 * Includes robust fallback handling for images that fail to load.
 * 
 * @param {TrendingStory} story - The story data to display
 * @param {string} className - Optional additional CSS classes
 * @returns {JSX.Element} Rendered story card
 * 
 * @example
 * <StoryCard story={trendingStory} className="mb-4" />
 * 
 * Design decisions:
 * - Uses Next.js Image for optimized thumbnail loading
 * - Fallback placeholder for stories without thumbnails or loading errors
 * - Hover effects for better interactivity
 * - External link indicators for clarity
 * - Responsive design that works on mobile and desktop
 * 
 * Image handling:
 * - Detects valid Reddit thumbnails
 * - Falls back to placeholder on 403, 404, or other errors
 * - Graceful degradation for missing thumbnails
 * 
 * Accessibility:
 * - Semantic HTML with proper heading hierarchy
 * - ARIA labels for interactive elements
 * - Keyboard navigation support
 * - High contrast colors and readable text sizes
 */
export function StoryCard({ story, className }: StoryCardProps) {
  const [imageError, setImageError] = useState(false)

  // Determine if the story has a valid thumbnail and hasn't failed to load
  const hasValidThumbnail = story.thumbnail && 
    story.thumbnail.startsWith('http') && 
    !story.thumbnail.includes('default') &&
    !imageError

  /**
   * Handle image loading errors
   * Sets error state to show fallback placeholder
   */
  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card border-border/50",
      "h-full flex flex-col",
      className
    )}>
      <CardHeader className="p-0">
        {/* Thumbnail or Placeholder */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
          {hasValidThumbnail ? (
            <Image
              src={story.thumbnail!}
              alt={`Thumbnail for ${story.title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
              unoptimized={true}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          {/* Overlay with quick stats */}
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              {formatScore(story.score)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-3">
        {/* Story Title */}
        <h3 className="font-semibold text-base leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {story.title}
        </h3>

        {/* Story Snippet (if available) */}
        {story.snippet && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {story.snippet}
          </p>
        )}

        {/* Metadata Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-3">
            {/* Subreddit */}
            <span className="font-medium text-primary">
              r/{story.subreddit}
            </span>
            
            {/* Author */}
            <span>
              by u/{story.author}
            </span>
          </div>

          {/* Time ago */}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getTimeAgo(story.createdAt)}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {/* Score */}
            <div className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              <span className="font-medium">{formatScore(story.score)}</span>
            </div>

            {/* Comments */}
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{story.comments}</span>
            </div>

            {/* Domain (for external links) */}
            {story.domain && story.domain !== `reddit.com` && (
              <div className="flex items-center gap-1 text-primary">
                <ExternalLink className="h-3 w-3" />
                <span className="truncate max-w-20">{story.domain}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {/* Original Link Button */}
          {story.url !== story.redditUrl && (
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
            >
              <Link 
                href={story.url} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`Read original article: ${story.title}`}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Read Article
              </Link>
            </Button>
          )}

          {/* Reddit Discussion Button */}
          <Button 
            asChild 
            variant="secondary" 
            size="sm" 
            className="flex-1 text-xs"
          >
            <Link 
              href={story.redditUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`View Reddit discussion for: ${story.title}`}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Discussion
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
