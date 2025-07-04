/**
 * @fileoverview Root layout for pixel-perfect replication of the provided image
 * @author Cursor AI
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * 
 * This file sets up the root layout with the Inter font for a modern, clean look.
 */

import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Prism - AI-Powered Topic Analysis",
  description: "Get comprehensive, multi-perspective analysis of any topic.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
