import { PrismaService } from '@/services/prisma.service';
import { Paginate, ServiceCreateData } from '@/types/types';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Student } from '@prisma/client';
import { CreateStudent } from './create-student.dto';

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

  create: ServiceCreateData<CreateStudent> = async (data) => {
    const isEmailExist = await this.findByEmail(data.email);
    if (isEmailExist) throw new BadRequestException('Email already exist');
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

  async delete(id: string) {
    await this.db.student.deleteMany({ where: { id } });
  }
}
