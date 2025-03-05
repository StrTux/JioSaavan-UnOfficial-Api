import { Hono } from "hono";

import { api } from "../lib/api";
import { config } from "../lib/config";
import { parseBool, validLangs } from "../lib/utils";
import {
  albumSearchPayload,
  allSearchPayload,
  artistSearchPayload,
  playlistSearchPayload,
  podcastsSearchPayload,
  songSearchPayload,
  topSearchesPayload,
} from "../payloads/search.payload";
import { CustomResponse } from "../types/response";
import {
  AlbumSearchRequest,
  AlbumSearchResponse,
  AllSearchRequest,
  ArtistSearchRequest,
  ArtistSearchResponse,
  CAllSearchResponse,
  CTopSearchResponse,
  PlaylistSearchRequest,
  PlaylistSearchResponse,
  PodcastSearchRequest,
  PodcastSearchResposne,
  SongSearchRequest,
  SongSearchResponse,
  TopSearchRequest,
} from "../types/search";

const {
  top_search: t,
  all,
  songs: s,
  albums: al,
  playlists: pl,
  artists: ar,
  more: m,
} = config.endpoint.search;

export const search = new Hono();

/* -----------------------------------------------------------------------------------------------
 * Search All Route Handler - /search
 * -----------------------------------------------------------------------------------------------*/

search.get("/", async (c) => {
  const { q: query = "", raw = "" } = c.req.query();

  // Sanitize query to handle special characters
  const sanitizedQuery = encodeURIComponent(query.trim().replace(/[^\w\s]/g, ' '));
  if (!sanitizedQuery) {
    throw new Error("Please provide a valid search query");
  }

  const result: AllSearchRequest = await api(all, {
    query: { query: sanitizedQuery },
    isVersion4: false,
  });

  if (!result.albums) {
    throw new Error("No search results found");
  }

  if (parseBool(raw)) {
    return c.json(result);
  }

  const payload: CAllSearchResponse = {
    status: "Success",
    message: "✅ Search results fetched successfully",
    data: allSearchPayload(result),
  };

  return c.json(payload);
});

search.get("/top", async (c) => {
  const { raw = "" } = c.req.query();

  const result: TopSearchRequest[] = await api(t, {});

  if (!result.length) {
    throw new Error("No top searches found");
  }

  if (parseBool(raw)) {
    return c.json(result);
  }

  const payload: CTopSearchResponse = {
    status: "Success",
    message: "✅ Top searches fetched successfully",
    data: result.map(topSearchesPayload),
  };

  return c.json(payload);
});

/* -----------------------------------------------------------------------------------------------
 * Search Songs, Albums, Playlists, Artists Route Handler - /search/{songs|albums|playlists|artists}
 * -----------------------------------------------------------------------------------------------*/

search.get("/:path{(songs|albums|playlists|artists)}", async (c) => {
  const path = c.req.path.split("/")[2];

  const { 
    q = "", 
    page = "1", 
    n = "10", 
    raw = "",
    language = "",
    limit = ""
  } = c.req.query();

  // Validate required query parameter
  if (!q.trim()) {
    return c.json({
      status: "Failed",
      message: "Please provide a valid search query",
      data: null
    }, 400);
  }

  // Sanitize query to handle special characters
  const sanitizedQuery = encodeURIComponent(q.trim().replace(/[^\w\s]/g, ' '));

  // Handle language parameter
  const langs = language ? validLangs(language) : "";
  if (language && !langs) {
    return c.json({
      status: "Failed", 
      message: "Invalid language parameter",
      data: null
    }, 400);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _artistSearchPayload = (a: ArtistSearchRequest, _?: boolean) =>
    artistSearchPayload(a);

  const [endpoint, payloadFn] = (
    {
      songs: [s, songSearchPayload],
      albums: [al, albumSearchPayload],
      playlists: [pl, playlistSearchPayload],
      artists: [ar, _artistSearchPayload],
    } as Record<string, [string, (a: A) => SongSearchResponse | AlbumSearchResponse | PlaylistSearchResponse | ArtistSearchResponse]>
  )[path];

  type A =
    | SongSearchRequest
    | AlbumSearchRequest
    | PlaylistSearchRequest
    | ArtistSearchRequest;

  try {
    const result: A = await api(endpoint, { 
      query: { 
        q: sanitizedQuery,
        p: page,
        n: n,
        ...(langs ? { language: langs } : {})
      } 
    });

    if (!result.results || !result.results.length) {
      return c.json({
        status: "Success",
        message: "No results found",
        data: {
          total: 0,
          start: 0,
          results: []
        }
      });
    }

    if (parseBool(raw)) {
      return c.json(result);
    }

    let data = payloadFn(result);
    
    // Apply limit if specified
    if (limit && !isNaN(parseInt(limit))) {
      const limitNum = parseInt(limit);
      if (Array.isArray(data.results)) {
        data = {
          ...data,
          results: data.results.slice(0, limitNum)
        } as typeof data;
      }
    }

    return c.json({
      status: "Success",
      message: "✅ Search results fetched successfully",
      data
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch search results";
    return c.json({
      status: "Failed",
      message: errorMessage,
      data: null
    }, 500);
  }
});

/* -----------------------------------------------------------------------------------------------
 * Search Podcasts Route Handler - /search/podcasts
 * -----------------------------------------------------------------------------------------------*/

search.get("/podcasts", async (c) => {
  const { q: query = "", page: p = "", n = "", raw = "" } = c.req.query();

  const result: PodcastSearchRequest = await api(m, {
    query: { query, p, n, params: '{ "type": "podcasts" }' },
  });

  if (!result.results.length) {
    throw new Error("No search results found");
  }

  if (parseBool(raw)) {
    return c.json(result);
  }

  const payload: CustomResponse<PodcastSearchResposne> = {
    status: "Success",
    message: "✅ Search results fetched successfully",
    data: podcastsSearchPayload(result),
  };

  return c.json(payload);
});
