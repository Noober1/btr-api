import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTeacher implements Partial<Teacher> {
  @ApiProperty()
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  fullname: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  @IsEmail(undefined, {
    message: 'Format data harus berupa email, contoh: johndoe@mail.com',
  })
  email: string;
}
