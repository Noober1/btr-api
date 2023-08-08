import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MajorService } from '@/major/major.service';
import { CreateMajorDto } from '@/major/create-major.dto';
import { UpdateMajorDto } from '@/major/update-major.dto';
import {
  ApiBadRequestResponse,
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

@Controller('major')
@ApiTags('major')
@ApiForbiddenResponse({ description: 'Client not logged in yet' })
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @Get()
  @ApiPagination({
    summary: 'Get all major',
    OkDescription: 'Returned all major',
  })
  findAll(
    @Req() { page, pageSize }: RequestWithPagination,
  ): ResponsePaginate<Major> {
    return this.majorService.findAll(page, pageSize);
  }

  @Post()
  @ApiOperation({ summary: 'Create a major' })
  @ApiBadRequestResponse({
    description: 'Bad request value or duplication data',
  })
  @ApiCreatedResponse({ description: 'Major created successfully' })
  async create(@Body() data: CreateMajorDto) {
    await this.majorService.create(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.majorService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a major by id' })
  @ApiOkResponse({ description: 'Major updated successfully' })
  @ApiBadRequestResponse({
    description: 'Invalid request value or duplicate data',
  })
  async update(@Param('id') id: string, @Body() data: UpdateMajorDto) {
    await this.majorService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a major' })
  @ApiOkResponse({ description: 'Major deleted successfully' })
  @ApiNotFoundResponse({ description: 'Major with given id not found' })
  remove(@Param('id') id: string) {
    return this.majorService.remove(id);
  }
}
