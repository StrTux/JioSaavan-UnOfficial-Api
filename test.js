const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const DELAY_BETWEEN_TESTS = 500; // ms between tests to avoid rate limiting

async function testAPI(endpoint, params = '', options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}${params}`;
    console.log(`\nTesting: ${url}`);
    
    const response = await fetch(url, options);
    console.log(`Status: ${response.status}`);
    
    // Handle different content types
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (data.status === 'Failed') {
        console.error('API Error:', data.message);
        return false;
      }
      console.log('Response:', JSON.stringify(data, null, 2));
    } else if (contentType && contentType.includes('text/html')) {
      const text = await response.text();
      console.log('Response: [HTML Content]');
    } else {
      console.log('Response: Unknown content type:', contentType);
    }
    
    return response.ok;
  } catch (error) {
    console.error(`Error testing ${endpoint}:`, error.message);
    return false;
  } finally {
    console.log('-'.repeat(80));
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('Starting API Tests...\n');
  let failedTests = [];
  let passedTests = [];
  
  const tests = [
    // Home page
    ['/'],
    
    // Search APIs with different queries
    ['/search', '?q=arijit'],
    ['/search/songs', '?q=perfect'],
    ['/search/songs', '?q=despacito'],
    ['/search/albums', '?q=arijit'],
    ['/search/albums', '?q=ed sheeran'],
    ['/search/artists', '?q=arijit'],
    ['/search/artists', '?q=taylor swift'],
    ['/search/playlists', '?q=workout'],
    ['/search/playlists', '?q=party'],

    // Song APIs with multiple IDs
    ['/song', '?id=5WXAlMNt'],
    ['/song', '?id=abcdef12'],
    ['/get/lyrics', '?id=5WXAlMNt'],
    ['/get/lyrics', '?id=abcdef12'],
    ['/download', '?id=5WXAlMNt'],
    ['/download', '?id=5WXAlMNt&quality=320_KBPS'],
    ['/download', '?id=abcdef12'],

    // Album APIs with different IDs
    ['/album', '?id=1142502'],
    ['/album', '?id=9876543'],
    ['/album/recommend', '?id=1142502'],
    ['/album/same-year', '?year=2023&lang=hindi'],

    // Artist APIs with various parameters
    ['/artist', '?id=459320'],
    ['/artist/songs', '?id=459320'],
    ['/artist/albums', '?id=459320'],
    ['/artist/top-songs', '?artist_id=459320&song_id=5WXAlMNt'],

    // Playlist APIs
    ['/playlist', '?id=159145156'],
    ['/playlist/recommend', '?id=159145156'],

    // Language APIs with different languages
    ['/language/songs', '?lang=hindi'],
    ['/language/songs', '?lang=english'],
    ['/language/albums', '?lang=english'],
    ['/language/albums', '?lang=punjabi'],
    ['/language/playlists', '?lang=punjabi'],
    ['/language/playlists', '?lang=hindi'],

    // Genre APIs with combinations
    ['/genre/songs', '?name=rock&lang=english'],
    ['/genre/songs', '?name=pop&lang=hindi'],
    ['/genre/albums', '?name=classical&lang=hindi'],
    ['/genre/albums', '?name=edm&lang=english'],
    ['/genre/playlists', '?name=edm'],
    ['/genre/playlists', '?name=rock'],

    // Trending APIs with categories
    ['/get/trending', '?type=song'],
    ['/get/trending', '?type=album'],
    ['/trending/category/song', '?category=popularity&lang=hindi'],
    ['/trending/category/song', '?category=latest&lang=english'],
    ['/trending/category/album', '?category=latest'],
    ['/trending/category/album', '?category=popularity'],

    // Radio APIs
    ['/radio/featured', '?name=arijit'],
    ['/radio/artist', '?name=arijit'],
    ['/radio/songs', '?id=123456'],

    // Home & Modules APIs
    ['/modules/home'],
    ['/modules/charts'],
    ['/modules/playlists', '?lang=hindi']
  ];

  for (const [endpoint, params] of tests) {
    const success = await testAPI(endpoint, params || '');
    if (!success) {
      failedTests.push(endpoint + (params || ''));
    } else {
      passedTests.push(endpoint + (params || ''));
    }
    await sleep(DELAY_BETWEEN_TESTS);
  }

  console.log('\nTest Summary:');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`Passed Tests: ${passedTests.length}`);
  console.log(`Failed Tests: ${failedTests.length}`);
  
  if (failedTests.length > 0) {
    console.log('\nFailed Endpoints:');
    failedTests.forEach(test => console.log(`- ${test}`));
  }

  if (passedTests.length > 0) {
    console.log('\nPassed Endpoints:');
    passedTests.forEach(test => console.log(`- ${test}`));
  }
}

// Start the tests
console.log(`Testing API at: ${BASE_URL}`);
console.log('Starting tests in 3 seconds...');
setTimeout(runTests, 3000); 