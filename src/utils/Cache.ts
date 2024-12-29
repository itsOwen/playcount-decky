export let CACHE: Cache;

export class Cache {
  public readonly APP_ID_KEY = "APP_ID";
  public readonly PLAYER_COUNT_PREFIX = "PLAYER_COUNT_";
  private cache: Partial<Record<string, any>> = {};
  private subscribers: Map<string, () => void> = new Map();
  private readonly CACHE_VERSION = "1.0";
  private readonly CACHE_EXPIRY = 1000 * 60 * 5; // 5 minutes for player count data
  private readonly CACHE_EXPIRY_LONG = 1000 * 60 * 30; // 30 minutes for other data

  constructor() {
    this.loadFromLocalStorage();
    // Clean expired items periodically
    setInterval(() => this.cleanExpiredItems(), 1000 * 60 * 5); // Every 5 minutes
  }

  static init() {
    CACHE = new Cache();
    return CACHE;
  }

  subscribe(id: string, callback: () => void): void {
    this.subscribers.set(id, callback);
  }

  unsubscribe(id: string): void {
    this.subscribers.delete(id);
  }

  private notifySubscribers() {
    for (const callback of this.subscribers.values()) {
      callback();
    }
  }

  async loadValue(key: string): Promise<any> {
    const cacheItem = this.cache[key];
    
    if (cacheItem && this.isValid(cacheItem, this.getExpiryForKey(key))) {
      return cacheItem.value;
    }
    
    // If cache miss or expired, remove it
    if (cacheItem) {
      delete this.cache[key];
      this.saveToLocalStorage();
    }
    
    return null;
  }

  async setValue(key: string, value: any): Promise<void> {
    const oldValue = await this.loadValue(key);
    if (oldValue !== value) {
      this.cache[key] = {
        value,
        timestamp: Date.now(),
        version: this.CACHE_VERSION
      };
      this.saveToLocalStorage();
      this.notifySubscribers();
    }
  }

  // New method for caching player count data
  async setPlayerCount(appId: string, count: number): Promise<void> {
    const key = `${this.PLAYER_COUNT_PREFIX}${appId}`;
    await this.setValue(key, count);
  }

  // New method for retrieving cached player count
  async getPlayerCount(appId: string): Promise<number | null> {
    const key = `${this.PLAYER_COUNT_PREFIX}${appId}`;
    return this.loadValue(key);
  }

  private getExpiryForKey(key: string): number {
    return key.startsWith(this.PLAYER_COUNT_PREFIX) 
      ? this.CACHE_EXPIRY 
      : this.CACHE_EXPIRY_LONG;
  }

  private isValid(cacheItem: any, expiry: number): boolean {
    if (!cacheItem || !cacheItem.timestamp || !cacheItem.version) {
      return false;
    }

    // Check version
    if (cacheItem.version !== this.CACHE_VERSION) {
      return false;
    }

    // Check expiry
    const age = Date.now() - cacheItem.timestamp;
    return age < expiry;
  }

  private cleanExpiredItems(): void {
    let hasChanges = false;
    for (const [key, item] of Object.entries(this.cache)) {
      if (!this.isValid(item, this.getExpiryForKey(key))) {
        delete this.cache[key];
        hasChanges = true;
      }
    }
    if (hasChanges) {
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('playerPulseCache', JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save cache to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('playerPulseCache');
      if (saved) {
        this.cache = JSON.parse(saved);
        this.cleanExpiredItems(); // Clean on load
      }
    } catch (error) {
      console.error('Failed to load cache from localStorage:', error);
      this.cache = {};
    }
  }
}