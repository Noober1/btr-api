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
import { UserService } from './user.service';
import { CreateUser } from '@/user/create-user.dto';
import { UpdateUser } from './update-user.dto';
import { RequestWithPagination } from '@/middlewares/pagination.middleware';
import { AuthenticatedGuard } from '@/auth/authenticated.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
@UseGuards(AuthenticatedGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUser) {
    this.userService.create(data);
  }

  @Get()
  findAll(@Req() req: RequestWithPagination) {
    return this.userService.findAll(req.page, req.pageSize);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUser) {
    return this.userService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
