import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { album } from "./routes/album.route";
import { artist } from "./routes/artist.route";
import { docs } from "./routes/docs.route";
import { get } from "./routes/get.route";
import { mood } from "./routes/mood.route";
import { newReleases } from "./routes/new-releases.route";
import { playlist } from "./routes/playlist.route";
import { podcast } from "./routes/podcast.route";
import { radio } from "./routes/radio.route";
import { search } from "./routes/search.route";
import { songRoute } from "./routes/song.route";
import { trending } from "./routes/trending.route";

const app = new Hono();

app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "HEAD", "OPTIONS"],
    maxAge: 86400,
  })
);

app.route("/album", album);
app.route("/artist", artist);
app.route("/docs", docs);
app.route("/get", get);
app.route("/mood", mood);
app.route("/new-releases", newReleases);
app.route("/playlist", playlist);
app.route("/podcast", podcast);
app.route("/radio", radio);
app.route("/search", search);
app.route("/song", songRoute);
app.route("/trending", trending);

export default app; 