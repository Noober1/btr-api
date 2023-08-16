import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { AllowNoToken } from '@/auth/auth.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RequestWithUser } from './auth.interfaces';
import { RefreshTokenGuard } from './refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AllowNoToken()
  @ApiOperation({
    summary: 'Login user',
    description:
      'Login untuk mendapatkan token, yaitu access token dan refresh token. Access token digunakan untuk mengakses fitur-fitur pada API ini. Sedangkan Refresh token digunakan untuk memperbarui access token yang sudah kadaluarsa.',
  })
  @ApiOkResponse({
    description: 'Mengembalikan access token dan refresh token',
  })
  @ApiBadRequestResponse({ description: 'Autentikasi invalid' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: AuthDto) {
    return this.authService.signIn(data.username, data.password);
  }

  @Get('logout')
  @ApiBearerAuth()
  @AllowNoToken()
  @ApiOperation({
    summary: 'Logout user',
    description: 'Setelah logout, akses token dari database akan dihapus',
  })
  @UseGuards(RefreshTokenGuard)
  logout(@Req() req: RequestWithUser) {
    this.authService.logout(req.user['sub']);
  }

  @Get('refresh')
  @AllowNoToken()
  @ApiOperation({
    summary: 'Untuk merefresh akses token',
    description:
      'Akses token memiliki masa kadaluarsa. Gunakan endpoint ini untuk membuat akses token baru.',
  })
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  refreshTokens(@Req() req: RequestWithUser) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
