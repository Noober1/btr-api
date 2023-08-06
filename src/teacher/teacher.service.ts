import { Injectable } from '@nestjs/common';
import { UpdateTeacher } from '@/teacher/update-teacher.dto';
import { PrismaService } from '@/services/prisma.service';
import { Prisma, Teacher } from '@prisma/client';
import { DuplicateException } from '@/exception/routeException';
import { Paginate, ServiceCreateData } from '@/types/types';

@Injectable()
export class TeacherService {
  constructor(private readonly db: PrismaService) {}

  async findByEmail(email: string) {
    return await this.db.teacher.findUnique({ where: { email } });
  }

  create: ServiceCreateData<Prisma.TeacherCreateInput> = async (data) => {
    const isEmailExist = await this.findByEmail(data.email);
    if (isEmailExist) throw new DuplicateException('Email already exist');
    await this.db.teacher.create({ data });

    return {
      success: true,
    };
  };

  findAll: Paginate<Teacher> = async (page, limit) => {
    return this.db.extended().teacher.paginate({
      page,
      limit,
    });
  };

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, data: UpdateTeacher) {
    return `This action updates a #${id} teacher`;
  }

  async deleteTeacher(id: string) {
    await this.db.teacher.deleteMany({ where: { id } });
  }
}
