import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacher } from '@/teacher/create-teacher.dto';

export class UpdateTeacher extends PartialType(CreateTeacher) {}
