import { PrismaService } from '@/services/prisma.service';
import { Encryption } from '@/utils/encryption';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  findOne(username: string): Promise<User> {
    return this.db.user.findUnique({ where: { username } });
  }

  async signIn(username: string, password: string) {
    const user = await this.findOne(username);
    if (!user) throw new BadRequestException('User not found');

    const isPasswordMatch = await Encryption.isMatch(password, user.password);

    if (!isPasswordMatch) throw new BadRequestException('Password mismatch');

    const jwt = await this.jwtService.signAsync({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      accessToken: jwt,
    };
  }
}
