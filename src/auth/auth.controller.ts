import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { serialize } from 'class-transformer';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAccessTokenAuthGuard } from './guard/jwt-access-token-auth.guard';
import { JwtRefreshTokenAuthGuard } from './guard/jwt-refresh-token-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RequestWithUser } from './interface/request-with-user.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    const accessToken = this.authService.makeAccessToken(req.user);

    const { cookieOptions, refreshToken } =
      this.authService.makeRefreshTokenAndCookieOptions(req.user);

    req.res.cookie('cid', refreshToken, cookieOptions);

    return serialize({
      accessToken,
      user: req.user,
    });
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    const user = await this.userService.createUser(createUserDto);
    const accessToken = this.authService.makeAccessToken(user);

    const { cookieOptions, refreshToken } =
      this.authService.makeRefreshTokenAndCookieOptions(user);

    req.res.cookie('cid', refreshToken, cookieOptions);

    return serialize({
      accessToken,
      user,
    });
  }

  @Get('me')
  @UseGuards(JwtAccessTokenAuthGuard)
  me(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshTokenAuthGuard)
  refresh(@Req() req: RequestWithUser) {
    const accessToken = this.authService.makeAccessToken(req.user);
    const { refreshToken, cookieOptions } =
      this.authService.makeRefreshTokenAndCookieOptions(req.user);

    req.res.cookie('cid', refreshToken, cookieOptions);

    return serialize({
      accessToken,
      user: req.user,
    });
  }
}
