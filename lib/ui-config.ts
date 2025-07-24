/**
 * @fileoverview UI configuration implementations and utilities
 * @author GitHub Copilot
 * @created 2025-07-24
 * @lastModified 2025-07-24
 *
 * Central configuration management for dynamic UI rendering.
 * Provides default configurations, utilities for responsive behavior,
 * and data-driven UI generation functions.
 *
 * Dependencies:
 * - types/ui-config.ts for type definitions
 * - lucide-react for icons
 * - next/navigation for routing utilities
 *
 * Usage:
 * - Import configurations for components
 * - Use utility functions for responsive behavior
 * - Customize configurations per page/component needs
 *
 * Related files:
 * - types/ui-config.ts (type definitions)
 * - components/* (components consuming configurations)
 */

import { 
  UIConfiguration,
  NavigationConfig,
  DynamicTabConfig,
  AnalysisUIConfig,
  EmptyStateConfig,
  LoadingStateConfig,
  ErrorStateConfig,
  SearchConfig,
  ThemeConfig
} from '@/types/ui-config'
import { 
  Gem, 
  FileText, 
  Users, 
  GitCommitHorizontal, 
  Lightbulb,
  Search,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  Mic,
  Grid,
  List,
  Calendar,
  TrendingUp,
  Globe,
  MessageSquare
} from 'lucide-react'

/**
 * Default navigation configuration with responsive behavior
 */
export const defaultNavigationConfig: NavigationConfig = {
  brand: {
    name: 'Prism',
    icon: Gem,
    href: '/',
    ariaLabel: 'Prism - AI-Powered Topic Analysis'
  },
  items: [
    {
      key: 'analyze',
      label: 'Analyze',
      href: '/',
      icon: Search,
      isActive: (pathname) => pathname === '/',
      ariaLabel: 'Analyze topics with AI'
    },
    {
      key: 'discover',
      label: 'Discover',
      href: '/discover',
      icon: Globe,
      isActive: (pathname) => pathname === '/discover',
      ariaLabel: 'Discover trending analyses'
    }
  ],
  mobile: {
    breakpoint: 768,
    menuIcon: Menu,
    closeIcon: X,
    animationDuration: 300,
    swipeGestures: true
  },
  accessibility: {
    skipToContent: 'Skip to main content',
    menuButtonLabel: 'Open navigation menu',
    closeMenuLabel: 'Close navigation menu',
    navigationLandmark: 'Main navigation'
  }
}

/**
 * Dynamic tab configurations for analysis page
 */
export const analysisTabConfigs: DynamicTabConfig[] = [
  {
    key: 'overview',
    label: 'Overview',
    icon: FileText,
    isVisible: (data) => !!(data?.summary || data?.sources),
    isEmpty: (data) => !data?.summary && (!data?.sources || data.sources.length === 0),
    emptyState: {
      icon: FileText,
      title: 'No Overview Available',
      description: 'The analysis did not generate summary content or sources.',
      action: {
        label: 'Try Another Topic',
        href: '/',
        variant: 'default'
      }
    },
    mobileLabel: 'Overview',
    ariaLabel: 'Analysis overview and summary',
    badgeCount: (data) => data?.sources?.length || 0
  },
  {
    key: 'perspectives',
    label: 'Perspectives',
    icon: Users,
    isVisible: (data) => !!(data?.perspectives && data.perspectives.length > 0),
    isEmpty: (data) => !data?.perspectives || data.perspectives.length === 0,
    emptyState: {
      icon: Users,
      title: 'No Perspectives Found',
      description: 'No distinct perspectives were identified for this topic.',
      action: {
        label: 'Analyze Different Topic',
        href: '/',
        variant: 'outline'
      }
    },
    mobileLabel: 'Views',
    ariaLabel: 'Different perspectives on the topic',
    badgeCount: (data) => data?.perspectives?.length || 0
  },
  {
    key: 'contrasts',
    label: 'Contrasts',
    icon: GitCommitHorizontal,
    isVisible: (data) => !!(data?.contrasting_points && data.contrasting_points.length > 0),
    isEmpty: (data) => !data?.contrasting_points || data.contrasting_points.length === 0,
    emptyState: {
      icon: GitCommitHorizontal,
      title: 'No Contrasts Identified',
      description: 'No significant contrasting viewpoints were found.',
      action: {
        label: 'Explore Perspectives',
        onClick: () => {
          // Switch to perspectives tab
          const perspectivesTab = document.querySelector('[data-tab="perspectives"]') as HTMLElement
          perspectivesTab?.click()
        },
        variant: 'ghost'
      }
    },
    mobileLabel: 'Debates',
    ariaLabel: 'Contrasting points and disagreements',
    badgeCount: (data) => data?.contrasting_points?.length || 0
  },
  {
    key: 'insights',
    label: 'Insights',
    icon: Lightbulb,
    isVisible: (data) => !!(data?.insights && data.insights.length > 0),
    isEmpty: (data) => !data?.insights || data.insights.length === 0,
    emptyState: {
      icon: Lightbulb,
      title: 'No Key Insights',
      description: 'No hidden insights or patterns were discovered.',
      action: {
        label: 'View Summary',
        onClick: () => {
          // Switch to overview tab
          const overviewTab = document.querySelector('[data-tab="overview"]') as HTMLElement
          overviewTab?.click()
        },
        variant: 'ghost'
      }
    },
    mobileLabel: 'Insights',
    ariaLabel: 'Key insights and hidden patterns',
    badgeCount: (data) => data?.insights?.length || 0
  }
]

/**
 * Analysis page UI configuration
 */
export const defaultAnalysisConfig: AnalysisUIConfig = {
  tabs: analysisTabConfigs,
  sources: {
    maxVisible: 10,
    truncateLength: 120,
    showFavicons: true,
    groupBySite: false,
    sortBy: 'relevance'
  },
  perspectives: {
    expandedByDefault: false,
    maxKeyPoints: 5,
    showSentiment: true,
    animateExpansion: true,
    mobileStackLayout: true
  },
  insights: {
    highlightKeywords: true,
    showCategories: false,
    enableFiltering: false,
    sortBy: 'importance'
  },
  responsive: {
    mobile: {
      tabsAsDropdown: false,
      singleColumnLayout: true,
      collapseSources: true
    },
    tablet: {
      twoColumnLayout: true,
      sidebarSources: false
    },
    desktop: {
      threeColumnLayout: false,
      fixedSidebar: false
    }
  }
}

/**
 * Default search configuration
 */
export const defaultSearchConfig: SearchConfig = {
  placeholder: 'Enter a topic to analyze...',
  suggestions: {
    enabled: true,
    maxItems: 5,
    categories: ['Technology', 'Politics', 'Science', 'Business', 'Culture'],
    showHistory: true,
    showTrending: true
  },
  filters: [],
  results: {
    itemsPerPage: 10,
    showSnippets: true,
    highlightMatches: true,
    sortOptions: [
      { key: 'relevance', label: 'Most Relevant', direction: 'desc' },
      { key: 'date', label: 'Newest First', direction: 'desc' },
      { key: 'popularity', label: 'Most Popular', direction: 'desc' }
    ],
    viewModes: [
      { key: 'grid', label: 'Grid View', icon: Grid, columns: 3 },
      { key: 'list', label: 'List View', icon: List, columns: 1 }
    ]
  },
  voice: {
    enabled: true,
    icon: Mic,
    languages: ['en-US', 'en-GB'],
    continuous: false
  },
  mobile: {
    fullScreen: true,
    swipeToClose: true,
    voiceButtonSize: 'lg'
  }
}

/**
 * Loading state configurations
 */
export const loadingConfigs: Record<string, LoadingStateConfig> = {
  search: {
    type: 'spinner',
    size: 'md',
    message: 'Analyzing topic...',
    showProgress: false
  },
  analysis: {
    type: 'skeleton',
    size: 'lg',
    message: 'Generating analysis...',
    duration: 5000,
    showProgress: true
  },
  sources: {
    type: 'pulse',
    size: 'sm',
    message: 'Loading sources...',
    showProgress: false
  },
  page: {
    type: 'dots',
    size: 'lg',
    message: 'Loading page...',
    showProgress: false
  }
}

/**
 * Error state configurations
 */
export const errorConfigs: Record<string, ErrorStateConfig> = {
  networkError: {
    type: 'banner',
    severity: 'error',
    title: 'Connection Error',
    message: 'Unable to connect to the analysis service. Please check your internet connection.',
    actions: [
      {
        label: 'Retry',
        action: () => window.location.reload(),
        variant: 'primary'
      }
    ],
    dismissible: true,
    autoHide: 10000
  },
  analysisError: {
    type: 'inline',
    severity: 'error',
    title: 'Analysis Failed',
    message: 'The AI analysis could not be completed. Please try a different topic or try again later.',
    actions: [
      {
        label: 'Try Different Topic',
        action: () => (window.location.href = '/'),
        variant: 'primary'
      },
      {
        label: 'Report Issue',
        action: () => console.log('Report issue'),
        variant: 'outline'
      }
    ],
    dismissible: true
  },
  validationError: {
    type: 'inline',
    severity: 'warning',
    title: 'Invalid Input',
    message: 'Please enter a valid topic to analyze.',
    actions: [],
    dismissible: true,
    autoHide: 5000
  },
  notFound: {
    type: 'modal',
    severity: 'info',
    title: 'Content Not Found',
    message: 'The requested analysis could not be found.',
    actions: [
      {
        label: 'Return Home',
        action: () => (window.location.href = '/'),
        variant: 'primary'
      }
    ],
    dismissible: true
  }
}

/**
 * Default theme configuration
 */
export const defaultThemeConfig: ThemeConfig = {
  mode: 'dark',
  colors: {
    primary: {
      50: '#f0f4ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#7B61FF',
      600: '#5b21b6',
      700: '#4c1d95',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b'
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    accent: {
      50: '#f0f4ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b'
    },
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b'
    },
    semantic: {
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16'
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03'
      },
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a'
      },
      info: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554'
      }
    }
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Monaco', 'Consolas', 'monospace']
    },
    fontSize: {
      xs: { fontSize: '0.75rem', lineHeight: '1rem' },
      sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
      base: { fontSize: '1rem', lineHeight: '1.5rem' },
      lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
      xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
      '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
      '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },
      '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },
      '5xl': { fontSize: '3rem', lineHeight: '1' },
      '6xl': { fontSize: '3.75rem', lineHeight: '1' }
    },
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },
  spacing: {
    base: 4,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64],
    responsive: {
      mobile: 16,
      tablet: 24,
      desktop: 32
    }
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '750ms'
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    reducedMotion: false,
    stagger: 0.1
  },
  accessibility: {
    highContrast: false,
    focusRing: {
      width: '2px',
      color: '#7B61FF',
      style: 'solid'
    },
    fontSize: {
      min: '14px',
      max: '24px',
      scale: 1.2
    }
  }
}

/**
 * Utility functions for responsive behavior
 */

/**
 * Get visible tabs based on data availability
 */
export function getVisibleTabs(data: any, tabConfigs: DynamicTabConfig[]): DynamicTabConfig[] {
  return tabConfigs.filter(tab => tab.isVisible(data))
}

/**
 * Get empty tabs that should show empty states
 */
export function getEmptyTabs(data: any, tabConfigs: DynamicTabConfig[]): DynamicTabConfig[] {
  return tabConfigs.filter(tab => tab.isVisible(data) && tab.isEmpty(data))
}

/**
 * Check if device is mobile based on screen width
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

/**
 * Check if device is tablet based on screen width
 */
export function isTabletDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

/**
 * Check if device is desktop based on screen width
 */
export function isDesktopDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
}

/**
 * Get responsive configuration based on current device
 */
export function getResponsiveConfig<T>(config: { mobile: T; tablet: T; desktop: T }): T {
  if (isMobileDevice()) return config.mobile
  if (isTabletDevice()) return config.tablet
  return config.desktop
}

/**
 * Generate dynamic navigation items based on current route
 */
export function getDynamicNavigation(pathname: string, config: NavigationConfig): NavigationConfig {
  return {
    ...config,
    items: config.items.map(item => ({
      ...item,
      isActive: item.isActive || (() => false)
    }))
  }
}

/**
 * Get error configuration by type
 */
export function getErrorConfig(errorType: keyof typeof errorConfigs): ErrorStateConfig {
  return errorConfigs[errorType] || errorConfigs.analysisError
}

/**
 * Get loading configuration by type
 */
export function getLoadingConfig(loadingType: keyof typeof loadingConfigs): LoadingStateConfig {
  return loadingConfigs[loadingType] || loadingConfigs.page
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * Get adaptive animation duration based on user preferences
 */
export function getAnimationDuration(duration: keyof typeof defaultThemeConfig.animations.duration): string {
  if (prefersReducedMotion()) return '0ms'
  return defaultThemeConfig.animations.duration[duration]
}
