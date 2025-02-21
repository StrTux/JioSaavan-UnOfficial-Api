import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { config } from "./lib/config";
import { camelCaseMiddleware, rateLimitMiddleware } from "./lib/middleware";
import {
  album,
  artist,
  docs,
  download,
  genre,
  get,
  home,
  language,
  modules,
  playlist,
  radio,
  search,
  show,
  song,
  trending,
} from "./routes";

const app = new Hono({ strict: false });

/* -----------------------------------------------------------------------------------------------
 * Middlewares
 * -----------------------------------------------------------------------------------------------*/
app.use(
  "*",
  cors(),
  prettyJSON(),
  logger(),
  rateLimitMiddleware(),
  camelCaseMiddleware()
);

/* -----------------------------------------------------------------------------------------------
 * Routes
 * -----------------------------------------------------------------------------------------------*/
/* home */
app.route("/", home);

/* modules */
app.route("/modules", modules);

/* search */
app.route("/search", search);

/* details & recommendations */
app.route("/song", song);
app.route("/album", album);
app.route("/playlist", playlist);
app.route("/artist", artist);
app.route("/show", show);

/* get routes */
app.route("/get", get);

/* radio */
app.route("/radio", radio);

/* docs */
app.route("/docs", docs);

/* new routes */
app.route("/download", download);
app.route("/genre", genre);
app.route("/language", language);
app.route("/trending", trending);

/* -----------------------------------------------------------------------------------------------
 * Error Handlers
 * -----------------------------------------------------------------------------------------------*/
/* 404 */
app.notFound((c) => {
  c.status(404);
  return c.json({
    status: "Failed",
    message: `Requested route not found, please check the documentation at ${config.urls.docsUrl}`,
  });
});

/* 500 */
app.onError((err, c) => {
  c.status(400);
  return c.json({
    status: "Failed",
    message: err.message,
    data: null,
  });
});

const server = {
  port: +(process.env.PORT ?? 3000),
  fetch: app.fetch,
};

export { app };
export default server;
