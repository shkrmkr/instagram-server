import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessTokenAuthGuard } from 'src/auth/guard/jwt-access-token-auth.guard';
import { RequestWithUser } from 'src/auth/interface/request-with-user.interface';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
@UseGuards(JwtAccessTokenAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  createComment(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(req.user, createCommentDto);
  }
}
