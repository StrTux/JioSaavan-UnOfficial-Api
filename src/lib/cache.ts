import type { Context, Next } from 'hono';

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '3600', 10); // 1 hour default

export const cacheMiddleware = () => {
  return async (c: Context, next: Next) => {
    if (!process.env.ENABLE_CACHE || c.req.method !== 'GET') {
      return next();
    }

    const key = c.req.url;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL * 1000) {
      return c.json(cached.data);
    }

    await next();

    try {
      // Clone the response to cache it
      const response = c.res;
      const clonedResponse = response.clone();
      const data = await clonedResponse.json();
      
      cache.set(key, {
        data,
        timestamp: Date.now()
      });

      // Clean up old cache entries
      if (cache.size > 1000) {
        const oldEntries = Array.from(cache.entries())
          .filter(([key]) => {
            const entry = cache.get(key);
            return entry && Date.now() - entry.timestamp > CACHE_TTL * 1000;
          })
          .map(([key]) => key);
        
        oldEntries.forEach(key => cache.delete(key));
      }
    } catch (error) {
      console.error('Cache error:', error);
    }
  };
}; 