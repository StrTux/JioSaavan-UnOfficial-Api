import { describe, expect, test } from "bun:test";

const BASE_URL = "https://strtux-main.vercel.app";

const LANGUAGES = [
  "hindi",
  "english",
  "punjabi",
  "tamil",
  "telugu",
  "marathi",
  "gujarati",
  "bengali",
  "kannada",
  "bhojpuri",
  "malayalam",
  "urdu",
  "haryanvi",
  "rajasthani",
  "odia",
  "assamese",
];

interface Album {
  id: string;
  name: string;
  type: string;
  language: string;
  year: number;
  image: Array<{ quality: string; link: string }>;
  artist_map: object;
  song_count: number;
  songs: any[];
}

interface AlbumsResponse {
  status: string;
  message: string;
  data: {
    total: number;
    start: number;
    results: Album[];
  };
}

describe("🌐 JioSaavn Album Language Search API Tests", () => {
  LANGUAGES.forEach((language) => {
    test(`GET /search/albums?q=${language} should return valid albums`, async () => {
      const response = await fetch(`${BASE_URL}/search/albums?q=${language}`);
      expect(response.status).toBe(200);
      const data = await response.json() as AlbumsResponse;

      expect(data.status).toBe("Success");
      expect(data.message).toBe("✅ Search results fetched successfully");
      expect(Array.isArray(data.data.results)).toBe(true);
      expect(data.data.results.length).toBeGreaterThan(0);

      const album = data.data.results[0];
      expect(album).toHaveProperty("id");
      expect(album).toHaveProperty("name");
      expect(album).toHaveProperty("type", "album");
      expect(album).toHaveProperty("language");
      expect(album.language.toLowerCase()).toContain(language.toLowerCase()); // optional fuzzy match
      expect(album).toHaveProperty("year");
      expect(Array.isArray(album.image)).toBe(true);
      expect(album).toHaveProperty("artist_map");
      expect(album).toHaveProperty("song_count");
    });
  });
});
