import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAccessTokenAuthGuard extends AuthGuard(
  'jwt-access-token',
) {
  handleRequest<User>(_: any, user: User) {
    return user;
  }
}
