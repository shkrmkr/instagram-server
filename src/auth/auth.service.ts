import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { JwtAccessTokenPayload } from './interface/jwt-access-token-payload.interface';
import { JwtRefreshTokenPayload } from './interface/jwt-refresh-token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.verifyPassword(password)) {
      return user;
    }

    return null;
  }

  makeAccessToken(user: User): string {
    const payload: JwtAccessTokenPayload = { userId: user.id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  makeRefreshTokenAndCookieOptions(user: User): {
    cookieOptions: CookieOptions;
    refreshToken: string;
  } {
    const payload: JwtRefreshTokenPayload = {
      userId: user.id,
      tokenVersion: user.tokenVersion,
    };
    const cookieOptions: CookieOptions = {
      maxAge: parseInt(
        this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      ),
      path: '/',
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    return { cookieOptions, refreshToken };
  }
}
