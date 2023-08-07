import { PartialType } from '@nestjs/mapped-types';
import { CreateUser } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUser extends PartialType(CreateUser) {
  @ApiProperty()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsString()
  password?: string;
}
