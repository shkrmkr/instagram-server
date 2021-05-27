import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/posts.entity';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepo: Repository<Comment>,
    @InjectRepository(Post) private postsRepo: Repository<Post>,
  ) {}

  async createComment(
    user: User,
    { body, postId }: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postsRepo.findOne(postId);

    if (!post) {
      throw new NotFoundException(
        `Post with id of ${postId} not found. Cannot create comment.`,
      );
    }

    const comment = this.commentsRepo.create({ user, body, post });

    return this.commentsRepo.save(comment);
  }
}
