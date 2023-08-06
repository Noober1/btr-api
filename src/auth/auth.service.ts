import { NotFoundException } from '@/exception/routeException';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { Session } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, password: string): Promise<Session> {
    const user = await this.userService.findByUsername(username);
    if (!user)
      throw new NotFoundException('User with given username not found');

    // if password mismatch, return null
    if (user.password !== password) {
      return null;
    }

    return {
      id: user.id,
      loginDate: new Date(),
    };
  }
}
