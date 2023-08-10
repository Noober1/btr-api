import { Module } from '@nestjs/common';
import { CourseController } from '@/course/course.controller';
import { CourseService } from '@/course/course.service';
import { PrismaService } from '@/services/prisma.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaService],
})
export class CourseModule {}
