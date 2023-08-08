import { ApiProperty } from '@nestjs/swagger';
import { Gender, Religion, Student } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateStudent implements Partial<Student> {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ default: 'example-student@mail.com' })
  email: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  birthPlace: string;

  @IsString()
  @ApiProperty()
  @Length(5, 10)
  NIS: string;

  @IsString()
  @ApiProperty()
  @Length(5, 10)
  NISN: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  @ApiProperty({ enum: Gender })
  gender: Gender;

  @IsEnum(Religion)
  @IsNotEmpty()
  @ApiProperty({ enum: Religion })
  religion: Religion;
}
