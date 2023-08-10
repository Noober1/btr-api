import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { PrismaService } from '@/services/prisma.service';
import { TeacherModule } from '@/teacher/teacher.module';
import { TeacherService } from '@/teacher/teacher.service';

@Module({
  controllers: [StudentController],
  providers: [StudentService, TeacherService, PrismaService],
})
export class StudentModule {}
