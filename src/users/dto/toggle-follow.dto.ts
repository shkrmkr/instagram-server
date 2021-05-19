import { User } from '../users.entity';

export interface ToggleFollowDto {
  followeeId: User['id'];
}
