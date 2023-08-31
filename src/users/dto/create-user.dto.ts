import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'a@a.com',
  })
  email: string;

  @ApiProperty()
  fullName?: string;

  @ApiProperty({
    default: 'password',
  })
  password: string;

  @ApiProperty({
    default: 'password',
  })
  confirmPassword: string;
}
