import { ApiProperty } from '@nestjs/swagger';
import { Course, CourseCategory, CourseType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourse implements Partial<Course> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CourseType)
  type: CourseType;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CourseCategory)
  category: CourseCategory;
}
