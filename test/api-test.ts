import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3500';
const RESULTS_DIR = path.join(process.cwd(), 'test-results');

interface APITest {
  name: string;
  endpoint: string;
  method: string;
  params?: Record<string, string>;
  expectedStatus: number;
}

const tests: APITest[] = [
  // Song API Tests
  {
    name: "Get Song Details",
    endpoint: "/song",
    method: "GET",
    params: { id: "5WXAlMNt" },
    expectedStatus: 200
  },
  {
    name: "Get Multiple Songs",
    endpoint: "/song",
    method: "GET",
    params: { id: "5WXAlMNt,9BjJPi0Y,IhKbmgyP" },
    expectedStatus: 200
  },
  {
    name: "Get Song by URL",
    endpoint: "/song",
    method: "GET",
    params: { link: "https://www.jiosaavn.com/song/thunderclouds/RT8zcBh9eUc" },
    expectedStatus: 200
  },

  // Album API Tests
  {
    name: "Get Album Details",
    endpoint: "/album",
    method: "GET",
    params: { id: "1142502" },
    expectedStatus: 200
  },
  {
    name: "Get Album by URL",
    endpoint: "/album",
    method: "GET",
    params: { link: "https://www.jiosaavn.com/album/night-visions/xe6Gx7Sg12U" },
    expectedStatus: 200
  },

  // Artist API Tests
  {
    name: "Get Artist Details",
    endpoint: "/artist",
    method: "GET",
    params: { id: "459320" },
    expectedStatus: 200
  },
  {
    name: "Get Artist Songs",
    endpoint: "/artist/songs",
    method: "GET",
    params: { id: "459320" },
    expectedStatus: 200
  },
  {
    name: "Get Artist Albums",
    endpoint: "/artist/albums",
    method: "GET",
    params: { id: "459320" },
    expectedStatus: 200
  },

  // Playlist API Tests
  {
    name: "Get Playlist Details",
    endpoint: "/playlist",
    method: "GET",
    params: { id: "159144718" },
    expectedStatus: 200
  },
  {
    name: "Get Playlist by URL",
    endpoint: "/playlist",
    method: "GET",
    params: { link: "https://www.jiosaavn.com/featured/hindi-india-superhits-top-50/zlJfJYVuyjpxWb5,FqsjKg__" },
    expectedStatus: 200
  },

  // Search API Tests
  {
    name: "Global Search",
    endpoint: "/search",
    method: "GET",
    params: { q: "love" },
    expectedStatus: 200
  },
  {
    name: "Search Songs",
    endpoint: "/search/songs",
    method: "GET",
    params: { q: "love" },
    expectedStatus: 200
  },
  {
    name: "Search Albums",
    endpoint: "/search/albums",
    method: "GET",
    params: { q: "love" },
    expectedStatus: 200
  },

  // Radio API Tests
  {
    name: "Create Featured Radio",
    endpoint: "/radio/featured",
    method: "GET",
    params: { name: "90s Nostalgia" },
    expectedStatus: 200
  },
  {
    name: "Create Artist Radio",
    endpoint: "/radio/artist",
    method: "GET",
    params: { name: "Arijit Singh" },
    expectedStatus: 200
  }
];

interface TestResult {
  name: string;
  endpoint: string;
  success: boolean;
  status: number;
  expectedStatus: number;
  responseTime: number;
  error?: string;
  response?: any;
}

async function runTests() {
  const results: TestResult[] = [];
  console.log(`Starting API tests against ${BASE_URL}`);
  
  for (const test of tests) {
    try {
      console.log(`\nRunning test: ${test.name}`);
      const params = new URLSearchParams(test.params);
      const url = `${BASE_URL}${test.endpoint}${params ? '?' + params : ''}`;
      
      console.log(`URL: ${url}`);
      const startTime = Date.now();
      const response = await fetch(url);
      const responseTime = Date.now() - startTime;

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = await response.text();
      }

      const result: TestResult = {
        name: test.name,
        endpoint: test.endpoint,
        success: response.status === test.expectedStatus,
        status: response.status,
        expectedStatus: test.expectedStatus,
        responseTime,
        response: responseData
      };

      if (response.status !== test.expectedStatus) {
        result.error = typeof responseData === 'string' ? responseData : JSON.stringify(responseData);
      }

      results.push(result);
      
      console.log(`Status: ${response.status} ${result.success ? '✓' : '✗'}`);
      console.log(`Time: ${responseTime}ms`);
      
    } catch (error) {
      console.error(`Error in test ${test.name}:`, error);
      results.push({
        name: test.name,
        endpoint: test.endpoint,
        success: false,
        status: 0,
        expectedStatus: test.expectedStatus,
        responseTime: 0,
        error: error.message
      });
    }
  }

  // Create results directory if it doesn't exist
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  // Save test results
  const apiResultsFile = path.join(RESULTS_DIR, 'api-test-results.json');
  fs.writeFileSync(apiResultsFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalTests: results.length,
    passedTests: results.filter(r => r.success).length,
    failedTests: results.filter(r => !r.success).length,
    results
  }, null, 2));

  // Generate Postman collection
  const postmanFile = path.join(RESULTS_DIR, 'postman_collection.json');
  const postmanCollection = {
    info: {
      name: "JioSaavn API Collection",
      description: "API collection for JioSaavn Unofficial API",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: tests.map(test => ({
      name: test.name,
      request: {
        method: test.method,
        header: [],
        url: {
          raw: `${BASE_URL}${test.endpoint}${test.params ? '?' + new URLSearchParams(test.params).toString() : ''}`,
          host: [BASE_URL],
          path: test.endpoint.split('/').filter(Boolean),
          query: test.params ? Object.entries(test.params).map(([key, value]) => ({
            key,
            value
          })) : []
        }
      }
    }))
  };

  fs.writeFileSync(postmanFile, JSON.stringify(postmanCollection, null, 2));

  // Print summary
  console.log('\nTest Summary:');
  console.log(`Total Tests: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  console.log(`\nResults saved to: ${apiResultsFile}`);
  console.log(`Postman collection saved to: ${postmanFile}`);
}

runTests().catch(console.error); 