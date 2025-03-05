import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src';

// Handle requests with timeout
const handler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout

    // Convert VercelRequest to Request
    const url = new URL(req.url!, `http://${req.headers.host || 'localhost'}`);
    const request = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers as Record<string, string>),
      body: req.body ? JSON.stringify(req.body) : null
    });

    const response = await app.fetch(request, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Copy status and headers
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send the response body
    const body = await response.text();
    return res.send(body);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(504).json({
        error: 'Request timeout',
        status: 504
      });
    }
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      status: 500
    });
  }
};

export default handler; 