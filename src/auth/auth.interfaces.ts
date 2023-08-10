import { Role } from '@prisma/client';

export interface Session {
  id: string;
  username: string;
  role?: Role;
  refreshToken: string;
}

export interface RequestWithUser extends Request {
  user: Session;
}
