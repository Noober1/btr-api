import { ApiProperty } from '@nestjs/swagger';
import { Student } from '@prisma/client';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateStudent implements Partial<Student> {
  @IsNotEmpty()
  @ApiProperty()
  fullname: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}
