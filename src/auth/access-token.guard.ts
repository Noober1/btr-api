import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { NO_ACCESS_TOKEN } from './auth.decorator';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService, private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowNoAccessToken = this.reflector.getAllAndOverride<boolean>(
      NO_ACCESS_TOKEN,
      [context.getHandler(), context.getClass()],
    );

    if (allowNoAccessToken) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const verifyToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      request['user'] = verifyToken;
    } catch {
      throw new UnauthorizedException('Token invalid');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
