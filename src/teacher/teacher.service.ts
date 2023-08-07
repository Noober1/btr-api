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

  async findByEmail(email: string) {
    return await this.db.teacher.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return await this.db.teacher.findUnique({ where: { id } });
  }

  create: ServiceCreateData<CreateTeacher> = async (data) => {
    const isEmailExist = await this.findByEmail(data.email);
    if (isEmailExist) throw new BadRequestException('Email already exist');
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

  update(id: number, data: UpdateTeacher) {
    return `This action updates a #${id} teacher`;
  }

  async deleteTeacher(id: string) {
    await this.db.teacher.deleteMany({ where: { id } });
  }
}
