// Simple in-memory rate limiting (for production, use Redis)
interface RateLimit {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimit>()

export interface RateLimitConfig {
  limit: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

export function rateLimit(
  identifier: string, 
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  
  // Clean up expired entries
  rateLimitStore.forEach((v, k) => {
    if (v.resetTime <= now) {
      rateLimitStore.delete(k)
    }
  })
  
  const existing = rateLimitStore.get(key)
  
  if (!existing) {
    // First request
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    
    return {
      success: true,
      remaining: config.limit - 1,
      resetTime: now + config.windowMs
    }
  }
  
  if (existing.resetTime <= now) {
    // Window has expired, reset
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    
    return {
      success: true,
      remaining: config.limit - 1,
      resetTime: now + config.windowMs
    }
  }
  
  // Within window
  if (existing.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: existing.resetTime
    }
  }
  
  // Increment count
  existing.count++
  
  return {
    success: true,
    remaining: config.limit - existing.count,
    resetTime: existing.resetTime
  }
}

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // Authentication endpoints
  AUTH_SIGNUP: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 signups per 15 minutes
  AUTH_SIGNIN: { limit: 10, windowMs: 15 * 60 * 1000 }, // 10 signin attempts per 15 minutes
  AUTH_RESET: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 password resets per hour
  
  // Chess game endpoints
  CHESS_SCORE_UPDATE: { limit: 100, windowMs: 60 * 60 * 1000 }, // 100 score updates per hour
  CHESS_GAME_START: { limit: 50, windowMs: 60 * 60 * 1000 }, // 50 games per hour
  
  // General API
  API_GENERAL: { limit: 1000, windowMs: 60 * 60 * 1000 }, // 1000 requests per hour
} as const