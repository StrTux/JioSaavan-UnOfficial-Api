import { Hono } from "hono";

import { api } from "../lib/api";
import { config } from "../lib/config";
import {
  isJioSaavnLink,
  parseBool,
  validLangs,
} from "../lib/utils";
import { songPayload } from "../payloads/song.payload";
import {
  CSongsResponse,
  SongRequest,
} from "../types/song";

const { id: songId, link: songLink, recommend: recommendEndpoint } = config.endpoint.song;

interface TestSongDetails {
  id: string;
  name: string;
  album?: {
    id: string;
    name: string;
    url: string;
  };
  year?: string;
  releaseDate?: string;
  duration?: string;
  language?: string;
  downloadUrl?: string[];
  streamingUrl?: string;
  image?: string[];
  primaryArtists?: string;
  singers?: string[];
  artists?: Array<{
    id?: string;
    name: string;
    url?: string;
  }>;
  lyrics?: string;
  hasLyrics?: boolean;
  copyright?: string;
  label?: string;
}

interface TestSongResponse {
  status: string;
  message: string;
  data: TestSongDetails;
}

interface JioSaavnSongResponse {
  songs: Array<{
    id: string;
    title: string;
    album: string;
    albumid: string;
    year: string;
    release_date: string;
    duration: string;
    language: string;
    media_preview_url: string;
    image: string;
    primary_artists: string;
    singers?: string;
    artistMap?: {
      artists?: Array<{
        id: string;
        name: string;
        perma_url: string;
      }>;
    };
    has_lyrics: string;
    copyright_text: string;
    label: string;
  }>;
}

export const song = new Hono();

/* -----------------------------------------------------------------------------------------------
 * MIDDLEWARE to check if query params are provided and are valid
 * -----------------------------------------------------------------------------------------------*/

song.use("*", async (c, next) => {
  const { id, link, token } = c.req.query();
  const path = c.req.path.split("/").slice(2).join("/");

  if (path === "") {
    if (!id && !link && !token) {
      throw new Error("Please provide song id(s), link or a token");
    }

    if (link && !(isJioSaavnLink(link) && link.includes("song"))) {
      throw new Error("Please provide a valid JioSaavn link");
    }
  }

  if (path === "recommend") {
    if (!id) throw new Error("Please provide song id");
  }

  await next();
});

/* -----------------------------------------------------------------------------------------------
 * Songs Details Route Handler - GET /song
 * -----------------------------------------------------------------------------------------------*/

song.get("/", async (c) => {
  const {
    id: pids = "",
    link = "",
    token = "",
    raw = "",
  } = c.req.query();

  try {
    let songId = pids;
    
    if (link) {
      const urlParts = link.split("/");
      songId = urlParts[urlParts.length - 1];
    }

    if (!songId && token) {
      songId = token;
    }

    if (!songId) {
      throw new Error("Invalid song ID or link");
    }

    const result = await api<JioSaavnSongResponse>(songLink, {
      query: { token: songId, type: "song" },
      isVersion4: false,
    });

    if (!result || !result.songs || !result.songs.length) {
      throw new Error("Song not found, please check the id, link or token");
    }

    if (parseBool(raw)) {
      return c.json(result);
    }

    const songDetails: TestSongDetails = {
      id: result.songs[0].id,
      name: result.songs[0].title,
      album: {
        id: result.songs[0].albumid,
        name: result.songs[0].album,
        url: `https://www.jiosaavn.com/album/${result.songs[0].albumid}`
      },
      year: result.songs[0].year,
      releaseDate: result.songs[0].release_date,
      duration: result.songs[0].duration,
      language: result.songs[0].language,
      downloadUrl: [result.songs[0].media_preview_url],
      streamingUrl: result.songs[0].media_preview_url,
      image: [result.songs[0].image],
      primaryArtists: result.songs[0].primary_artists,
      singers: result.songs[0].singers?.split(","),
      artists: result.songs[0].artistMap?.artists?.map(artist => ({
        id: artist.id,
        name: artist.name,
        url: artist.perma_url
      })) || [],
      hasLyrics: result.songs[0].has_lyrics === "true",
      copyright: result.songs[0].copyright_text,
      label: result.songs[0].label
    };

    const response: TestSongResponse = {
      status: "Success",
      message: link ? "✅ Song(s) Details fetched successfully" : "✅ Song details fetched successfully",
      data: songDetails
    };

    return c.json(response);
  } catch (error) {
    console.error("Error fetching song details:", error);
    return c.json({
      status: "Error",
      message: "Failed to fetch song details",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, 500);
  }
});

/* -----------------------------------------------------------------------------------------------
 * Songs Recommendations Route Handler - GET /song/recommend
 * -----------------------------------------------------------------------------------------------*/

song.get("/recommend", async (c) => {
  const { id: pid, lang = "", raw = "", mini = "", limit = "" } = c.req.query();

  try {
    const result: SongRequest[] = await api(recommendEndpoint, {
      query: { pid, language: validLangs(lang) },
    });

    if (!result || !Array.isArray(result)) {
      throw new Error("No recommendations found, please check the id");
    }

    if (parseBool(raw)) {
      return c.json(result);
    }

    let songs = result.map((s) => songPayload(s, parseBool(mini)));
    if (limit && !isNaN(parseInt(limit))) {
      songs = songs.slice(0, parseInt(limit));
    }

    const response: CSongsResponse = {
      status: "Success",
      message: "✅ Song Recommendations fetched successfully",
      data: songs,
    };

    return c.json(response);
  } catch (error) {
    c.status(400);
    return c.json({
      status: "Failed",
      message: error instanceof Error ? error.message : "Failed to get recommendations",
    });
  }
});

/* -----------------------------------------------------------------------------------------------
 * Song Details by ID Route Handler - GET /song/:id
 * -----------------------------------------------------------------------------------------------*/

song.get("/:id", async (c) => {
  try {
    const songId = c.req.param("id");
    
    // Use webapi.get endpoint for all requests
    const result = await api<JioSaavnSongResponse>(songLink, {
      query: { token: songId, type: "song" },
      isVersion4: false,
    });

    if (!result || !result.songs || !result.songs.length) {
      throw new Error("Song not found");
    }

    const songDetails: TestSongDetails = {
      id: songId,
      name: result.songs[0].title,
      album: {
        id: result.songs[0].albumid,
        name: result.songs[0].album,
        url: `https://www.jiosaavn.com/album/${result.songs[0].albumid}`
      },
      year: result.songs[0].year,
      releaseDate: result.songs[0].release_date,
      duration: result.songs[0].duration,
      language: result.songs[0].language,
      downloadUrl: [result.songs[0].media_preview_url],
      streamingUrl: result.songs[0].media_preview_url,
      image: [result.songs[0].image],
      primaryArtists: result.songs[0].primary_artists,
      singers: result.songs[0].singers?.split(", "),
      artists: result.songs[0].artistMap?.artists?.map(artist => ({
        id: artist.id,
        name: artist.name,
        url: artist.perma_url
      })),
      hasLyrics: result.songs[0].has_lyrics === "true",
      copyright: result.songs[0].copyright_text,
      label: result.songs[0].label
    };

    const response: TestSongResponse = {
      status: "Success",
      message: "✅ Song details fetched successfully",
      data: songDetails
    };

    return c.json(response);
  } catch (error: unknown) {
    console.error("Error fetching song details:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return c.json({
      status: "Error",
      message: "Failed to fetch song details",
      error: errorMessage
    }, 500);
  }
});

export { song as songRoute };
