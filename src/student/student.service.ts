import { DuplicateException } from '@/exception/routeException';
import { PrismaService } from '@/services/prisma.service';
import { Paginate, ServiceCreateData } from '@/types/types';
import { Injectable } from '@nestjs/common';
import { Prisma, Student } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private readonly db: PrismaService) {}

  async findByEmail(email: string) {
    return await this.db.student.findUnique({ where: { email } });
  }

  findAll: Paginate<Student> = async (page, limit) => {
    return this.db.extended().student.paginate({
      page,
      limit,
    });
  };

  create: ServiceCreateData<Prisma.StudentCreateInput> = async (data) => {
    const isEmailExist = await this.findByEmail(data.email);
    if (isEmailExist) throw new DuplicateException('Email already exist');
    await this.db.student.create({ data });

    return {
      success: true,
    };
  };

  async delete(id: string) {
    await this.db.student.deleteMany({ where: { id } });
  }
}
