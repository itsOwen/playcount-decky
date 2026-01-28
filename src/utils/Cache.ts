/**
 * Cache utility for storing and retrieving data with expiration
 */

import { CACHE_KEYS, TIMING } from '../constants';
import type { CacheSubscriber } from '../types/index';

export let CACHE: Cache;

interface CacheEntry {
  value: unknown;
  timestamp: number;
  version: string;
}

/**
 * Cache manager with localStorage persistence and expiration
 */
export class Cache {
  public readonly APP_ID_KEY = CACHE_KEYS.APP_ID;
  public readonly PLAYER_COUNT_PREFIX = CACHE_KEYS.PLAYER_COUNT_PREFIX;

  private cache: Record<string, CacheEntry> = {};
  private subscribers: Map<string, CacheSubscriber> = new Map();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  private readonly CACHE_VERSION = '1.0';
  private readonly CACHE_EXPIRY = TIMING.CACHE_EXPIRY_SHORT;
  private readonly CACHE_EXPIRY_LONG = TIMING.CACHE_EXPIRY_LONG;

  constructor() {
    this.loadFromLocalStorage();
    // Clean expired items periodically
    this.cleanupInterval = setInterval(
      () => this.cleanExpiredItems(),
      TIMING.CACHE_CLEANUP_INTERVAL
    );
  }

  /**
   * Initialize the global cache instance
   */
  static init(): Cache {
    CACHE = new Cache();
    return CACHE;
  }

  /**
   * Cleanup the cache instance (stop intervals)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.subscribers.clear();
  }

  /**
   * Subscribe to cache changes
   */
  subscribe(id: string, callback: CacheSubscriber): void {
    this.subscribers.set(id, callback);
  }

  /**
   * Unsubscribe from cache changes
   */
  unsubscribe(id: string): void {
    this.subscribers.delete(id);
  }

  /**
   * Notify all subscribers of changes
   */
  private notifySubscribers(): void {
    for (const callback of this.subscribers.values()) {
      try {
        callback();
      } catch (error) {
        console.error('[PlayCount] Cache subscriber error:', error);
      }
    }
  }

  /**
   * Load a value from cache
   */
  async loadValue<T = unknown>(key: string): Promise<T | null> {
    const cacheItem = this.cache[key];

    if (cacheItem && this.isValid(cacheItem, this.getExpiryForKey(key))) {
      return cacheItem.value as T;
    }

    // If cache miss or expired, remove it
    if (cacheItem) {
      delete this.cache[key];
      this.saveToLocalStorage();
    }

    return null;
  }

  /**
   * Set a value in cache
   */
  async setValue<T = unknown>(key: string, value: T): Promise<void> {
    const oldValue = await this.loadValue(key);

    if (oldValue !== value) {
      this.cache[key] = {
        value,
        timestamp: Date.now(),
        version: this.CACHE_VERSION,
      };
      this.saveToLocalStorage();
      this.notifySubscribers();
    }
  }

  /**
   * Set player count for an app (convenience method)
   */
  async setPlayerCount(appId: string, count: number): Promise<void> {
    const key = `${this.PLAYER_COUNT_PREFIX}${appId}`;
    await this.setValue(key, count);
  }

  /**
   * Get player count for an app (convenience method)
   */
  async getPlayerCount(appId: string): Promise<number | null> {
    const key = `${this.PLAYER_COUNT_PREFIX}${appId}`;
    return this.loadValue<number>(key);
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache = {};
    this.saveToLocalStorage();
    this.notifySubscribers();
  }

  /**
   * Get expiry time for a key based on its prefix
   */
  private getExpiryForKey(key: string): number {
    return key.startsWith(this.PLAYER_COUNT_PREFIX)
      ? this.CACHE_EXPIRY
      : this.CACHE_EXPIRY_LONG;
  }

  /**
   * Check if a cache entry is still valid
   */
  private isValid(cacheItem: CacheEntry, expiry: number): boolean {
    if (!cacheItem?.timestamp || !cacheItem?.version) {
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

  /**
   * Remove expired items from cache
   */
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

  /**
   * Persist cache to localStorage
   */
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(CACHE_KEYS.CACHE_STORAGE, JSON.stringify(this.cache));
    } catch (error) {
      console.error('[PlayCount] Failed to save cache:', error);
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem(CACHE_KEYS.CACHE_STORAGE);
      if (saved) {
        this.cache = JSON.parse(saved);
        this.cleanExpiredItems(); // Clean on load
      }
    } catch (error) {
      console.error('[PlayCount] Failed to load cache:', error);
      this.cache = {};
    }
  }
}
