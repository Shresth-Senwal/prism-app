# X (Twitter) API Integration

This document describes the X API integration implemented in the Prism app for real-time social media analysis.

## Overview

The X API integration fetches recent posts/tweets related to a search topic to provide real-time social sentiment and discussions as part of the multi-source topic analysis.

## Implementation Details

### API Version
- **X API v2** - Using the modern Twitter API v2 endpoints
- **Endpoint**: `https://api.twitter.com/2/tweets/search/recent`
- **Authentication**: Bearer Token authentication

### Features
- ✅ Real-time tweet fetching
- ✅ Author information and verification status
- ✅ Public metrics (likes, retweets, etc.)
- ✅ Context annotations for better understanding
- ✅ Graceful error handling and fallbacks
- ✅ Rate limiting awareness
- ✅ Non-English tweet filtering

### Environment Variables

Add these to your `.env.local` file:

```env
# X (Twitter) API Credentials
X_BEARER_TOKEN=your_bearer_token_here
X_ACCESS_TOKEN=your_access_token_here
X_ACCESS_TOKEN_SECRET=your_access_token_secret_here
X_API_KEY=your_api_key_here
X_API_KEY_SECRET=your_api_key_secret_here
```

### Usage

The X API integration is automatically used in the `/api/analyze` endpoint:

```typescript
// The API fetches from multiple sources including X
const [news, web, xPosts, redditPosts] = await Promise.all([
  fetchNewsArticles(topic),
  fetchWebResults(topic),
  fetchXPosts(topic),      // ← X API integration
  fetchRedditPosts(topic)
])
```

### Data Format

X posts are normalized to this format:

```typescript
{
  source: 'X',
  title: '@username: Tweet preview...',
  url: 'https://twitter.com/username/status/123456789',
  snippet: 'Full tweet text',
  metadata: {
    author: 'Display Name',
    username: 'username',
    verified: true/false,
    metrics: { like_count, retweet_count, etc. },
    created_at: 'ISO timestamp'
  }
}
```

### Error Handling

- **Missing credentials**: Gracefully skips X API, continues with other sources
- **API errors**: Logs error, returns empty array
- **Rate limiting**: Handled by X API response codes
- **Network issues**: Caught and logged, doesn't break overall analysis

## Testing

To test the X API integration:

1. Ensure credentials are set in `.env.local`
2. Run the development server: `npm run dev`
3. Make a POST request to `/api/analyze` with a topic
4. Check console logs for X API fetch statistics

## Rate Limits

X API v2 has the following rate limits for the search endpoint:
- **Bearer Token**: 300 requests per 15-minute window
- **User context**: 180 requests per 15-minute window

The implementation fetches max 10 tweets per request to conserve rate limits.

## Future Enhancements

- [ ] Implement OAuth 2.0 for user context authentication
- [ ] Add support for X Spaces and other content types
- [ ] Implement caching to reduce API calls
- [ ] Add sentiment analysis for individual tweets
- [ ] Support for trending topics and hashtag analysis
