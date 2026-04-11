interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = `${identifier}:${Math.floor(now / windowMs)}`

  if (!store[key]) {
    store[key] = { count: 0, resetTime: now + windowMs }
  }

  const entry = store[key]

  if (now > entry.resetTime) {
    entry.count = 0
    entry.resetTime = now + windowMs
  }

  entry.count++

  return {
    success: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetTime: entry.resetTime,
  }
}

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}, 3600000)
