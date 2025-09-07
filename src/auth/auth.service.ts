import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UsersService } from '../users/users.service';
import { OmitType } from '@nestjs/mapped-types';
import { JwtService } from '@nestjs/jwt';

export class UserExceptPassword extends OmitType(User, ['password']) {}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === pass) {
      //   const { password: _password, ...result } = user;
      //   return { user: result };
      const payload = {
        username: user.username,
        sub: user.userId,
        roles: user.roles,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
