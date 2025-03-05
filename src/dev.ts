import { serve } from "@hono/node-server";
import { app } from "./index";

const port = +(process.env.PORT ?? 3500);

const devHandler = async (req: Request) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 29000); // 29s timeout for development

    const response = await app.fetch(req, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response('Request timeout', { status: 504 });
    }
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

if (process.env.NODE_ENV === 'development') {
  serve({
    fetch: devHandler,
    port,
    hostname: 'localhost'
  }, (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
  });
}

export default devHandler;