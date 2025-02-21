import { Hono } from "hono";
import { api } from "../lib/api";
import { config } from "../lib/config";
import { parseBool, validLangs } from "../lib/utils";
import { CustomResponse } from "../types/response";
import { trendingPayload } from "../payloads/get.payload";
import { TrendingRequest, TrendingResponse } from "../types/get";

export const trending = new Hono();

/* -----------------------------------------------------------------------------------------------
 * Get Trending by Category Route Handler - /trending/category/{type}
 * -----------------------------------------------------------------------------------------------*/

trending.get("/category/:type", async (c) => {
  const type = c.req.param("type");
  const { 
    category = "popularity", // popularity, latest, alphabetical
    lang = "",
    page = "1",
    n = "20",
    raw = "",
    mini = ""
  } = c.req.query();

  if (!["song", "album", "playlist"].includes(type)) {
    throw new Error("Invalid type. Must be one of: song, album, playlist");
  }

  let apiResult: TrendingRequest;
  try {
    apiResult = await api(config.endpoint.get.trending, {
      query: { 
        entity_type: type,
        category,
        entity_language: validLangs(lang),
        page,
        n
      }
    });

    if (!apiResult || !Array.isArray(apiResult) || !apiResult.length) {
      // Try without category if initial request fails
      apiResult = await api(config.endpoint.get.trending, {
        query: { 
          entity_type: type,
          entity_language: validLangs(lang),
          page,
          n
        }
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to fetch trending ${type}s: ${errorMessage}`);
  }

  if (!apiResult || !Array.isArray(apiResult) || !apiResult.length) {
    throw new Error(`No trending ${type}s found for category: ${category}`);
  }

  if (parseBool(raw)) {
    return c.json(apiResult);
  }

  const transformedData = trendingPayload(apiResult, parseBool(mini));
  const response: CustomResponse<TrendingResponse> = {
    status: "Success",
    message: `✅ Trending ${type}s by ${category} fetched successfully`,
    data: transformedData
  };

  return c.json(response);
}); 