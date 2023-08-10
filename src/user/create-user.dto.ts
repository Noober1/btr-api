import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { IsNotEmpty, IsEnum, IsEmail } from 'class-validator';

export class CreateUser implements Partial<User> {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsEnum(Role)
  @ApiProperty({ default: 'TEACHER' })
  role: Role;

  @IsEmail()
  @ApiProperty()
  email: string;

  refreshToken: string;
}
