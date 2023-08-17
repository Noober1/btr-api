import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { IsNotEmpty, IsEnum, IsEmail, IsString } from 'class-validator';

export class CreateUser implements Partial<User> {
  @ApiProperty()
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  @IsString({ message: 'Harus berupa huruf dan angka' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  @IsString({ message: 'Harus berupa huruf dan angka' })
  password: string;

  @ApiProperty({ default: 'TEACHER' })
  @IsEnum(Role, {
    message: 'Data harus berupa TEACHER atau STUDENT',
  })
  role: Role;

  @IsEmail(undefined, {
    message: 'Format data harus berupa email, contoh: johndoe@mail.com',
  })
  @IsNotEmpty({
    message: 'Data tidak boleh kosong',
  })
  @ApiProperty()
  email: string;
}
