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
      throw new BadRequestException('Email telah digunakan');
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

  async updateTeacher(id: string, data: UpdateTeacher) {
    const getTeacher = await this.findById(id);
    console.log('getteacher', getTeacher);
    if (!getTeacher)
      throw new NotFoundException('Teacher with given id not found');
    if (data.email) {
      const isEmailUsed = await this.isEmailUsedByOther(data.email, id);
      const isEmailFromStudent = await this.isEmailByStudent(data.email);
      // if email used by other student or by teacher, return error
      if (isEmailUsed || isEmailFromStudent)
        throw new BadRequestException('Email telah digunakan');
    }

    await this.db.teacher.update({
      where: { id },
      data,
    });
  }

  async deleteTeacher(userId: number, id: string[]) {
    // find teacher where user id equal userId
    const getTeacherByUserId = await this.db.teacher.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
    });
    // if teacher exist, remove from id list
    if (getTeacherByUserId) {
      id = id.filter((value) => value !== getTeacherByUserId.id);
    }
    // deleting teachers
    const deleting = await this.db.teacher.deleteMany({
      where: { id: { in: id } },
    });
    // return result
    return deleting;
  }
}
