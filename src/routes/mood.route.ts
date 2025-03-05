import { Hono } from "hono";
import { api } from "../lib/api";
import { config } from "../lib/config";
import { validLangs } from "../lib/utils";

const mood = new Hono();

// Get playlists by mood
mood.get("/:mood", async (c) => {
  const moodType = c.req.param("mood");
  const { lang = "", limit = "20" } = c.req.query();

  const validMoods = [
    "happy", "sad", "romantic", "party", "devotional",
    "workout", "chill", "sleep", "focus", "energetic"
  ];

  if (!validMoods.includes(moodType)) {
    throw new Error(`Invalid mood. Use one of: ${validMoods.join(", ")}`);
  }

  const result = await api(config.endpoint.get.featured_playlists, {
    query: {
      mood: moodType,
      language: validLangs(lang),
      n: limit
    }
  });

  return c.json({
    status: "Success",
    message: `✅ ${moodType} mood playlists fetched successfully`,
    data: result
  });
});

// Get songs by mood
mood.get("/:mood/songs", async (c) => {
  const moodType = c.req.param("mood");
  const { lang = "", limit = "20" } = c.req.query();

  const result = await api(config.endpoint.search.songs, {
    query: {
      mood: moodType,
      language: validLangs(lang),
      n: limit
    }
  });

  return c.json({
    status: "Success",
    message: `✅ ${moodType} mood songs fetched successfully`,
    data: result
  });
});

export { mood }; 