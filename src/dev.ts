import { serve } from "@hono/node-server";
import { app } from "./index";

const port = +(process.env.PORT ?? 3001);
console.log(`Development server is running on port ${port}`);

serve({
  fetch: (req: Request) => app.fetch(req),
  port: port,
}); 