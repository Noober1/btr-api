import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TeacherService } from '@/teacher/teacher.service';
import { CreateTeacher } from '@/teacher/create-teacher.dto';
import { RequestWithPagination } from '@/middlewares/pagination.middleware';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
// import { AuthenticatedGuard } from '@/auth/authenticated.guard';
import { ResponsePaginate } from '@/types/types';
import { Teacher } from '@prisma/client';
import { ApiPagination } from '@/middlewares/paginationApi.decorator';
import { UpdateTeacher } from './update-teacher.dto';
import { AccessTokenGuard } from '@/auth/access-token.guard';

@Controller('teacher')
@ApiTags('Guru')
@ApiForbiddenResponse({ description: 'Client belum login' })
@ApiBearerAuth()
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @ApiPagination({
    summary: 'Mendapatkan semua guru',
    OkDescription: 'Mengembalikan semua guru',
  })
  findAll(
    @Req() { page, pageSize }: RequestWithPagination,
  ): ResponsePaginate<Teacher> {
    return this.teacherService.findAll(page, pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Pendapatkan guru berdasarkan ID' })
  @ApiOkResponse({ description: 'Menampilkan guru' })
  @ApiNotFoundResponse({
    description: 'Guru dengan ID yang diberikan tidak ditemukan',
  })
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui guru' })
  @ApiOkResponse({ description: 'Guru berhasil diperbarui' })
  @ApiNotFoundResponse({
    description: 'Guru dengan ID yang diberikan tidak ditemukan',
  })
  @ApiBadRequestResponse({
    description: 'Data yang diberikan invalid atau terjadi duplikasi data',
  })
  async updateStudent(@Param('id') id: string, @Body() data: UpdateTeacher) {
    await this.teacherService.updateTeacher(id, data);
  }

  @Post()
  @ApiOperation({ summary: 'Membuat guru' })
  @ApiCreatedResponse({ description: 'Guru berhasil dibuat' })
  @ApiBadRequestResponse({
    description: 'Data yang diberikan invalid atau terjadi duplikasi data',
  })
  async create(@Body() data: CreateTeacher) {
    await this.teacherService.create(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus guru berdasarkan ID' })
  @ApiOkResponse({ description: 'Guru berhasil dihapus' })
  @ApiNotFoundResponse({
    description: 'Guru dengan ID yang diberikan tidak ditemukan',
  })
  delete(@Param('id') id: string) {
    return this.teacherService.deleteTeacher(id);
  }
}
