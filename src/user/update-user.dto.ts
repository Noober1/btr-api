import { PartialType } from '@nestjs/swagger';
import { CreateUser } from '@/user/create-user.dto';

export class UpdateUser extends PartialType(CreateUser) {}
