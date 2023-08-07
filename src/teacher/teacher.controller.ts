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
import {
  PageDto,
  PageSizeDto,
  RequestWithPagination,
} from '@/middlewares/pagination.middleware';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '@/auth/authenticated.guard';

@Controller('teacher')
@ApiTags('teacher')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(AuthenticatedGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user' })
  @ApiQuery({ name: 'page', type: PageDto })
  @ApiQuery({ name: 'pageSize', type: PageSizeDto })
  @ApiOkResponse({ description: 'Return all teacher' })
  findAll(@Req() req: RequestWithPagination) {
    return this.teacherService.findAll(req.page, req.pageSize);
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
