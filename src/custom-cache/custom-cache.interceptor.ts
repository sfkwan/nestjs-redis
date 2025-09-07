import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { CacheService } from '../cache/cache.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class CustomCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const start = Date.now();
    const cacheKey = `${request.method} ${request.url}`;

    // read from cache (typed) — if cache read fails, fall back to request handling
    try {
      const cached = await this.cacheService.get<string>(cacheKey);
      if (cached) {
        const duration = Date.now() - start;
        response.setHeader('Server-Timing', `cache;dur=${duration}`);
        return of(cached);
      }
    } catch (err) {
      this.logger.error(`Cache read error for key ${cacheKey}: ${err}`);
      // don't fail the request on cache errors
      // console.error can be noisy; rely on centralized logger if needed
    }

    return next.handle().pipe(
      mergeMap((data: unknown) =>
        from(this.cacheService.set(cacheKey, data, 300)).pipe(map(() => data)),
      ),
      tap(() => {
        const duration = Date.now() - start;
        response.setHeader('Server-Timing', `total;dur=${duration}`);
      }),
    );
  }
}
