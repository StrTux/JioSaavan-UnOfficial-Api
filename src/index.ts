import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { timing } from "hono/timing";

import { config } from "./lib/config";
import { camelCaseMiddleware, rateLimitMiddleware } from "./lib/middleware";
import {
  album,
  artist,
  get,
  home,
  modules,
  newReleases,
  ping,
  playlist,
  radio,
  search,
  show,
  song,
} from "./routes";
import { docs } from "./routes/docs.route";
import { trending } from "./routes/trending.route";
import { mood } from "./routes/mood.route";
import { podcast } from "./routes/podcast.route";
import { topArtists } from "./routes/top-artists.route";
import { auth } from "./routes/auth.route";
import { CustomResponse } from "./types/response";

const app = new Hono({ strict: false }); // match routes w/ or w/o trailing slash

/* -----------------------------------------------------------------------------------------------
 * middlewares
 * -----------------------------------------------------------------------------------------------*/
app.use(
  "*",
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  }),
  prettyJSON(),
  logger(),
  rateLimitMiddleware(),
  camelCaseMiddleware(),
  timing()
);

/* -----------------------------------------------------------------------------------------------
 * routes
 * -----------------------------------------------------------------------------------------------*/

app.get("/", (c) => {
  return c.redirect("/home");
});

/* auth */
app.route("/auth", auth);

/* home */
app.route("/home", home);

/* docs */
app.route("/docs", docs);

/* modules */
app.route("/modules", modules);

/* details & recommendations */
app.route("/song", song);
app.route("/album", album);
app.route("/playlist", playlist);
app.route("/artist", artist);

/* search */
app.route("/search", search);

/* show */
app.route("/show", show);

/* get */
app.route("/get", get);

/* radio */
app.route("/radio", radio);

/* trending */
app.route("/trending", trending);

/* mood-based */
app.route("/mood", mood);

/* podcast */
app.route("/podcast", podcast);

/* new releases */
app.route("/new-releases", newReleases);

/* top artists */
app.route("/top-artists", topArtists);

/* test route to check if the server is up and running */
app.route("/ping", ping);

/* 404 */
app.notFound((c) => {
  c.status(404);
  return c.json({
    status: "Failed",
    message: `Requested route not found, please check the documentation at ${config.urls.docsUrl}`,
  });
});

/* -----------------------------------------------------------------------------------------------
 * error handler
 * -----------------------------------------------------------------------------------------------*/
app.onError((err, c) => {
  const response: CustomResponse = {
    status: "Failed",
    message: `❌ ${err.message}`,
    data: null,
  };

  c.status(400);
  return c.json(response);
});

const server = {
  port: +(process.env.PORT ?? 3500),
  fetch: app.fetch,
};

export { app };

export default server;
