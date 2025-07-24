import 'dotenv/config';
/**
 * @fileoverview Test script for Reddit OAuth2 integration
 * @author Cursor AI
 * @created 2025-07-24
 * @lastModified 2025-07-24
 *
 * This script tests the ability to authenticate with Reddit and fetch subreddit posts using the implemented OAuth2 utilities.
 *
 * Usage:
 *   Run with: `npx tsx test-reddit-auth.ts` (or use your preferred Node.js TypeScript runner)
 *
 * Related files:
 * - lib/reddit-auth.ts
 * - .env.local (must contain Reddit credentials)
 */

import { getRedditAccessToken, fetchRedditData } from './lib/reddit-auth';

async function testRedditOAuth() {
  try {
    console.log('Obtaining Reddit access token...');
    const token = await getRedditAccessToken();
    console.log('Access token acquired:', token ? 'YES' : 'NO');

    console.log('Fetching posts from /r/reactjs...');
    const data = await fetchRedditData('/r/reactjs/hot', token);
    if (data && data.data && Array.isArray(data.data.children)) {
      console.log(`Fetched ${data.data.children.length} posts from /r/reactjs.`);
      // Print the first post title as a sample
      if (data.data.children.length > 0) {
        console.log('First post title:', data.data.children[0].data.title);
      }
    } else {
      console.error('Unexpected response structure:', data);
    }
  } catch (err) {
    console.error('Reddit OAuth2 test failed:', err);
    process.exit(1);
  }
}

// Run the test
void testRedditOAuth();
