import { describe, expect, test } from "bun:test";

import { app } from "../src";

describe("Playlist", () => {
  test("GET /playlist | Playlists Details (Error)", async () => {
    const response = await app.request("/playlist");

    expect(response.status).toBe(400);

    const playlists: any = await response.json();

    expect(playlists.status).toBe("Failed");
    expect(playlists.data).toBeNull();
  });

  test("GET /playlist?id=159144718 | Playlist Details by ID", async () => {
    const response = await app.request("/playlist?id=159144718");

    expect(response.status).toBe(200);

    const playlists: any = await response.json();

    expect(playlists.status).toBe("Success");
    expect(playlists.data).toHaveProperty("fan_count");
    expect(playlists.data.songs).toBeArray();
  });

  test("GET /playlist?id=159144718&camel=1 | Playlist Details by ID (Camel Case)", async () => {
    const response = await app.request("/playlist?id=159144718&camel=1");

    expect(response.status).toBe(200);

    const playlists: any = await response.json();

    expect(playlists.status).toBe("Success");
    expect(playlists.data).toHaveProperty("fanCount");
    expect(playlists.data.songs).toBeArray();
  });

  test("GET /playlist?id=1591____ | Playlist Details by ID (Invalid ID)", async () => {
    const response = await app.request("/playlist?id=1591____");

    expect(response.status).toBe(400);

    const playlists: any = await response.json();

    expect(playlists.status).toBe("Failed");
    expect(playlists.data).toBeNull();
  });

  test("GET /playlist?link=https://www.jiosaavn.com/featured/hindi-india-superhits-top-50/zlJfJYVuyjpxWb5,FqsjKg__ | Playlist Details by Link", async () => {
    const response = await app.request(
      "/playlist?link=https://www.jiosaavn.com/featured/hindi-india-superhits-top-50/zlJfJYVuyjpxWb5,FqsjKg__"
    );

    expect(response.status).toBe(200);

    const playlists: any = await response.json();

    expect(playlists.status).toBe("Success");
    expect(playlists.data).toHaveProperty("fan_count");
    expect(playlists.data.songs).toBeArray();
    expect(playlists.data.songs[0]).toHaveProperty("play_count");
  });

  test("GET /playlist/recommend?id=159144718 | Recommend Playlists", async () => {
    const response = await app.request("/playlist/recommend?id=159144718");

    expect(response.status).toBe(200);

    const recos: any = await response.json();

    expect(recos.status).toBe("Success");
    expect(Array.isArray(recos.data)).toBe(true);
  });

  test("GET /playlist/recommend?id=15914____ | Recommend Playlists (Invalid ID)", async () => {
    const response = await app.request("/playlist/recommend?id=15914____");

    expect(response.status).toBe(200); // Changed to 200 since we now return empty array instead of error

    const playlists: any = await response.json();

    expect(playlists.status).toBe("Success");
    expect(playlists.data).toBeArray();
    expect(playlists.data.length).toBe(0);
  });

  // Performance Tests
  describe("Performance Tests - Connection Pooling", () => {
    const CONCURRENT_REQUESTS = 5; // Reduced to avoid rate limiting
    const TEST_TIMEOUT = 30000; // 30 seconds timeout

    test("Connection Pool - Multiple Playlist Details Requests", async () => {
      const playlistId = "159144718"; // Sample playlist ID
      const requests = Array(CONCURRENT_REQUESTS).fill(null).map(() => 
        Promise.resolve(app.request(`/playlist?id=${playlistId}`))
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      // Verify all requests were either successful or rate limited
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });

      // Log performance metrics
      const totalTime = endTime - startTime;
      const avgTimePerRequest = totalTime / CONCURRENT_REQUESTS;
      console.log(`Playlist Details Connection Pool Metrics:`);
      console.log(`Total Time: ${totalTime}ms`);
      console.log(`Average Time per Request: ${avgTimePerRequest}ms`);
      console.log(`Requests per Second: ${(CONCURRENT_REQUESTS / (totalTime / 1000)).toFixed(2)}`);
    }, TEST_TIMEOUT);

    test("Connection Pool - Mixed Playlist Endpoints", async () => {
      const mixedRequests = [
        Promise.resolve(app.request(`/playlist?id=159144718`)),
        Promise.resolve(app.request(`/playlist/recommend?id=159144718`))
      ];

      const requests = [];
      for (let i = 0; i < 2; i++) { // Reduced iterations to avoid rate limiting
        requests.push(...mixedRequests);
      }

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      // Verify all requests were either successful or rate limited
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });

      // Log performance metrics
      const totalTime = endTime - startTime;
      const totalRequests = requests.length;
      console.log(`Mixed Playlist Endpoints Performance:`);
      console.log(`Total Requests: ${totalRequests}`);
      console.log(`Total Time: ${totalTime}ms`);
      console.log(`Average Time per Request: ${(totalTime / totalRequests).toFixed(2)}ms`);
      console.log(`Requests per Second: ${(totalRequests / (totalTime / 1000)).toFixed(2)}`);
    }, TEST_TIMEOUT);

    test("Connection Pool - Sequential vs Parallel Playlist Requests", async () => {
      const playlistId = "159144718";
      const numRequests = 3; // Reduced to avoid rate limiting

      // Sequential requests
      const sequentialStartTime = Date.now();
      for (let i = 0; i < numRequests; i++) {
        const response = await app.request(`/playlist?id=${playlistId}`);
        expect([200, 429]).toContain(response.status);
      }
      const sequentialTime = Date.now() - sequentialStartTime;

      // Parallel requests
      const parallelStartTime = Date.now();
      const parallelRequests = Array(numRequests).fill(null).map(() =>
        Promise.resolve(app.request(`/playlist?id=${playlistId}`))
      );
      const parallelResponses = await Promise.all(parallelRequests);
      parallelResponses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
      const parallelTime = Date.now() - parallelStartTime;

      // Log comparison metrics
      console.log(`Playlist Requests - Sequential vs Parallel Performance:`);
      console.log(`Sequential Execution Time: ${sequentialTime}ms`);
      console.log(`Parallel Execution Time: ${parallelTime}ms`);
      console.log(`Performance Improvement: ${((sequentialTime - parallelTime) / sequentialTime * 100).toFixed(2)}%`);
    }, TEST_TIMEOUT);
  });
});
