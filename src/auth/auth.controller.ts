import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { Public } from '@/auth/auth.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RequestWithUser, Session } from './auth.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() data: AuthDto) {
    return this.authService.signIn(data.username, data.password);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Profile user' })
  @ApiOkResponse({
    description: 'Mengembalikan data profile user yang sudah login',
  })
  @ApiBearerAuth()
  authProfile(@Request() req: RequestWithUser): Session {
    return req.user;
  }
}
