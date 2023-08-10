import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@/services/prisma.service';
import { TeacherService } from '@/teacher/teacher.service';
import { StudentService } from '@/student/student.service';

@Module({
  controllers: [UserController],
  providers: [UserService, TeacherService, StudentService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
