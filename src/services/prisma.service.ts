import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { extension } from 'prisma-paginate';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'production'
          ? ['error']
          : ['query', 'error', 'warn'],
    });
  }

  async onModuleInit() {
    this.$extends(extension);
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  extended() {
    return this.$extends(extension);
  }
}
