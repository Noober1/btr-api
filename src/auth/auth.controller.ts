import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginAuth } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: 'Login authentication' })
  @ApiUnauthorizedResponse({
    description: "Given credential doesn't match",
  })
  @ApiOkResponse({ description: 'Login successfully' })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async authLogin(@Request() req, @Body() data: LoginAuth): Promise<object> {
    return {
      success: true,
      data: req.user,
    };
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout authentication' })
  @ApiOkResponse({ description: 'Logout successfully' })
  authLogout(@Request() req): object {
    req.session.destroy();
    return { success: true };
  }
}
