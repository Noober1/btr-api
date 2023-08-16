import { PrismaService } from '@/services/prisma.service';
import { Paginate, ServiceCreateData } from '@/types/types';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Student } from '@prisma/client';
import { CreateStudent } from '@/student/create-student.dto';
import { UpdateStudent } from '@/student/update-student.dto';

@Injectable()
export class StudentService {
  constructor(private readonly db: PrismaService) {}

  findByEmail(email: string) {
    return this.db.student.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.db.student.findUnique({ where: { id } });
  }

  findTeacherEmail(email: string) {
    return this.db.teacher.findUnique({ where: { email } });
  }

  isEmailUsedByOther(email: string, id: string) {
    return this.db.student.count({
      where: {
        email,
        NOT: {
          id,
        },
      },
    });
  }

  isEmailByTeacher(email: string) {
    return this.db.teacher.count({ where: { email } });
  }

  findAll: Paginate<Student> = async (page, limit) => {
    return this.db.extended().student.paginate({
      page,
      limit,
    });
  };

  create: ServiceCreateData<CreateStudent> = async (data) => {
    const isEmailExist = await this.findByEmail(data.email);
    const isEmailFromTeacher = await this.findTeacherEmail(data.email);
    // if given email already exist from user or teacher table, return error
    if (isEmailExist || isEmailFromTeacher)
      throw new BadRequestException('Email telah digunakan');
    await this.db.student.create({ data });
  };

  async findOne(id: string) {
    const getStudent = await this.db.student.findUnique({
      where: {
        id,
      },
    });

    if (!getStudent) throw new NotFoundException('Student not found');
    return getStudent;
  }

  async updateStudent(id: string, data: UpdateStudent) {
    const getStudent = await this.findById(id);
    if (!getStudent)
      throw new NotFoundException('Student with given id not found');
    if (data.email) {
      const isEmailUsed = await this.isEmailUsedByOther(data.email, id);
      const isEmailFromTeacher = await this.isEmailByTeacher(data.email);
      // if email used by other student or by teacher, return error
      if (isEmailUsed || isEmailFromTeacher)
        throw new BadRequestException('Email already used by other');
    }

    await this.db.student.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const getStudent = await this.findById(id);
    if (!getStudent)
      throw new NotFoundException('Student with given id not found');
    await this.db.student.delete({ where: { id } });
  }
}
