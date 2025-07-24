/**
 * @fileoverview Modern TabsBar component with mobile-first responsive design
 * @author GitHub Copilot
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * 
 * A custom tab bar component built from scratch to match the exact visual design
 * from the screenshot. Features smooth animations, mobile scrolling, and full
 * accessibility support with keyboard navigation.
 * 
 * Key Features:
 * - Mobile-first responsive design with horizontal scrolling
 * - Smooth animated underline that follows the active tab
 * - Touch-friendly interactions (44px minimum height)
 * - Full keyboard navigation (arrow keys, tab, enter/space)
 * - Semantic ARIA attributes and roles
 * - Badge support with counts
 * - Icon and text scaling for mobile
 * - No hardcoded content - fully prop-driven
 * 
 * Dependencies:
 * - framer-motion: For smooth underline animations
 * - lucide-react: For icons
 * - Tailwind CSS: For styling and responsive behavior
 * - TypeScript: For strict type safety
 * 
 * Usage:
 * <TabsBar
 *   tabs={tabsData}
 *   activeTab="overview"
 *   onTabChange={handleTabChange}
 * />
 * 
 * Related files:
 * - components/ui/badge.tsx (for tab badges)
 * - lib/utils.ts (for cn utility)
 */

"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Tab configuration interface
 */
export interface TabItem {
  /** Unique identifier for the tab */
  key: string
  /** Display label for the tab */
  label: string
  /** Icon component from lucide-react */
  icon: LucideIcon
  /** Optional badge count (if > 0, badge will be shown) */
  badgeCount?: number
  /** ARIA label for accessibility */
  ariaLabel?: string
  /** Whether this tab is disabled */
  disabled?: boolean
}

/**
 * TabsBar component props
 */
export interface TabsBarProps {
  /** Array of tab configurations */
  tabs: TabItem[]
  /** Key of the currently active tab */
  activeTab: string
  /** Callback fired when a tab is selected */
  onTabChange: (tabKey: string) => void
  /** Additional CSS classes */
  className?: string
  /** Whether to show the bottom border separator */
  showBorder?: boolean
}

/**
 * Modern TabsBar component with mobile-first design
 * 
 * Renders a horizontal tab bar with smooth animated underline, mobile scrolling,
 * and full keyboard accessibility. Built to match the exact visual design from
 * the provided screenshot.
 * 
 * @param tabs - Array of tab configurations
 * @param activeTab - Key of the currently active tab
 * @param onTabChange - Callback when tab selection changes
 * @param className - Additional CSS classes
 * @param showBorder - Whether to show bottom border (default: true)
 * 
 * @example
 * const tabs = [
 *   { key: 'overview', label: 'Overview', icon: FileText, badgeCount: 10 },
 *   { key: 'perspectives', label: 'Perspectives', icon: Users, badgeCount: 2 }
 * ]
 * 
 * <TabsBar
 *   tabs={tabs}
 *   activeTab="overview"
 *   onTabChange={setActiveTab}
 * />
 * 
 * Keyboard Navigation:
 * - Tab: Focus next/previous tab
 * - Arrow Left/Right: Navigate between tabs
 * - Enter/Space: Activate focused tab
 * - Home/End: Go to first/last tab
 * 
 * Mobile Features:
 * - Horizontal scrolling on small screens
 * - Touch-friendly 44px minimum height
 * - Optimized badge and icon sizes
 * - Smooth scroll to active tab
 */
export function TabsBar({
  tabs,
  activeTab,
  onTabChange,
  className,
  showBorder = true
}: TabsBarProps) {
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 })
  const [focusedTab, setFocusedTab] = useState<string | null>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  /**
   * Calculate underline position and width for the active tab
   */
  const updateUnderline = useCallback(() => {
    const activeTabElement = tabRefs.current[activeTab]
    const container = tabsContainerRef.current

    if (!activeTabElement || !container) {
      setUnderlineStyle({ width: 0, left: 0 })
      return
    }

    const containerRect = container.getBoundingClientRect()
    const tabRect = activeTabElement.getBoundingClientRect()

    setUnderlineStyle({
      width: tabRect.width,
      left: tabRect.left - containerRect.left + container.scrollLeft
    })
  }, [activeTab])

  /**
   * Scroll active tab into view on mobile
   */
  const scrollToActiveTab = useCallback(() => {
    const activeTabElement = tabRefs.current[activeTab]
    const container = tabsContainerRef.current

    if (!activeTabElement || !container) return

    const containerRect = container.getBoundingClientRect()
    const tabRect = activeTabElement.getBoundingClientRect()
    
    // Check if tab is outside the visible area
    const isTabOutOfView = 
      tabRect.left < containerRect.left || 
      tabRect.right > containerRect.right

    if (isTabOutOfView) {
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [activeTab])

  /**
   * Update underline when active tab changes
   */
  useEffect(() => {
    const timer = setTimeout(updateUnderline, 50) // Small delay for DOM updates
    return () => clearTimeout(timer)
  }, [updateUnderline])

  /**
   * Update underline on window resize
   */
  useEffect(() => {
    const handleResize = () => updateUnderline()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateUnderline])

  /**
   * Scroll to active tab when it changes
   */
  useEffect(() => {
    scrollToActiveTab()
  }, [scrollToActiveTab])

  /**
   * Handle tab selection
   */
  const handleTabClick = (tabKey: string) => {
    const tab = tabs.find(t => t.key === tabKey)
    if (!tab || tab.disabled) return
    
    onTabChange(tabKey)
    setFocusedTab(null) // Clear focus when clicking
  }

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent, tabKey: string) => {
    const currentIndex = tabs.findIndex(tab => tab.key === tabKey)
    const enabledTabs = tabs.filter(tab => !tab.disabled)
    const enabledIndex = enabledTabs.findIndex(tab => tab.key === tabKey)

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        if (enabledIndex > 0) {
          const prevTab = enabledTabs[enabledIndex - 1]
          setFocusedTab(prevTab.key)
          tabRefs.current[prevTab.key]?.focus()
        }
        break

      case 'ArrowRight':
        event.preventDefault()
        if (enabledIndex < enabledTabs.length - 1) {
          const nextTab = enabledTabs[enabledIndex + 1]
          setFocusedTab(nextTab.key)
          tabRefs.current[nextTab.key]?.focus()
        }
        break

      case 'Home':
        event.preventDefault()
        if (enabledTabs.length > 0) {
          const firstTab = enabledTabs[0]
          setFocusedTab(firstTab.key)
          tabRefs.current[firstTab.key]?.focus()
        }
        break

      case 'End':
        event.preventDefault()
        if (enabledTabs.length > 0) {
          const lastTab = enabledTabs[enabledTabs.length - 1]
          setFocusedTab(lastTab.key)
          tabRefs.current[lastTab.key]?.focus()
        }
        break

      case 'Enter':
      case ' ':
        event.preventDefault()
        handleTabClick(tabKey)
        break
    }
  }

  /**
   * Get tab styling classes
   */
  const getTabClasses = (tab: TabItem, isActive: boolean, isFocused: boolean) => {
    return cn(
      // Base styles
      "relative flex items-center gap-2 px-4 sm:px-6 py-3 min-h-[44px]",
      "text-sm font-medium transition-all duration-200 ease-in-out",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "whitespace-nowrap select-none",
      
      // Active/inactive states
      isActive 
        ? "text-primary" 
        : "text-muted-foreground hover:text-foreground",
      
      // Disabled state
      tab.disabled && "opacity-50 cursor-not-allowed",
      
      // Focus state
      isFocused && "ring-2 ring-primary ring-offset-2"
    )
  }

  return (
    <div 
      className={cn(
        "relative w-full",
        showBorder && "border-b border-border",
        className
      )}
    >
      {/* Scrollable tabs container */}
      <div
        ref={tabsContainerRef}
        className="relative overflow-x-auto scrollbar-hide"
        role="tablist"
        aria-label="Analysis sections"
      >
        <div className="flex min-w-max">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab
            const isFocused = tab.key === focusedTab

            return (
              <button
                key={tab.key}
                ref={(el) => { tabRefs.current[tab.key] = el }}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.key}`}
                aria-label={tab.ariaLabel || `${tab.label} tab`}
                tabIndex={isActive ? 0 : -1}
                disabled={tab.disabled}
                className={getTabClasses(tab, isActive, isFocused)}
                onClick={() => handleTabClick(tab.key)}
                onKeyDown={(e) => handleKeyDown(e, tab.key)}
                onFocus={() => setFocusedTab(tab.key)}
                onBlur={() => setFocusedTab(null)}
              >
                {/* Tab icon */}
                <tab.icon 
                  className="h-4 w-4 flex-shrink-0" 
                  aria-hidden="true"
                />
                
                {/* Tab label */}
                <span className="flex-shrink-0">
                  {tab.label}
                </span>
                
                {/* Tab badge */}
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 px-1.5 py-0.5 text-xs font-medium min-w-[1.25rem] h-5"
                  >
                    {tab.badgeCount}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>

        {/* Animated underline */}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-primary"
          initial={false}
          animate={{
            width: underlineStyle.width,
            x: underlineStyle.left
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.3
          }}
          style={{ left: 0 }}
        />
      </div>
    </div>
  )
}

export default TabsBar
