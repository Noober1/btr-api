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

  async updateToken(id: number, token: string | null) {
    return await this.db.user.update({
      where: { id },
      data: { refreshToken: token },
    });
  }

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
      throw new BadRequestException(
        'Nama pengguna telah digunakan oleh pengguna lain',
      );
    const isUserWithThisEmailExist = await this.findByEmail(data.email);
    if (isUserWithThisEmailExist)
      throw new BadRequestException('Email telah digunakan oleh pengguna lain');

    const getBasicData =
      data.role === 'STUDENT'
        ? await this.studentService.findByEmail(data.email)
        : await this.teacherService.findByEmail(data.email);

    if (!getBasicData) throw new BadRequestException('Email tidak ditemukan');

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
          updatedAt: true,
          createdAt: true,
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
        result: result.map(({ teacher, student, ...value }) => ({
          ...value,
          email: value.role === 'STUDENT' ? student.email : teacher.email,
        })),
      }));
  };

  async findOne(id: number) {
    const getUser = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        student: {
          select: {
            fullname: true,
            birthDate: true,
            birthPlace: true,
            email: true,
            NIS: true,
            NISN: true,
          },
        },
        teacher: {
          select: {
            fullname: true,
            email: true,
          },
        },
      },
    });
    if (!getUser)
      throw new NotFoundException(
        'Nama pengguna dengan ID tersebut tidak ditemukan',
      );
    const userData =
      getUser.student !== null ? getUser.student : getUser.teacher;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { student, teacher, ...data } = getUser;
    return {
      ...data,
      data: userData,
    };
  }

  async updateUser(id: number, data: UpdateUser) {
    const getUser = await this.findById(id);
    if (!getUser)
      throw new NotFoundException(
        'Nama pengguna dengan ID tersebut tidak ditemukan',
      );
    if (data.username) {
      const isUsernameUsedByOther = await this.isUsernameUsedByOther(
        data.username,
        id,
      );
      if (isUsernameUsedByOther)
        throw new BadRequestException(
          'Nama pengguna telah digunakan oleh pengguna lain',
        );
    }

    data.password = data.password
      ? await Encryption.hash(data.password)
      : undefined;

    await this.db.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(ids: number[]) {
    const deleting = await this.db.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return deleting;
  }
}
