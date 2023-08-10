import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTeacher } from '@/teacher/update-teacher.dto';
import { PrismaService } from '@/services/prisma.service';
import { Teacher } from '@prisma/client';
import { Paginate, ServiceCreateData } from '@/types/types';
import { CreateTeacher } from './create-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private readonly db: PrismaService) {}

  findByEmail(email: string) {
    return this.db.teacher.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.db.teacher.findUnique({ where: { id } });
  }

  findStudentEmail(email: string) {
    return this.db.student.findUnique({ where: { email } });
  }

  isEmailUsedByOther(email: string, id: string) {
    return this.db.teacher.count({
      where: {
        email,
        NOT: {
          id,
        },
      },
    });
  }

  isEmailByStudent(email: string) {
    return this.db.student.count({ where: { email } });
  }

  create: ServiceCreateData<CreateTeacher> = async (data) => {
    const isEmailExist = await this.findByEmail(data.email);
    const isEmailStudent = await this.findStudentEmail(data.email);
    if (isEmailExist || isEmailStudent)
      throw new BadRequestException('Email already exist');
    await this.db.teacher.create({ data });
  };

  findAll: Paginate<Teacher> = async (page, limit) => {
    return this.db.extended().teacher.paginate({
      page,
      limit,
    });
  };

  async findOne(id: string) {
    const find = await this.findById(id);
    if (!find) throw new NotFoundException('Teacher with given id not found');
    return find;
  }

  // TODO: ini belum beres gan
  async updateTeacher(id: string, data: UpdateTeacher) {
    const getTeacher = await this.findById(id);
    if (!getTeacher)
      throw new NotFoundException('Teacher with given id not found');
    if (data.email) {
      const isEmailUsed = await this.isEmailUsedByOther(data.email, id);
      const isEmailFromStudent = await this.isEmailByStudent(data.email);
      // if email used by other student or by teacher, return error
      if (isEmailUsed || isEmailFromStudent)
        throw new BadRequestException('Email already used by other');
    }

    await this.db.student.update({
      where: { id },
      data,
    });
  }

  async deleteTeacher(id: string) {
    const getTeacher = await this.findById(id);
    if (!getTeacher)
      throw new NotFoundException('Teacher with given id not found');
    await this.db.teacher.delete({ where: { id } });
  }
}
