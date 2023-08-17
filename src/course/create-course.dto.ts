import { ApiProperty } from '@nestjs/swagger';
import { Course, CourseCategory, CourseType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourse implements Partial<Course> {
  @ApiProperty()
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  @IsString({ message: 'Harus berupa huruf dan angka' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  @IsString({ message: 'Harus berupa huruf dan angka' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  @IsEnum(CourseType)
  type: CourseType;

  @ApiProperty()
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  @IsEnum(CourseCategory)
  category: CourseCategory;
}
