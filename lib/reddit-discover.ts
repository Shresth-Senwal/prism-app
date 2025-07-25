/**
 * @fileoverview Reddit API utilities for Discover page trending stories
 * @author GitHub Copilot
 * @created 2025-07-25
 * @lastModified 2025-07-25
 *
 * Provides functionality to fetch trending Reddit posts from multiple sectors/subreddits
 * for the dynamic Discover page. Uses Reddit's public JSON API with caching and error handling.
 *
 * Features:
 * - Fetch top posts from specified subreddits
 * - Type-safe interfaces for Reddit API responses
 * - Built-in caching with Next.js fetch cache
 * - Error handling and fallback logic
 * - Configurable sectors/subreddits
 *
 * Dependencies:
 * - Next.js fetch with cache
 * 
 * Usage:
 * - Import and use in Server Components
 * - Call fetchTrendingStories() to get all sector data
 * - Individual sector fetching with fetchSubredditPosts()
 *
 * Related files:
 * - app/discover/page.tsx (main consumer)
 * - context.md (documentation)
 */

// Sector configuration - easy to add/remove sectors
export const DISCOVER_SECTORS = [
  { name: 'Technology', subreddit: 'technology', icon: '💻' },
  { name: 'Gaming', subreddit: 'gaming', icon: '🎮' },
  { name: 'Health', subreddit: 'Health', icon: '🏥' },
  { name: 'Finance', subreddit: 'investing', icon: '💰' },
  { name: 'World News', subreddit: 'worldnews', icon: '🌍' },
  { name: 'Science', subreddit: 'science', icon: '🔬' },
  { name: 'Politics', subreddit: 'politics', icon: '🏛️' },
  { name: 'Space', subreddit: 'space', icon: '🚀' }
] as const

// TypeScript interfaces for Reddit API responses
export interface RedditPost {
  id: string
  title: string
  author: string
  subreddit: string
  subreddit_name_prefixed: string
  score: number
  num_comments: number
  created_utc: number
  url: string
  permalink: string
  thumbnail: string | null
  selftext: string
  is_video: boolean
  domain: string
  ups: number
  upvote_ratio: number
}

export interface RedditChild {
  kind: string
  data: RedditPost
}

export interface RedditResponse {
  kind: string
  data: {
    modhash: string
    dist: number
    children: RedditChild[]
    after: string | null
    before: string | null
  }
}

export interface TrendingStory {
  id: string
  title: string
  author: string
  subreddit: string
  score: number
  comments: number
  createdAt: Date
  url: string
  redditUrl: string
  thumbnail: string | null
  snippet: string
  domain: string
  upvoteRatio: number
}

export interface SectorStories {
  sector: string
  icon: string
  stories: TrendingStory[]
  error?: string
}

/**
 * Fetch top posts from a specific subreddit
 * @param subreddit - The subreddit name (without r/ prefix)
 * @param limit - Number of posts to fetch (default: 10)
 * @returns Promise<TrendingStory[]> Array of trending stories
 */
export async function fetchSubredditPosts(
  subreddit: string, 
  limit: number = 10
): Promise<TrendingStory[]> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=${limit}&t=day`
    
    // Use Next.js fetch with caching for performance
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PrismApp/1.0 (Discover Page Trending Stories)'
      },
      // Cache for 10 minutes to avoid rate limits and improve performance
      next: { 
        revalidate: 600,
        tags: [`reddit-${subreddit}`]
      }
    })

    if (!response.ok) {
      console.warn(`Failed to fetch r/${subreddit}: ${response.status} ${response.statusText}`)
      return []
    }

    const data: RedditResponse = await response.json()
    
    if (!data.data?.children || !Array.isArray(data.data.children)) {
      console.warn(`No posts found in r/${subreddit}`)
      return []
    }

    // Transform Reddit posts to our TrendingStory format
    return data.data.children
      .filter(child => child.data && !child.data.is_video) // Filter out videos for consistency
      .map(child => {
        const post = child.data
        return {
          id: post.id,
          title: post.title,
          author: post.author,
          subreddit: post.subreddit,
          score: post.score || post.ups || 0,
          comments: post.num_comments || 0,
          createdAt: new Date(post.created_utc * 1000),
          url: post.url,
          redditUrl: `https://reddit.com${post.permalink}`,
          thumbnail: post.thumbnail !== 'self' && post.thumbnail !== 'default' ? post.thumbnail : null,
          snippet: post.selftext ? post.selftext.slice(0, 200) + '...' : '',
          domain: post.domain || '',
          upvoteRatio: post.upvote_ratio || 0
        }
      })
      .slice(0, limit) // Ensure we don't exceed the limit

  } catch (error) {
    console.error(`Error fetching r/${subreddit}:`, error)
    return []
  }
}

/**
 * Fetch trending stories from all configured sectors
 * @param postsPerSector - Number of posts to fetch per sector (default: 8)
 * @returns Promise<SectorStories[]> Array of sector stories with error handling
 */
export async function fetchTrendingStories(postsPerSector: number = 8): Promise<SectorStories[]> {
  // Fetch all sectors in parallel for performance
  const sectorPromises = DISCOVER_SECTORS.map(async sector => {
    try {
      const stories = await fetchSubredditPosts(sector.subreddit, postsPerSector)
      return {
        sector: sector.name,
        icon: sector.icon,
        stories,
        error: stories.length === 0 ? `No stories found in r/${sector.subreddit}` : undefined
      }
    } catch (error) {
      console.error(`Error fetching sector ${sector.name}:`, error)
      return {
        sector: sector.name,
        icon: sector.icon,
        stories: [],
        error: `Failed to load ${sector.name} stories`
      }
    }
  })

  const results = await Promise.all(sectorPromises)
  
  // Log summary for debugging
  const totalStories = results.reduce((sum, sector) => sum + sector.stories.length, 0)
  console.log(`[DISCOVER] Fetched ${totalStories} stories across ${results.length} sectors`)
  
  return results
}

/**
 * Get a formatted time string for post age
 * @param createdAt - Date when the post was created
 * @returns string - Human-readable time difference
 */
export function getTimeAgo(createdAt: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - createdAt.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return `${diffDays}d ago`
  } else if (diffHours > 0) {
    return `${diffHours}h ago`
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return `${diffMinutes}m ago`
  }
}

/**
 * Format score numbers for display (e.g., 1.2k, 15.3k)
 * @param score - The numeric score
 * @returns string - Formatted score
 */
export function formatScore(score: number): string {
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}k`
  }
  return score.toString()
}
