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
import {
  PageDto,
  PageSizeDto,
  RequestWithPagination,
} from '@/middlewares/pagination.middleware';
import { CreateStudent } from '@/student/create-student.dto';
import { AuthenticatedGuard } from '@/auth/authenticated.guard';
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
import { UpdateStudent } from './update-student.dto';

@Controller('student')
@ApiTags('student')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(AuthenticatedGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all student' })
  @ApiQuery({ name: 'page', type: PageDto })
  @ApiQuery({ name: 'pageSize', type: PageSizeDto })
  @ApiOkResponse({ description: 'Get all student' })
  findAllStudent(@Req() req: RequestWithPagination) {
    return this.studentService.findAll(req.page, req.pageSize);
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
