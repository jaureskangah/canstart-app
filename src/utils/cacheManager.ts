import { CacheConfig } from '../types/cache';

const CACHE_PREFIX = 'canstart_';

const DEFAULT_CONFIG: CacheConfig = {
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxItems: 100,
  version: '1.0'
};

export class CacheManager {
  private static config: CacheConfig = DEFAULT_CONFIG;

  static configure(config: Partial<CacheConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  static set(key: string, data: any, ttl?: number) {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl,
      version: this.config.version
    };

    try {
      // Check cache size limit
      const keys = this.getAllKeys();
      if (keys.length >= this.config.maxItems) {
        // Remove oldest item
        const oldest = keys.sort((a, b) => {
          const itemA = this.get(a);
          const itemB = this.get(b);
          return (itemA?.timestamp || 0) - (itemB?.timestamp || 0);
        })[0];
        this.remove(oldest);
      }

      localStorage.setItem(cacheKey, JSON.stringify(item));
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // Clear half of the cache if storage is full
        this.clearOldest(Math.floor(this.config.maxItems / 2));
        // Try setting the item again
        localStorage.setItem(cacheKey, JSON.stringify(item));
      }
      return false;
    }
  }

  static get<T>(key: string): T | null {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const item = localStorage.getItem(cacheKey);

    if (!item) return null;

    try {
      const { data, timestamp, ttl, version } = JSON.parse(item);

      // Check version and TTL
      if (
        version !== this.config.version ||
        Date.now() - timestamp > ttl
      ) {
        this.remove(key);
        return null;
      }

      return data as T;
    } catch {
      this.remove(key);
      return null;
    }
  }

  static remove(key: string) {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  }

  static clear() {
    const keys = this.getAllKeys();
    keys.forEach(key => this.remove(key));
  }

  static clearOldest(count: number) {
    const keys = this.getAllKeys()
      .sort((a, b) => {
        const itemA = this.get(a);
        const itemB = this.get(b);
        return (itemA?.timestamp || 0) - (itemB?.timestamp || 0);
      })
      .slice(0, count);

    keys.forEach(key => this.remove(key));
  }

  private static getAllKeys(): string[] {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .map(key => key.replace(CACHE_PREFIX, ''));
  }

  static async preloadData(key: string, fetchFn: () => Promise<any>, ttl?: number) {
    const cached = this.get(key);
    if (cached) return cached;

    try {
      const data = await fetchFn();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error(`Failed to preload data for key: ${key}`, error);
      return null;
    }
  }
}