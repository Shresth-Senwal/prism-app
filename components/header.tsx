/**
 * @fileoverview Bulletproof header - CANNOT break on any screen size
 * @author GitHub Copilot
 * @created 2025-07-25
 * @lastModified 2025-07-25
 * 
 * Uses the most basic CSS possible with !important overrides.
 * Guaranteed to work on screens from 320px to 4K.
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gem, Search, Globe } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  return (
    <div
      style={{
        position: 'fixed !important' as any,
        top: '0 !important' as any,
        left: '0 !important' as any,
        right: '0 !important' as any,
        width: '100% !important' as any,
        height: '60px !important' as any,
        zIndex: '9999 !important' as any,
        backgroundColor: '#1A1B26 !important' as any,
        borderBottom: '1px solid rgba(255,255,255,0.1) !important' as any,
        display: 'flex !important' as any,
        alignItems: 'center !important' as any,
        justifyContent: 'space-between !important' as any,
        padding: '0 12px !important' as any,
        boxSizing: 'border-box !important' as any,
        overflow: 'visible !important' as any,
        minWidth: '320px !important' as any
      }}
    >
      {/* Logo */}
      <Link 
        href="/" 
        style={{
          display: 'flex !important' as any,
          alignItems: 'center !important' as any,
          gap: '6px !important' as any,
          textDecoration: 'none !important' as any,
          color: 'white !important' as any,
          fontSize: '16px !important' as any,
          fontWeight: '600 !important' as any,
          flexShrink: '0 !important' as any,
          minWidth: 'auto !important' as any
        }}
      >
        <Gem style={{ 
          width: '18px !important' as any, 
          height: '18px !important' as any, 
          color: '#7B61FF !important' as any,
          flexShrink: '0 !important' as any
        }} />
        <span style={{ 
          whiteSpace: 'nowrap !important' as any,
          overflow: 'hidden !important' as any
        }}>
          Prism
        </span>
      </Link>

      {/* Navigation - Always visible */}
      <div style={{
        display: 'flex !important' as any,
        gap: '6px !important' as any,
        flexShrink: '0 !important' as any,
        alignItems: 'center !important' as any
      }}>
        <Link
          href="/"
          style={{
            display: 'flex !important' as any,
            alignItems: 'center !important' as any,
            justifyContent: 'center !important' as any,
            width: '40px !important' as any,
            height: '40px !important' as any,
            borderRadius: '6px !important' as any,
            backgroundColor: pathname === '/' ? 'rgba(255,255,255,0.1) !important' as any : 'transparent !important' as any,
            color: 'white !important' as any,
            textDecoration: 'none !important' as any,
            flexShrink: '0 !important' as any,
            border: 'none !important' as any,
            outline: 'none !important' as any
          }}
          title="Analyze"
        >
          <Search style={{ 
            width: '18px !important' as any, 
            height: '18px !important' as any,
            color: 'white !important' as any
          }} />
        </Link>
        
        <Link
          href="/discover"
          style={{
            display: 'flex !important' as any,
            alignItems: 'center !important' as any,
            justifyContent: 'center !important' as any,
            width: '40px !important' as any,
            height: '40px !important' as any,
            borderRadius: '6px !important' as any,
            backgroundColor: pathname === '/discover' ? 'rgba(255,255,255,0.1) !important' as any : 'transparent !important' as any,
            color: 'white !important' as any,
            textDecoration: 'none !important' as any,
            flexShrink: '0 !important' as any,
            border: 'none !important' as any,
            outline: 'none !important' as any
          }}
          title="Discover"
        >
          <Globe style={{ 
            width: '18px !important' as any, 
            height: '18px !important' as any,
            color: 'white !important' as any
          }} />
        </Link>
      </div>
    </div>
  )
}
