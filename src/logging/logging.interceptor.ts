import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'winston';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const start = Date.now();
    const logLocation = `${request.method} ${request.url}`;
    this.logger.info(`Start... ${logLocation}`);

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.info(`End... ${logLocation} ${Date.now() - now}ms`);
        const duration = Date.now() - start;
        const existing = response.getHeader('Server-Timing') as
          | string
          | undefined;
        const timing = existing
          ? `${existing}, logging;dur=${duration}`
          : `logging;dur=${duration}`;
        response.setHeader('Server-Timing', timing);
      }),
    );
  }
}
