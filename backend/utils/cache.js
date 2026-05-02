// Simple in-memory cache for API responses
// Reduces repeated Gemini API calls for same images/queries

const cache = new Map();

// Hash function for cache keys
const generateHash = (data) => {
  let hash = 0;
  const string = JSON.stringify(data);
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'cache_' + Math.abs(hash).toString(36);
};

// Cache control with TTL (time to live)
class CacheManager {
  constructor(ttlMinutes = 60) {
    this.ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
  }

  set(key, value) {
    const cacheKey = typeof key === 'string' ? key : generateHash(key);
    const expiresAt = Date.now() + this.ttl;
    cache.set(cacheKey, { value, expiresAt });
    console.log(`💾 Cached: ${cacheKey} (expires in ${this.ttl / 1000}s)`);
    return cacheKey;
  }

  get(key) {
    const cacheKey = typeof key === 'string' ? key : generateHash(key);
    const cached = cache.get(cacheKey);
    
    if (!cached) {
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      cache.delete(cacheKey);
      console.log(`⏰ Cache expired: ${cacheKey}`);
      return null;
    }

    console.log(`✅ Cache hit: ${cacheKey}`);
    return cached.value;
  }

  clear() {
    cache.clear();
    console.log('🗑️ Cache cleared');
  }

  getStats() {
    return {
      size: cache.size,
      entries: Array.from(cache.entries()).map(([key, { expiresAt }]) => ({
        key,
        expiresIn: Math.max(0, (expiresAt - Date.now()) / 1000)
      }))
    };
  }
}

export const cacheManager = new CacheManager(60); // 60 minute TTL
