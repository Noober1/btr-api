import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MajorService } from '@/major/major.service';
import { CreateMajor } from '@/major/create-major.dto';
import { UpdateMajor } from '@/major/update-major.dto';
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
import { RequestWithPagination } from '@/middlewares/pagination.middleware';
import { ResponsePaginate } from '@/types/types';
import { Major } from '@prisma/client';
import { ApiPagination } from '@/middlewares/paginationApi.decorator';
// import { AuthenticatedGuard } from '@/auth/authenticated.guard';

@Controller('major')
@ApiTags('Jurusan')
@ApiForbiddenResponse({ description: 'Client belum login' })
@ApiBearerAuth()
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @Get()
  @ApiPagination({
    summary: 'Mendapatkan semua jurusan',
    OkDescription: 'Menampilkan semua jurusan',
  })
  findAll(
    @Req() { page, pageSize }: RequestWithPagination,
  ): ResponsePaginate<Major> {
    return this.majorService.findAll(page, pageSize);
  }

  @Post()
  @ApiOperation({ summary: 'Membuat jurusan' })
  @ApiBadRequestResponse({
    description: 'Data yang diberikan invalid atau terjadi duplikasi data',
  })
  @ApiCreatedResponse({ description: 'Jurusan berhasil dibuat' })
  async create(@Body() data: CreateMajor) {
    await this.majorService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan jurusan berdasarkan ID' })
  @ApiOkResponse({ description: 'Menampilkan jurusan' })
  @ApiNotFoundResponse({
    description: 'Jurusan dengan ID yang diberikan tidak ditemukan',
  })
  findOne(@Param('id') id: string) {
    return this.majorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui jurusan berdasarkan ID' })
  @ApiOkResponse({ description: 'Jurusan berhasil diperbarui' })
  @ApiBadRequestResponse({
    description: 'Data yang diberikan invalid atau terjadi duplikasi data',
  })
  @ApiNotFoundResponse({
    description: 'Jurusan dengan ID yang diberikan tidak ditemukan',
  })
  async update(@Param('id') id: string, @Body() data: UpdateMajor) {
    await this.majorService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus jurusan' })
  @ApiOkResponse({ description: 'Jurusan berhasil dihapus' })
  @ApiNotFoundResponse({
    description: 'Jurusan dengan ID yang diberikan tidak ditemukan',
  })
  remove(@Param('id') id: string) {
    return this.majorService.remove(id);
  }
}
