/**
 * @fileoverview API route for AI-powered topic analysis using Gemini Flash 2.0 and public APIs
 * @author Cursor AI
 * @created 2024-12-19
 * @lastModified 2024-12-19
 *
 * This route accepts a POST request with a topic, fetches data from public APIs,
 * synthesizes a prompt, and calls Gemini Flash 2.0 to generate a multi-perspective analysis.
 *
 * Environment Variables:
 * - GEMINI_API_KEY: API key for Gemini Flash 2.0
 * - NEWS_API_KEY: API key for NewsAPI (placeholder)
 * - SEARCH_API_KEY: API key for a web search API (placeholder)
 *
 * Usage:
 * POST /api/analyze { topic: string }
 *
 * Returns:
 * - 200: { summary, viewpoints, overlaps, insights, rawData }
 * - 400/500: { error }
 */

import { NextRequest, NextResponse } from 'next/server'

// --- Helper: Fetch news articles from NewsAPI ---
async function fetchNewsArticles(topic: string): Promise<any[]> {
  const NEWS_API_KEY = process.env.NEWS_API_KEY || 'YOUR_NEWS_API_KEY'
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('NewsAPI error')
    const data = await res.json()
    return data.articles || []
  } catch (err) {
    return [] // Gracefully degrade
  }
}

// --- Helper: Fetch web search results (placeholder, e.g., SerpAPI, Bing, etc.) ---
async function fetchWebResults(topic: string): Promise<any[]> {
  // Placeholder: Replace with a real web search API
  // const SEARCH_API_KEY = process.env.SEARCH_API_KEY || 'YOUR_SEARCH_API_KEY'
  // ...
  return []
}

// --- Helper: Normalize all sources into a consistent format ---
function normalizeData(news: any[], web: any[]): Array<{ source: string; title: string; url: string; snippet: string }> {
  const normNews = news.map((a) => ({
    source: 'news',
    title: a.title,
    url: a.url,
    snippet: a.description || a.content || ''
  }))
  const normWeb = web.map((a) => ({
    source: 'web',
    title: a.title || a.name || '',
    url: a.url || a.link || '',
    snippet: a.snippet || a.description || ''
  }))
  return [...normNews, ...normWeb]
}

// --- Helper: Call Gemini Flash 2.0 API ---
async function callGeminiFlash(topic: string, docs: Array<{ source: string; title: string; url: string; snippet: string }>): Promise<any> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  if (!GEMINI_API_KEY) throw new Error('Missing Gemini API key')

  // New, more robust prompt asking for a richer, more structured JSON object
  const prompt = `
You are a world-class analytical AI, renowned for your ability to synthesize information with nuance and clarity.
Your task is to analyze the provided topic and sources, then return a meticulously structured JSON object.

**Topic:** "${topic}"

**Sources:**
${docs.length > 0 ? docs.map((d, i) => `[${i + 1}] ${d.title}\n${d.snippet}`).join('\n\n') : "No external sources provided. Rely on your internal knowledge."}

---

**Instructions:**
Based on the sources and your internal knowledge, generate a JSON object with the following exact structure.

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

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + GEMINI_API_KEY, {
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

    // Fetch data from public APIs
    const [news, web] = await Promise.all([
      fetchNewsArticles(topic),
      fetchWebResults(topic)
    ])
    const docs = normalizeData(news, web)

    // Call Gemini Flash 2.0
    const analysisData = await callGeminiFlash(topic, docs)

    return NextResponse.json({
      topic,
      ...analysisData, // Spread the summary, perspectives, and insights
      sources: docs
    })
  } catch (err: any) {
    console.error("[API/ANALYZE ERROR]", err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
} 