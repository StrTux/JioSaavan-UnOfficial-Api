import { describe, expect, test } from "bun:test";
import { app } from "../src";

describe("Search Extended Tests", () => {
  // Test search with special characters
  test("GET /search?q=!@#$%^&* | Search with special characters", async () => {
    const response = await app.request("/search?q=!@#$%^&*");
    expect(response.status).toBe(200);

    const results: any = await response.json();
    expect(results.status).toBe("Success");
    expect(results.data).toHaveProperty("topQuery");
    expect(results.data).toHaveProperty("songs");
    expect(results.data).toHaveProperty("albums");
    expect(results.data).toHaveProperty("artists");
    expect(results.data).toHaveProperty("playlists");
  });

  // Test search with multiple languages
  test("GET /search/songs?q=love&language=hindi,english | Multi-language search", async () => {
    const response = await app.request("/search/songs?q=love&language=hindi,english");
    expect(response.status).toBe(200);

    const results: any = await response.json();
    expect(results.status).toBe("Success");
    expect(results.data).toBeArray();
    if (results.data.length > 0) {
      expect(results.data[0]).toHaveProperty("language");
    }
  });

  // Test search pagination
  test("GET /search/songs?q=love&page=2 | Search pagination", async () => {
    const response = await app.request("/search/songs?q=love&page=2");
    expect(response.status).toBe(200);

    const results: any = await response.json();
    expect(results.status).toBe("Success");
    expect(results.data).toBeArray();
  });

  // Test search with limit
  test("GET /search/songs?q=love&limit=5 | Search with limit", async () => {
    const response = await app.request("/search/songs?q=love&limit=5");
    expect(response.status).toBe(200);

    const results: any = await response.json();
    expect(results.status).toBe("Success");
    expect(results.data).toBeArray();
    expect(results.data.length).toBeLessThanOrEqual(5);
  });

  // Test search with very long query
  test("GET /search?q=verylongquerystringverylongquerystringverylongquerystring | Long query search", async () => {
    const response = await app.request("/search?q=verylongquerystringverylongquerystringverylongquerystring");
    expect(response.status).toBe(200);

    const results: any = await response.json();
    expect(results.status).toBe("Success");
  });

  // Test search with numbers
  test("GET /search?q=123456789 | Search with numbers", async () => {
    const response = await app.request("/search?q=123456789");
    expect(response.status).toBe(200);

    const results: any = await response.json();
    expect(results.status).toBe("Success");
  });

  // Test search results structure for each type
  test("GET /search?q=love | Verify all result types structure", async () => {
    const response = await app.request("/search?q=love");
    expect(response.status).toBe(200);

    const results: any = await response.json();
    
    // Check songs structure
    if (results.data.songs.length > 0) {
      const song = results.data.songs[0];
      expect(song).toHaveProperty("id");
      expect(song).toHaveProperty("name");
      expect(song).toHaveProperty("album");
      expect(song).toHaveProperty("year");
      expect(song).toHaveProperty("primary_artists");
      expect(song).toHaveProperty("image");
    }

    // Check albums structure
    if (results.data.albums.length > 0) {
      const album = results.data.albums[0];
      expect(album).toHaveProperty("id");
      expect(album).toHaveProperty("name");
      expect(album).toHaveProperty("year");
      expect(album).toHaveProperty("image");
    }

    // Check artists structure
    if (results.data.artists.length > 0) {
      const artist = results.data.artists[0];
      expect(artist).toHaveProperty("id");
      expect(artist).toHaveProperty("name");
      expect(artist).toHaveProperty("image");
      expect(artist).toHaveProperty("url");
    }

    // Check playlists structure
    if (results.data.playlists.length > 0) {
      const playlist = results.data.playlists[0];
      expect(playlist).toHaveProperty("id");
      expect(playlist).toHaveProperty("title");
      expect(playlist).toHaveProperty("image");
      expect(playlist).toHaveProperty("url");
    }
  });

  // Test search with empty query
  test("GET /search?q= | Empty query search", async () => {
    const response = await app.request("/search?q=");
    expect(response.status).toBe(400);

    const results: any = await response.json();
    expect(results.status).toBe("Failed");
    expect(results.message).toBeTruthy();
  });

  // Test search with whitespace query
  test("GET /search?q=   | Whitespace query search", async () => {
    const response = await app.request("/search?q=   ");
    expect(response.status).toBe(400);

    const results: any = await response.json();
    expect(results.status).toBe("Failed");
    expect(results.message).toBeTruthy();
  });

  // Test search with invalid language
  test("GET /search/songs?q=love&language=invalid | Invalid language search", async () => {
    const response = await app.request("/search/songs?q=love&language=invalid");
    expect(response.status).toBe(200);

    const results: any = await response.json();
    expect(results.status).toBe("Success");
    expect(results.data).toBeArray();
  });

  // Test search with multiple spaces
  test("GET /search?q=hello   world | Multiple spaces in query", async () => {
    const response = await app.request("/search?q=hello   world");
    expect(response.status).toBe(200);

    const results: any = await response.json();
    expect(results.status).toBe("Success");
  });
}); 