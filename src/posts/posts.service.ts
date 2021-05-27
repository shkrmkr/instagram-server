import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Connection, In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepo: Repository<Post>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    private connection: Connection,
  ) {}

  async createPost(user: User, createPostDto: CreatePostDto): Promise<Post> {
    const newPost = this.postsRepo.create({ ...createPostDto, user });

    await this.postsRepo.save(newPost);

    return newPost;
  }

  async feedPosts(user: User): Promise<Post[]> {
    const dbUser = await this.usersRepo.findOne(user.id, {
      relations: ['following'],
    });

    if (!dbUser) {
      throw new UnauthorizedException();
    }

    const postsToFeed = await this.postsRepo.find({
      where: {
        user: In(dbUser.following.map((u) => u.id)),
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['user', 'likedBy', 'comments', 'comments.user'],
    });

    postsToFeed.forEach((post) => {
      if (post.likedBy.some((likedUser) => likedUser.id === user.id)) {
        post.isLikedByUser = true;
      }

      post.totalLikes = post.likedBy.length;
    });

    return postsToFeed;
  }

  async getPostById(user: User, postId: Post['id']): Promise<Post> {
    const dbPost = await this.postsRepo.findOne(postId, {
      relations: ['likedBy', 'user', 'comments', 'comments.user'],
    });

    if (!dbPost) {
      throw new NotFoundException(`Post with the id of ${postId} not found.`);
    }

    dbPost.isLikedByUser = dbPost.likedBy.some(
      (likedUser) => likedUser.id === user.id,
    );

    dbPost.totalLikes = dbPost.likedBy.length;

    return dbPost;
  }

  async toggleLike(user: User, postId: Post['id']): Promise<Post> {
    const dbPost = await this.postsRepo.findOne(postId, {
      relations: ['likedBy', 'user', 'comments', 'comments.user'],
    });

    if (!dbPost) {
      throw new NotFoundException(`Post with the id of ${postId} not found.`);
    }

    const alreadyLiked = dbPost.likedBy.some(
      (likedUser) => likedUser.id === user.id,
    );

    if (alreadyLiked) {
      dbPost.likedBy = dbPost.likedBy.filter(
        (likedUser) => likedUser.id !== user.id,
      );
      dbPost.isLikedByUser = false;
    } else {
      dbPost.likedBy = [...dbPost.likedBy, user];
      dbPost.isLikedByUser = true;
    }

    dbPost.totalLikes = dbPost.likedBy.length;

    await this.connection.manager.save(dbPost);

    return dbPost;
  }
}
