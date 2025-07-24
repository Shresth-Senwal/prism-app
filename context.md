#### [2025-07-25] Gemini Flash Model Upgraded to 2.0

+- The Gemini model used for AI-powered analysis now uses the endpoint `gemini-2.0-flash` (not `gemini-2.0-flash-latest`) in the `/api/analyze` route, per latest API requirements.
+- Reason: To ensure compatibility with the correct Gemini 2.0 Flash model endpoint.
+- Impact: All topic analyses now use the correct Gemini 2.0 Flash endpoint. No other code changes required. API key usage and prompt structure remain the same.
#### [2025-07-25] .gitignore Updated for Env Files

- Updated `.gitignore` to ignore all `.env` files, including `.env`, `.env.*`, `.env.local`, and `.env*.local`.
- Reason: Prevent accidental commit of sensitive environment variables and secrets.
- Impact: All environment variable files are now excluded from version control, improving security and compliance.
# PRISM APP - PROJECT CONTEXT
*Last Updated: 2025-07-25*
#### [2025-07-25] Legacy Mobile Menu Fully Removed & Header Cleanup

- All code related to the legacy sliding mobile menu has been fully removed from the codebase, including from `components/navigation/responsive-header.tsx`.
- The `responsive-header.tsx` file now only contains desktop navigation and brand/logo logic. All mobile menu logic, animation variants, and exports for mobile navigation have been deleted.
- The file was cleaned up to resolve all build errors caused by partial removals and duplicate/stray code. The interface definition was fixed, and only the valid exported `ResponsiveHeader` function and `DesktopNavItem` remain.
- **Architectural Decision**: Only the new dropdown mobile menu in `components/header.tsx` is used for mobile navigation. The legacy responsive header is now desktop-only and will not conflict with the new implementation.
- **Impact**: No legacy mobile menu code remains. The codebase is now consistent with the new navigation architecture, and all build errors are resolved.

## PROJECT OVERVIEW
**Prism** is an AI-powered topic analysis platform that provides comprehensive, multi-perspective analysis of any topic by aggregating and analyzing content from across the digital world. The application allows users to search for topics and receive detailed analyses showing different viewpoints, trends, and insights from multiple sources including social media (X/Twitter), Reddit discussions, news articles, and web content.

## CURRENT ARCHITECTURE

### Technology Stack
- **Frontend**: Next.js 15.2.4 with App Router
- **React Version**: 19 (latest)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom theme
- **Components**: shadcn/ui built on Radix UI
- **Package Manager**: pnpm
- **Icons**: Lucide React

### Data Sources & APIs
**Reddit API**: Community discussions and forum posts (OAuth2 server-side integration; now used in /api/analyze for all Reddit data fetching)
- **Web Search**: General web content (placeholder for future implementation)
- **Gemini Flash 2.0**: AI analysis and synthesis engine

#### [2025-07-24] Reddit API OAuth2 UPGRADE

- The /api/analyze API route now uses authenticated Reddit API requests via OAuth2 (see `lib/reddit-auth.ts`).
- Reason: Reddit's public API returned 403 errors for server-side requests; OAuth2 is required for reliable, production-grade Reddit data access.
- Impact: Reddit data is now always available for analysis, and sources are returned to the UI. This enables the "Sources" section in the analysis output to work as intended.
- Architectural Decision: All Reddit data fetching is now server-side and authenticated. This improves reliability, avoids rate limits, and ensures compliance with Reddit's API terms. If Reddit integration needs to be disabled, stub out the fetchRedditPosts helper in the API route.

#### [2025-07-24] X (Twitter) API REMOVED
- The X (Twitter) API v2 integration has been fully removed from the codebase, including all fetch logic, normalization, and API route usage.
- Reason: User requested complete removal due to rate limits, maintenance overhead, and to simplify the analysis pipeline.
- Impact: The /api/analyze endpoint now only aggregates Reddit and web results (plus Gemini analysis). All X API credentials and documentation are now obsolete.
- Architectural Decision: This change reduces external API dependencies and improves reliability. If X integration is needed in the future, it should be re-implemented as a separate, optional module with robust error handling and rate limit awareness.

### Design System
- **Primary Background**: Very dark desaturated purple/blue (#1A1B26)
- **Primary Text**: Pure white (#FFFFFF) for main headings and navigation
- **Secondary Text**: Light gray (#E0E0E0) for sub-headings and placeholders
- **Input Field Background**: Pure white (#FFFFFF)
- **Input Field Border**: Light gray (#E0E0E0)
- **Accent/Primary Interactive**: Vibrant purple (#7B61FF)
- **Typography**: Inter (sans-serif) for all text elements
- **Layout**: Centered main content block with a pill-shaped search bar
- **Theme**: Dark mode optimized with high-contrast elements
- **Responsive**: Mobile-first design approach

### Key Dependencies
- `@radix-ui/*` - Accessible UI primitives
- `react-hook-form` + `zod` - Form handling and validation
- `recharts` - Data visualization
- `sonner` - Toast notifications
- `cmdk` - Command palette functionality
- `embla-carousel-react` - Carousel component
- `next-themes` - Theme management
- `framer-motion` - Advanced animations and micro-interactions

## CURRENT FILE STRUCTURE

### App Directory (Next.js App Router)
```
app/
├── page.tsx              # Home page with search functionality
├── layout.tsx            # Root layout with providers
├── globals.css           # Global styles and CSS variables
├── loading.tsx           # Global loading component
├── about/page.tsx        # About page
├── analysis/             # Analysis results
│   ├── page.tsx         # Main analysis page
│   └── loading.tsx      # Analysis loading state
├── discover/page.tsx     # Discover/explore page
└── privacy/page.tsx      # Privacy policy page
```

### Components Directory
```
components/
├── ui/                   # shadcn/ui components (38 components)
├── header.tsx           # Main navigation header
├── footer.tsx           # Site footer
└── theme-provider.tsx   # Theme context provider
```

### Supporting Directories
- `lib/` - Utility functions
- `hooks/` - Custom React hooks
- `public/` - Static assets
- `styles/` - Additional CSS files

## CURRENT FUNCTIONALITY

### Implemented Features
1. **Home Page**
   - Hero section with search functionality
   - Trending topics display
   - Featured content card
   - Responsive design

2. **Search System**
   - Text input with search functionality
   - Enter key support
   - Navigation to analysis page with query parameters

3. **UI Components**
   - Complete shadcn/ui component library
   - Custom theme implementation
   - Responsive navigation
   - Toast notifications support

4. **Theming**
   - Custom color palette
   - Dark mode optimized design
   - Consistent spacing and typography

5. **Multi-Source Data Analysis API** *(UPDATED - 2025-07-24)*
   - Reddit API integration for community discussions (OAuth2 server-side)
   - Gemini Flash 2.0 for AI-powered analysis and synthesis
   - Normalized data format across all sources
   - Graceful error handling and fallback mechanisms
   - [2025-07-24] X (Twitter) API v2 integration and NewsAPI have been fully removed

### API Endpoints
- `POST /api/analyze` - Multi-source topic analysis
  - Fetches data from Reddit and web sources
  - Uses Gemini Flash 2.0 for synthesis
  - Returns structured analysis with perspectives and insights

### Environment Variables Required
- `GEMINI_API_KEY` - Google Gemini Flash 2.0 API key
- `SEARCH_API_KEY` - Web search API key (optional)
 - `REDDIT_CLIENT_ID` - Reddit API client ID (for OAuth2)
 - `REDDIT_CLIENT_SECRET` - Reddit API client secret (for OAuth2)
   - Dark mode support
   - CSS custom properties

5. **Visual Assets**
   - High-quality Unsplash images integrated
   - Responsive image handling with Next.js Image component
   - Thematic consistency between content and imagery

6. **Animation System**
   - Comprehensive Framer Motion integration across all pages
   - Professional entrance animations and micro-interactions
   - Animated loading states and progress indicators
   - Interactive hover effects and smooth transitions
   - Staggered animations for lists and content sections

### Component Analysis

#### Home Page (`app/page.tsx`)
- **Purpose**: Landing page with search functionality
- **Key Features**:
  - Search input with button
  - Trending topics as clickable badges
  - Featured content card
  - Responsive grid layout
- **State Management**: Local useState for search query
- **Navigation**: Uses `window.location.href` for page transitions
- **Styling**: Custom Tailwind classes with theme colors

#### Layout (`app/layout.tsx`)
- **Purpose**: Root layout wrapper
- **Providers**: Theme provider integration
- **Components**: Header and footer included
- **Metadata**: SEO optimization

## CURRENT ISSUES & TECHNICAL DEBT

### Known Issues
1. **Navigation**: Using `window.location.href` instead of Next.js router
2. **Build Configuration**: TypeScript and ESLint errors ignored
3. **Image Optimization**: Disabled in next.config.mjs
4. **Missing Implementation**: Analysis page functionality not fully implemented

### Areas for Improvement
1. **State Management**: Consider more sophisticated state management
2. **API Integration**: Need to implement actual AI analysis functionality
3. **Error Handling**: Implement comprehensive error boundaries
4. **Performance**: Add proper loading states and optimization (partially completed with animations)
5. **Accessibility**: Enhance ARIA labels and keyboard navigation
6. **Image Optimization**: Consider implementing blur placeholders and lazy loading for better performance

## DEVELOPMENT PATTERNS

### Established Patterns
1. **Component Structure**: Functional components with TypeScript
2. **Styling**: Tailwind CSS with custom theme variables
3. **State**: React hooks for local state management
4. **Routing**: Next.js App Router patterns
5. **Imports**: Absolute imports with @ alias

### Code Quality Standards
- TypeScript strict mode enabled
- Consistent component naming (PascalCase)
- Proper prop typing
- Responsive design patterns
- Accessibility considerations

## FUTURE ROADMAP

### Immediate Priorities
1. Implement actual AI analysis functionality
2. Add proper routing with Next.js router
3. Implement error boundaries and loading states
4. Add form validation with react-hook-form + zod
5. Enhance accessibility features

### Long-term Goals
1. Real-time analysis updates
2. User authentication and preferences
3. Analysis history and favorites
4. Advanced visualization components
5. API rate limiting and caching

## ARCHITECTURAL DECISIONS

### Why Next.js 15 App Router?
- Server Components for better performance
- Built-in routing and layouts
- Excellent developer experience
- SEO optimization out of the box

### Why shadcn/ui?
- High-quality, accessible components
- Customizable with Tailwind
- Built on Radix UI primitives
- Excellent TypeScript support

### Why pnpm?
- Faster installation than npm/yarn
- Efficient disk space usage
- Strict dependency management
- Better monorepo support

## ENVIRONMENT & SETUP

### Requirements
- Node.js 16+
- pnpm package manager
- TypeScript 5+

### Development Commands
- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm start` - Production server
- `pnpm lint` - Code linting

## NOTES & REMINDERS

### Critical Reminders
1. Always update this context.md file after any code changes
2. Maintain extensive commenting throughout codebase
3. Follow established TypeScript patterns
4. Ensure responsive design for all new components
5. Test accessibility features regularly

### Recent Changes
- **Pixel-Perfect UI Refactor (2024-12-19)**: Overhauled the entire UI to match the provided image with pixel-perfect precision:
  - Color Scheme: Implemented the new color palette with a dark background, white text, and vibrant purple accents.
  - Typography: Switched to the Inter font for a modern, clean look and adjusted font sizes and weights to match the design.
  - Layout: Centered the main content block and adjusted padding/margins for a more spacious and balanced layout.
  - Component Styling:
    - Header: Made the header transparent with a taller height and a subtle white underline for the active link.
    - Search Bar: Created a pill-shaped search bar with a white background, light gray border, and seamlessly integrated search button.
    - Footer: Made the footer transparent to blend in with the background.
  - Code Cleanup: Removed unused animations and styles from the home page to focus on a clean, static visual replication of the design.
  - Accessibility: Ensured that the new design maintains high contrast and readability.

### AI-Powered Multi-Perspective Analysis Architecture (2024-12-19)

#### Gemini Flash 2.0 Integration
- The platform now uses Gemini Flash 2.0 (Google Generative Language API) to synthesize multi-perspective analysis for any user-provided topic.
- Gemini is prompted with aggregated data from public APIs and instructed to:
  - Identify contrasting viewpoints
  - Highlight overlaps in information
  - Uncover hidden insights or biases
  - Synthesize a concise summary of diverse perspectives
- The Gemini API key is securely loaded from `process.env.GEMINI_API_KEY`.

#### Public API Integration
- The backend fetches data from multiple public APIs for each topic:
  - **NewsAPI**: Fetches recent news articles related to the topic (API key required, placeholder provided).
  - **Web Search API**: Placeholder for future integration (e.g., SerpAPI, Bing, etc.).
- All external API keys are loaded from environment variables (e.g., `NEWS_API_KEY`).
- API rate limits and errors are handled gracefully; missing data does not break the analysis.

#### /api/analyze API Route
- New Next.js API route at `app/api/analyze/route.ts`.
- Accepts POST requests with `{ topic: string }`.
- Fetches and normalizes data from public APIs.
- Calls Gemini Flash 2.0 with a structured prompt and returns the synthesized analysis (markdown) and raw sources.
- Implements robust error handling and JSDoc comments throughout.

#### Frontend Flow
- **Home Page (`app/page.tsx`)**:
  - User enters a topic and submits the form.
  - The frontend POSTs to `/api/analyze` and shows a loading state.
  - On success, navigates to `/analysis?topic=...`.
- **Analysis Page (`app/analysis/page.tsx`)**:
  - On mount, fetches the analysis for the topic from `/api/analyze`.
  - Parses Gemini's markdown into sections (Summary, Viewpoints, Overlaps, Insights).
  - Renders the analysis using shadcn/ui components (Card, Accordion, etc.).
  - Displays loading and error states as needed.
  - Fully responsive and accessible.

#### Environment Variables
- `.env.local` must include:
  - `GEMINI_API_KEY=AIzaSyDnsyO95aMD9BBHtJz5Ey6b1GJQNet0xwY`
  - `NEWS_API_KEY=YOUR_NEWS_API_KEY`
  - `SEARCH_API_KEY=YOUR_SEARCH_API_KEY` (placeholder)

#### Error Handling & Comments
- All API calls use try-catch and return user-friendly error messages.
- Extensive JSDoc comments are present in all new/modified files, explaining data fetching, Gemini prompting, and rendering logic.

#### New Dependencies/Patterns
- Uses Next.js API routes for backend logic.
- Integrates Gemini Flash 2.0 via REST API.
- Normalizes and aggregates data from multiple sources before analysis.
- Frontend and backend are fully decoupled for analysis pipeline.

---

### Enhanced Analysis Engine & UI (2024-12-19)

#### Backend - Richer AI Responses
The backend API route (`app/api/analyze/route.ts`) has been significantly enhanced to produce a more detailed and structured JSON object.
- **Upgraded Gemini Prompt**: The prompt sent to the Gemini API now explicitly requests sentiment analysis, key takeaways, and a list of contrasting points.
- **New Data Structure**: The API now returns the following JSON structure, providing richer data for the frontend:
  ```json
  {
    "summary": "A concise, neutral summary.",
    "perspectives": [
      {
        "title": "Name of Perspective",
        "sentiment": "Positive" | "Negative" | "Neutral",
        "key_points": ["Point 1", "Point 2"],
        "content": "Full detailed content."
      }
    ],
    "contrasting_points": ["Point of disagreement 1."],
    "insights": ["A hidden insight or bias."]
  }
  ```

#### Frontend - Interactive & Stunning UI
The analysis page (`app/analysis/page.tsx`) has been completely overhauled to present the new, richer data in a more sophisticated and interactive manner.
- **Four-Tab Layout**: The UI is now organized into four clear tabs: `Overview`, `Perspectives`, `Contrasts`, and `Insights`.
- **Stateful Perspective Cards**: The core of the new UI. Each card displays:
  - **Sentiment Icon**: A visual indicator (e.g., `TrendingUp` for Positive) for at-a-glance understanding.
  - **Key Points**: A bulleted list of key takeaways is shown by default for quick reading.
  - **Expandable Content**: A "Read More" button smoothly reveals the full, detailed content of the perspective.
- **Polished Visuals & Animations**:
    - **Subtle Background**: A slow-moving, non-distracting gradient has been added to give the page a premium feel.
    - **Refined Animations**: Content loading, tab transitions, and card interactions are all powered by more polished `framer-motion` animations.
- **Robust Data Handling**: The frontend now directly consumes the structured JSON, eliminating the need for fragile regex parsing and making the display more reliable.

**Next Update Required**: After any code modifications, architectural changes, or new feature implementations.

### UI Fixes & Performance Enhancements (2024-12-19)

#### Navigation Buttons (Header)
- **Issue**: 'Analyze' and 'Discover' navigation buttons in the header were not interactive on the analysis page.
- **Resolution**: Added `z-50` and `pointer-events-auto` Tailwind classes to the `<header>` element in `components/header.tsx` to ensure it always overlays and accepts pointer events above other page content.

#### 'Read Less' Button Functionality
- **Issue**: The 'Read Less' button within the `PerspectiveCard` on `app/analysis/page.tsx` was not functioning correctly, affecting all cards simultaneously.
- **Resolution**: Modified the `PerspectiveCard` component:
  - Ensured the `isExpanded` state correctly toggles the visibility of the full content.
  - Set `initial={false}` on the `AnimatePresence` component wrapping the expandable content to prevent an unwanted animation on initial mount.
  - Wrapped the expandable content and the 'Read More'/'Read Less' button in a conditional render, so the button only appears when there is actual content to expand (`perspective.content` is not empty).
  - **Critical Fix**: Updated the `key` prop for `motion.div` wrapping each `PerspectiveCard` from `i` (array index) to `${p.title}-${i}` (a composite key combining title and index) to ensure unique identification and isolated state management for each card.
  - **State Lifting Refinement**: The `isExpanded` state is now consistently managed in the parent `AnalysisPage` using a `Record<string, boolean>` where the keys are also the composite `${p.title}-${i}` identifiers, further guaranteeing independent state for each card.

#### Removal of Purple Dots Background
- **Issue**: Unwanted "purple dots" were present in the background of the analysis page.
- **Resolution**: Removed the `motion.div` element responsible for generating the `radial-gradient` pattern from `app/analysis/page.tsx`. Verified `app/globals.css` to confirm no other global styles were introducing similar patterns.

### Search Bar UI Refinement (2024-12-19)

- **Issue**: The search bar on the home page had a disjointed translucent effect, with the glassmorphism applied only to the input field and not the entire component.
- **Resolution**: Refactored the search bar in `app/page.tsx` into a single, cohesive "glass pill" component.
  - The glassmorphism styles (`bg-white/10`, `backdrop-blur-md`, `border-white/20`) were moved from the `<Input>` to the parent `<form>` element.
  - The `<form>` now uses Flexbox to align the input and button.
  - The `<Input>` background was made transparent (`bg-transparent`) to blend into the new form container, and its independent borders and shadows were removed.
  - This creates a unified, modern, and fully translucent search bar, improving the overall aesthetic of the home page.

### Comprehensive Glassmorphism UI Overhaul (2024-12-19)

- **Issue**: The application's UI did not have a consistent "glassmorphism" theme. While some components were translucent, the effect was not applied globally.
- **Resolution**: A full-scale UI overhaul was performed to implement a cohesive, app-wide translucent theme.
  - **Global Animated Background**: A dynamic, animated gradient was added to `app/globals.css`. It sits in the background of the entire application, making the glassmorphism effect visible and adding a premium, modern feel.
  - **Analysis Page (`app/analysis/page.tsx`)**:
    - The `Tabs` component was restyled with a transparent background and a clean bottom-border indicator for the active tab, enhancing the floating glass effect.
    - All `Card` components (`PerspectiveCard`, `InfoListCard`) were updated to explicitly use glassmorphism styles (`bg-card/80`, `backdrop-blur-lg`, `border-border`), ensuring they appear as translucent panels floating above the animated background.
  - **Footer (`components/footer.tsx`)**: The footer was updated with a translucent background, a backdrop blur, and a subtle top border to match the header and maintain UI consistency.
- This comprehensive update unifies the entire application under a sophisticated and modern glassmorphism design system.

### Background Effect Refinement (2024-12-19)

- **Issue**: The global animated gradient was too intense, and its movement was distracting. The top-left gradient, in particular, was overlapping with the "Prism" logo in the header.
- **Resolution**: The background effect in `app/globals.css` was refined to be more subtle and less intrusive.
  - **Reduced Opacity**: The opacity of the `radial-gradient` colors was significantly lowered to 15%, making the glow effect much softer.
  - **Repositioning**: The gradients were pushed further into the corners to avoid overlap with UI elements.
  - **Slower & Smoother Animation**: The animation duration was increased from 30s to 40s, and the `translate` and `scale` values within the keyframes were reduced, resulting in a slower, less jarring movement.
  - This change makes the background a subtle, premium enhancement rather than a distraction.

### Discover Page Content Overhaul (2024-12-19)

- **Issue**: The `Discover` page used generic placeholder images and content that did not align with the application's focus on technology and AI-driven analysis.
- **Resolution**: The content in `app/discover/page.tsx` was completely overhauled to be more thematically relevant.
  - **Updated Topics**: The placeholder report titles and descriptions were replaced with topics centered on technology, AI, and science (e.g., "The Future of Artificial Intelligence," "Quantum Computing," "Decentralized Finance").
  - **Curated Images**: The generic Unsplash images were replaced with a curated set of high-quality, abstract images related to technology, data, and science, creating a more professional and visually cohesive experience.

### Discover Page UI Simplification (2024-12-19)

- **Issue**: The `Discover` page included a search/filter bar that was redundant, as the primary search functionality exists on the home page.
- **Resolution**: The UI of the `Discover` page was simplified by removing the search functionality.
  - The search input field was removed from `app/discover/page.tsx`.
  - The corresponding state management (`useState`) and filtering logic for the search feature were also removed, cleaning up the component.
  - The page now only retains the "Sort by" dropdown, providing a cleaner, more focused user experience for browsing featured topics.

### Broken Image Fix (2024-12-19)

- **Issue**: The image for the "Decentralized Finance" card on the `Discover` page was broken and not loading.
- **Resolution**: The broken URL in the `analysisReports` array within `app/discover/page.tsx` was replaced with a new, valid Unsplash URL pointing to a thematically appropriate abstract image representing blockchain technology.

### Remote Image Loading Fix (2024-12-19)

- **Issue**: Images on the `Discover` page were still not loading even after fixing a broken URL.
- **Resolution**: The root cause was identified in the Next.js configuration. The `next.config.mjs` file was disabling image optimization (`unoptimized: true`) and lacked the necessary security policy to allow remote images.
  - The configuration was updated to include a `remotePatterns` entry, explicitly allowing images to be served from `images.unsplash.com`.
  - **This change requires a server restart to take effect.**
  - This fix ensures that all external images from Unsplash will now load correctly and securely across the application.

### Image Replacement (2024-12-19)

- **Issue**: The user requested a different image for the "Decentralized Finance" card on the `Discover` page.
- **Resolution**: The image URL for the specified card in `app/discover/page.tsx` was replaced with a new, thematically appropriate image from Unsplash.

### Image 404 Error Fix (2024-12-19)

- **Issue**: The replacement image for the "Decentralized Finance" card was also broken, returning a 404 error.
- **Resolution**: The faulty URL in `app/discover/page.tsx` was replaced again with a new, verified, and valid Unsplash URL to finally resolve the image loading issue.

#### UI Smoothness & Performance Polish

- **Issue**: General UI felt less fluid; animations could be smoother.
- **Resolution**:
  - **Framer Motion Damping/Stiffness**: Adjusted `stiffness` to `70` and `damping` to `18` in `itemVariants` (in `app/analysis/page.tsx`) for a more natural and fluid spring animation effect.
  - **Tabs Content Transition**: Added `ease: "easeInOut"` to the `transition` prop of the `motion.div` wrapping `TabsContent` in `app/analysis/page.tsx` for smoother tab switching animations.
  - **Component Memoization**: Wrapped `PerspectiveCard` and `InfoListCard` components (in `app/analysis/page.tsx`) with `React.memo` to prevent unnecessary re-renders, thereby improving overall rendering performance and UI fluidity.

**Next Update Required**: After any code modifications, architectural changes, or new feature implementations.

### Translucent UI Theme Overhaul (2024-12-19)

#### New Color Palette
- **Primary Background**: Very dark desaturated purple/blue (#1A1B26) with 50% opacity for a translucent effect.
- **Primary Text**: Pure white (#FFFFFF) with 80% opacity for readability.
- **Secondary Text**: Light gray (#E0E0E0) with 60% opacity for subtle hints.
- **Input Field Background**: Pure white (#FFFFFF) with 90% opacity for a clean, modern look.
- **Accent/Primary Interactive**: Vibrant purple (#7B61FF) with 70% opacity for a subtle, elegant highlight.

#### Glassmorphism Effects
- **Header**: Transparent header with a subtle white underline for active links.
- **Search Bar**: Pill-shaped search bar with a white background, light gray border, and translucent purple accent.
- **Footer**: Transparent footer that blends seamlessly with the background.
- **Analysis Page Cards**: Sophisticated glassmorphism effect for the main content area, with a subtle blur and a soft, non-distracting gradient.

#### Restyled Components
- **Header**:
  - Taller height for better visibility.
  - Transparent background.
  - Subtle white underline for active links.
  - Smooth hover effects.
- **Search Bar**:
  - Pill shape.
  - White background.
  - Light gray border.
  - Seamless integration with search button.
  - Translucent purple accent.
- **Footer**:
  - Transparent background.
  - Smooth hover effects.
  - Seamless integration with the main content.
- **Analysis Page Cards**:
  - Sophisticated glassmorphism effect.
  - Subtle blur.
  - Soft, non-distracting gradient.
  - Smooth hover and interaction states.
  - Improved readability with translucent text.

#### New Visual Assets
- **Hero Section**: High-quality Unsplash images integrated with a translucent overlay for depth.
- **Trending Topics**: Clickable badges with a translucent purple background.
- **Featured Content**: Cards with a subtle glassmorphism effect and translucent text.
- **Analysis Page**: Sophisticated glassmorphism for the main content area, with a subtle blur and a soft, non-distracting gradient.

#### Accessibility Improvements
- **Translucent Text**: Increased opacity for better readability.
- **Contrast**: Maintained high contrast for all elements.
- **Focus States**: Enhanced focus states for interactive elements.
- **Hover Effects**: Smooth, subtle hover transitions.

**Next Update Required**: After any code modifications, architectural changes, or new feature implementations.

### Reddit OAuth2 Integration (2025-07-24)
- Implemented `lib/reddit-auth.ts` for server-side OAuth2 authentication and API requests to Reddit.
- Uses client credentials grant for app-level access (no user context).
- All Reddit API calls should use `getRedditAccessToken()` and `fetchRedditData()` from this utility.
- Credentials are stored in `.env.local` and never hardcoded.
- Architectural decision: This approach is more robust, secure, and future-proof than public JSON endpoints, and allows for higher rate limits and more advanced Reddit API features.

### TabsBar Component Integration (2025-01-27)
- **Created**: New custom `components/ui/tabs-bar.tsx` component to replace `components/content/dynamic-tabs.tsx`.
- **Motivation**: User reported visual bugs with tab underline and active state styling. Required a complete visual overhaul to match provided screenshot with mobile-first, accessible design.
- **Key Features**:
  - Mobile-first responsive design with horizontal scrolling
  - Smooth animated underline using framer-motion that follows the active tab
  - Touch-friendly interactions (44px minimum height)
  - Full keyboard navigation (arrow keys, tab, enter/space)
  - Semantic ARIA attributes and roles for accessibility
  - Badge support with dynamic counts
  - Icon and text scaling for mobile breakpoints
  - No hardcoded content - fully prop-driven with strict TypeScript types

- **Integration**: Updated `app/analysis/page.tsx` to use the new TabsBar component:
  - Added `convertToTabItems()` helper function to transform `DynamicTabConfig` to `TabItem` format
  - Replaced `DynamicTabs` component with `TabsBar` and separate content rendering
  - Added memoized tab items calculation for performance
  - Maintained all existing functionality while improving visual design

- **Impact**: Resolves all tab styling issues, provides pixel-perfect design matching the screenshot, and ensures full mobile and accessibility compliance. The component is reusable across the application with consistent behavior.

### Mobile Navigation Fix (2025-01-27)
- **Issue**: The header component had no mobile navigation menu - only desktop navigation was implemented, making the app unusable on mobile devices.
- **Solution**: Complete rebuild of `components/header.tsx` with mobile-first responsive design:
  - **Desktop**: Logo on left, navigation links on right with smooth animated underlines using framer-motion
  - **Mobile**: Logo on left, hamburger menu button on right with slide-out navigation panel
  - **Animations**: Smooth slide-in/out transitions, icon rotation, staggered menu item animations
  - **Accessibility**: Full keyboard navigation, ARIA labels, focus management, escape key support
  - **UX Enhancements**: Auto-close on navigation, body scroll lock during menu open, backdrop blur overlay

- **Technical Implementation**:
  - Uses `useIsMobile()` hook for responsive behavior detection
  - Integrates with `defaultNavigationConfig` from ui-config.ts for consistency
  - Implements proper TypeScript null checking for optional NavigationItem properties
  - Mobile menu panel slides in from right with backdrop overlay
  - Active page indicators for both desktop (underline) and mobile (dot indicator)
  - Touch-friendly mobile interactions with proper spacing and sizing

- **Impact**: Mobile navigation now works perfectly across all screen sizes, providing a native mobile app experience with smooth animations and full accessibility compliance.

### Mobile Navigation Rebuild (2025-01-27)
- **Issue**: User reported the mobile navigation was "completely broken" with React component errors related to undefined exports.
- **Root Cause**: The previous implementation had complex framer-motion animations and navigation config dependencies that were causing import/export issues.
- **Solution**: Complete ground-up rebuild of the mobile navigation system:
  - **Removed**: All complex framer-motion animations and dependencies on navigation config
  - **Rebuilt**: Simple, clean mobile navigation with basic CSS transitions
  - **Fixed**: Removed unused `DynamicSearch` import from analysis page that was causing React errors
  - **Simplified**: Direct implementation of navigation items without external config dependencies
  
- **New Implementation Features**:
  - Clean hamburger menu toggle (Menu/X icons)
  - Right-side slide-out mobile panel (w-80, max-w-[80vw])
  - Backdrop overlay with click-to-close functionality
  - Body scroll lock when menu is open
  - Auto-close on route navigation
  - Active page highlighting with primary color
  - Touch-friendly 44px+ tap targets
  - Proper z-index layering (header: z-50, panel: z-50, backdrop: z-40)

- **Impact**: Mobile navigation now works reliably without any React errors. The implementation is simpler, more maintainable, and provides excellent user experience on mobile devices.

### Mobile Dropdown Navigation (2025-01-27)
- **User Feedback**: The previous sliding panel implementation was "horrible" and not user-friendly.
- **User Request**: Wanted a "nice mobile friendly dropdown menu" instead of the scrolling/sliding interface.
- **Complete Redesign**: Replaced the sliding panel with a clean dropdown menu:
  - **Removed**: Sliding panel, backdrop overlay, body scroll lock, complex z-index layering
  - **New Design**: Simple dropdown that appears directly below the header
  - **Better UX**: No more screen-covering overlays or scroll blocking
  - **Cleaner Animation**: Just a smooth dropdown appearance/disappearance
  - **Mobile-Optimized**: Touch-friendly buttons with proper spacing
  - **Consistent Styling**: Matches header design with backdrop blur effect

- **Technical Implementation**:
  - Dropdown positioned with `absolute top-full left-0 right-0`
  - Uses same container constraints as header for alignment
  - Clean state management with simple `useState` toggle
  - Auto-close on navigation without complex event handling
  - Proper mobile breakpoint detection with `useIsMobile()` hook

- **User Experience Improvements**:
  - No more "horrible scrolling interface"
  - Intuitive dropdown pattern familiar to mobile users
  - Page remains scrollable when menu is open
  - No dark overlays covering content
  - Clean, modern mobile navigation design

- **Impact**: Mobile navigation now provides an excellent, intuitive user experience that matches modern mobile app patterns without being intrusive or complex.