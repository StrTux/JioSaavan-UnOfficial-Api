import { Hono } from "hono";

import { api } from "../lib/api";
import { config } from "../lib/config";
import {
  isJioSaavnLink,
  parseBool,
  tokenFromLink,
  validLangs,
} from "../lib/utils";
import {
  artistPayload,
  artistTopSongsOrAlbumsPayload,
} from "../payloads/artist.payload";
import { songPayload } from "../payloads/song.payload";
import {
  ArtistRequest,
  ArtistSongsOrAlbumsRequest,
  CArtistResponse,
  CArtistSongsOrAlbumsResponse,
} from "../types/artist";
import { CSongsResponse, SongRequest } from "../types/song";

const {
  id: i,
  link: l,
  songs: s,
  albums: a,
  top_songs: t,
} = config.endpoint.artist;

export const artist = new Hono();

/* -----------------------------------------------------------------------------------------------
 * MIDDLEWARE to check if query params are provided and are valid
 * -----------------------------------------------------------------------------------------------*/

artist.use("*", async (c, next) => {
  const { artistid, link, token } = c.req.query();
  const path = "/" + c.req.path.split("/").slice(2).join("/");

  if (path === "/") {
    if (!artistid && !link && !token)
      throw new Error("Please provide Artist id, link or token");

    if (artistid && link) throw new Error("Please provide either Artist id or link");

    if (link && !isJioSaavnLink(link) && link.includes("artist")) {
      throw new Error("Please provide a valid JioSaavn link");
    }
  }

  if (path === "/songs" || path === "/albums") {
    if (!artistid) throw new Error("Please provide artist id.");
  }

  await next();
});

/* -----------------------------------------------------------------------------------------------
 * Artist Details Route Handler - GET /artist
 * -----------------------------------------------------------------------------------------------*/

artist.get("/", async (c) => {
  const {
    artistid = "",
    link = "",
    token = "",
    raw = "",
    mini = "",
  } = c.req.query();

  const result: ArtistRequest = await api(artistid ? i : l, {
    query: {
      artistid,
      token: token ? token : tokenFromLink(link),
      type: artistid ? "" : "artist",
    },
  });

  if (!result.artistId) {
    throw new Error("Artist not found, please check the id or link");
  }
  if (parseBool(raw)) {
    return c.json(result);
  }

  const response: CArtistResponse = {
    status: "Success",
    message: "✅ Artist Details fetched successfully",
    data: artistPayload(result, parseBool(mini)),
  };

  return c.json(response);
});

/* -----------------------------------------------------------------------------------------------
 * Artist Top Songs or Albums Route Handler - GET /artist/{songs|albums}
 * -----------------------------------------------------------------------------------------------*/

artist.get("/:path{(songs|albums)}", async (c) => {
  const path = c.req.path.split("/")[2];
  const {
    artistid,
    page = "",
    raw = "",
    mini = "",
  } = c.req.query();

  const result: ArtistSongsOrAlbumsRequest = await api(
    path === "songs" ? s : a,
    { query: { artistid, page } }
  );

  if (
    path === "songs"
      ? result.topSongs?.songs.length === 0
      : result.topAlbums?.albums.length === 0
  ) {
    throw new Error(`Artist's top ${path} not found, please check the id`);
  }

  if (parseBool(raw)) {
    return c.json(result);
  }

  const response: CArtistSongsOrAlbumsResponse = {
    status: "Success",
    message: `✅ Artist's ${path} fetched successfully`,
    data: artistTopSongsOrAlbumsPayload(result, parseBool(mini)),
  };

  return c.json(response);
});

/* -----------------------------------------------------------------------------------------------
 * Artist Top Songs/Recommend Route Handler - GET /artist/{top-songs|recommend}
 * -----------------------------------------------------------------------------------------------*/

artist.get("/:path{(top-songs|recommend)}", async (c) => {
  const {
    artist_id: artist_ids,
    song_id,
    page = "",
    lang = "",
    cat: category = "", // ["latest", "alphabetical", "popularity"]
    sort: sort_order = "", // ["asc", "desc"]
    raw = "",
    mini = "",
  } = c.req.query();

  const result: SongRequest[] = await api(t, {
    query: {
      artist_ids,
      song_id,
      page,
      category,
      sort_order,
      language: validLangs(lang),
    },
  });

  if (result.length === 0) {
    throw new Error("Artist not found, please check the ids");
  }

  if (parseBool(raw)) {
    return c.json(result);
  }

  const response: CSongsResponse = {
    status: "Success",
    message: "✅ Artist's top songs fetched successfully",
    data: result.map((s) => songPayload(s, parseBool(mini))),
  };

  return c.json(response);
});
