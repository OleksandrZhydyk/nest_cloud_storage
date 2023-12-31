import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

export interface AuthReq extends Request {
  user: UserEntity;
}
