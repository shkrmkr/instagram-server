import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessTokenAuthGuard } from 'src/auth/guard/jwt-access-token-auth.guard';
import { OptionalJwtAccessTokenAuthGuard } from 'src/auth/guard/optional-jwt-access-token-auth.guard';
import { RequestWithUser } from 'src/auth/interface/request-with-user.interface';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('suggestions')
  @UseGuards(JwtAccessTokenAuthGuard)
  getFollowSuggestions(@Req() req: RequestWithUser) {
    return this.usersService.getFollowSuggestions(req.user);
  }

  @Post('follow/:username')
  @UseGuards(JwtAccessTokenAuthGuard)
  toggleFollow(
    @Req() req: RequestWithUser,
    @Param('username') username: string,
  ) {
    return this.usersService.toggleFollow(req.user, username);
  }

  @Get(':username')
  @UseGuards(OptionalJwtAccessTokenAuthGuard)
  getUserProfile(
    @Req() req: RequestWithUser,
    @Param('username') username: string,
  ) {
    return this.usersService.getUserProfile(req.user, username);
  }
}
