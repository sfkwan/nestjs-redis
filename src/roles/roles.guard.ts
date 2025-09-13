import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { UserExceptPassword } from '../auth/auth.service';
import { IS_PUBLIC_KEY } from '../auth/public';
import { Roles } from './roles.decorator';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<UserExceptPassword>(
        token,
        {
          secret: jwtConstants.secret,
        },
      );

      this.logger.info(`payload: ${JSON.stringify(payload)}`);

      request.user = payload;
      // Assign the payload to the request object for downstream access
      const roles = this.reflector.get<string[]>(Roles, context.getHandler());
      this.logger.info(`roles: ${JSON.stringify(roles)}`);

      if (!roles) {
        return true;
      }

      const user = request.user as UserExceptPassword;
      // if (!user.roles || !Array.isArray(user.roles)) {
      //   return false;
      // }
      return user.roles.some((role) => roles.includes(role));
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
