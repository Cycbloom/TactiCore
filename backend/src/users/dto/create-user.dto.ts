import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'johndoe' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ description: '邮箱地址', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}
