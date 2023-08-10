import { Role } from '@prisma/client';

export interface Session {
  id: string;
  username: string;
  role: Role;
}

export interface RequestWithUser extends Request {
  user: Session;
}
