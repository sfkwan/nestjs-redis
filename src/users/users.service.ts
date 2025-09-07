import { Injectable } from '@nestjs/common';

export class User {
  userId: number;
  username: string;
  password: string;
  roles: string[];
}

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      roles: ['admin'],
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      roles: ['user'],
    },
  ];

  findOne(username: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.username === username);
    return Promise.resolve(user);
  }
}
