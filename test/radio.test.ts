import { describe, expect, test } from "bun:test";

import { app } from "../src";

// Radio Station Categories from JioSaavn
const RADIO_STATIONS = {
  hindi: [
    "Baal Geet",
    "Shri Hari Narayan",
    "Bollywood Classics 30s-40s",
    "Jai Shri Krishna",
    "Jai Jinendra",
    "Remix Dhamaal",
    "Sufiyana Safar",
    "Jai Shiv Shankar",
    "Desi Hip Hop",
    "Shri Sai Baba",
    "Dukhi Mann",
    "Jai Shri Ram",
    "Drivetime Dhun",
    "Mehfil-e-Ghazal",
    "Jai Ganesh Deva",
    "Unlimited Khushiyan",
    "Chill Karo",
    "Yeshu Masih",
    "Bhakti Rachna",
    "Hindustani Sangeet",
    "Hindi Superhits",
    "Pyaar Ka Safar",
    "90s Nostalgia",
    "Madhur Kirtan",
    "Bollywood Retro 70s-80s",
    "Jai Ambe Mata",
    "Hindi Musical Covers",
    "Workout Karo"
  ],
  artists: [
    "Arijit Singh",
    "A.R. Rahman",
    "Neha Kakkar",
    "Badshah",
    "Shreya Ghoshal",
    "Atif Aslam",
    "Lata Mangeshkar",
    "Kishore Kumar",
    "Mohammed Rafi"
  ],
  categories: [
    "Bhakti",
    "Bollywood",
    "Retro",
    "Romance",
    "Party",
    "Chill",
    "Workout",
    "Devotional",
    "Classical"
  ]
};

// Radio Station Types
const STATION_TYPES = {
  featured: "featured",
  artist: "artist",
  entity: "entity",
  genre: "genre",
  language: "language"
};

describe("Radio API Tests", () => {
  // Test Featured Radio Stations
  describe("Featured Radio Stations", () => {
    RADIO_STATIONS.hindi.forEach(stationName => {
      test(`GET /radio/featured?name=${stationName} | Create Featured Radio`, async () => {
        const response = await app.request(`/radio/featured?name=${encodeURIComponent(stationName)}`);
        expect(response.status).toBe(200);

        const station: any = await response.json();
        expect(station.status).toBe("Success");
        expect(station.data).toHaveProperty("station_id");
        
        // Log station details
        console.log(`Created featured radio: ${stationName}`);
        console.log(`Station ID: ${station.data.station_id}`);
      });
    });

    test("GET /radio/featured | Error - Missing Name", async () => {
      const response = await app.request("/radio/featured");
      expect(response.status).toBe(400);

      const station: any = await response.json();
      expect(station.status).toBe("Failed");
    });
  });

  // Test Artist Radio Stations
  describe("Artist Radio Stations", () => {
    RADIO_STATIONS.artists.forEach(artistName => {
      test(`GET /radio/artist?name=${artistName} | Create Artist Radio`, async () => {
        const response = await app.request(`/radio/artist?name=${encodeURIComponent(artistName)}`);
        expect(response.status).toBe(200);

        const station: any = await response.json();
        expect(station.status).toBe("Success");
        expect(station.data).toHaveProperty("station_id");

        // Log artist station details
        console.log(`Created artist radio: ${artistName}`);
        console.log(`Station ID: ${station.data.station_id}`);
      });
    });

    test("GET /radio/artist | Error - Missing Artist Name", async () => {
      const response = await app.request("/radio/artist");
      expect(response.status).toBe(400);

      const station: any = await response.json();
      expect(station.status).toBe("Failed");
    });
  });

  // Test Entity Radio Stations
  describe("Entity Radio Stations", () => {
    const TEST_ENTITIES = [
      { id: "5WXAlMNt", type: "song" },
      { id: "1142502", type: "album" },
      { id: "159144718", type: "playlist" }
    ];

    TEST_ENTITIES.forEach(entity => {
      test(`GET /radio/entity?id=${entity.id}&type=${entity.type} | Create Entity Radio`, async () => {
        const response = await app.request(`/radio/entity?id=${entity.id}&type=${entity.type}`);
        expect(response.status).toBe(200);

        const station: any = await response.json();
        expect(station.status).toBe("Success");
        expect(station.data).toHaveProperty("station_id");

        // Log entity station details
        console.log(`Created ${entity.type} radio for ID: ${entity.id}`);
        console.log(`Station ID: ${station.data.station_id}`);
      });
    });

    test("GET /radio/entity | Error - Missing Parameters", async () => {
      const response = await app.request("/radio/entity");
      expect(response.status).toBe(400);

      const station: any = await response.json();
      expect(station.status).toBe("Failed");
    });
  });

  // Test Radio Songs Endpoint
  describe("Radio Songs", () => {
    test("GET /radio/songs | Get Songs from Station", async () => {
      // First create a station
      const createResponse = await app.request("/radio/featured?name=Hindi Superhits");
      expect(createResponse.status).toBe(200);
      
      const station: any = await createResponse.json();
      expect(station.status).toBe("Success");
      expect(station.data).toHaveProperty("station_id");

      // Then get songs from that station
      const songsResponse = await app.request(`/radio/songs?id=${station.data.station_id}`);
      expect(songsResponse.status).toBe(200);

      const songs: any = await songsResponse.json();
      expect(songs.status).toBe("Success");
      expect(songs.data).toHaveProperty("songs");
      expect(Array.isArray(songs.data.songs)).toBe(true);

      // Log songs details
      console.log(`Retrieved songs from station ID: ${station.data.station_id}`);
      console.log(`Number of songs: ${songs.data.songs.length}`);
    });

    test("GET /radio/songs | Error - Missing Station ID", async () => {
      const response = await app.request("/radio/songs");
      expect(response.status).toBe(400);

      const result: any = await response.json();
      expect(result.status).toBe("Failed");
    });
  });

  // Test Category Radio Stations
  describe("Category Radio Stations", () => {
    RADIO_STATIONS.categories.forEach(category => {
      test(`GET /radio/category?name=${category} | Create Category Radio`, async () => {
        const response = await app.request(`/radio/category?name=${encodeURIComponent(category)}`);
        expect(response.status).toBe(200);

        const station: any = await response.json();
        expect(station.status).toBe("Success");
        expect(station.data).toHaveProperty("station_id");

        // Log category station details
        console.log(`Created category radio: ${category}`);
        console.log(`Station ID: ${station.data.station_id}`);
      });
    });
  });

  // Test Featured Stations List
  describe("Featured Stations", () => {
    test("GET /get/featured-stations | Get All Featured Stations", async () => {
      const response = await app.request("/get/featured-stations");
      expect(response.status).toBe(200);

      const result: any = await response.json();
      expect(result.status).toBe("Success");
      expect(Array.isArray(result.data)).toBe(true);

      // Log featured stations
      console.log(`Retrieved ${result.data.length} featured stations`);
      result.data.slice(0, 5).forEach((station: any) => {
        console.log(`- ${station.name} (${station.language})`);
      });
    });
  });
});
