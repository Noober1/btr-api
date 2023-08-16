import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty } from 'class-validator';

export class IdListDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  id: (string | number)[];
}
