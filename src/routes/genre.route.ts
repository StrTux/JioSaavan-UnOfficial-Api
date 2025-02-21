import { Hono } from "hono";
import { api } from "../lib/api";
import { config } from "../lib/config";
import { parseBool, validLangs } from "../lib/utils";
import { CustomResponse } from "../types/response";

interface GenreResult {
  id: string;
  title: string;
  type: string;
  language: string;
  url: string;
  image: string;
  [key: string]: unknown;
}

interface SearchResponse {
  results: GenreResult[];
  position: number;
  [key: string]: unknown;
}

export const genre = new Hono();

/* -----------------------------------------------------------------------------------------------
 * Get Content by Genre Route Handler - /genre/{type}
 * -----------------------------------------------------------------------------------------------*/

genre.get("/:type", async (c) => {
  const type = c.req.param("type");
  const { 
    name = "", // e.g., "rock", "pop", "classical"
    lang = "",
    page = "1",
    n = "20",
    raw = ""
  } = c.req.query();

  if (!name) {
    throw new Error("Genre name is required");
  }

  if (!["songs", "albums", "playlists"].includes(type)) {
    throw new Error("Invalid type. Must be one of: songs, albums, playlists");
  }

  const endpoint = config.endpoint.search[type as keyof typeof config.endpoint.search];
  if (!endpoint) {
    throw new Error(`Unsupported search type: ${type}`);
  }

  const result = await api<SearchResponse>(endpoint, {
    query: { 
      q: name,
      type: "genre",
      language: validLangs(lang),
      page,
      n
    }
  });

  if (!result?.results?.length) {
    throw new Error(`No ${type} found for genre: ${name}`);
  }

  if (parseBool(raw)) {
    return c.json(result);
  }

  const response: CustomResponse<typeof result> = {
    status: "Success",
    message: `✅ ${type} for genre '${name}' fetched successfully`,
    data: result
  };

  return c.json(response);
}); 