/**
 * Custom server startup script for the backend
 * This ensures the server is accessible from Android emulators
 */

import { serve } from "@hono/node-server";
import { app } from "./dist/index.js";

const port = +(process.env.PORT ?? 3500);

// Add CORS and timeout handling
const serverHandler = async (req) => {
  try {
    // Use a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    const response = await app.fetch(req, {
      signal: controller.signal
    });
    
    // Ensure CORS headers are present
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
  } catch (error) {
    if (error.name === 'AbortError') {
      return new Response('Request timeout', { status: 504 });
    }
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

// Start the server on all network interfaces (0.0.0.0)
serve({
  fetch: serverHandler,
  port,
  hostname: '0.0.0.0'
}, (info) => {
  console.log(`🚀 Server running at http://localhost:${info.port}`);
  console.log(`Server also accessible at http://0.0.0.0:${info.port}`);
  console.log(`For Android Emulator use: http://10.0.2.2:${info.port}`);
  console.log(`For Genymotion use: http://10.0.3.2:${info.port}`);
}); 