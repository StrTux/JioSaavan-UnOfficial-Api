import { Hono } from "hono";
import { api } from "../lib/api";
import { config } from "../lib/config";
import { validLangs } from "../lib/utils";

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
  "Lata Mangeshkar"
];

const topArtists = new Hono();

// Get top artists
topArtists.get("/", async (c) => {
  const { lang = "", limit = "20", offset = "0" } = c.req.query();

  // Use search endpoint to get details for default artists
  const promises = defaultArtists.map(artist => 
    api(config.endpoint.search.artists, {
      query: {
        q: artist,
        language: validLangs(lang),
        n: "1",
        p: "1"
      }
    }) as Promise<SearchResult>
  );

  const results = await Promise.all(promises);
  const artists = results
    .map(result => result?.results?.[0])
    .filter(artist => artist !== undefined);

  return c.json({
    status: "Success",
    message: "✅ Top artists fetched successfully",
    data: artists.slice(+offset, +offset + +limit)
  });
});

export { topArtists }; 