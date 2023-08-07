import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUser } from '@/user/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from '@/services/prisma.service';
import { TeacherService } from '@/teacher/teacher.service';
import { StudentService } from '@/student/student.service';
import { CreateUser } from '@/user/create-user.dto';
import { Paginate, ServiceCreateData } from '@/types/types';
import { Encryption } from '@/utils/encryption';

@Injectable()
export class UserService {
  constructor(
    private readonly db: PrismaService,
    private readonly teacherService: TeacherService,
    private readonly studentService: StudentService,
  ) {}

  async findById(id: number): Promise<User> {
    return await this.db.user.findUnique({ where: { id } });
  }

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

  async isUsernameUsedByOther(username: string, id: number): Promise<User> {
    return await this.db.user.findFirst({
      where: {
        username,
        NOT: {
          id,
        },
      },
    });
  }

  create: ServiceCreateData<CreateUser> = async (data) => {
    const isUsernameExist = await this.findByUsername(data.username);
    if (isUsernameExist)
      throw new BadRequestException('Username already exist');
    const isUserWithThisEmailExist = await this.findByEmail(data.email);
    if (isUserWithThisEmailExist)
      throw new BadRequestException('Email already exist');

    const getBasicData =
      data.role === 'STUDENT'
        ? await this.studentService.findByEmail(data.email)
        : await this.teacherService.findByEmail(data.email);
    if (!getBasicData) throw new BadRequestException('Email not found');

    const hashedPassword = await Encryption.hash(data.password);

    await this.db.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: data.role,
        studentId: data.role === 'STUDENT' ? getBasicData.id : undefined,
        teacherId: data.role === 'TEACHER' ? getBasicData.id : undefined,
      },
    });
  };

  findAll: Paginate<User> = async (page, limit) => {
    return this.db
      .extended()
      .user.paginate({
        page,
        limit,
        select: {
          id: true,
          username: true,
          role: true,
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
          role: value.role,
          email:
            value.role === 'STUDENT'
              ? value.student.email
              : value.teacher.email,
        })),
      }));
  };

  async updateUser(id: number, data: UpdateUser) {
    const getUser = await this.findById(id);
    if (!getUser) throw new NotFoundException('User with given id not found');
    if (data.username) {
      const isUsernameUsedByOther = await this.isUsernameUsedByOther(
        data.username,
        id,
      );
      if (isUsernameUsedByOther)
        throw new BadRequestException('Username already used by other user');
    }

    data.password = data.password
      ? await Encryption.hash(data.password)
      : undefined;

    await this.db.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    await this.db.user.deleteMany({ where: { id } });
  }
}
