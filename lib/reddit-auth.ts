/**
 * @fileoverview Reddit OAuth2 authentication and API utility functions
 * @author Cursor AI
 * @created 2025-07-24
 * @lastModified 2025-07-24
 *
 * Provides functions to authenticate with Reddit using OAuth2 and fetch data from Reddit's API.
 * Handles access token retrieval and authenticated requests for server-side usage.
 *
 * Dependencies:
 * - Node.js built-in fetch (Next.js API route/server component)
 * - Environment variables for Reddit credentials
 *
 * Usage:
 * - Import and use getRedditAccessToken() to obtain an access token
 * - Use fetchRedditData() to make authenticated Reddit API requests
 *
 * Related files:
 * - context.md (update with integration details)
 * - .env.local (store credentials)
 */



/**
 * Retrieves a Reddit OAuth2 access token using client credentials grant.
 *
 * @returns {Promise<string>} The access token string
 * @throws {Error} If token retrieval fails
 *
 * Algorithm/Logic explanation:
 * - Uses client credentials grant (no user context)
 * - Encodes client_id and secret in Basic Auth header
 * - Requests token from Reddit's /api/v1/access_token endpoint
 */
export async function getRedditAccessToken(): Promise<string> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Reddit client ID/secret not set in environment variables');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'prism-app/1.0 (by u/yourusername)'
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error(`Failed to get Reddit access token: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.access_token) {
    throw new Error('No access token returned from Reddit');
  }
  return data.access_token;
}

/**
 * Fetches data from Reddit API using an OAuth2 access token.
 *
 * @param {string} endpoint - The Reddit API endpoint (e.g., '/r/reactjs/hot')
 * @param {string} accessToken - The OAuth2 access token
 * @param {RequestInit} [options] - Optional fetch options
 * @returns {Promise<any>} The Reddit API response data
 * @throws {Error} If the fetch fails
 *
 * @example
 * const token = await getRedditAccessToken();
 * const data = await fetchRedditData('/r/reactjs/hot', token);
 */
export async function fetchRedditData(
  endpoint: string,
  accessToken: string,
  options?: RequestInit
): Promise<any> {
  const url = `https://oauth.reddit.com${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'prism-app/1.0 (by u/yourusername)',
    },
  });
  if (!res.ok) {
    throw new Error(`Reddit API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
