import argon2 from 'argon2';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
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

  verifyPassword(plain: string): Promise<boolean> {
    return argon2.verify(this.password, plain);
  }
}
