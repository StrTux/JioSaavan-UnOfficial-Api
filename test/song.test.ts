import { describe, expect, test } from "bun:test";
import { writeFileSync } from "fs";

import { app } from "../src";

const BASE_URL = "http://localhost:3500";

interface SongDetails {
  id: string;
  name: string;
  album?: {
    id: string;
    name: string;
    url: string;
  };
  year?: string;
  releaseDate?: string;
  duration?: string;
  language?: string;
  downloadUrl?: string[];
  streamingUrl?: string;
  image?: string[];
  primaryArtists?: string;
  singers?: string[];
  artists?: Array<{
    id?: string;
    name: string;
    url?: string;
  }>;
  lyrics?: string;
  hasLyrics?: boolean;
  copyright?: string;
  label?: string;
}

interface SongResponse {
  status: string;
  message: string;
  data: SongDetails;
}

interface ErrorResponse {
  status: string;
  message: string;
  error: string;
}

async function saveResponseToFile(filename: string, data: any) {
  writeFileSync(filename, JSON.stringify(data, null, 2));
}

describe("Song API Tests", () => {
  describe("Song Details Endpoint", () => {
    test("GET song details by ID should return valid data", async () => {
      const songId = "GB4-dAV4WFs"; // Sanam Teri Kasam song ID
      const response = await fetch(`${BASE_URL}/song/${songId}`);
      expect(response.status).toBe(200);
      
      const data = await response.json() as SongResponse;
      expect(data.status).toBe("Success");
      expect(data.message).toBe("✅ Song details fetched successfully");
      expect(data.data).toBeDefined();
      
      await saveResponseToFile("test/responses/song.json", data);
      
      // Validate song details
      const songDetails = data.data;
      expect(songDetails.id).toBe(songId);
      expect(songDetails.name).toBeDefined();
      expect(songDetails.streamingUrl).toBeDefined();
      expect(songDetails.streamingUrl).toMatch(/^https?:\/\//);
      expect(songDetails.downloadUrl).toBeDefined();
      if (songDetails.downloadUrl) {
        expect(Array.isArray(songDetails.downloadUrl)).toBe(true);
        expect(songDetails.downloadUrl.length).toBeGreaterThan(0);
      }
      expect(songDetails.image).toBeDefined();
      if (songDetails.image) {
        expect(Array.isArray(songDetails.image)).toBe(true);
        expect(songDetails.image.length).toBeGreaterThan(0);
      }

      // Validate album details
      expect(songDetails.album).toBeDefined();
      expect(songDetails.album?.id).toBeDefined();
      expect(songDetails.album?.name).toBeDefined();
      expect(songDetails.album?.url).toBeDefined();
      expect(songDetails.album?.url).toMatch(/^https:\/\/www\.jiosaavn\.com\/album\//);

      // Validate artist details
      expect(songDetails.primaryArtists).toBeDefined();
      if (songDetails.primaryArtists) {
        expect(typeof songDetails.primaryArtists).toBe("string");
        expect(songDetails.primaryArtists.length).toBeGreaterThan(0);
      }
    });

    test("GET song details by URL should return valid data", async () => {
      const songUrl = "https://www.jiosaavn.com/song/sanam-teri-kasam/GB4-dAV4WFs";
      const response = await fetch(`${BASE_URL}/song?link=${encodeURIComponent(songUrl)}`);
      expect(response.status).toBe(200);
      
      const data = await response.json() as SongResponse;
      expect(data.status).toBe("Success");
      expect(data.message).toBe("✅ Song(s) Details fetched successfully");
      expect(data.data).toBeDefined();
      
      // Validate song details
      const songDetails = data.data;
      expect(songDetails.id).toBe("GB4-dAV4WFs");
      expect(songDetails.name).toBeDefined();
      expect(songDetails.streamingUrl).toBeDefined();
      expect(songDetails.streamingUrl).toMatch(/^https?:\/\//);
    });

    test("GET song details with invalid ID should return error", async () => {
      const response = await fetch(`${BASE_URL}/song/invalid_id`);
      expect(response.status).toBe(500);
      
      const data = await response.json() as ErrorResponse;
      expect(data.status).toBe("Error");
      expect(data.message).toBe("Failed to fetch song details");
      expect(data.error).toBeDefined();
    });

    test("GET song details with invalid URL should return error", async () => {
      const response = await fetch(`${BASE_URL}/song?link=https://invalid.com/song`);
      expect(response.status).toBe(500);
      
      const data = await response.json() as ErrorResponse;
      expect(data.status).toBe("Error");
      expect(data.message).toBe("Failed to fetch song details");
      expect(data.error).toBeDefined();
    });
  });
});
