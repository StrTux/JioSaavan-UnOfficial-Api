import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { serve } from "@hono/node-server";

import { config } from "./lib/config";
import { camelCaseMiddleware, rateLimitMiddleware } from "./lib/middleware";
import { cacheMiddleware } from "./lib/cache";
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
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  }),
  prettyJSON(),
  logger(),
  rateLimitMiddleware(),
  cacheMiddleware(),
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
  console.error('Server Error:', err);
  c.status(500);
  return c.json({
    status: "Error",
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export the app instance
export { app };

// Export the handler for Vercel
export default async function handler(req: Request): Promise<Response> {
  return app.fetch(req);
}

// Development server
if (process.env.NODE_ENV === 'development') {
  const port = +(process.env.PORT ?? 3001);
  console.log(`Server is running on port ${port}`);
  
  serve({
    fetch: (req: Request) => app.fetch(req),
    port: port,
  });
}
