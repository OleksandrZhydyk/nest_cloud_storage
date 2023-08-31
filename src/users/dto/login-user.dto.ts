import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    default: 'a@a.com',
  })
  email: string;

  @ApiProperty({
    default: 'password',
  })
  password: string;
}
