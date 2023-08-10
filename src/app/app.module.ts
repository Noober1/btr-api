import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from '@/app/app.controller';
import { AppService } from '@/app/app.service';
import { UserModule } from '@/user/user.module';
import { TeacherModule } from '@/teacher/teacher.module';
import { PaginationMiddleware } from '@/middlewares/pagination.middleware';
import { ConfigMiddleware } from '@/middlewares/config.middleware';
import { AuthModule } from '@/auth/auth.module';
import { StudentModule } from '@/student/student.module';
import { MajorModule } from '@/major/major.module';
import { CourseModule } from '@/course/course.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TeacherModule,
    StudentModule,
    MajorModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.GET,
      })
      .apply(ConfigMiddleware)
      .forRoutes('*');
  }
}
