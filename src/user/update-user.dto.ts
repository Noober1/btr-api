import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUser } from '@/user/create-user.dto';
import { IsString } from 'class-validator';

export class UpdateUser extends PickType(CreateUser, ['username']) {
  @ApiProperty()
  @IsString({ message: 'Harus berupa huruf dan angka' })
  password: string;
}
