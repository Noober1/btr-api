import { ApiProperty } from '@nestjs/swagger';

export class LoginAuth {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
