import { Hono } from "hono";
import { api } from "../lib/api";
import { config } from "../lib/config";
import { validLangs } from "../lib/utils";

const trending = new Hono();

// Get trending content by category (songs, albums, playlists)
trending.get("/:category", async (c) => {
  const category = c.req.param("category");
  const { lang = "", limit = "20", offset = "0" } = c.req.query();

  if (!["songs", "albums", "playlists"].includes(category)) {
    throw new Error("Invalid category. Use: songs, albums, or playlists");
  }

  const result = await api(config.endpoint.get.trending, {
    query: {
      entity_type: category.slice(0, -1), // Remove 's' from end
      entity_language: validLangs(lang),
      n: limit,
      p: offset
    }
  });

  return c.json({
    status: "Success",
    message: `✅ Trending ${category} fetched successfully`,
    data: result
  });
});

// Get weekly charts
trending.get("/charts/weekly", async (c) => {
  const { lang = "", limit = "20" } = c.req.query();
  
  const result = await api(config.endpoint.get.charts, {
    query: {
      type: "weekly",
      language: validLangs(lang),
      n: limit
    }
  });

  return c.json({
    status: "Success",
    message: "✅ Weekly charts fetched successfully",
    data: result
  });
});

// Get city-based trending
trending.get("/city/:cityName", async (c) => {
  const cityName = c.req.param("cityName");
  const { limit = "20" } = c.req.query();

  const result = await api(config.endpoint.get.trending, {
    query: {
      city: cityName,
      n: limit
    }
  });

  return c.json({
    status: "Success",
    message: `✅ Trending in ${cityName} fetched successfully`,
    data: result
  });
});

export { trending }; 