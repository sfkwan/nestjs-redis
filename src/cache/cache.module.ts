import { Module, Global } from '@nestjs/common';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        // Single Redis-backed Keyv instance. TTL can be passed per-set.
        const store = new KeyvRedis('redis://localhost:6379');
        return new Keyv({ store });
      },
    },
    CacheService,
  ],
  exports: ['CACHE_INSTANCE', CacheService],
})
export class CustomCacheModule {}
