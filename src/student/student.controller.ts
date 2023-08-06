import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { RequestWithPagination } from '@/middlewares/pagination.middleware';
import { CreateStudent } from '@/student/create-student.dto';
import { AuthenticatedGuard } from '@/auth/authenticated.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('student')
@Controller('student')
@UseGuards(AuthenticatedGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all student' })
  findAllStudent(@Req() req: RequestWithPagination) {
    return this.studentService.findAll(req.page, req.pageSize);
  }

  @Post()
  @ApiOperation({ summary: 'Create a student' })
  async createStudent(@Body() data: CreateStudent) {
    await this.studentService.create(data);
  }

  @ApiOperation({ summary: 'Delete a student by id' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.studentService.delete(id);
  }
}
