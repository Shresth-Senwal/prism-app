/**
 * @fileoverview Tailwind CSS configuration with pixel-perfect replication of the provided image
 * @author Cursor AI
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * 
 * This configuration implements a precise color scheme to match the provided design:
 * - Background: Very dark desaturated purple/blue (#1A1B26)
 * - Primary Text: Pure white (#FFFFFF) for main headings and navigation
 * - Secondary Text: Light gray (#E0E0E0) for sub-headings and placeholders
 * - Input Field Background: Pure white (#FFFFFF)
 * - Input Field Border: Light gray (#E0E0E0)
 * - Accent/Primary Interactive: Vibrant purple (#7B61FF)
 * 
 * Dependencies:
 * - tailwindcss-animate: For accordion and other UI animations
 * 
 * Usage:
 * - Provides consistent color system across all components
 * - Supports both light and dark mode variations
 * - Integrates with shadcn/ui component system
 */

import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // New translucent colors for glassmorphism effect
        "surface-glass": "rgba(45, 46, 59, 0.2)", // Semi-transparent dark gray for surfaces
        "border-glass": "rgba(255, 255, 255, 0.1)", // Subtle transparent white for borders
        "accent-glass": "rgba(123, 97, 255, 0.1)", // Transparent accent for highlights

        // CSS variable-based colors for dynamic theming
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // New color scheme implementation for pixel-perfect replication
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        primary: {
          DEFAULT: "#7B61FF", // Vibrant purple for interactive elements
          foreground: "#FFFFFF", // Pure white text on purple background
        },
        
        secondary: {
          DEFAULT: "#2D2E3B", // Dark gray for secondary elements
          foreground: "#FFFFFF", // Pure white text on dark gray
        },
        
        // Destructive colors (errors, warnings)
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        
        // Muted colors for subtle elements
        muted: {
          DEFAULT: "#2D2E3B", // Dark gray for muted backgrounds
          foreground: "#E0E0E0", // Light gray for secondary text and placeholders
        },
        
        // Accent colors for highlights and emphasis
        accent: {
          DEFAULT: "#363749", // Slightly lighter gray for accents
          foreground: "#FFFFFF", // Pure white text on accent background
        },
        
        // Popover and modal backgrounds
        popover: {
          DEFAULT: "#1A1B26", // Same as main background
          foreground: "#FFFFFF", // Pure white text
        },
        
        // Card backgrounds
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Additional high-contrast text colors for special use cases
        textSecondary: "#E1E4E8", // High-contrast secondary text (90% lightness)
        textTertiary: "#C4C7D0", // Medium-contrast tertiary text (85% lightness)
        textMuted: "#A8ABB8", // Minimum acceptable contrast muted text (80% lightness)
      },
      
      // Typography configuration
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      
      // Border radius system
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // Animation keyframes for UI interactions
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      
      // Animation definitions
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
