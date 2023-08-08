import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTeacher implements Partial<Teacher> {
  @ApiProperty()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
