import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginAuth } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: 'Login authentication' })
  @UseGuards(LocalAuthGuard)
  async authLogin(@Request() req, @Body() data: LoginAuth) {
    return {
      success: true,
      data: req.user,
    };
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout authentication' })
  authLogout(@Request() req): object {
    req.session.destroy();
    return { success: true };
  }
}
