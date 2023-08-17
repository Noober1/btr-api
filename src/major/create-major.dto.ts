import { ApiProperty } from '@nestjs/swagger';
import { Major } from '@prisma/client';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMajor implements Partial<Major> {
  @ApiProperty()
  @IsString({ message: 'Harus berupa huruf dan angka' })
  @Length(1, 10)
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  code: string;

  @ApiProperty()
  @IsString({ message: 'Harus berupa huruf dan angka' })
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  name: string;
}
