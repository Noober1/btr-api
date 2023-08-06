import { ApiProperty } from '@nestjs/swagger';
import { Student } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateStudent implements Partial<Student> {
  @IsNotEmpty()
  @ApiProperty()
  fullname: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}
