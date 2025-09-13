import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomCacheModule } from './cache/cache.module';
import { validate } from './config/env.validation';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }), // make sure you import the ConfigModule first like this
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        const redisHost =
          configService.get<string>('REDIS_HOST') || 'localhost';
        const redisPort = configService.get<number>('REDIS_PORT') || 6379;
        return {
          stores: [createKeyv(`redis://${redisHost}:${redisPort}`)],
          ttl: 600000, // 10 minutes
        };
      },
      inject: [ConfigService],
    }),
    CatsModule,
    AuthModule,

    CatsModule,
    AuthModule,
    UsersModule,
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
    PrismaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
