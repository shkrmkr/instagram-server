import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtRefreshTokenPayload } from '../interface/jwt-refresh-token-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.cid]),
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
    } as StrategyOptions);
  }

  async validate(payload: JwtRefreshTokenPayload) {
    const user = await this.userService.findOneById(payload.userId);

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
