import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface RequestWithPagination extends Request {
  page: number;
  pageSize: number;
}

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: RequestWithPagination, res: Response, next: NextFunction) {
    const { query } = req;
    const page = +query.page || 1;
    const pageSize = +query.pageSize || 5;

    // if page or pageSize is not a number
    // if page or PageSize value less than 1
    // throw errow
    if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
      throw new BadRequestException(`invalid value for 'page' or 'pageSize'`);
    }

    req.page = page;
    req.pageSize = pageSize;

    next();
  }
}
