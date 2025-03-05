import { describe, expect, test, beforeAll } from "bun:test";
import { app } from "../src";

// JioSaavn के response structure के अनुसार Interface
interface Album {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  language: string;
  play_count: number;
  duration: number;
  explicit: boolean;
  year: number;
  url: string;
  header_desc: string;
  list_count: number;
  list_type: string;
  image: Array<{
    quality: string;
    link: string;
  }>;
  artist_map: {
    artists: Array<{
      id: string;
      name: string;
      url: string;
      role: string;
      type: string;
      image: string;
    }>;
    featured_artists: any[];
    primary_artists: Array<{
      id: string;
      name: string;
      url: string;
      role: string;
      type: string;
      image: string;
    }>;
  };
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

// टेस्ट कॉन्फ़िगरेशन – वास्तविक album IDs का उपयोग
const TEST_CONFIG = {
  albumIds: [
    "tFptJWy0HPM_",  // Thandel by Devi Sri Prasad
    "KxURLGjeQg4_",  // Jo Tum Mere Ho by Anuv Jain
    "KvUd6uRIrts_",  // Jhol by Maanu, Annural Khalid
    "HvA1Hqgh83E_",  // Sanam Teri Kasam by Himesh Reshammiya
    "kArqawD7cKk_"   // Devara Part 1 - Telugu by Anirudh Ravichander
  ],
  numAlbumsToTest: 5
};

describe("JioSaavn Album API Tests", () => {

  // एल्बम लिस्ट का endpoint टेस्ट
  describe("Album List Endpoint", () => {
    test("GET album list should return valid albums", async () => {
      const response = await app.request("/search/albums?q=latest");
      expect(response.status).toBe(200);
      const data = await response.json() as AlbumsResponse;
      expect(data.status).toBe("Success");
      expect(data.message).toBe("✅ Search results fetched successfully");
      expect(Array.isArray(data.data.results)).toBe(true);
      expect(data.data.results.length).toBeGreaterThan(0);

      // Validate first album structure
      const album = data.data.results[0];
      expect(album).toHaveProperty("id");
      expect(album).toHaveProperty("name");
      expect(album).toHaveProperty("type", "album");
      expect(album).toHaveProperty("language");
      expect(album).toHaveProperty("year");
      expect(album).toHaveProperty("image");
      expect(Array.isArray(album.image)).toBe(true);
      expect(album).toHaveProperty("artist_map");
      expect(album).toHaveProperty("song_count");
    });
  });

  // एल्बम डिटेल्स का endpoint टेस्ट
  describe("Album Details Endpoint", () => {
    TEST_CONFIG.albumIds.forEach((token) => {
      test(`GET album details for token=${token}`, async () => {
        const response = await app.request(`/album?token=${token}`);
        expect(response.status).toBe(200);
        const albumData = await response.json() as { status: string; message: string; data: Album };
        expect(albumData.status).toBe("Success");
        expect(albumData.message).toBe("✅ Album Details fetched successfully");
        
        // Validate album structure
        const album = albumData.data;
        expect(album).toHaveProperty("id");
        expect(album).toHaveProperty("name");
        expect(album).toHaveProperty("type", "album");
        expect(album).toHaveProperty("language");
        expect(album).toHaveProperty("year");
        expect(album).toHaveProperty("image");
        expect(Array.isArray(album.image)).toBe(true);
        expect(album).toHaveProperty("artist_map");
        expect(album).toHaveProperty("song_count");

        // यदि गाने (songs) उपलब्ध हैं तो उनकी संरचना validate करें
        if (album.songs && album.songs.length > 0) {
          expect(Array.isArray(album.songs)).toBe(true);
          album.songs.forEach((song) => {
            expect(song).toHaveProperty("id");
            expect(song).toHaveProperty("name");
            expect(song).toHaveProperty("duration");
            expect(song).toHaveProperty("download_url");
            expect(song).toHaveProperty("play_count");
          });
        }
      });
    });
  });
});
