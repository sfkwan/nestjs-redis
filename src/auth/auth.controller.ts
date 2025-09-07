import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RolesGuard } from '../roles/roles.guard';
import { Public } from './public';

class UserDto {
  id: number;
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() sigInDto: UserDto) {
    return this.authService.signIn(sigInDto.username, sigInDto.password);
  }

  @UseGuards(RolesGuard)
  @Get('profile')
  getProfile(@Req() req: import('express').Request) {
    return req.user;
  }
}
