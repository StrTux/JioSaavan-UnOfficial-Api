import { describe, expect, test } from "bun:test";
import { writeFileSync } from "fs";

const BASE_URL = "http://localhost:3500";

interface JioSaavnAlbum {
  id: string;
  name: string;
  year?: string;
  language?: string;
  image?: string;
  url?: string;
  songs_count?: number;
  artists?: Array<{
    id?: string;
    name: string;
    url?: string;
  }>;
}

interface ApiResponse {
  status: string;
  message: string;
  data: JioSaavnAlbum[];
}

async function saveResponseToFile(filename: string, data: any) {
  writeFileSync(filename, JSON.stringify(data, null, 2));
}

describe("New Releases API Tests", () => {
  describe("New Releases Endpoint", () => {
    test("GET new releases should return valid data", async () => {
      const response = await fetch(`${BASE_URL}/new-releases`);
      expect(response.status).toBe(200);
      
      const data = await response.json() as ApiResponse;
      expect(data.status).toBe("Success");
      expect(data.message).toBe("✅ New releases fetched successfully");
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
      
      await saveResponseToFile("test/responses/new-releases.json", data);
      
      // Validate data structure
      const releases = data.data;
      if (releases.length > 0) {
        const firstRelease = releases[0];
        expect(firstRelease).toHaveProperty("id");
        expect(firstRelease).toHaveProperty("name");
        expect(firstRelease).toHaveProperty("url");
        expect(firstRelease).toHaveProperty("language");
        expect(firstRelease).toHaveProperty("artists");
        expect(Array.isArray(firstRelease.artists)).toBe(true);

        // Validate URL format
        expect(firstRelease.url).toMatch(/^https:\/\/www\.jiosaavn\.com\/(album|song)\//);

        // Validate ID format
        expect(firstRelease.id).toBeTruthy();
        expect(firstRelease.id.length).toBeGreaterThan(0);

        // Validate name
        expect(firstRelease.name).toBeTruthy();
        expect(firstRelease.name.length).toBeGreaterThan(0);

        // Validate artists if present
        if (firstRelease.artists && firstRelease.artists.length > 0) {
          const firstArtist = firstRelease.artists[0];
          expect(firstArtist).toHaveProperty("name");
          expect(firstArtist.name).toBeTruthy();
          expect(firstArtist.name.length).toBeGreaterThan(0);
        }
      }
    });

    test("GET new releases with language filter", async () => {
      const response = await fetch(`${BASE_URL}/new-releases?lang=hindi`);
      expect(response.status).toBe(200);
      
      const data = await response.json() as ApiResponse;
      expect(data.status).toBe("Success");
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
      
      const releases = data.data;
      if (releases.length > 0) {
        releases.forEach(release => {
          expect(release.language).toBe("hindi");
        });
      }
    });

    test("GET new releases with limit", async () => {
      const limit = 5;
      const response = await fetch(`${BASE_URL}/new-releases?limit=${limit}`);
      expect(response.status).toBe(200);
      
      const data = await response.json() as ApiResponse;
      expect(data.status).toBe("Success");
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
      
      const releases = data.data;
      expect(releases.length).toBeLessThanOrEqual(limit);
    });

    test("GET new releases with offset", async () => {
      // First, get initial releases
      const firstResponse = await fetch(`${BASE_URL}/new-releases?limit=5`);
      const firstData = await firstResponse.json() as ApiResponse;
      const firstReleases = firstData.data;

      // Then, get releases with offset
      const response = await fetch(`${BASE_URL}/new-releases?limit=5&offset=5`);
      expect(response.status).toBe(200);
      
      const data = await response.json() as ApiResponse;
      expect(data.status).toBe("Success");
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
      
      const releases = data.data;
      if (releases.length > 0 && firstReleases.length > 0) {
        // Verify that the offset releases are different from the first releases
        expect(releases[0].id).not.toBe(firstReleases[0].id);
      }
    });

    test("GET new releases with invalid language should return empty data", async () => {
      const response = await fetch(`${BASE_URL}/new-releases?lang=invalid`);
      expect(response.status).toBe(200);
      
      const data = await response.json() as ApiResponse;
      expect(data.status).toBe("Success");
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBe(0);
    });
  });
}); 