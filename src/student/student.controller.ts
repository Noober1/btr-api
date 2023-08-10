import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { RequestWithPagination } from '@/middlewares/pagination.middleware';
import { CreateStudent } from '@/student/create-student.dto';
// import { AuthenticatedGuard } from '@/auth/authenticated.guard';
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
import { ResponsePaginate } from '@/types/types';
import { Student } from '@prisma/client';
import { ApiPagination } from '@/middlewares/paginationApi.decorator';
import { UpdateStudent } from './update-student.dto';

@Controller('student')
@ApiTags('Siswa')
@ApiForbiddenResponse({ description: 'Client belum login' })
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiPagination({
    summary: 'Mendapatkan semua siswa',
    OkDescription: 'Menampilkan semua siswa',
  })
  findAllStudent(
    @Req() { page, pageSize }: RequestWithPagination,
  ): ResponsePaginate<Student> {
    return this.studentService.findAll(page, pageSize);
  }

  @Post()
  @ApiOperation({ summary: 'Membuat siswa' })
  @ApiCreatedResponse({ description: 'Siswa berhasil dibuat' })
  @ApiBadRequestResponse({
    description: 'Data yang diberikan invalid atau terjadi duplikasi data',
  })
  async createStudent(@Body() data: CreateStudent) {
    await this.studentService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mencari siswa berdasarkan ID' })
  @ApiOkResponse({ description: 'Menampilkan siswa' })
  @ApiNotFoundResponse({
    description: 'Data dengan ID yang diberikan tidak ditemukan',
  })
  getStudentById(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui siswa' })
  @ApiOkResponse({ description: 'Siswa berhasil diperbarui' })
  @ApiNotFoundResponse({
    description: 'Siswa dengan ID yang diberikan tidak ditemukan',
  })
  @ApiBadRequestResponse({
    description: 'Data yang diberikan invalid atau terjadi duplikasi data',
  })
  async updateStudent(@Param('id') id: string, @Body() data: UpdateStudent) {
    await this.studentService.updateStudent(id, data);
  }

  @ApiOperation({ summary: 'Hapus siswa berdasarkan ID' })
  @ApiNotFoundResponse({
    description: 'Siswa dengan ID yang diberikan tidak ditemukan',
  })
  @ApiOkResponse({ description: 'Siswa berhasil dihapus' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.studentService.delete(id);
  }
}
