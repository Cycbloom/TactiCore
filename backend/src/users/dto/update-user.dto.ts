import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: '用户名', example: 'johndoe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @ApiProperty({
    description: '邮箱地址',
    example: 'john@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: '密码', example: 'password123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
