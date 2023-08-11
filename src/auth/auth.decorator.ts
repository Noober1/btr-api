import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const NO_ACCESS_TOKEN = 'isPublic';
export const AllowNoToken = () => SetMetadata(NO_ACCESS_TOKEN, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
