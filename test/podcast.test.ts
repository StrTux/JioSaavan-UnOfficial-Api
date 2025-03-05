import { describe, expect, test } from "bun:test";
import { app } from "../src";

// Podcast Categories from JioSaavn
const PODCASTS = {
  trending: [
    "Krishna - The Supreme Soul",
    "DHADKANE MERI SUN",
    "Bhagvat Gita quotes|Mahabharat Shri Krishna quotes",
    "Bakwaas Bandh Kar",
    "लव स्टोरी",
    "IAS Prachi | आईएएस प्राची",
    "Kabir Ke Dohe"
  ],
  categories: [
    "Spirituality",
    "Stories",
    "True Crime",
    "Education",
    "Entertainment",
    "News",
    "Business",
    "Health & Lifestyle",
    "Sports",
    "Technology"
  ]
};

describe("Podcast API Tests", () => {
  // Test Trending Podcasts
  describe("Trending Podcasts", () => {
    test("GET /podcast/trending | Get Trending Podcasts", async () => {
      const response = await app.request("/podcast/trending");
      expect(response.status).toBe(200);

      const result: any = await response.json();
      expect(result.status).toBe("Success");
      expect(Array.isArray(result.data)).toBe(true);

      // Validate podcast structure
      if (result.data.length > 0) {
        const podcast = result.data[0];
        expect(podcast).toHaveProperty("id");
        expect(podcast).toHaveProperty("title");
        expect(podcast).toHaveProperty("type");
        expect(podcast).toHaveProperty("image");
        expect(podcast).toHaveProperty("url");

        // Log trending podcasts
        console.log("Trending Podcasts:");
        result.data.slice(0, 5).forEach((p: any) => {
          console.log(`- ${p.title} (${p.type})`);
        });
      }
    });
  });

  // Test Podcast Categories
  describe("Podcast Categories", () => {
    PODCASTS.categories.forEach(category => {
      test(`GET /podcast/category/${category} | Get ${category} Podcasts`, async () => {
        const response = await app.request(`/podcast/category/${encodeURIComponent(category)}`);
        expect(response.status).toBe(200);

        const result: any = await response.json();
        expect(result.status).toBe("Success");
        expect(Array.isArray(result.data)).toBe(true);

        // Log category podcasts
        console.log(`${category} Podcasts:`);
        result.data.slice(0, 3).forEach((p: any) => {
          console.log(`- ${p.title}`);
        });
      });
    });
  });

  // Test Podcast Episodes
  describe("Podcast Episodes", () => {
    test("GET /podcast/episodes?id={id} | Get Podcast Episodes", async () => {
      // First get a podcast ID from trending
      const trendingResponse = await app.request("/podcast/trending");
      const trending: any = await trendingResponse.json();
      const podcastId = trending.data[0].id;

      // Get episodes
      const response = await app.request(`/podcast/episodes?id=${podcastId}`);
      expect(response.status).toBe(200);

      const result: any = await response.json();
      expect(result.status).toBe("Success");
      expect(Array.isArray(result.data)).toBe(true);

      if (result.data.length > 0) {
        const episode = result.data[0];
        expect(episode).toHaveProperty("id");
        expect(episode).toHaveProperty("title");
        expect(episode).toHaveProperty("url");

        // Log episodes
        console.log(`Episodes for podcast ID ${podcastId}:`);
        result.data.slice(0, 3).forEach((ep: any) => {
          console.log(`- ${ep.title} (${ep.duration || ""})`);
        });
      }
    });
  });

  // Test Featured Podcasts
  describe("Featured Podcasts", () => {
    test("GET /podcast/featured | Get Featured Podcasts", async () => {
      const response = await app.request("/podcast/featured");
      expect(response.status).toBe(200);

      const result: any = await response.json();
      expect(result.status).toBe("Success");
      expect(Array.isArray(result.data)).toBe(true);

      // Log featured podcasts
      console.log("Featured Podcasts:");
      result.data.slice(0, 5).forEach((p: any) => {
        console.log(`- ${p.title} (${p.category || ""})`);
      });
    });
  });

  // Test New Releases
  describe("New Releases", () => {
    test("GET /podcast/new | Get New Podcast Releases", async () => {
      const response = await app.request("/podcast/new");
      expect(response.status).toBe(200);

      const result: any = await response.json();
      expect(result.status).toBe("Success");
      expect(Array.isArray(result.data)).toBe(true);

      // Log new releases
      console.log("New Podcast Releases:");
      result.data.slice(0, 5).forEach((p: any) => {
        console.log(`- ${p.title} (Released: ${p.release_date || ""})`);
      });
    });
  });

  // Performance Tests
  describe("Performance Tests", () => {
    const CONCURRENT_REQUESTS = 3; // Reduced to avoid rate limiting
    const TEST_TIMEOUT = 30000; // 30 seconds timeout

    test("Multiple Concurrent Requests", async () => {
      const requests = [
        app.request("/podcast/trending"),
        app.request("/podcast/featured"),
        app.request("/podcast/new")
      ];

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      // Verify all requests were successful
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });

      // Log performance metrics
      const totalTime = endTime - startTime;
      const avgTimePerRequest = totalTime / CONCURRENT_REQUESTS;
      console.log(`Performance Metrics:`);
      console.log(`Total Time: ${totalTime}ms`);
      console.log(`Average Time per Request: ${avgTimePerRequest}ms`);
      console.log(`Requests per Second: ${(CONCURRENT_REQUESTS / (totalTime / 1000)).toFixed(2)}`);
    }, TEST_TIMEOUT);
  });
}); 