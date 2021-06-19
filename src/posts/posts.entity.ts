import { Exclude } from 'class-transformer';
import { Comment } from 'src/comments/comments.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  caption: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  imageSrc: string;

  @ManyToMany(() => User)
  @JoinTable()
  @Exclude()
  likedBy: User[];

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  isLikedByUser?: boolean = false;

  totalLikes?: number = 0;
  totalComments?: number = 0;
}
