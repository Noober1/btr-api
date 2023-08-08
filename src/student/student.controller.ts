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
import {
  ApiBadRequestResponse,
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

@Controller('student')
@ApiTags('student')
@ApiForbiddenResponse({ description: 'Client not logged in yet' })
@UseGuards(AuthenticatedGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiPagination({
    summary: 'Get all student',
    OkDescription: 'Returned all student',
  })
  findAllStudent(
    @Req() { page, pageSize }: RequestWithPagination,
  ): ResponsePaginate<Student> {
    return this.studentService.findAll(page, pageSize);
  }

  @Post()
  @ApiOperation({ summary: 'Create a student' })
  @ApiCreatedResponse({ description: 'Student created successfully' })
  @ApiBadRequestResponse({ description: 'Bad request value' })
  async createStudent(@Body() data: CreateStudent) {
    await this.studentService.create(data);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Return a student' })
  @ApiNotFoundResponse({ description: 'Student with given id not found' })
  getStudentById(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  // @Patch(':id')
  // @ApiOperation({summary: 'Update a student'})
  // @ApiOkResponse({description: 'Student update successfully'})
  // @ApiNotFoundResponse({description: 'Student with given id not found'})
  // @ApiBadRequestResponse({description: 'Bad request input'})
  // async updateStudent(@Param('id') @Body() data: UpdateStudent){
  //   await this.studentService.
  // }

  @ApiOperation({ summary: 'Delete a student by id' })
  @ApiNotFoundResponse({ description: 'Given student id not found' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.studentService.delete(id);
  }
}
