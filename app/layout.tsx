/**
 * @fileoverview Root layout with dynamic, mobile-first navigation
 * @author GitHub Copilot
 * @created 2024-12-19
 * @lastModified 2025-01-27
 * 
 * Updated to use the new responsive header component with dynamic navigation,
 * mobile-first design, and consistent theming throughout the application.
 */

import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { ResponsiveHeader } from "@/components/navigation/responsive-header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Prism - AI-Powered Topic Analysis",
  description: "Get comprehensive, multi-perspective analysis of any topic with AI-powered insights from multiple perspectives.",
  keywords: ["AI analysis", "topic analysis", "multiple perspectives", "research tool"],
  authors: [{ name: "Prism AI" }],
  creator: "Prism AI",
  openGraph: {
    title: "Prism - AI-Powered Topic Analysis",
    description: "Get comprehensive, multi-perspective analysis of any topic",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prism - AI-Powered Topic Analysis",
    description: "Get comprehensive, multi-perspective analysis of any topic",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ResponsiveHeader />
          <main className="flex-1 flex flex-col" id="main-content">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
