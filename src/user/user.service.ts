import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Prisma, User } from '../../generated/prisma';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    this.logger.info(
      `Find unique user ${JSON.stringify(userWhereUniqueInput)}`,
    );
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    return user;
  }

  async createUser(data: Prisma.UserCreateInput) {
    try {
      this.logger.info(`Creating user with email: ${JSON.stringify(data)}`);
      const user = await this.prisma.user.create({
        data,
      });
      this.logger.info(`User created successfully with ID: ${user.id}`);
      return user;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create user: ${errorMessage}`);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      this.logger.info('Retrieving all users');
      const users = await this.prisma.user.findMany({
        include: {
          posts: true, // Include related posts
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      this.logger.info(`Retrieved ${users.length} users`);
      return users;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to retrieve users: ${errorMessage}`);
      throw error;
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    this.logger.info(`Updating user with ID: ${JSON.stringify(params.where)}`);
    const updateUser = await this.prisma.user.update({
      where: params.where,
      data: params.data,
    });
    return updateUser;
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    try {
      this.logger.info(`Deleting user with ID: ${JSON.stringify(where)}`);
      const user = await this.prisma.user.delete({
        where,
      });
      this.logger.info(
        `User deleted successfully with ID: ${JSON.stringify(where)}`,
      );
      return user;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to delete user: ${errorMessage}`);
      throw error;
    }
  }
}
