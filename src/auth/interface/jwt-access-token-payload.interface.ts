import { User } from 'src/users/users.entity';

export interface JwtAccessTokenPayload {
  userId: User['id'];
}
