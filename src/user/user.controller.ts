import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser } from '@/user/create-user.dto';
import { UpdateUser } from './update-user.dto';
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
import { Role, User } from '@prisma/client';
import { ResponsePaginate } from '@/types/types';
import { ApiPagination } from '@/middlewares/paginationApi.decorator';
import { Roles } from '@/auth/auth.decorator';
import { RolesGuard } from './roles.guard';
import { AccessTokenGuard } from '@/auth/access-token.guard';
import { IdListDto } from '@/id-list.dto';
import { RequestWithUser } from '@/auth/auth.interfaces';

@Controller('user')
@ApiTags('User')
@ApiForbiddenResponse({ description: 'Client belum login' })
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiPagination({
    summary: 'Mendapatkan semua user',
    OkDescription: 'Menampilkan semua user',
  })
  findAll(
    @Req() { page, pageSize }: RequestWithPagination,
  ): ResponsePaginate<User> {
    return this.userService.findAll(page, pageSize);
  }

  @Post()
  @ApiOperation({
    summary: 'Membuat user',
    description:
      'Membuat user berdasarkan email pada table student atau teacher. Pastikan email terdaftar pada database student atau teacher dan tidak terdaftar pada table user',
  })
  @ApiBadRequestResponse({ description: 'Data yang diberikan invalid' })
  @ApiCreatedResponse({ description: 'User berhasil dibuat' })
  async create(@Body() data: CreateUser) {
    await this.userService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan siswa berdasarkan ID' })
  @ApiOkResponse({ description: 'Menampilkan siswa' })
  @ApiNotFoundResponse({
    description: 'Siswa dengan ID yang diberikan tidak ditemukan',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui user' })
  @ApiNotFoundResponse({
    description: 'Data dengan ID user yang diberikan tidak ditemukan',
  })
  @ApiBadRequestResponse({
    description: 'Data yang diberikan invalid atau terjadi duplikasi data',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUser,
  ) {
    await this.userService.updateUser(id, data);
  }

  @Delete()
  @ApiOperation({ summary: 'Menghapus user berdasarkan kumpulan id' })
  @ApiOkResponse({ description: 'Pengguna berhasil dihapus' })
  @ApiNotFoundResponse({
    description: 'Data dengan ID user yang diberikan tidak ditemukan',
  })
  async remove(@Body() data: IdListDto, @Req() req) {
    // parse all id into number
    const parseAllId = data.id.map((value) =>
      typeof value === 'string' ? parseInt(value) : value,
    );
    // filter id where id is not current user id
    const id = parseAllId.filter((item) => item !== req.user['sub']);
    await this.userService.deleteUser(id);
  }
}
