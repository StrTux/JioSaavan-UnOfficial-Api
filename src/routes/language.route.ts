import { Hono } from "hono";
import { api } from "../lib/api";
import { config } from "../lib/config";
import { parseBool, validLangs } from "../lib/utils";
import { CustomResponse } from "../types/response";

interface LanguageResponse extends Array<any> {
  length: number;
}

export const language = new Hono();

/* -----------------------------------------------------------------------------------------------
 * Get Content by Language Route Handler - /language/{songs|albums|playlists}
 * -----------------------------------------------------------------------------------------------*/

language.get("/:type{(songs|albums|playlists)}", async (c) => {
  const type = c.req.param("type");
  const { 
    lang = "",
    page = "1",
    n = "20",
    raw = ""
  } = c.req.query();

  if (!lang) {
    throw new Error("Language parameter is required");
  }

  const result = await api<LanguageResponse>(config.endpoint.get.trending, {
    query: { 
      entity_type: type.slice(0, -1), // remove 's' from end
      entity_language: validLangs(lang),
      page,
      n
    }
  });

  if (!result?.length) {
    throw new Error(`No ${type} found for language: ${lang}`);
  }

  if (parseBool(raw)) {
    return c.json(result);
  }

  const response: CustomResponse<typeof result> = {
    status: "Success",
    message: `✅ ${type} in ${lang} fetched successfully`,
    data: result
  };

  return c.json(response);
}); 