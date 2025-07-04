/**
 * @fileoverview Footer component for pixel-perfect replication of the provided image
 * @author Cursor AI
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * 
 * This component renders a minimal footer.
 */

import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full bg-background/50 backdrop-blur-lg border-t border-white/10">
      <div className="container mx-auto flex h-16 items-center justify-center space-x-8">
        <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">
          About
        </Link>
        <Link href="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
          Privacy Policy
        </Link>
      </div>
    </footer>
  )
}
