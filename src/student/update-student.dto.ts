import { OmitType } from '@nestjs/swagger';
import { CreateStudent } from './create-student.dto';

export class UpdateStudent extends OmitType(CreateStudent, ['year']) {}
