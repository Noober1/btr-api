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
import { UpdateTeacher } from '@/teacher/update-teacher.dto';
import { RequestWithPagination } from '@/middlewares/pagination.middleware';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '@/auth/authenticated.guard';

@ApiTags('teacher')
@Controller('teacher')
@UseGuards(AuthenticatedGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teacher' })
  findAll(@Req() req: RequestWithPagination) {
    return this.teacherService.findAll(req.page, req.pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by id' })
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a teacher' })
  async create(@Body() data: CreateTeacher) {
    await this.teacherService.create(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher by id' })
  delete(@Param('id') id: string) {
    return this.teacherService.deleteTeacher(id);
  }
}
