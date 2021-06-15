import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtAccessTokenPayload } from '../interface/jwt-access-token-payload.interface';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    } as StrategyOptions);
  }

  validate(payload: JwtAccessTokenPayload) {
    return this.userService.findOneById(payload.userId);
  }
}
