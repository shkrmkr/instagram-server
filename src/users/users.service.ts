import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import argon2 from 'argon2';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const checkUnique = await this.checkIfUsernameOrEmailExists({
      username: createUserDto.username,
      email: createUserDto.email,
    });

    if (checkUnique.email) {
      throw new ConflictException('Email already in use.');
    }

    if (checkUnique.username) {
      throw new ConflictException('Username already in use.');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);
    return this.usersRepo.save({ ...createUserDto, password: hashedPassword });
  }

  findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  findOneById(id: User['id']): Promise<User | undefined> {
    return this.usersRepo.findOne(id);
  }

  findOneByUsername(username: User['username']): Promise<User | undefined> {
    return this.usersRepo.findOne({ where: { username } });
  }

  /*
   * Private Methods
   */

  private hashPassword(plain: string): Promise<string> {
    return argon2.hash(plain, { saltLength: 12 });
  }

  private verifyPassword(plain: string, hashed: string): Promise<boolean> {
    return argon2.verify(hashed, plain);
  }

  private async checkIfUsernameOrEmailExists(
    where: Pick<User, 'email' | 'username'>,
  ): Promise<{ email: boolean; username: boolean }> {
    const users = await this.usersRepo.find({ where });

    const result = {
      email: false,
      username: false,
    };

    users.forEach((user) => {
      if (user.email === where.email) {
        result.email = true;
      }

      if (user.username === where.username) {
        result.username = true;
      }
    });

    return result;
  }
}
