import { PrismaService } from '@/services/prisma.service';
import { Paginate } from '@/types/types';
import {
  ForbiddenException,
  Get,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Course } from '@prisma/client';
import { CreateCourse } from './create-course.dto';
import { UpdateCourse } from './update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly db: PrismaService) {}

  findById(id: string) {
    return this.db.course.findUnique({ where: { id } });
  }

  getAllCourse: Paginate<Course> = async (page, limit) => {
    return this.db.extended().course.paginate({ page, limit });
  };

  async createCourse(data: CreateCourse) {
    await this.db.course.create({ data });
  }

  async findOne(id: string) {
    const getData = await this.findById(id);
    if (!getData)
      throw new NotFoundException(
        'Mapel dengan ID yang diberikan tidak ditemukan',
      );
    return getData;
  }

  async updateCourse(id: string, data: UpdateCourse) {
    const getData = await this.findById(id);
    if (!getData)
      throw new NotFoundException(
        'Mapel dengan ID yang diberikan tidak ditemukan',
      );

    await this.db.course.update({
      where: { id },
      data,
    });
  }

  async deleteCourse(id: string) {
    const getData = await this.db.course.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        scores: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!getData) throw new NotFoundException('Course with given id not found');
    if (getData.scores.length > 0)
      throw new ForbiddenException(
        'Cannot deleting course that already have data',
      );

    await this.db.course.delete({ where: { id } });
  }
}
