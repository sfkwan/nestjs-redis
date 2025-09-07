import { CustomCacheInterceptor } from './custom-cache.interceptor';
import { CacheService } from '../cache/cache.service';
import { Logger } from 'winston';

describe('CustomCacheInterceptor', () => {
  it('should be defined', () => {
    const mockCacheService: Partial<CacheService> = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };

    const mockLogger: Partial<Logger> = {
      error: jest.fn() as unknown as Logger['error'],
      warn: jest.fn() as unknown as Logger['warn'],
      info: jest.fn() as unknown as Logger['info'],
      debug: jest.fn() as unknown as Logger['debug'],
    };

    const interceptor = new CustomCacheInterceptor(
      mockCacheService as CacheService,
      mockLogger as Logger,
    );

    expect(interceptor).toBeDefined();
  });
});
