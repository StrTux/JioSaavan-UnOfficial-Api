import { Hono } from "hono";

import { api } from "../lib/api";
import { config } from "../lib/config";
import { parseBool, validLangs } from "../lib/utils";
import { radioSongsPayload } from "../payloads/radio.payload";
import {
  RadioSongRequest,
  RadioSongResponse,
  RadioStationRequest,
  RadioStationResponse,
} from "../types/radio";
import { CustomResponse } from "../types/response";

const { featured: f, artist: a, entity: e, songs: s } = config.endpoint.radio;

export const radio = new Hono();

/* -----------------------------------------------------------------------------------------------
 * Create Radio Route Handler - /radio/{featured|artist|entity}
 * -----------------------------------------------------------------------------------------------*/

radio.get("/:type{(featured|artist|entity)}", async (c) => {
  const type = c.req.param("type");

  const {
    song_id: pid = "",
    artist_id: artistid = "",
    id: entity_id = "",
    type: entity_type = "",
    name = "",
    q: query = "",
    mode = "",
    lang = "",
    raw = "",
  } = c.req.query();

  try {
    if (type === "entity") {
      if (!entity_id) {
        throw new Error("Radio Station ID is Required!");
      }
      if (!entity_type) {
        throw new Error("Radio Station Type is Required!");
      }
    } else if (!name) {
      throw new Error("Radio Station Name is Required!");
    }

    const endpoint = type === "featured" ? f : type === "artist" ? a : e;

    const { error, stationid: station_id }: RadioStationRequest = await api(
      endpoint,
      {
        query: {
          pid,
          artistid,
          entity_id,
          entity_type,
          name,
          query: !query ? name : query,
          mode,
          language: validLangs(lang),
        },
      }
    );

    if (error) {
      throw new Error(typeof error === "string" ? error : error.msg);
    }

    if (parseBool(raw)) {
      return c.json(station_id);
    }

    const payload: CustomResponse<RadioStationResponse> = {
      status: "Success",
      message: `✅ ${
        type[0].toUpperCase() + type.substring(1)
      } Radio Station Created Successfully!`,
      data: { station_id },
    };

    return c.json(payload);
  } catch (error) {
    c.status(400);
    return c.json({
      status: "Failed",
      message: error instanceof Error ? error.message : "Failed to create radio station",
    });
  }
});

/* -----------------------------------------------------------------------------------------------
 * Get Radio Songs Route Handler - /radio/songs
 * -----------------------------------------------------------------------------------------------*/

radio.get("/songs", async (c) => {
  const {
    id: stationid = "",
    n: k = "10",
    raw = "",
    mini = "",
  } = c.req.query();

  try {
    if (!stationid) {
      throw new Error("Radio Station ID is Required!");
    }

    const result: RadioSongRequest = await api(s, {
      query: { stationid, k },
    });

    if (result.error) {
      throw new Error(result.error);
    }

    if (parseBool(raw)) {
      return c.json(result);
    }

    const payload: CustomResponse<RadioSongResponse> = {
      status: "Success",
      message: "✅ Radio Station Songs Fetched Successfully!",
      data: radioSongsPayload(result, parseBool(mini)),
    };

    return c.json(payload);
  } catch (error) {
    c.status(400);
    return c.json({
      status: "Failed",
      message: error instanceof Error ? error.message : "Failed to get radio station songs",
    });
  }
});
