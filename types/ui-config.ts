/**
 * @fileoverview UI configuration types for dynamic, data-driven interface
 * @author GitHub Copilot
 * @created 2025-07-24
 * @lastModified 2025-07-24
 *
 * Comprehensive type definitions for dynamic UI configuration, enabling
 * fully configurable, responsive, and accessible interface components.
 *
 * Dependencies:
 * - React types for component definitions
 * - Lucide React for icon types
 *
 * Usage:
 * - Import types for component props and configuration
 * - Use for building dynamic, data-driven UI elements
 *
 * Related files:
 * - lib/ui-config.ts (configuration implementations)
 * - components/* (components using these types)
 */

import { ComponentType, ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

/**
 * Core UI configuration interface for the entire application
 */
export interface UIConfiguration {
  navigation: NavigationConfig
  pages: Record<string, PageConfig>
  theme: ThemeConfig
  content: ContentConfig
  accessibility: AccessibilityConfig
}

/**
 * Navigation configuration for responsive navigation systems
 */
export interface NavigationConfig {
  brand: BrandConfig
  items: NavigationItem[]
  mobile: MobileNavigationConfig
  accessibility: NavigationA11yConfig
}

export interface BrandConfig {
  name: string
  icon: LucideIcon
  href: string
  ariaLabel: string
}

export interface NavigationItem {
  key: string
  label: string
  href: string
  icon?: LucideIcon
  isActive?: (pathname: string) => boolean
  mobileOnly?: boolean
  desktopOnly?: boolean
  ariaLabel?: string
}

export interface MobileNavigationConfig {
  breakpoint: number
  menuIcon: LucideIcon
  closeIcon: LucideIcon
  animationDuration: number
  swipeGestures: boolean
}

export interface NavigationA11yConfig {
  skipToContent: string
  menuButtonLabel: string
  closeMenuLabel: string
  navigationLandmark: string
}

/**
 * Page-specific configuration for dynamic content rendering
 */
export interface PageConfig {
  title: string
  description: string
  layout: LayoutConfig
  sections: SectionConfig[]
  seo: SEOConfig
}

export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonical?: string
  noIndex?: boolean
}

export interface LayoutConfig {
  type: 'centered' | 'wide' | 'sidebar' | 'split'
  maxWidth: string
  padding: ResponsiveSpacing
  background?: BackgroundConfig
}

export interface ResponsiveSpacing {
  mobile: string
  tablet: string
  desktop: string
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'pattern'
  value: string
  opacity?: number
  animated?: boolean
}

/**
 * Section configuration for dynamic content areas
 */
export interface SectionConfig {
  key: string
  type: 'hero' | 'content' | 'tabs' | 'grid' | 'form'
  title?: string
  isVisible: (data?: any) => boolean
  isEmpty: (data?: any) => boolean
  emptyState: EmptyStateConfig
  responsive: ResponsiveConfig
}

export interface EmptyStateConfig {
  icon: LucideIcon
  title: string
  description: string
  action?: EmptyStateAction
  illustration?: string
}

export interface EmptyStateAction {
  label: string
  href?: string
  onClick?: () => void
  variant: 'default' | 'outline' | 'ghost'
}

export interface ResponsiveConfig {
  mobile: ComponentConfig
  tablet: ComponentConfig
  desktop: ComponentConfig
}

export interface ComponentConfig {
  columns: number
  gap: string
  layout: 'stack' | 'grid' | 'flex'
  direction: 'row' | 'column'
}

/**
 * Dynamic tab configuration for analysis and content sections
 */
export interface DynamicTabConfig {
  key: string
  label: string
  icon: LucideIcon
  isVisible: (data: any) => boolean
  isEmpty: (data: any) => boolean
  emptyState: EmptyStateConfig
  mobileLabel?: string
  ariaLabel: string
  badgeCount?: (data: any) => number
}

/**
 * Theme configuration for dynamic theming
 */
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  colors: ColorScheme
  typography: TypographyConfig
  spacing: SpacingConfig
  animations: AnimationConfig
  accessibility: ThemeA11yConfig
}

export interface ColorScheme {
  primary: ColorSet
  secondary: ColorSet
  accent: ColorSet
  neutral: ColorSet
  semantic: SemanticColors
}

export interface ColorSet {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export interface SemanticColors {
  success: ColorSet
  warning: ColorSet
  error: ColorSet
  info: ColorSet
}

export interface TypographyConfig {
  fontFamily: {
    sans: string[]
    serif: string[]
    mono: string[]
  }
  fontSize: Record<string, TypographySize>
  fontWeight: Record<string, number>
  lineHeight: Record<string, number>
  letterSpacing: Record<string, string>
}

export interface TypographySize {
  fontSize: string
  lineHeight: string
  letterSpacing?: string
}

export interface SpacingConfig {
  base: number
  scale: number[]
  responsive: {
    mobile: number
    tablet: number
    desktop: number
  }
}

export interface AnimationConfig {
  duration: Record<string, string>
  easing: Record<string, string>
  reducedMotion: boolean
  stagger: number
}

export interface ThemeA11yConfig {
  highContrast: boolean
  focusRing: {
    width: string
    color: string
    style: string
  }
  fontSize: {
    min: string
    max: string
    scale: number
  }
}

/**
 * Content configuration for dynamic text and media
 */
export interface ContentConfig {
  locale: string
  fallbackLocale: string
  rtl: boolean
  content: Record<string, ContentItem>
  images: ImageConfig
  icons: IconConfig
}

export interface ContentItem {
  text: string
  html?: string
  metadata?: Record<string, any>
  alternatives?: Record<string, string>
}

export interface ImageConfig {
  baseUrl: string
  formats: string[]
  qualities: number[]
  placeholder: 'blur' | 'empty'
  lazy: boolean
}

export interface IconConfig {
  defaultSize: number
  strokeWidth: number
  library: 'lucide' | 'heroicons' | 'custom'
}

/**
 * Accessibility configuration for comprehensive a11y support
 */
export interface AccessibilityConfig {
  announcements: boolean
  keyboardNavigation: KeyboardConfig
  screenReader: ScreenReaderConfig
  reducedMotion: boolean
  highContrast: boolean
  fontSize: FontSizeConfig
}

export interface KeyboardConfig {
  shortcuts: Record<string, KeyboardShortcut>
  focusManagement: FocusConfig
  skipLinks: SkipLinkConfig[]
}

export interface KeyboardShortcut {
  key: string
  modifiers: string[]
  action: () => void
  description: string
  global: boolean
}

export interface FocusConfig {
  trapInModals: boolean
  returnToTrigger: boolean
  skipHidden: boolean
  highlightOutline: boolean
}

export interface SkipLinkConfig {
  target: string
  label: string
  position: number
}

export interface ScreenReaderConfig {
  announcePageChanges: boolean
  announceErrors: boolean
  announceUpdates: boolean
  liveRegions: boolean
}

export interface FontSizeConfig {
  min: number
  max: number
  default: number
  step: number
  persistent: boolean
}

/**
 * Analysis-specific configuration types
 */
export interface AnalysisUIConfig {
  tabs: DynamicTabConfig[]
  sources: SourceDisplayConfig
  perspectives: PerspectiveDisplayConfig
  insights: InsightDisplayConfig
  responsive: AnalysisResponsiveConfig
}

export interface SourceDisplayConfig {
  maxVisible: number
  truncateLength: number
  showFavicons: boolean
  groupBySite: boolean
  sortBy: 'relevance' | 'date' | 'source'
}

export interface PerspectiveDisplayConfig {
  expandedByDefault: boolean
  maxKeyPoints: number
  showSentiment: boolean
  animateExpansion: boolean
  mobileStackLayout: boolean
}

export interface InsightDisplayConfig {
  highlightKeywords: boolean
  showCategories: boolean
  enableFiltering: boolean
  sortBy: 'importance' | 'type' | 'alphabetical'
}

export interface AnalysisResponsiveConfig {
  mobile: {
    tabsAsDropdown: boolean
    singleColumnLayout: boolean
    collapseSources: boolean
  }
  tablet: {
    twoColumnLayout: boolean
    sidebarSources: boolean
  }
  desktop: {
    threeColumnLayout: boolean
    fixedSidebar: boolean
  }
}

/**
 * Form configuration for dynamic form generation
 */
export interface FormConfig {
  fields: FormFieldConfig[]
  validation: ValidationConfig
  submission: SubmissionConfig
  accessibility: FormA11yConfig
}

export interface FormFieldConfig {
  key: string
  type: 'text' | 'email' | 'search' | 'textarea' | 'select' | 'radio' | 'checkbox'
  label: string
  placeholder?: string
  required: boolean
  validation: FieldValidation[]
  responsive: FormFieldResponsive
}

export interface FieldValidation {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
  value?: any
  message: string
}

export interface FormFieldResponsive {
  mobile: FormFieldSize
  tablet: FormFieldSize
  desktop: FormFieldSize
}

export interface FormFieldSize {
  width: string
  height: string
  fontSize: string
}

export interface ValidationConfig {
  validateOnChange: boolean
  validateOnBlur: boolean
  showErrorsOnSubmit: boolean
  errorDisplay: 'inline' | 'summary' | 'both'
}

export interface SubmissionConfig {
  showProgress: boolean
  preventDoubleSubmit: boolean
  resetOnSuccess: boolean
  redirectOnSuccess?: string
}

export interface FormA11yConfig {
  autoFocusFirst: boolean
  errorAnnouncements: boolean
  fieldDescriptions: boolean
  requiredFieldMarker: string
}

/**
 * Loading and error state configurations
 */
export interface LoadingStateConfig {
  type: 'spinner' | 'skeleton' | 'pulse' | 'dots'
  size: 'sm' | 'md' | 'lg'
  message?: string
  duration?: number
  showProgress?: boolean
}

export interface ErrorStateConfig {
  type: 'inline' | 'banner' | 'modal' | 'toast'
  severity: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  actions?: ErrorAction[]
  dismissible: boolean
  autoHide?: number
}

export interface ErrorAction {
  label: string
  action: () => void
  variant: 'primary' | 'secondary' | 'outline'
}

/**
 * Search configuration for dynamic search interfaces
 */
export interface SearchConfig {
  placeholder: string
  suggestions: SuggestionConfig
  filters: FilterConfig[]
  results: SearchResultConfig
  voice: VoiceSearchConfig
  mobile: SearchMobileConfig
}

export interface SuggestionConfig {
  enabled: boolean
  maxItems: number
  categories: string[]
  showHistory: boolean
  showTrending: boolean
}

export interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'checkbox' | 'range' | 'date'
  options?: FilterOption[]
  defaultValue?: any
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface SearchResultConfig {
  itemsPerPage: number
  showSnippets: boolean
  highlightMatches: boolean
  sortOptions: SortOption[]
  viewModes: ViewMode[]
}

export interface SortOption {
  key: string
  label: string
  direction: 'asc' | 'desc'
}

export interface ViewMode {
  key: string
  label: string
  icon: LucideIcon
  columns: number
}

export interface VoiceSearchConfig {
  enabled: boolean
  icon: LucideIcon
  languages: string[]
  continuous: boolean
}

export interface SearchMobileConfig {
  fullScreen: boolean
  swipeToClose: boolean
  voiceButtonSize: 'sm' | 'md' | 'lg'
}
