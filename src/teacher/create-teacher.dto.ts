import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTeacher implements Partial<Teacher> {
  @IsNotEmpty()
  @ApiProperty()
  fullname: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}
