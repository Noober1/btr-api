import { PartialType } from '@nestjs/swagger';
import { CreateMajor } from './create-major.dto';

export class UpdateMajor extends PartialType(CreateMajor) {}
