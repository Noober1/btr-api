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
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser } from '@/user/create-user.dto';
import { UpdateUser } from './update-user.dto';
import { RequestWithPagination } from '@/middlewares/pagination.middleware';
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
import { User } from '@prisma/client';
import { ResponsePaginate } from '@/types/types';
import { ApiPagination } from '@/middlewares/paginationApi.decorator';

@Controller('user')
@ApiTags('user')
@ApiForbiddenResponse({ description: 'Client not logged in yet' })
@UseGuards(AuthenticatedGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPagination({
    summary: 'Get all user',
    OkDescription: 'Returned all user',
  })
  findAll(
    @Req() { page, pageSize }: RequestWithPagination,
  ): ResponsePaginate<User> {
    return this.userService.findAll(page, pageSize);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a user',
    description:
      'Creating a user based on student or techer email. Make sure the email is exist from student or teacher database',
  })
  @ApiBadRequestResponse({ description: 'Bad request value' })
  @ApiCreatedResponse({ description: 'Created successfully' })
  async create(@Body() data: CreateUser) {
    await this.userService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiNotFoundResponse({ description: 'Given user id not found' })
  @ApiBadRequestResponse({
    description: 'Invalid request input or unique data duplication',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUser,
  ) {
    await this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User with given id not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }
}
