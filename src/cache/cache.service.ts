import { Inject, Injectable } from '@nestjs/common';
import Keyv from 'keyv';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class CacheService {
  constructor(
    @Inject('CACHE_INSTANCE') private readonly cache: Keyv,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async get<T = any>(key: string): Promise<T | undefined> {
    return (await this.cache.get(key)) as T | undefined;
  }
  /**
   * Add to cache.
   * @param {string} key - key to set.
   * @param {any} value - value to set.
   * @param {number} [ttlInSeconds] - time to live in seconds.
   * @returns — if it sets then it will return a true. On failure will return false.
   */
  async set(key: string, value: any, ttlInSeconds?: number): Promise<boolean> {
    this.logger.info(`Setting cache key: ${key} ttl=${ttlInSeconds}`);
    if (ttlInSeconds) {
      // Keyv expects ttl in ms
      return await this.cache.set(key, value, ttlInSeconds * 1000);
    } else {
      return await this.cache.set(key, value);
    }
  }

  async delete(key: string): Promise<boolean> {
    this.logger.info(`Deleting cache key: ${key}`);
    return await this.cache.delete(key);
  }
}
