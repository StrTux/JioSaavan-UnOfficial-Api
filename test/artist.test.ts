import { describe, expect, test } from "bun:test";

import { app } from "../src";

// Test configuration with real artist IDs
const TEST_CONFIG = {
  artistIds: [
    "459320",   // Arijit Singh
    "568707",   // Ed Sheeran
    "455926",   // Neha Kakkar
    "456863"    // A.R. Rahman
  ],
  languages: ["hindi", "english", "punjabi", "tamil"],
  categories: ["latest", "alphabetical", "popularity"]
};

interface Artist {
  id: string;
  name: string;
  url: string;
  image: Array<{
    quality: string;
    link: string;
  }>;
  followerCount: string;
  fanCount: string;
  isVerified: boolean;
  dominantLanguage: string;
  dominantType: string;
  bio: string[];
}

interface ArtistResponse {
  status: string;
  message: string;
  data: Artist;
}

interface SearchResponse {
  status: string;
  message: string;
  data: {
    total: number;
    start: number;
    results: any[];
  };
}

describe("JioSaavn Artist API Tests", () => {
  // Test Artist Details Endpoint
  describe("Artist Details Endpoint", () => {
    test("GET /artist | Error - Missing Artist ID", async () => {
      const response = await app.request("/artist");
      expect(response.status).toBe(400);

      const result = await response.json() as { status: string; message: string };
      expect(result.status).toBe("Failed");
      expect(result.message).toBe("❌ Please provide Artist id, link or token");
    });

    test("GET /artist | Error - Invalid Artist ID", async () => {
      const response = await app.request("/artist?artistid=invalid_id");
      expect(response.status).toBe(400);

      const result = await response.json() as { status: string };
      expect(result.status).toBe("Failed");
    });

    test("GET /artist | Error - Both ID and Link provided", async () => {
      const response = await app.request("/artist?artistid=459320&link=https://www.jiosaavn.com/artist/arijit-singh");
      expect(response.status).toBe(400);

      const result = await response.json() as { status: string; message: string };
      expect(result.status).toBe("Failed");
      expect(result.message).toBe("❌ Please provide either Artist id or link");
    });

    test("GET /artist | Error - Invalid JioSaavn Link", async () => {
      const response = await app.request("/artist?link=https://invalid-link.com/artist");
      expect(response.status).toBe(400);

      const result = await response.json() as { status: string; message: string };
      expect(result.status).toBe("Failed");
      expect(result.message).toBe("❌ Please provide a valid JioSaavn link");
    });
  });

  // Test Artist Songs Endpoint
  describe("Artist Songs Endpoint", () => {
    test("GET /artist/songs | Error - Missing Artist ID", async () => {
      const response = await app.request("/artist/songs");
      expect(response.status).toBe(400);

      const result = await response.json() as { status: string; message: string };
      expect(result.status).toBe("Failed");
      expect(result.message).toBe("❌ Please provide artist id.");
    });

    test("GET /artist/songs | Error - Invalid Artist ID", async () => {
      const response = await app.request("/artist/songs?artistid=invalid_id");
      expect(response.status).toBe(400);

      const result = await response.json() as { status: string };
      expect(result.status).toBe("Failed");
    });
  });

  // Test Artist Albums Endpoint
  describe("Artist Albums Endpoint", () => {
    test("GET /artist/albums | Error - Missing Artist ID", async () => {
      const response = await app.request("/artist/albums");
      expect(response.status).toBe(400);

      const result = await response.json() as { status: string; message: string };
      expect(result.status).toBe("Failed");
      expect(result.message).toBe("❌ Please provide artist id.");
    });

    test("GET /artist/albums | Error - Invalid Artist ID", async () => {
      const response = await app.request("/artist/albums?artistid=invalid_id");
      expect(response.status).toBe(400);

      const result = await response.json() as { status: string };
      expect(result.status).toBe("Failed");
    });
  });

  // Test Artist Top Songs with Categories
  describe("Artist Top Songs with Categories", () => {
    TEST_CONFIG.categories.forEach((category) => {
      test(`GET artist top songs with category=${category}`, async () => {
        const response = await app.request(
          `/artist/top-songs?artist_id=${TEST_CONFIG.artistIds[0]}&cat=${category}`
        );
        expect(response.status).toBe(400); // Expecting 400 as this endpoint requires both artist_id and song_id

        const result = await response.json() as { status: string };
        expect(result.status).toBe("Failed");
      });
    });
  });

  // Test Artist Search
  describe("Artist Search", () => {
    TEST_CONFIG.languages.forEach((language) => {
      test(`GET artist search with language=${language}`, async () => {
        const response = await app.request(
          `/search/artists?q=top&language=${language}`
        );
        expect(response.status).toBe(200); // Search endpoint returns 200 with valid query

        const result = await response.json() as SearchResponse;
        expect(result.status).toBe("Success");
        expect(result.data).toHaveProperty("results");
        expect(Array.isArray(result.data.results)).toBe(true);
      });
    });

    test("GET /search/artists | Error - Empty Query", async () => {
      const response = await app.request("/search/artists?q=");
      expect(response.status).toBe(400);

      const result = await response.json() as { status: string };
      expect(result.status).toBe("Failed");
    });

    test("GET /search/artists | Valid Search", async () => {
      const response = await app.request("/search/artists?q=arijit");
      expect(response.status).toBe(200);

      const result = await response.json() as SearchResponse;
      expect(result.status).toBe("Success");
      expect(result.data).toHaveProperty("results");
      expect(Array.isArray(result.data.results)).toBe(true);
    });
  });

  // Performance Tests
  describe("Performance Tests", () => {
    const CONCURRENT_REQUESTS = 3; // Reduced to avoid rate limiting
    const TEST_TIMEOUT = 30000; // 30 seconds timeout

    test("Concurrent Artist Details Requests - Error Cases", async () => {
      const artistId = TEST_CONFIG.artistIds[0];
      const requests = Array(CONCURRENT_REQUESTS)
        .fill(null)
        .map(() => app.request(`/artist?artistid=${artistId}`));

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      // Responses should be either 400 (Bad Request) or 429 (Too Many Requests)
      responses.forEach((response) => {
        expect([400, 429]).toContain(response.status);
      });

      console.log(`Total time for ${CONCURRENT_REQUESTS} requests: ${endTime - startTime}ms`);
      console.log(`Average time per request: ${(endTime - startTime) / CONCURRENT_REQUESTS}ms`);
    }, TEST_TIMEOUT);
  });
});
