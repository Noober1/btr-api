import { ApiProperty } from '@nestjs/swagger';

export class LoginAuth {
  @ApiProperty({ default: 'vulnerablev1' })
  username: string;

  @ApiProperty({ default: 'lordazzura123' })
  password: string;
}
