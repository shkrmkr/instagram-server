import { Request } from 'express';
import { User } from 'src/users/users.entity';

export interface RequestWithUser extends Request {
  user: User;
}
