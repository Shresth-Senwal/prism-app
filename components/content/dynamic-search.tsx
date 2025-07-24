/**
 * @fileoverview Mobile-first responsive search component with dynamic configuration
 * @author GitHub Copilot
 * @created 2025-07-24
 * @lastModified 2025-07-24
 *
 * Comprehensive search interface supporting mobile-first design, voice search,
 * suggestions, accessibility, and dynamic configuration. Built with progressive
 * enhancement from mobile to desktop experiences.
 *
 * Dependencies:
 * - framer-motion: Animation and gesture handling
 * - next/navigation: Routing for search results
 * - lib/ui-config: Configuration management
 * - hooks/use-mobile: Device detection
 *
 * Usage:
 * - Replace existing search interfaces
 * - Provides voice search on supported devices
 * - Shows dynamic suggestions and history
 * - Fully accessible and responsive
 *
 * Related files:
 * - lib/ui-config.ts (search configuration)
 * - types/ui-config.ts (type definitions)
 */

"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Fuse from 'fuse.js'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Mic, MicOff, X, TrendingUp, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsMobile } from '@/hooks/use-mobile'
import { 
  defaultSearchConfig, 
  prefersReducedMotion,
  getLoadingConfig,
  getErrorConfig
} from '@/lib/ui-config'
import { SearchConfig, LoadingStateConfig, ErrorStateConfig } from '@/types/ui-config'
import { cn } from '@/lib/utils'

/**
 * Dynamic search interface with mobile-first responsive design
 */
interface DynamicSearchProps {
  config?: SearchConfig
  onSearch?: (query: string) => Promise<void> | void
  onSuggestionClick?: (suggestion: string) => void
  className?: string
  placeholder?: string
  autoFocus?: boolean
  disabled?: boolean
}

export function DynamicSearch({
  config = defaultSearchConfig,
  onSearch,
  onSuggestionClick,
  className,
  placeholder,
  autoFocus = false,
  disabled = false
}: DynamicSearchProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  // Build a corpus for fuzzy search: combine categories, history, and trending
  const [searchCorpus, setSearchCorpus] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [fuse, setFuse] = useState<Fuse<string> | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isVoiceSupported, setIsVoiceSupported] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const corpus = [
      ...config.suggestions.categories,
      ...searchHistory,
      // Add more static topics if desired
    ]
    setSearchCorpus(corpus)
    setFuse(new Fuse(corpus, {
      includeScore: true,
      threshold: 0.4, // Lower is stricter, higher is fuzzier
    }))
  }, [config.suggestions.categories, searchHistory])

  // Check for voice search support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsVoiceSupported(!!SpeechRecognition && config.voice.enabled)
    
    if (SpeechRecognition && config.voice.enabled) {
      const recognition = new SpeechRecognition()
      recognition.continuous = config.voice.continuous
      recognition.interimResults = true
      recognition.lang = config.voice.languages[0] || 'en-US'
      
      recognition.onstart = () => setIsVoiceActive(true)
      recognition.onend = () => setIsVoiceActive(false)
      recognition.onerror = (event: any) => {
        setIsVoiceActive(false)
        setError('Voice recognition failed. Please try typing instead.')
      }
      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1]
        if (result.isFinal) {
          setQuery(result[0].transcript)
          setIsVoiceActive(false)
        }
      }
      
      recognitionRef.current = recognition
    }
  }, [config.voice])

  // Load search history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('search-history')
      if (history) {
        setSearchHistory(JSON.parse(history).slice(0, 5))
      }
    }
  }, [])

  // Generate suggestions based on query
  const generateSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2 || !fuse) {
      setSuggestions([])
      return
    }
    // Use Fuse.js for fuzzy suggestions
    const fuseResults = fuse.search(searchQuery)
    const fuzzySuggestions = fuseResults
      .map(result => result.item)
      .filter((item, idx, arr) => arr.indexOf(item) === idx) // dedupe
      .slice(0, config.suggestions.maxItems)
    setSuggestions(fuzzySuggestions)
  }, [fuse, config.suggestions.maxItems])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    setError(null)
    
    if (config.suggestions.enabled) {
      generateSuggestions(newQuery)
      setShowSuggestions(newQuery.length > 0)
    }
  }

  // Handle search submission
  const handleSearch = async (searchQuery?: string) => {
    let finalQuery = searchQuery || query
    if (!finalQuery.trim()) {
      setError('Please enter a topic to analyze')
      return
    }

    // Fuzzy-correct the query if it's not an exact match
    if (fuse && !searchCorpus.includes(finalQuery)) {
      const fuseResults = fuse.search(finalQuery)
      if (fuseResults.length > 0) {
        finalQuery = fuseResults[0].item
      }
    }

    setIsLoading(true)
    setError(null)
    setShowSuggestions(false)

    try {
      // Save to search history
      const updatedHistory = [finalQuery, ...searchHistory.filter(item => item !== finalQuery)].slice(0, 5)
      setSearchHistory(updatedHistory)
      localStorage.setItem('search-history', JSON.stringify(updatedHistory))

      if (onSearch) {
        await onSearch(finalQuery)
      } else {
        // Default behavior: navigate to analysis page
        router.push(`/analysis?topic=${encodeURIComponent(finalQuery)}`)
      }
    } catch (err: any) {
      setError(err.message || 'Search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    
    if (onSuggestionClick) {
      onSuggestionClick(suggestion)
    } else {
      handleSearch(suggestion)
    }
  }

  // Handle voice search
  const handleVoiceSearch = () => {
    if (!isVoiceSupported || !recognitionRef.current) return

    if (isVoiceActive) {
      recognitionRef.current.stop()
    } else {
      setError(null)
      recognitionRef.current.start()
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestions])

  // Auto-focus input
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  }

  const suggestionsVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  }

  const suggestionItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: prefersReducedMotion() ? 0 : i * 0.05
      }
    })
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("relative w-full max-w-3xl", className)}
    >
      {/* Main Search Input */}
      <div className="relative">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch() }}
          className={cn(
            "relative flex items-center",
            "bg-background/80 backdrop-blur-md border border-border",
            "rounded-full overflow-hidden shadow-lg",
            "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
            "transition-all duration-300",
            isMobile ? "h-14" : "h-16",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {/* Search Icon */}
          <div className="pl-6 pr-3 flex-shrink-0">
            <Search className={cn(
              "text-muted-foreground transition-colors",
              isMobile ? "h-5 w-5" : "h-6 w-6"
            )} />
          </div>

          {/* Input Field */}
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => config.suggestions.enabled && setShowSuggestions(true)}
            placeholder={placeholder || config.placeholder}
            disabled={disabled || isLoading}
            className={cn(
              "flex-1 bg-transparent border-none shadow-none",
              "focus:outline-none focus:ring-0 h-full",
              "text-foreground placeholder:text-muted-foreground",
              isMobile ? "text-base px-2" : "text-lg px-4"
            )}
            aria-label="Search topics"
            aria-describedby={error ? "search-error" : undefined}
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
            autoComplete="off"
          />

          {/* Clear Button */}
          {query && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setQuery('')
                setSuggestions([])
                setShowSuggestions(false)
                inputRef.current?.focus()
              }}
              className="mr-2 h-8 w-8 hover:bg-muted"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Voice Search Button */}
          {isVoiceSupported && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleVoiceSearch}
              disabled={disabled || isLoading}
              className={cn(
                "mr-2 transition-colors",
                isMobile ? "h-10 w-10" : "h-12 w-12",
                isVoiceActive && "text-red-500 bg-red-50 hover:bg-red-100"
              )}
              aria-label={isVoiceActive ? "Stop voice search" : "Start voice search"}
            >
              {isVoiceActive ? (
                <MicOff className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
              ) : (
                <Mic className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
              )}
            </Button>
          )}

          {/* Search Button */}
          <Button
            type="submit"
            disabled={disabled || isLoading || !query.trim()}
            className={cn(
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "rounded-full flex-shrink-0 transition-all duration-300",
              isMobile ? "h-12 w-12 mr-1" : "h-14 w-14 mr-1"
            )}
            aria-label="Search"
          >
            {isLoading ? (
              <Loader2 className={cn(
                "animate-spin",
                isMobile ? "h-5 w-5" : "h-6 w-6"
              )} />
            ) : (
              <Search className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
            )}
          </Button>
        </form>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 px-6"
          >
            <div
              id="search-error"
              className="text-red-500 text-sm bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-800"
              role="alert"
            >
              {error}
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
          <motion.div
            ref={suggestionsRef}
            variants={suggestionsVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <Card className="border border-border shadow-lg bg-background/95 backdrop-blur-md">
              <CardContent className="p-4">
                
                {/* Search History */}
                {config.suggestions.showHistory && searchHistory.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Recent</span>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.slice(0, 3).map((item, index) => (
                        <motion.button
                          key={`history-${index}`}
                          custom={index}
                          variants={suggestionItemVariants}
                          initial="hidden"
                          animate="visible"
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                        >
                          {item}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Suggestions</span>
                    </div>
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={`suggestion-${index}`}
                          custom={index + searchHistory.length}
                          variants={suggestionItemVariants}
                          initial="hidden"
                          animate="visible"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Categories */}
                {config.suggestions.showTrending && config.suggestions.categories.length > 0 && query.length === 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Trending Topics</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {config.suggestions.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleSuggestionClick(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Recognition Indicator */}
      {isVoiceActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4"
        >
          <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Mic className="h-6 w-6 text-red-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute inset-0 rounded-full bg-red-500/20"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-red-700 dark:text-red-300">
                  Listening...
                </div>
                <div className="text-xs text-red-600 dark:text-red-400">
                  Speak clearly or tap to stop
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

// Extend the Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
