import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({ default: 'vulnerablev1' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ default: 'lordazzura123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
