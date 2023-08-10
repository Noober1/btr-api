import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMajor } from '@/major/create-major.dto';
import { UpdateMajor } from '@/major/update-major.dto';
import { Paginate, ServiceCreateData } from '@/types/types';
import { Major, Prisma } from '@prisma/client';
import { PrismaService } from '@/services/prisma.service';

@Injectable()
export class MajorService {
  constructor(private readonly db: PrismaService) {}

  countMajor(query: Prisma.MajorCountArgs) {
    return this.db.major.count(query);
  }

  isCodeUsedByOther(code: string, id: string) {
    return this.countMajor({
      where: {
        code,
        NOT: { id },
      },
    });
  }

  findByCode(code: string) {
    return this.db.major.findUnique({ where: { code } });
  }

  create: ServiceCreateData<CreateMajor> = async (data) => {
    const isCodeExist = await this.findByCode(data.code);
    if (isCodeExist)
      throw new BadRequestException('Major with given code already exist');

    await this.db.major.create({ data });
  };

  findAll: Paginate<Major> = async (page, limit) => {
    return this.db.extended().major.paginate({ page, limit });
  };

  async findOne(id: string) {
    const getData = await this.db.major.findUnique({
      where: { id },
    });
    if (!getData) throw new NotFoundException('Major with given id not found');
    return getData;
  }

  async update(id: string, data: UpdateMajor) {
    // count where code equal given code AND id not equal given id
    const getOtherMajorByCode = await this.isCodeUsedByOther(data.code, id);

    if (getOtherMajorByCode)
      throw new BadRequestException(
        'Given code is already used by other major',
      );
    await this.db.major.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const isMajorHasChildData = await this.countMajor({
      where: {
        academicSession: {
          some: {},
        },
      },
    });

    if (isMajorHasChildData)
      return new HttpException('No data deleted', HttpStatus.OK);

    await this.db.major.deleteMany({ where: { id } });
  }
}
