import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Create Redis client (uses env vars automatically)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different rate limiters for different endpoints
// Using sliding window algorithm for smoother rate limiting

// General API rate limiter: 80 requests per minute
export const generalRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(80, "1 m"),
  analytics: true,
  prefix: "ratelimit:general",
});

// Checkout/Payment rate limiter: 20 requests per minute
export const checkoutRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "ratelimit:checkout",
});

// Reservation rate limiter: 10 requests per minute
export const reservationRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "ratelimit:reservation",
});

// Get client IP from request headers
export function getClientIp(request: Request): string {
  // Check various headers for the real IP (when behind proxy/load balancer)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, first one is the client
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Vercel-specific header
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    return vercelIp.split(",")[0].trim();
  }

  // Fallback - in development this might be undefined
  return "127.0.0.1";
}

// Rate limit check helper
export async function checkRateLimit(
  request: Request,
  limiter: Ratelimit = generalRateLimiter
): Promise<{ success: boolean; response?: NextResponse }> {
  const ip = getClientIp(request);

  try {
    const { success, limit, reset, remaining } = await limiter.limit(ip);

    if (!success) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: "Too many requests. Please try again later.",
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
              "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
            },
          }
        ),
      };
    }

    return { success: true };
  } catch (error) {
    // If rate limiting fails (Redis down), allow the request but log
    console.error("[RateLimit] Error checking rate limit:", error);
    return { success: true };
  }
}
