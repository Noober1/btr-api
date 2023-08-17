import { ApiProperty } from '@nestjs/swagger';
import { Gender, Religion, Student } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateStudent implements Partial<Student> {
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
  @IsString({ message: 'Nama lengkap Harus berupa huruf dan angka' })
  @ApiProperty()
  fullname: string;

  @IsNotEmpty({ message: 'Tahun masuk tidak boleh kosong' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 4 },
    {
      message: 'Data tahun masuk tidak valid',
    },
  )
  @ApiProperty({ description: 'Tahun masuk siswa' })
  year: number;

  @IsEmail(undefined, {
    message: 'Format data harus berupa email, contoh: johndoe@mail.com',
  })
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  @ApiProperty({ default: 'example-student@mail.com' })
  email: string;

  @IsDateString(
    {},
    { message: 'Tanggal lahir tidak valid, harus berupa DateString' },
  )
  @IsNotEmpty({ message: 'Tanggal lahir tidak boleh kosong' })
  @ApiProperty()
  birthDate: Date;

  @IsString({ message: 'Tempat lahir harus berupa huruf dan angka' })
  @IsNotEmpty({ message: 'Tempat lahir tidak boleh kosong' })
  @ApiProperty()
  birthPlace: string;

  @IsString({ message: 'Harus berupa huruf dan angka' })
  @ApiProperty()
  @Length(0, 10, { message: 'NIS tidak boleh melebihi dari 10 karakter' })
  NIS: string;

  @IsString({ message: 'Harus berupa huruf dan angka' })
  @ApiProperty()
  @Length(0, 10, { message: 'NISN tidak boleh melebihi dari 10 karakter' })
  NISN: string;

  @IsEnum(Gender, {
    message: 'Jenis kelamin harus diisi antara MALE dan FEMALE',
  })
  @IsNotEmpty({ message: 'Jenis kelamin tidak boleh kosong' })
  @ApiProperty({ enum: Gender })
  gender: Gender;

  @IsEnum(Religion, {
    message: `Agama harus diisi antara: "ISLAM","KRISTEN","KATHOLIK","HINDU","BUDHA", dan "KONGHUCU"`,
  })
  @IsNotEmpty({ message: 'Agama tidak boleh kosong' })
  @ApiProperty({ enum: Religion })
  religion: Religion;

  @IsString({ message: 'Jurusan harus berupa huruf dan angka' })
  @IsNotEmpty({ message: 'ID jurusan tidak boleh kosong' })
  @ApiProperty()
  majorId: string;
}
