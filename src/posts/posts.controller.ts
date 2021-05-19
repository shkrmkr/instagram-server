import {
  Body,
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
import { RequestWithUser } from 'src/auth/interface/request-with-user.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAccessTokenAuthGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  createPost(
    @Req() req: RequestWithUser,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(req.user, createPostDto);
  }

  @Get()
  feedPosts(@Req() req: RequestWithUser) {
    return this.postsService.feedPosts(req.user);
  }

  @Post('likes/:postId')
  toggleLike(
    @Req() req: RequestWithUser,
    @Param('postId') postId: PostEntity['id'],
  ) {
    return this.postsService.toggleLike(req.user, postId);
  }
}
