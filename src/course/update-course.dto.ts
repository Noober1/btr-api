import { PartialType } from '@nestjs/swagger';
import { CreateCourse } from './create-course.dto';

export class UpdateCourse extends PartialType(CreateCourse) {}
