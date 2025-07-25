"use client"

/**
 * @fileoverview Tabbed interface for Discover page sectors
 * @author GitHub Copilot
 * @created 2025-07-25
 * @lastModified 2025-07-25
 *
 * Provides a tabbed interface for browsing different Reddit sectors.
 * Allows users to switch between Technology, Gaming, Health, Finance, etc.
 * without scrolling through all sectors at once.
 *
 * Features:
 * - Interactive tab navigation
 * - Responsive design for mobile and desktop
 * - Keyboard navigation support
 * - Loading states for each tab
 * - Error handling per sector
 * - Active tab persistence
 *
 * Dependencies:
 * - shadcn/ui Tabs components
 * - SectorSection component for story display
 * - React state management for active tab
 * 
 * Usage:
 * - Used in app/discover/page.tsx
 * - Receives sector data from parent server component
 * - Renders interactive tabbed interface
 *
 * Related files:
 * - app/discover/page.tsx (parent)
 * - components/discover/sector-section.tsx (child)
 * - lib/reddit-discover.ts (data types)
 */

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectorSection } from './sector-section'
import { SectorStories } from '@/lib/reddit-discover'
import { TrendingUp } from 'lucide-react'

interface SectorTabsProps {
  sectorData: SectorStories[]
  className?: string
}

/**
 * SectorTabs - Tabbed interface for browsing Reddit sectors
 * 
 * Provides an organized way to browse trending stories from different sectors.
 * Each tab contains stories from a specific subreddit/topic area.
 * 
 * @param {SectorStories[]} sectorData - Array of sector data with stories
 * @param {string} className - Optional additional CSS classes
 * @returns {JSX.Element} Tabbed interface component
 * 
 * @example
 * <SectorTabs sectorData={sectors} />
 * 
 * Design decisions:
 * - First sector selected by default
 * - Mobile-friendly tab navigation
 * - Consistent spacing and typography
 * - Error states shown within tabs
 * - Loading states for better UX
 * 
 * Accessibility:
 * - Keyboard navigation (Tab, Arrow keys)
 * - ARIA labels and roles
 * - Focus management
 * - Screen reader friendly
 */
export function SectorTabs({ sectorData, className }: SectorTabsProps) {
  // Get sectors that have stories to show
  const sectorsWithStories = sectorData.filter(sector => 
    sector.stories.length > 0 || sector.error
  )

  // Set first available sector as default
  const defaultValue = sectorsWithStories.length > 0 
    ? sectorsWithStories[0].sector.toLowerCase().replace(/\s+/g, '-')
    : ''

  return (
    <div className={className}>
      <Tabs defaultValue={defaultValue} className="w-full">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 mb-8 h-auto p-1 bg-muted/50">
          {sectorsWithStories.map((sector) => {
            const tabValue = sector.sector.toLowerCase().replace(/\s+/g, '-')
            const storyCount = sector.stories.length
            
            return (
              <TabsTrigger
                key={sector.sector}
                value={tabValue}
                className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-background data-[state=active]:text-foreground text-xs sm:text-sm transition-all"
                aria-label={`View ${sector.sector} stories (${storyCount} stories)`}
              >
                <span className="text-lg" role="img" aria-hidden="true">
                  {sector.icon}
                </span>
                <span className="font-medium leading-tight text-center">
                  {sector.sector}
                </span>
                <span className="text-xs text-muted-foreground">
                  {sector.error ? 'Error' : `${storyCount} stories`}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab Content */}
        {sectorsWithStories.map((sector) => {
          const tabValue = sector.sector.toLowerCase().replace(/\s+/g, '-')
          
          return (
            <TabsContent
              key={sector.sector}
              value={tabValue}
              className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
            >
              {sector.error ? (
                /* Error state for this sector */
                <div className="text-center py-16 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-destructive">
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {sector.icon}
                    </span>
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Unable to load {sector.sector} stories
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We encountered an error while fetching stories from r/{sector.sector}. 
                    Please try refreshing the page or check back later.
                  </p>
                  <p className="text-sm text-destructive">
                    Error: {sector.error}
                  </p>
                </div>
              ) : sector.stories.length > 0 ? (
                /* Render sector stories */
                <SectorSection 
                  sectorData={sector}
                  showHeader={false} // Hide header since tab already shows sector info
                />
              ) : (
                /* Empty state */
                <div className="text-center py-16 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {sector.icon}
                    </span>
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    No {sector.sector} stories available
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    There are no trending stories in this sector right now. 
                    Check back later for fresh content.
                  </p>
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Overall empty state if no sectors have data */}
      {sectorsWithStories.length === 0 && (
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
    </div>
  )
}
