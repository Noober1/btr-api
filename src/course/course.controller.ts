// import { AuthenticatedGuard } from '@/auth/authenticated.guard';
import { RequestWithPagination } from '@/middlewares/pagination.middleware';
import { ResponsePaginate } from '@/types/types';
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
import { Course } from '@prisma/client';
import { CourseService } from './course.service';
import { ApiPagination } from '@/middlewares/paginationApi.decorator';
import { CreateCourse } from './create-course.dto';
import { UpdateCourse } from './update-course.dto';

@Controller('course')
@ApiTags('Mata pelajaran')
@ApiForbiddenResponse({ description: 'Client belum login' })
@ApiBearerAuth()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiPagination({
    summary: 'Mendapatkan semua mapel',
    OkDescription: 'Menampilkan semua mapel',
  })
  findAllCourse(
    @Req() { page, pageSize }: RequestWithPagination,
  ): ResponsePaginate<Course> {
    return this.courseService.getAllCourse(page, pageSize);
  }

  @Post()
  @ApiOperation({ summary: 'Membuat mata pelajaran' })
  @ApiCreatedResponse({ description: 'Mata pelajaran berhasil dibuat' })
  @ApiBadRequestResponse({
    description: 'Data yang diberikan invalid',
  })
  async createCourse(@Body() data: CreateCourse) {
    await this.courseService.createCourse(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan mapel berdasarkan ID' })
  @ApiOkResponse({ description: 'Menampilkan mapel' })
  @ApiNotFoundResponse({
    description: 'Mapel dengan id yang diberikan tidak ditemukan',
  })
  getCourseById(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui mapel' })
  @ApiOkResponse({ description: 'Mapel berhasil diperbarui' })
  @ApiBadRequestResponse({
    description: 'Data yang diberikan invalid',
  })
  async updateCourse(@Param('id') id: string, @Body() data: UpdateCourse) {
    await this.courseService.updateCourse(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Menghapus mapel',
    description:
      'Menghapus mata pelajaran berdasarkan ID yang diberikan. Mata pelajaran tidak akan terhapus ketika jika mata pelajaran saat ini sedang digunakan oleh data lain',
  })
  @ApiOkResponse({ description: 'Mapel berhasil dihapus' })
  @ApiForbiddenResponse({
    description: 'Tidak bisa menghapus mapel yang sedang digunakan',
  })
  @ApiNotFoundResponse({
    description: 'Mapel dengan ID yang diberikan tidak ditemukan',
  })
  async deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}
