import { Injectable } from '@nestjs/common';
import { UpdateUser } from '@/user/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@/services/prisma.service';
import {
  DuplicateException,
  NotFoundException,
} from '@/exception/routeException';
import { TeacherService } from '@/teacher/teacher.service';
import { StudentService } from '@/student/student.service';
import { CreateUser } from '@/user/create-user.dto';
import { Paginate } from '@/types/types';

@Injectable()
export class UserService {
  constructor(
    private db: PrismaService,
    private teacherService: TeacherService,
    private studentService: StudentService,
  ) {}

  async findByUsername(username: string): Promise<User> {
    return await this.db.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.db.user.findFirst({
      where: {
        OR: [{ student: { email } }, { teacher: { email } }],
      },
    });
  }

  async create(data: CreateUser): Promise<object> {
    const isUsernameExist = await this.findByUsername(data.username);
    if (isUsernameExist) throw new DuplicateException('Username already exist');
    const isUserWithThisEmailExist = await this.findByEmail(data.email);
    if (isUserWithThisEmailExist)
      throw new DuplicateException('Email already exist');

    const getBasicData =
      data.roles === 'STUDENT'
        ? await this.studentService.findByEmail(data.email)
        : await this.teacherService.findByEmail(data.email);

    if (!getBasicData) throw new NotFoundException('Email not found');

    await this.db.user.create({
      data: {
        username: data.username,
        password: data.password,
        roles: data.roles,
        studentId: data.roles === 'STUDENT' ? getBasicData.id : undefined,
        teacherId: data.roles === 'TEACHER' ? getBasicData.id : undefined,
      },
    });

    return {
      success: true,
    };
  }

  findAll: Paginate<User> = async (page, limit) => {
    return this.db
      .extended()
      .user.paginate({
        page,
        limit,
        select: {
          id: true,
          username: true,
          roles: true,
          student: {
            select: {
              email: true,
            },
          },
          teacher: {
            select: {
              email: true,
            },
          },
        },
      })
      .then(({ result, ...rest }) => ({
        ...rest,
        result: result.map((value) => ({
          id: value.id,
          username: value.username,
          roles: value.roles,
          email:
            value.roles === 'STUDENT'
              ? value.student.email
              : value.teacher.email,
        })),
      }));
  };

  update(id: number, data: UpdateUser) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
