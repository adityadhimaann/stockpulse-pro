import NodeCache from 'node-cache';

export class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 300) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });

    // Log cache statistics periodically
    setInterval(() => {
      const stats = this.cache.getStats();
      if (stats.keys > 0) {
        console.log('📊 Cache Stats:', {
          keys: stats.keys,
          hits: stats.hits,
          misses: stats.misses,
          hitRate: `${((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1)}%`
        });
      }
    }, 300000); // Every 5 minutes
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any, ttl?: number): boolean {
    return this.cache.set(key, value, ttl);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  getStats() {
    return this.cache.getStats();
  }

  keys(): string[] {
    return this.cache.keys();
  }
}

export default CacheService;
