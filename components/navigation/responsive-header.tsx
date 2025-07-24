/**
 * @fileoverview Mobile-first responsive navigation header with dynamic configuration
 * @author GitHub Copilot
 * @created 2025-07-24
 * @lastModified 2025-07-24
 *
 * Comprehensive responsive navigation system supporting desktop navigation only.
 * Mobile menu and all related code removed for clarity and to avoid conflicts.
 *
 * Dependencies:
 * - framer-motion: Animation and gesture handling
 * - next/navigation: Routing and pathname detection
 * - lib/ui-config: Configuration management
 * - hooks/use-mobile: Device detection
 *
 * Usage:
 * - Replace existing header component
 * - Automatically adapts to screen size
 * - Supports dynamic navigation configuration
 *
 * Related files:
 * - lib/ui-config.ts (configuration)
 * - types/ui-config.ts (type definitions)
 * - hooks/use-mobile.tsx (mobile detection)
 */

"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { defaultNavigationConfig, getDynamicNavigation } from '@/lib/ui-config'

/**
 * Enhanced header component with mobile-first responsive design
 */
interface ResponsiveHeaderProps {
  config?: any;
  className?: string;
  children?: React.ReactNode;
}
export function ResponsiveHeader({ config: headerConfig = defaultNavigationConfig, className, children }: ResponsiveHeaderProps) {
  const pathname = usePathname();
  const dynamicConfig = getDynamicNavigation(pathname, headerConfig);
  return (
    <header className={cn(
      "sticky top-0 left-0 right-0 z-40 transition-all duration-300",
      "bg-background/80 backdrop-blur-lg border-b",
      "border-border shadow-lg",
      className
    )} role="banner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Brand/Logo */}
          <Link
            href={headerConfig.brand.href}
            className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
            aria-label={headerConfig.brand.ariaLabel}
          >
            <headerConfig.brand.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              {headerConfig.brand.name}
            </span>
          </Link>
          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center space-x-8"
            role="navigation"
            aria-label={headerConfig.accessibility.navigationLandmark}
          >
            {dynamicConfig.items
              .filter(item => !item.mobileOnly)
              .map((item) => (
                <DesktopNavItem
                  key={item.key}
                  item={item}
                  pathname={pathname}
                />
              ))}
          </nav>
          {/* Additional content slot */}
          {children}
        </div>
      </div>
    </header>
  );
}

function DesktopNavItem({ item, pathname }: { item: any, pathname: string }) {
  const isActive = item.isActive?.(pathname) ?? false;
  return (
    <Link
      href={item.href}
      className={cn(
        "relative text-sm font-medium transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-3 py-2",
        "hover:text-primary",
        isActive 
          ? "text-primary font-semibold" 
          : "text-muted-foreground"
      )}
      aria-label={item.ariaLabel}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="flex items-center gap-2">
        {item.icon && <item.icon className="h-4 w-4" />}
        {item.label}
      </span>
    </Link>
  );
}


