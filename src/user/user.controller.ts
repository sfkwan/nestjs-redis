import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../generated/prisma';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Public } from '../auth/public';

@ApiTags('users')
@Controller('user')
@Public()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users with their posts',
  })
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
    example: 'ck1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUser(@Param('id') id: string) {
    return this.userService.user({ id: id });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    description: 'User data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'John Doe' },
      },
      required: ['email', 'name'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data',
  })
  async signupUser(
    @Body() userData: { email: string; name: string },
  ): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
    example: 'ck1234567890',
  })
  @ApiBody({
    description: 'Updated user data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'updated@example.com' },
        name: { type: 'string', example: 'Updated Name' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() userData: { email: string; name: string },
  ): Promise<User> {
    return this.userService.updateUser({
      where: { id: id },
      data: userData,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
    example: 'ck1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser({ id: id });
  }
}
