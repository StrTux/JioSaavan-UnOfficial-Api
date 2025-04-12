import { Hono } from "hono";
import { api } from "../lib/api";
import { config } from "../lib/config";
import { validLangs } from "../lib/utils";
import { artistMiniPayload } from "../payloads/artist.payload";
import { ArtistMiniRequest } from "../types/artist";

interface SearchResult {
  results?: Array<{
    id: string;
    name: string;
    image: string;
    type: string;
    role: string;
    perma_url: string;
  }>;
}

// Expanded list of default artists
const defaultArtists = [
  "Arijit Singh",
  "Neha Kakkar",
  "Justin Bieber",
  "Atif Aslam",
  "Diljit Dosanjh",
  "Yo Yo Honey Singh",
  "Badshah",
  "Nucleya",
  "Sonu Nigam",
  "Lata Mangeshkar",
  "A.R. Rahman",
  "Shreya Ghoshal",
  "Guru Randhawa",
  "Jubin Nautiyal",
  "Darshan Raval",
  "Asha Bhosle",
  "Ed Sheeran",
  "Kishore Kumar",
  "Pritam",
  "Taylor Swift",
  "Armaan Malik",
  "Alka Yagnik",
  "B Praak",
  "Mohammed Rafi",
  "Drake",
  "Post Malone",
  "Vishal-Shekhar",
  "Kumar Sanu",
  "Udit Narayan",
  "Akon"
];

const topArtists = new Hono();

/**
 * Get top artists
 * 
 * This endpoint returns a list of top artists. Each artist object includes:
 * - id: Artist's unique identifier
 * - name: Artist's name
 * - image: Artist's image (500x500 resolution)
 * - role: Artist's role (e.g., "Artist")
 * - type: Entity type (always "artist")
 * - url: URL to the artist's page on JioSaavn
 * - songs_url: URL to fetch all songs by this artist
 * 
 * To get all songs by an artist, use the provided songs_url:
 * GET /artist/{id}
 * 
 * Example: If an artist has id "464932", fetch their songs with:
 * GET /artist/464932
 */
topArtists.get("/", async (c) => {
  const { lang = "", limit = "20", offset = "0" } = c.req.query();

  try {
    // Use search endpoint to get details for default artists
    const promises = defaultArtists.map(artist => 
      api(config.endpoint.search.artists, {
        query: {
          q: artist,
          language: validLangs(lang),
          n: "1",
          p: "1"
        },
        retries: 2 // Add a retry option
      }) as Promise<SearchResult>
    );

    // Use Promise.allSettled to handle partial failures
    const results = await Promise.allSettled(promises);
    
    // Extract successful results and filter out undefined values
    const artists = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<SearchResult>).value?.results?.[0])
      .filter(artist => artist !== undefined)
      // Cast each artist to ArtistMiniRequest type and apply the transformer
      .map(artist => {
        const transformed = artistMiniPayload({
          ...artist,
          type: "artist" as const
        } as ArtistMiniRequest);
        
        // Add songs_url property to easily access artist's songs
        return {
          ...transformed,
          songs_url: `/search?q=${encodeURIComponent(transformed.name)}&type=artist`
        };
      });

    // Check if we have any results
    if (artists.length === 0) {
      return c.json({
        status: "Failed",
        message: "Failed to fetch top artists data",
        data: []
      }, 500);
    }

    // Return the artists with pagination
    return c.json({
      status: "Success",
      message: "✅ Top artists fetched successfully",
      data: artists.slice(+offset, +offset + +limit)
    });
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return c.json({
      status: "Failed",
      message: "Failed to fetch top artists",
      error: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

export { topArtists }; 