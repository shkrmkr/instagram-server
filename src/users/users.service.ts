import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import argon2 from 'argon2';
import { In, Not, Repository } from 'typeorm';
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

  async getFollowSuggestions(user: User): Promise<User[]> {
    const dbUser = await this.usersRepo.findOne(user.id, {
      relations: ['followers'],
    });

    const suggestions = await this.usersRepo.find({
      where: {
        id: Not(In(dbUser.followers)),
      },
      take: 5,
    });

    // suggestions 목록에 user 자신이 있으면 제외
    return suggestions.filter((suggestion) => suggestion.id !== user.id);
  }

  /*
   * Private Methods
   */

  private hashPassword(plain: string): Promise<string> {
    return argon2.hash(plain, { saltLength: 12 });
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
