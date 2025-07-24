/**
 * @fileoverview Test script for X API integration
 * @author Cursor AI
 * @created 2025-07-24
 * 
 * Simple test to verify X API credentials and endpoint functionality
 * Run with: node test-x-api.js (after adding .js extension and adjusting imports)
 */

// Test function to verify X API integration
async function testXAPI() {
  const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN
  
  if (!X_BEARER_TOKEN) {
    console.error('❌ X_BEARER_TOKEN not found in environment variables')
    return false
  }

  try {
    console.log('🔍 Testing X API connection...')
    
    // Simple test query
    const query = encodeURIComponent('javascript -is:retweet lang:en')
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=5`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${X_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`❌ X API error: ${response.status} ${response.statusText}`)
      const errorBody = await response.text()
      console.error('Error details:', errorBody)
      return false
    }

    const data = await response.json()
    console.log('✅ X API connection successful!')
    console.log(`📊 Found ${data.data?.length || 0} tweets`)
    
    if (data.data && data.data.length > 0) {
      console.log('📝 Sample tweet:', data.data[0].text.substring(0, 100) + '...')
    }
    
    return true
  } catch (error) {
    console.error('❌ Error testing X API:', error)
    return false
  }
}

// Export for use in other files
module.exports = { testXAPI }

// If running directly, execute the test
if (require.main === module) {
  require('dotenv').config({ path: '.env.local' })
  testXAPI()
}
