import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import { CustomCacheModule } from './cache/cache.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }), // make sure you import the ConfigModule first like this

    CatsModule,
    AuthModule,
    UsersModule,
    // CacheModule.register({ ttl: 300, max: 1000, isGlobal: true }),
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   useFactory: () => {
    //     return {
    //       stores: [new KeyvRedis('redis://localhost:6379')],
    //     };
    //   },
    // }),
    WinstonModule.forRoot({
      // Configure your Winston transports and formats here
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf((info: Record<string, any>) => {
              const { timestamp, level, message } = info;
              return `${timestamp} [${level}]: ${message}`;
            }),
          ),
        }),
        // Add other transports like file, daily rotate file, etc.
      ],
    }),
    CustomCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
