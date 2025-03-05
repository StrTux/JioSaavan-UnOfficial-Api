import { describe, expect, test } from "bun:test";
import { app } from "../src";

describe("Top Artists API Tests", () => {
  describe("Top Artists Endpoint", () => {
    test("GET top artists should return valid data", async () => {
      const response = await app.request("/top-artists");
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe("Success");
      expect(data.message).toBe("✅ Top artists fetched successfully");
      expect(data.data).toBeDefined();
      
      // Validate data structure
      const artists = data.data;
      expect(Array.isArray(artists)).toBe(true);
      if (artists.length > 0) {
        const firstArtist = artists[0];
        expect(firstArtist).toHaveProperty("id");
        expect(firstArtist).toHaveProperty("name");
        expect(firstArtist).toHaveProperty("image");
        expect(firstArtist).toHaveProperty("type", "artist");
        expect(firstArtist).toHaveProperty("role");
      }
    });

    test("GET top artists with language filter", async () => {
      const response = await app.request("/top-artists?lang=hindi");
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe("Success");
      expect(data.data).toBeDefined();
      
      const artists = data.data;
      expect(Array.isArray(artists)).toBe(true);
      // Note: Language filtering is done at the search level, so we don't test for it in the response
    });

    test("GET top artists with limit", async () => {
      const limit = 5;
      const response = await app.request(`/top-artists?limit=${limit}`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe("Success");
      expect(data.data).toBeDefined();
      
      const artists = data.data;
      expect(artists.length).toBeLessThanOrEqual(limit);
    });
  });
}); 