import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PageDto } from '@/middlewares/pagination.middleware'; // Update with the correct import path
import { PageSizeDto } from '@/middlewares/pagination.middleware'; // Update with the correct import path

interface ApiPaginationOption {
  summary?: string;
  OkDescription?: string;
}

export function ApiPagination(options?: ApiPaginationOption) {
  return applyDecorators(
    ApiOperation({ summary: options?.summary || 'No summary' }),
    ApiQuery({ name: 'page', type: PageDto }),
    ApiQuery({ name: 'pageSize', type: PageSizeDto }),
    ApiOkResponse({ description: options?.OkDescription || 'No description' }),
  );
}
