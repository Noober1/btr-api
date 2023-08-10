import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { PrismaService } from '@/services/prisma.service';
import { StudentService } from '@/student/student.service';
import { StudentModule } from '@/student/student.module';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, StudentService, PrismaService],
})
export class TeacherModule {}
