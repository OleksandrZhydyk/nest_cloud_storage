import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUser: CreateUserDto): Promise<any> {
    if (createUser.password !== createUser.confirmPassword) {
      throw new BadRequestException(
        'Password and confirmPassword are not the same',
      );
    }

    const user = await this.usersService.findByEmail(createUser.email);
    if (user) {
      throw new ConflictException();
    }

    const pwdhash = await bcrypt.hash(createUser.password, 10);
    createUser.password = pwdhash;

    const userDb = await this.usersService.create(createUser);
    return await this.generateToken(userDb);
  }

  async login(userCred: LoginUserDto): Promise<any> {
    const userDb = await this.validateUser(userCred.email, userCred.password);
    return await this.generateToken(userDb);
  }

  private async generateToken(user: UserEntity) {
    const payload = { id: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
      }),
    };
  }

  private async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isValidPass = await bcrypt.compare(password, user?.password);
    if (user && isValidPass) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
