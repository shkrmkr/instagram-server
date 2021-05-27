import argon2 from 'argon2';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../posts/posts.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  fullName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  profilePictureUrl?: string;

  @Column({ type: 'integer', default: 0 })
  @Exclude()
  tokenVersion: number;

  @ManyToMany(() => User, (user) => user.following, { cascade: true })
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  verifyPassword(plain: string): Promise<boolean> {
    return argon2.verify(this.password, plain, {
      saltLength: 12,
    });
  }
}
