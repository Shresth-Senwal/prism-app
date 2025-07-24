/**
 * @fileoverview Clean header with mobile dropdown navigation
 * @author GitHub Copilot
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * 
 * Simple header with a nice mobile-friendly dropdown menu.
 * No sliding panels or complex overlays - just a clean dropdown.
 * 
 * Features:
 * - Logo on the left
 * - Desktop: Navigation links on the right
 * - Mobile: Hamburger menu with dropdown below header
 * - Clean animations and mobile-friendly design
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Gem, Menu, X, Search, Globe } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navigationItems = [
    {
      label: 'Analyze',
      href: '/',
      icon: Search,
      isActive: pathname === '/'
    },
    {
      label: 'Discover', 
      href: '/discover',
      icon: Globe,
      isActive: pathname === '/discover'
    }
  ]

  return (
    <header className="sticky top-0 left-0 right-0 z-50 header-glass pointer-events-auto">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Gem className="h-6 w-6 text-primary" />
          <span className="font-sans text-xl font-semibold text-white">Prism</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-white relative transition-colors hover:text-white/80",
                  item.isActive ? "font-semibold" : ""
                )}
              >
                {item.label}
                {item.isActive && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-white/80 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border shadow-lg">
          <div className="container py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full",
                    item.isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-base">{item.label}</span>
                  {item.isActive && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
