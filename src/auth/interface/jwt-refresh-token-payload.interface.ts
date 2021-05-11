import { User } from 'src/users/users.entity';

export interface JwtRefreshTokenPayload {
  userId: User['id'];
  tokenVersion: User['tokenVersion'];
}
