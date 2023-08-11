import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AllowNoToken } from '@/auth/auth.decorator';

@Controller()
@ApiTags('utama')
@AllowNoToken()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ description: 'Description about this API' })
  rootPath() {
    return this.appService.getRoot();
  }
}
