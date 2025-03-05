import { Hono } from "hono";

import { api } from "../lib/api";
import { config } from "../lib/config";
import { isJioSaavnLink, parseBool, tokenFromLink } from "../lib/utils";
import {
  episodeDetailPayload,
} from "../payloads/show.payload";
import { CustomResponse } from "../types/response";
import {
  EpisodeDetailRequest,
  EpisodeDetailResponse,
} from "../types/show";

const {
  show_details: s,
  episodes: e,
  episode_details: e_d,
} = config.endpoint.show;

export const show = new Hono();

/* -----------------------------------------------------------------------------------------------
 * middleware
 * -----------------------------------------------------------------------------------------------*/

show.use("*", async (c, next) => {
  const path = "/" + c.req.path.split("/").slice(2).join("/");
  const { id = "", token = "", link = "" } = c.req.query();

  const entity = path === "/" ? "show" : "episode";

  if (["/", "/episode"].includes(path)) {
    if (!link && !token)
      throw new Error(`Please provide ${entity} token or link`);

    if (link && !(isJioSaavnLink(link) && link.includes("shows")))
      throw new Error(`Please provide valid ${entity} link`);
  }

  if (path === "/episodes") {
    if (!id) throw new Error(`Please provide show id`);
  }

  await next();
});

/* -------------------------------------------------------------------------------------------------
 * show's all episodes
 * -----------------------------------------------------------------------------------------------*/

show.get("/episodes", async (c) => {
  const {
    id: show_id = "",
    season: season_number = "",
    page: p = "",
    sort: sort_order = "",
    raw = "",
  } = c.req.query();

  const result: EpisodeDetailRequest[] = await api(e, {
    query: { show_id, season_number, p, sort_order },
  });

  if (parseBool(raw)) return c.json(result);

  const payload = result.map(episodeDetailPayload);

  const response: CustomResponse<EpisodeDetailResponse[]> = {
    status: "Success",
    message: "✅ Episodes fetched successfully",
    data: payload,
  };

  return c.json(response);
});

/* -------------------------------------------------------------------------------------------------
 * show's details | show's episode details
 * -----------------------------------------------------------------------------------------------*/

show.get("/", async (c) => {
  const { token, link } = c.req.query();

  if (!token && !link) {
    c.status(400);
    return c.json({
      status: "Failed",
      message: "❌ Show token or link is required",
    });
  }

  if (link && !isJioSaavnLink(link)) {
    c.status(400);
    return c.json({
      status: "Failed",
      message: "❌ Invalid JioSaavn link",
    });
  }

  try {
    const result = await api(s, {
      query: {
        token: token || tokenFromLink(link),
      },
    });

    return c.json({
      status: "Success",
      message: "✅ Show details fetched successfully",
      data: result,
    });
  } catch (error) {
    c.status(400);
    return c.json({
      status: "Failed",
      message: error instanceof Error ? error.message : "Failed to get show details",
    });
  }
});

show.get("/episode", async (c) => {
  const { token, link } = c.req.query();

  if (!token && !link) {
    c.status(400);
    return c.json({
      status: "Failed",
      message: "❌ Episode token or link is required",
    });
  }

  if (link && !isJioSaavnLink(link)) {
    c.status(400);
    return c.json({
      status: "Failed",
      message: "❌ Invalid JioSaavn link",
    });
  }

  try {
    const result = await api(e_d, {
      query: {
        token: token || tokenFromLink(link),
      },
    });

    return c.json({
      status: "Success",
      message: "✅ Episode details fetched successfully",
      data: result,
    });
  } catch (error) {
    c.status(400);
    return c.json({
      status: "Failed",
      message: error instanceof Error ? error.message : "Failed to get episode details",
    });
  }
});
