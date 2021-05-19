import { IsNotEmpty, IsUrl } from 'class-validator';
import { Post } from '../posts.entity';

export class CreatePostDto implements Partial<Post> {
  @IsNotEmpty()
  caption: string;

  @IsUrl()
  imageSrc: string;
}
