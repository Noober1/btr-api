import { ApiProperty } from '@nestjs/swagger';
import { Major } from '@prisma/client';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMajorDto implements Partial<Major> {
  @ApiProperty()
  @IsString()
  @Length(1, 10)
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
