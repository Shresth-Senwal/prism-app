/**
 * @fileoverview Header component for pixel-perfect replication of the provided image
 * @author Cursor AI
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * 
 * This component renders the header with the Prism logo on the left and navigation
 * links on the right, with a subtle underline for the active link.
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gem } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 left-0 right-0 z-50 header-glass">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Gem className="h-6 w-6 text-primary" />
          <span className="font-sans text-xl font-semibold text-white">Prism</span>
        </Link>

        <nav className="flex items-center space-x-8">
          <Link
            href="/"
            className={`text-sm font-medium text-white relative ${
              pathname === "/" ? "font-semibold" : ""
            }`}
          >
            Analyze
            {pathname === "/" && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full" />}
          </Link>
          <Link
            href="/discover"
            className={`text-sm font-medium text-white relative ${
              pathname === "/discover" ? "font-semibold" : ""
            }`}
          >
            Discover
            {pathname === "/discover" && (
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full" />
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
