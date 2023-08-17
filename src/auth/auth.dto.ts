import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({ default: 'vulnerablev1' })
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  @IsString({ message: 'Harus berupa huruf dan angka' })
  username: string;

  @ApiProperty({ default: 'lordazzura123' })
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  @IsString({ message: 'Harus berupa huruf dan angka' })
  password: string;
}

export class UpdateTokenDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Data tidak boleh kosong' })
  @IsString({ message: 'Harus berupa huruf dan angka' })
  refreshToken: string;
}
