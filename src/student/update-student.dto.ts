import { PartialType } from '@nestjs/swagger';
import { CreateStudent } from './create-student.dto';

export class UpdateStudent extends PartialType(CreateStudent) {}
