import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { Public } from '@/auth/auth.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RequestWithUser, Session } from './auth.interfaces';
import { AccessTokenGuard } from './access-token.guard';
import { RefreshTokenGuard } from './refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: AuthDto) {
    return this.authService.signIn(data.username, data.password);
  }

  @ApiBearerAuth()
  @Get('logout')
  logout(@Req() req: RequestWithUser) {
    this.authService.logout(req.user['sub']);
  }

  @Get('refresh')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  refreshTokens(@Req() req: RequestWithUser) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
