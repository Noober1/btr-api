import { UserService } from '@/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Session } from './auth.interface';
import { Encryption } from '@/utils/encryption';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, password: string): Promise<Session> {
    const user = await this.userService.findByUsername(username);
    if (!user)
      throw new UnauthorizedException('User with given username not found');

    const isPasswordMatch = await Encryption.isMatch(password, user.password);
    // if password mismatch, throw unauthorize error
    if (!isPasswordMatch) throw new UnauthorizedException('Password mismatch');

    return {
      id: user.id,
      loginDate: new Date(),
    };
  }
}
