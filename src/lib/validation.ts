import { z } from 'zod'

// Chess score validation schemas
export const chessScoreUpdateSchema = z.object({
  result: z.enum(['win', 'loss', 'draw']),
  gameData: z.object({
    playerColor: z.enum(['white', 'black']),
    fen: z.string().min(10).max(100), // FEN strings are typically 15-80 chars
    movesCount: z.number().int().min(0).max(1000), // Reasonable game length
    duration: z.number().int().min(0).max(86400).optional(), // Max 24 hours
  }).optional(),
  reset: z.boolean().optional()
})

export const chessScoreMigrationSchema = z.object({
  wins: z.number().int().min(0).max(10000),
  losses: z.number().int().min(0).max(10000), 
  draws: z.number().int().min(0).max(10000)
})

// Authentication validation schemas
export const emailSchema = z.string()
  .email('Invalid email format')
  .max(254) // RFC 5321 limit
  .toLowerCase()

export const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
  .max(128, 'Password must be less than 128 characters')

export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')

// User profile validation
export const userProfileUpdateSchema = z.object({
  username: usernameSchema.optional(),
  displayName: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional()
})

// Helper function to safely parse JSON with validation
export function validateAndParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return { 
        success: false, 
        error: firstError?.message || 'Validation failed' 
      }
    }
    return { success: false, error: 'Validation failed' }
  }
}

// Sanitize strings to prevent XSS
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 1000) // Limit length
}

// Validate FEN string format
export function isValidFEN(fen: string): boolean {
  const fenRegex = /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+\s[bw]\s(-|[KQkq]+)\s(-|[a-h][36])\s\d+\s\d+$/
  return fenRegex.test(fen)
}

// Rate limit key generators
export function generateRateLimitKey(type: string, identifier: string): string {
  return `${type}:${identifier}`
}