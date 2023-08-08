import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeacherService } from '@/teacher/teacher.service';
import { CreateTeacher } from '@/teacher/create-teacher.dto';
import { RequestWithPagination } from '@/middlewares/pagination.middleware';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '@/auth/authenticated.guard';
import { ResponsePaginate } from '@/types/types';
import { Teacher } from '@prisma/client';
import { ApiPagination } from '@/middlewares/paginationApi.decorator';

@Controller('teacher')
@ApiTags('teacher')
@ApiForbiddenResponse({ description: 'Client not logged in yet' })
@UseGuards(AuthenticatedGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @ApiPagination({
    summary: 'Get all user',
    OkDescription: 'Returned all teacher',
  })
  findAll(
    @Req() { page, pageSize }: RequestWithPagination,
  ): ResponsePaginate<Teacher> {
    return this.teacherService.findAll(page, pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by id' })
  @ApiOkResponse({ description: 'Return a teacher' })
  @ApiNotFoundResponse({ description: 'Given teacher id not found' })
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a teacher' })
  @ApiCreatedResponse({ description: 'Teacher created successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request value or unique data already exist',
  })
  async create(@Body() data: CreateTeacher) {
    await this.teacherService.create(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher by id' })
  @ApiOkResponse({ description: 'Teacher deleted successfully' })
  @ApiNotFoundResponse({ description: 'Teacher with given id not found' })
  delete(@Param('id') id: string) {
    return this.teacherService.deleteTeacher(id);
  }
}
