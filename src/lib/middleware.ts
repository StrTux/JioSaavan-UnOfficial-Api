import type { Context, Next } from "hono";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { toCamelCase } from "./utils";

/* -----------------------------------------------------------------------------------------------
 * Rate Limit Middleware using Upstash Redis Ratelimit
 * -----------------------------------------------------------------------------------------------*/

// Create a more forgiving rate limiter
const ratelimit = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  }),
  limiter: Ratelimit.slidingWindow(50, '1 m'), // 50 requests per minute
  analytics: true,
  prefix: '@upstash/ratelimit',
});

export const rateLimitMiddleware = () => {
  return async (c: Context, next: Next) => {
    if (!process.env.ENABLE_RATE_LIMIT) {
      return next();
    }

    try {
      const ip = c.req.header('x-forwarded-for') || 
                 c.req.header('x-real-ip') || 
                 c.req.header('cf-connecting-ip') ||
                 'unknown';
                 
      const userAgent = c.req.header('user-agent') || 'unknown';
      const key = `${ip}:${userAgent}`;

      // Get remaining requests
      const { success, limit, remaining, reset } = await ratelimit.limit(key);

      // Set rate limit headers
      c.res.headers.set('X-RateLimit-Limit', limit.toString());
      c.res.headers.set('X-RateLimit-Remaining', remaining.toString());
      c.res.headers.set('X-RateLimit-Reset', reset.toString());

      if (!success) {
        return c.json({
          status: 'Error',
          message: 'Too Many Requests',
          data: {
            limit,
            remaining,
            reset: new Date(reset).toISOString()
          }
        }, 429);
      }

      return next();
    } catch (error) {
      console.error('Rate limit error:', error);
      return next();
    }
  };
};

/* -----------------------------------------------------------------------------------------------
 * Camel Case Middleware
 * -----------------------------------------------------------------------------------------------*/

export const camelCaseMiddleware = () => {
  return async (c: Context, next: Next) => {
    const camel = c.req.query("camel");

    await next();

    if (camel !== undefined && c.res.headers.get("Content-Type")?.startsWith("application/json")) {
      const obj = await c.res.json();
      const camelCaseResponse = toCamelCase(obj as Record<string, unknown>) as Record<string, unknown>;
      return c.json(camelCaseResponse as { [key: string]: unknown });
    }
  };
};
