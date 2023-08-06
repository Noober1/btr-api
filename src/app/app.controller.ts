import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GetRootController } from './app.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  rootPath(): GetRootController {
    return {
      appName: 'BTR API',
      version: '1.0.0',
      author: 'Cucu Ruhiyatna',
    };
  }
}
