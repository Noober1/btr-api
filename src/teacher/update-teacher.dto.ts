import { PartialType } from '@nestjs/swagger';
import { CreateTeacher } from '@/teacher/create-teacher.dto';

export class UpdateTeacher extends PartialType(CreateTeacher) {}
