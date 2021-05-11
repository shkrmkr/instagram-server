import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from '../users.entity';

export class CreateUserDto implements Partial<User> {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;
}
