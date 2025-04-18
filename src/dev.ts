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

    if (!response.headers.has('Access-Control-Allow-Origin')) {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    if (!response.headers.has('Access-Control-Allow-Methods')) {
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
    if (!response.headers.has('Access-Control-Allow-Headers')) {
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

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
    hostname: '0.0.0.0'
  }, (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
    console.log(`Server also accessible at http://0.0.0.0:${info.port}`);
    console.log(`For Android Emulator use: http://10.0.2.2:${info.port}`);
  });
}

export default devHandler;