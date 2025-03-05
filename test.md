const JIOSAAVN_URL = 'https://www.jiosaavn.com';
const BASE_URL = process.env.API_URL || 'https://strtux-main.vercel.app';  
const DELAY_BETWEEN_TESTS = 500; // ms between tests to avoid rate limiting
const fs = require('fs');

// Test configuration
const config = {
  downloadQualities: [
    '12kbps', '48kbps', '96kbps', '160kbps', '320kbps',
    'lossless', 'hd', 'dolbyAtmos', 'high', 'medium', 'low'
  ],
  validUrlPattern: /^https:\/\/.*\.saavncdn\.com\/.*\.(mp4|mp3|flac|m4a|aac)$/,
  maxRetries: 3,
  timeout: 15000,
  cdnDomains: [
    'aac.saavncdn.com',
    'c.saavncdn.com',
    'sdl.saavncdn.com',
    'hls.saavncdn.com'
  ]
};

// Random search terms and IDs for testing
const randomSearchTerms = [
  'arijit singh',
  'ed sheeran',
  'taylor swift',
  'atif aslam',
  'coldplay',
  'imagine dragons',
  'shreya ghoshal',
  'justin bieber',
  'eminem',
  'ar rahman'
];

const randomSongIds = [
  'dZbr6LtY',
  '5WXAlMNt',
  '9BjJPi0Y',
  'jACF6j2T',
  'U9CLyTvH'
];

const randomAlbumIds = [
  '1142502',
  '25073072',
  '18087760',
  '3337462',
  '41869407'
];

const randomArtistIds = [
  '459320',
  '464656',
  '456863',
  '455917',
  '473441'
];

const randomPlaylistIds = [
  '159145156',
  '159145157',
  '159145158',
  '159145159',
  '159145160'
];

// Utility function to get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Utility function to validate download URL format
function validateDownloadUrl(url) {
  // Basic URL validation
  if (!url) {
    console.log('❌ Download URL is empty or undefined');
    return false;
  }

  // Check URL pattern
  if (!config.validUrlPattern.test(url)) {
    console.log(`❌ Invalid URL format: ${url}`);
    console.log('Expected format: https://<cdn-domain>/path/to/file.<supported-format>');
    return false;
  }

  // Check if URL is from allowed CDN domains
  const urlDomain = new URL(url).hostname;
  if (!config.cdnDomains.includes(urlDomain)) {
    console.log(`⚠️ Warning: URL domain ${urlDomain} is not in known CDN list`);
    // Still return true as new CDN domains might be added
    return true;
  }

  return true;
}

// Function to check if JioSaavn website is accessible
async function checkJioSaavnWebsite() {
  console.log('\n🌐 Checking JioSaavn website accessibility...');
  try {
    const response = await fetch(JIOSAAVN_URL);
    if (response.ok) {
      console.log('✅ JioSaavn website is accessible');
      return true;
    } else {
      console.log('❌ JioSaavn website returned status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Error accessing JioSaavn website:', error.message);
    return false;
  }
}

// Test metrics class with detailed results
class TestMetrics {
  constructor() {
    this.startTime = Date.now();
    this.tests = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    };
    this.responseTimesMs = [];
    this.errors = [];
    this.failedTests = [];
    this.passedTests = [];
    this.jiosaavnStatus = false;
    this.detailedResults = []; // Store detailed results for each test
  }

  setJioSaavnStatus(status) {
    this.jiosaavnStatus = status;
  }

  addResponseTime(ms) {
    this.responseTimesMs.push(ms);
  }

  addTestResult(testName, endpoint, status, responseTime, responseData, error = null) {
    // Validate download URLs if present in response
    let validationErrors = [];
    if (responseData && typeof responseData === 'object') {
      if (responseData.data && responseData.data.download_url) {
        responseData.data.download_url.forEach((item, index) => {
          const urlValidation = validateDownloadUrl(item.link);
          if (!urlValidation) {
            validationErrors.push({
              index,
              url: item.link,
              error: 'Invalid download URL format'
            });
          }

          // More flexible quality validation
          const quality = item.quality.toLowerCase();
          const isKbpsFormat = quality.endsWith('kbps');
          const isSpecialFormat = ['lossless', 'hd', 'dolbyatmos', 'high', 'medium', 'low'].includes(quality);

          if (!isKbpsFormat && !isSpecialFormat) {
            validationErrors.push({
              index,
              quality: item.quality,
              error: 'Unsupported quality format'
            });
          }

          // Log successful format detection
          const format = item.link.split('.').pop();
          console.log(`📍 Format detected for index ${index}: ${format} | Quality: ${item.quality}`);
        });
      }
    }

    this.detailedResults.push({
      testName,
      endpoint,
      status,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      success: status >= 200 && status < 400 && validationErrors.length === 0,
      responseData,
      error: error || (validationErrors.length > 0 ? validationErrors : null),
      validationDetails: validationErrors.length > 0 ? {
        errors: validationErrors,
        message: 'Some download URLs or qualities failed validation'
      } : null
    });
  }

  addError(endpoint, error) {
    this.errors.push({ endpoint, error, timestamp: new Date() });
  }

  get averageResponseTime() {
    return this.responseTimesMs.length > 0 
      ? Math.round(this.responseTimesMs.reduce((a, b) => a + b) / this.responseTimesMs.length) 
      : 0;
  }

  generateReport() {
    const duration = Date.now() - this.startTime;
    return {
      summary: {
        testDate: new Date().toISOString(),
        baseUrl: BASE_URL,
        totalDuration: `${duration}ms`,
        totalTests: this.tests.total,
        passedTests: this.tests.passed,
        failedTests: this.tests.failed,
        skippedTests: this.tests.skipped,
        successRate: `${Math.round((this.tests.passed / this.tests.total) * 100)}%`
      },
      jiosaavn: {
        status: this.jiosaavnStatus ? 'Accessible' : 'Not Accessible',
        checkedAt: new Date(this.startTime).toISOString()
      },
      performance: {
        averageResponseTime: `${this.averageResponseTime}ms`,
        maxResponseTime: `${Math.max(...this.responseTimesMs, 0)}ms`,
        minResponseTime: `${Math.min(...this.responseTimesMs.filter(t => t > 0), Infinity)}ms`
      },
      testResults: this.detailedResults,
      errors: this.errors
    };
  }
}

// Default fetch options for consistency
const defaultFetchOptions = {
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'JioSaavn-API-Tester/1.0'
  },
  timeout: config.timeout
};

// Helper function to create fetch options with defaults
function createFetchOptions(customOptions = {}) {
  return { ...defaultFetchOptions, ...customOptions };
}

// Helper function to mask sensitive parts of URLs for logging
function maskUrl(url) {
  try {
    const urlObj = new URL(url);
    // Mask potential tokens or sensitive query params
    const maskedSearch = urlObj.search.replace(/([?&][^=&]*token)=[^&]*/gi, '$1=***');
    return `${urlObj.origin}${urlObj.pathname}${maskedSearch}`;
  } catch (e) {
    return url; // Return original if URL parsing fails
  }
}

// Update getSongDetails to handle the correct response structure
async function getSongDetails(songId) {
  try {
    const url = `${BASE_URL}/song?id=${songId}`;
    console.log(`\n🎵 Fetching details for song ID: ${songId}`);
    
    const response = await fetch(url, createFetchOptions());
    if (!response.ok) {
      throw new Error(`Failed to get song details: ${response.status}`);
    }

    const responseData = await response.json();
    
    // Handle the correct response structure where song details are in data.songs array
    if (responseData.status === "Success" && responseData.data?.songs?.length > 0) {
      const songData = responseData.data.songs[0];
      console.log('\n📌 Song Information:');
      console.log(`Title: ${songData.name || 'N/A'}`);
      console.log(`Album: ${songData.album || 'N/A'}`);
      console.log(`Artists: ${songData.primary_artists || songData.artist_map?.primary_artists?.map(a => a.name).join(', ') || 'N/A'}`);
      console.log(`Year: ${songData.year || 'N/A'}`);
      console.log(`Label: ${songData.label || 'N/A'}`);
      
      // Check if 320kbps is available
      if (songData['320kbps']) {
        console.log('✨ High Quality (320kbps) available: Yes');
      }
      
      // Log available qualities
      if (songData.download_url && Array.isArray(songData.download_url)) {
        console.log('\n🎧 Available Qualities:');
        songData.download_url.forEach(item => {
          console.log(`- ${item.quality} ${validateDownloadUrl(item.link) ? '✅' : '❌'}`);
        });
      }

      // Return the song data in a consistent format
      return {
        status: "Success",
        data: songData
      };
    } else {
      console.log('❌ No song details found in response');
      return null;
    }
  } catch (error) {
    console.error('Error fetching song details:', error.message);
    return null;
  }
}

// Helper function to determine best download format
function getBestDownloadFormat(downloadUrls) {
  // Priority order for formats
  const formatPriority = {
    'flac': 5,  // Highest priority - best quality
    'aac': 4,   // Very good quality and compression
    'mp3': 3,   // Good compatibility
    'm4a': 2,   // Good for Apple devices
    'mp4': 1    // Lowest priority for audio
  };

  // Priority order for qualities
  const qualityPriority = {
    '320kbps': 5,
    '160kbps': 4,
    '96kbps': 3,
    '48kbps': 2,
    '12kbps': 1
  };

  return downloadUrls.sort((a, b) => {
    const formatA = a.link.split('.').pop().toLowerCase();
    const formatB = b.link.split('.').pop().toLowerCase();
    
    // Compare formats first
    const formatDiff = (formatPriority[formatA] || 0) - (formatPriority[formatB] || 0);
    if (formatDiff !== 0) return formatDiff;
    
    // If same format, compare quality
    const qualityA = a.quality.toLowerCase();
    const qualityB = b.quality.toLowerCase();
    return (qualityPriority[qualityA] || 0) - (qualityPriority[qualityB] || 0);
  });
}

// Update testDownloadUrls to show format recommendations
async function testDownloadUrls(songId, metrics, targetQuality = null) {
  console.log(`\n📡 Testing download URLs for song ID: ${songId}${targetQuality ? ` (Quality: ${targetQuality})` : ''}`);
  
  const songResponse = await getSongDetails(songId);
  if (!songResponse?.data?.download_url) {
    console.log('❌ No download URLs available in song details');
    return false;
  }

  let downloadUrls = songResponse.data.download_url;
  if (!Array.isArray(downloadUrls)) {
    console.log('❌ Invalid download_url format in response');
    return false;
  }

  // Sort and analyze available formats
  const sortedUrls = getBestDownloadFormat(downloadUrls);
  
  console.log('\n📊 Available Format Analysis:');
  const formats = new Set(sortedUrls.map(url => url.link.split('.').pop().toLowerCase()));
  console.log('Formats found:', Array.from(formats).join(', '));
  
  console.log('\n💫 Format Recommendations:');
  console.log('Best Quality: FLAC > AAC (320kbps) > MP3 (320kbps) > M4A > MP4');
  console.log('Best Compatibility: MP3 > AAC > M4A > MP4 > FLAC');
  console.log('Best Size Efficiency: AAC > MP3 > M4A > FLAC > MP4');

  console.log('\n🎯 Available Downloads (Best to Worst):');
  sortedUrls.forEach((item, index) => {
    const format = item.link.split('.').pop().toLowerCase();
    console.log(`${index + 1}. ${format.toUpperCase()} - ${item.quality}`);
  });

  // Continue with existing download testing logic...
  // ... rest of the existing function code ...
}

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Update testAPI to use the new download testing function
async function testAPI(endpoint, params = '', options = {}) {
  const metrics = options.metrics || new TestMetrics();
  const maxRetries = options.retryCount || 0;
  
  // Special handling for download endpoint
  if (endpoint === '/download') {
    const songId = new URLSearchParams(params).get('id');
    const quality = new URLSearchParams(params).get('quality');
    return await testDownloadUrls(songId, metrics, quality);
  }
  
  // Original test logic for non-download endpoints
  let retryCount = 0;
  while (retryCount <= maxRetries) {
    const startTime = Date.now();
    try {
      const url = `${BASE_URL}${endpoint}${params}`;
      console.log(`\nTesting: ${maskUrl(url)}${retryCount > 0 ? ` (Retry ${retryCount})` : ''}`);
      
      const response = await fetch(url, createFetchOptions());
      const responseTime = Date.now() - startTime;
      metrics.addResponseTime(responseTime);
      
      console.log(`Status: ${response.status} | Response Time: ${responseTime}ms`);

      let responseData = null;
      try {
        responseData = await response.clone().json();
        console.log('\nResponse Preview:', JSON.stringify(responseData, null, 2).substring(0, 200) + '...');
      } catch (e) {
        responseData = await response.text();
      }

      metrics.addTestResult(
        options.testName || endpoint,
        maskUrl(url),
        response.status,
        responseTime,
        responseData
      );

      if (!response.ok && retryCount < maxRetries) {
        console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
        retryCount++;
        await sleep(1000 * (retryCount + 1));
        continue;
      }

      return response.ok;
    } catch (error) {
      console.error(`Error testing ${endpoint}:`, error.message);
      metrics.addError(endpoint, error.message);
      
      if (retryCount < maxRetries) {
        retryCount++;
        await sleep(1000 * (retryCount + 1));
        continue;
      }
      return false;
    }
  }
  return false;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main test function
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  const metrics = new TestMetrics();

  // First check JioSaavn website
  const jiosaavnStatus = await checkJioSaavnWebsite();
  metrics.setJioSaavnStatus(jiosaavnStatus);
  await sleep(1000);

  if (!jiosaavnStatus) {
    console.log('⚠️ Warning: JioSaavn website is not accessible, proceeding with API tests...\n');
  }

  // Define test cases with random parameters
  const tests = [
    { endpoint: '/', name: 'Home Page' },
    { endpoint: '/docs', name: 'Documentation' },
    
    // Search Tests
    { 
      endpoint: '/search/songs',
      params: `?q=${encodeURIComponent('latest bollywood songs')}`,
      name: 'Popular Songs Search',
      retryCount: 2
    },
    { 
      endpoint: '/search/songs',
      params: `?q=${encodeURIComponent(getRandomItem(randomSearchTerms))}`,
      name: 'Random Artist Search',
      retryCount: 2
    },

    // Album Tests
    { 
      endpoint: '/album',
      params: `?id=${getRandomItem(randomAlbumIds)}`,
      name: 'Random Album Details',
      retryCount: 2
    },

    // Dynamic Song Test - Get ID from search results
    async function() {
      // First do a search
      const searchResponse = await fetch(`${BASE_URL}/search/songs?q=latest`, createFetchOptions());
      const searchData = await searchResponse.json();
      
      if (searchData.status === "Success" && searchData.data?.results?.length > 0) {
        const songId = searchData.data.results[0].id;
        return { 
          endpoint: '/song',
          params: `?id=${songId}`,
          name: 'Latest Song Details',
          retryCount: 2
        };
      }
      return null;
    },

    // Dynamic Download Test - Use ID from successful song details
    async function() {
      // First get a successful song ID from search
      const searchResponse = await fetch(`${BASE_URL}/search/songs?q=new`, createFetchOptions());
      const searchData = await searchResponse.json();
      
      if (searchData.status === "Success" && searchData.data?.results?.length > 0) {
        const songId = searchData.data.results[0].id;
        return { 
          endpoint: '/download',
          params: `?id=${songId}`,
          name: 'Latest Song Download Test',
          retryCount: 2
        };
      }
      return null;
    }
  ];

  // Run each test
  for (const test of tests) {
    try {
      // Handle dynamic test generators
      const currentTest = typeof test === 'function' ? await test() : test;
      if (!currentTest) continue; // Skip if dynamic test generation failed

      console.log(`\n📝 Running Test: ${currentTest.name}`);
      metrics.tests.total++;
      
      const success = await testAPI(
        currentTest.endpoint,
        currentTest.params || '',
        { 
          metrics,
          retryCount: currentTest.retryCount,
          testName: currentTest.name
        }
      );
      
      if (currentTest.expectedError) {
        if (!success) {
          console.log('✅ Expected error received');
          metrics.tests.passed++;
        } else {
          console.log('❌ Expected error not received');
          metrics.tests.failed++;
        }
      } else {
        if (success) {
          console.log('✅ Test passed successfully');
          metrics.tests.passed++;
        } else {
          console.log('❌ Test failed');
          metrics.tests.failed++;
        }
      }
      
      await sleep(DELAY_BETWEEN_TESTS);
    } catch (error) {
      console.error(`Error running test:`, error);
      metrics.tests.failed++;
    }
  }

  // Generate and save report
  const report = metrics.generateReport();
  fs.writeFileSync('test_results.json', JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`Total Tests: ${report.summary.totalTests}`);
  console.log(`Passed: ${report.summary.passedTests}`);
  console.log(`Failed: ${report.summary.failedTests}`);
  console.log(`Success Rate: ${report.summary.successRate}`);
  console.log(`Total Duration: ${report.summary.totalDuration}`);
  console.log('\n📝 Detailed results saved to test_results.json');
}

// Run the tests
console.log('🎯 Testing JioSaavn API');
console.log(`🔗 Base URL: ${BASE_URL}`);
runTests().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
