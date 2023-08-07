import { Injectable } from '@nestjs/common';
import { GetRootController } from './app.interface';

@Injectable()
export class AppService {
  getRoot(): GetRootController {
    return {
      appName: 'BTR API',
      version: '1.0.0',
      author: 'Cucu Ruhiyatna',
      description:
        'SMK Bina Taruna Jalancagak API. Go to /docs to see API documentation.',
    };
  }
}
