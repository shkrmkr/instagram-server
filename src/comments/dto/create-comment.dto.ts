import { Post } from 'src/posts/posts.entity';

export class CreateCommentDto {
  body: string;
  postId: Post['id'];
}
