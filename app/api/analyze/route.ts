/**
 * @fileoverview API route for AI-powered topic analysis using Gemini Flash 2.0 and multiple data sources
 * @author Cursor AI
 * @created 2024-12-19
 * @lastModified 2025-07-24
 *
 * This route accepts a POST request with a topic, fetches data from multiple sources
 * including Reddit, web search, then uses Gemini Flash 2.0 to generate a comprehensive multi-perspective analysis.
 *
 * Data Sources:
 * - Reddit API: Community discussions and forum posts
 * - Web Search: General web content (placeholder)
 *
 * Environment Variables:
 * - GEMINI_API_KEY: API key for Gemini Flash 2.0
 * - SEARCH_API_KEY: API key for web search API (optional)
 *
 * Usage:
 * POST /api/analyze { topic: string }
 *
 * Returns:
 * - 200: { topic, summary, perspectives, contrasting_points, insights, sources, sourceStats }
 * - 400/500: { error }
 */


import { NextRequest, NextResponse } from 'next/server'
import { getRedditAccessToken, fetchRedditData } from '@/lib/reddit-auth'


// --- Helper: Fetch web search results (placeholder, e.g., SerpAPI, Bing, etc.) ---
async function fetchWebResults(topic: string): Promise<any[]> {
  // Placeholder: Replace with a real web search API
  // const SEARCH_API_KEY = process.env.SEARCH_API_KEY || 'YOUR_SEARCH_API_KEY'
  // ...
  return []
}


// --- Helper: Fetch posts from Reddit API (OAuth2, server-side) ---
/**
 * Fetch posts from Reddit API for a given topic using OAuth2 authentication
 * @param topic - The search query/topic
 * @returns Promise<any[]> Array of Reddit post objects
 *
 * Uses Reddit's OAuth2 API to search for posts (server-side, avoids 403 errors)
 */
async function fetchRedditPosts(topic: string): Promise<any[]> {
  try {
    const accessToken = await getRedditAccessToken();
    const query = encodeURIComponent(topic);
    // Use Reddit's search endpoint (OAuth2)
    const endpoint = `/search?q=${query}&sort=relevance&limit=10&type=link`;
    const data = await fetchRedditData(endpoint, accessToken);
    if (!data.data?.children || !Array.isArray(data.data.children)) {
      console.warn('No Reddit posts found for topic:', topic);
      return [];
    }
    // Transform Reddit posts to our expected format
    return data.data.children.map((child: any) => {
      const post = child.data;
      return {
        id: post.id,
        title: post.title,
        selftext: post.selftext,
        author: post.author,
        subreddit: post.subreddit,
        score: post.score,
        num_comments: post.num_comments,
        created_utc: post.created_utc,
        url: post.url,
        permalink: `https://reddit.com${post.permalink}`,
        thumbnail: post.thumbnail !== 'self' ? post.thumbnail : null
      };
    });
  } catch (error) {
    console.error('Error fetching Reddit posts (OAuth2):', error);
    return [];
  }
}

// --- Helper: Normalize all sources into a consistent format ---
/**
/**
 * Normalize all sources (web, reddit) into a consistent format
 * @param web - Web search results
 * @param redditPosts - Posts from Reddit
 * @returns Array of normalized source objects
 */
function normalizeData(
  web: any[],
  redditPosts: any[] = []
): Array<{ source: string; title: string; url: string; snippet: string; metadata?: any }> {
  const normWeb = web.map((a) => ({
    source: 'Web',
    title: a.title || a.name || '',
    url: a.url || a.link || '',
    snippet: a.snippet || a.description || '',
    metadata: {}
  }))

  const normReddit = redditPosts.map((post) => ({
    source: 'Reddit',
    title: post.title,
    url: post.permalink,
    snippet: post.selftext || post.title,
    metadata: {
      subreddit: post.subreddit,
      author: post.author,
      score: post.score,
      comments: post.num_comments,
      created_utc: post.created_utc
    }
  }))

  return [...normWeb, ...normReddit]
}

// --- Helper: Call Gemini Flash 2.0 API ---
/**
 * Call Gemini Flash 2.0 API with enhanced prompt for multi-source analysis
 * @param topic - The topic being analyzed
 * @param docs - Normalized documents from all sources
 * @returns Promise<any> Analysis results from Gemini
 */
async function callGeminiFlash(topic: string, docs: Array<{ source: string; title: string; url: string; snippet: string; metadata?: any }>): Promise<any> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  if (!GEMINI_API_KEY) throw new Error('Missing Gemini API key')

  // Enhanced prompt with better source context
  const prompt = `
You are a world-class analytical AI, renowned for your ability to synthesize information with nuance and clarity.
Your task is to analyze the provided topic using diverse sources including news, social media (X/Twitter), Reddit discussions, and web content.

**Topic:** "${topic}"

**Sources (${docs.length} total):**
${docs.length > 0 ? docs.map((d, i) => `[${i + 1}] Source: ${d.source}
Title: ${d.title}
Content: ${d.snippet}
${d.metadata ? `Additional Context: ${JSON.stringify(d.metadata, null, 2)}` : ''}
`).join('\n') : "No external sources provided. Rely on your internal knowledge."}

---

**Instructions:**
Analyze the topic using all available sources and your knowledge. Pay special attention to:
- Different perspectives from various platforms (News vs Social Media vs Forums)
- Real-time social sentiment from X posts
- Community discussions from Reddit
- Factual reporting from news sources

Generate a JSON object with the following exact structure:

{
  "summary": "A concise, neutral, and synthesized summary of the entire topic, written in an encyclopedic tone.",
  "perspectives": [
    {
      "title": "Name of the First Perspective (e.g., Economic Viewpoint)",
      "sentiment": "Positive",
      "key_points": [
        "First key takeaway or argument of this perspective.",
        "Second key takeaway or argument."
      ],
      "content": "A detailed, paragraph-form explanation of this perspective."
    },
    {
      "title": "Name of the Second Perspective (e.g., Geopolitical Stance)",
      "sentiment": "Negative",
      "key_points": [
        "First key takeaway or argument of this perspective.",
        "Second key takeaway or argument."
      ],
      "content": "A detailed, paragraph-form explanation of this perspective."
    }
  ],
  "contrasting_points": [
      "A point summarizing a key area of disagreement or contrast between perspectives.",
      "Another point highlighting a direct conflict in the provided information."
  ],
  "insights": [
    "A hidden insight or subtle observation from the data.",
    "A note on potential bias found in the sources.",
    "An observation about an interesting overlap between seemingly unrelated points."
  ]
}

**Rules:**
- Your entire response MUST be a single, valid JSON object. Do not include any text, markdown, or explanations outside of it.
- **Sentiment** must be one of three strings: "Positive", "Negative", or "Neutral".
- **key_points**, **contrasting_points**, and **insights** must be arrays of strings.
- If you cannot find multiple perspectives, provide one broad, balanced perspective.
- If no specific insights, contrasts, or key points are found, return an empty array [] for that field.
`

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.5, 
        maxOutputTokens: 2048 
      }
    })
  })
  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Gemini API Error:", errorBody);
    throw new Error('Gemini API request failed');
  }
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
  
  try {
    // The response IS the JSON object.
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini JSON response:", text);
    throw new Error("Failed to parse analysis from AI response.");
  }
}

// --- Main API Route Handler ---
/**
 * POST /api/analyze
 * @param req - NextRequest with JSON body: { topic: string }
 * @returns NextResponse with analysis or error
 */
export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid topic' }, { status: 400 })
    }

    // Fetch data from available sources: Web and Reddit (X API removed)
    const [web, redditPosts] = await Promise.all([
      fetchWebResults(topic),
      fetchRedditPosts(topic)
    ])

    const docs = normalizeData(web, redditPosts)

    // Log source statistics for debugging
    console.log(`[ANALYSIS] Topic: "${topic}"`)
    console.log(`[SOURCES] Web: ${web.length}, Reddit: ${redditPosts.length}`)

    // Call Gemini Flash 2.0 for analysis
    const analysisData = await callGeminiFlash(topic, docs)

    return NextResponse.json({
      topic,
      ...analysisData, // Spread the summary, perspectives, and insights
      sources: docs,
      sourceStats: {
        web: web.length,
        reddit: redditPosts.length,
        total: docs.length
      }
    })
  } catch (err: any) {
    console.error("[API/ANALYZE ERROR]", err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
} 