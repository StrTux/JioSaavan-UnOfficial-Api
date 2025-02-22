import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/index';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Convert VercelRequest to standard Request
  const url = new URL(req.url || '', `https://${req.headers.host || 'localhost'}`);
  
  const request = new Request(url, {
    method: req.method || 'GET',
    headers: new Headers(req.headers as Record<string, string>),
    body: req.body ? JSON.stringify(req.body) : null
  });

  const response = await app.fetch(request);
  
  // Copy status and headers
  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  
  // Send body
  const body = await response.text();
  res.send(body);
} 