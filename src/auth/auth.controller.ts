import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService, UserExceptPassword } from './auth.service';
import { RolesGuard } from '../roles/roles.guard';
import { Public } from './public';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

class UserDto {
  id: number;
  username: string;
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Body() signInDto: UserDto, @Req() req: Request) {
    // return req.user;
    return this.authService.login(req.user as UserExceptPassword);
  }

  // @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
