import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessTokenAuthGuard } from 'src/auth/guard/jwt-access-token-auth.guard';
import { RequestWithUser } from 'src/auth/interface/request-with-user.interface';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAccessTokenAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/suggestions')
  getFollowSuggestions(@Req() req: RequestWithUser) {
    return this.usersService.getFollowSuggestions(req.user);
  }
}
