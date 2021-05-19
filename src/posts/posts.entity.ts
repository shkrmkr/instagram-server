import { Exclude } from 'class-transformer';
import { User } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  isLikedByUser?: boolean = false;
}
